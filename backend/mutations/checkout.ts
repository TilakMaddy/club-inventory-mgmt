import { KeystoneContext } from "@keystone-next/types";
import { CartItemCreateInput, OrderCreateInput } from "../.keystone/schema-types";
import stripeConfig from "../lib/stripe";
import 'dotenv/config';

export default async function checkOutandstuff(root: any, { token }: { token: string }, context: KeystoneContext): Promise<OrderCreateInput> {

  // make sure they are signed in
  const userId = context.session.itemId;

  if (!userId) {
    throw new Error("Sorry, must be signed in to create a order");
  }

  const graphql = String.raw;

  // query the current user
  const user = await context.lists.User.findOne({
    where: { id: userId },
    resolveFields: graphql`
      id
      name
      email
      totalSales
      cart {
        id
        quantity
        product {
          name
          sold {
            quantity
            user
          }
          description
          price
          id
          photo {
            id
            image {
              id
              publicUrlTransformed
            }

          }
        }
      }
    `
  });

  console.log(" --- ");
  console.dir(user, { depth: null });


  // calculate total price for their order
  const cartItems = user.cart.filter(cartItem => cartItem.product);
  const amount = cartItems.reduce(function (tally: number, item: CartItemCreateInput) {
    return tally + item.quantity * item.product.price;
  }, 0)

  console.log(amount);

  if (amount === 0) {
    throw new Error("You cannot perform an empty transaction !");
  }

  // create charge with stripe library
  const charge = (process.env.PAYMENTS_ENABLED === "true") && await stripeConfig.paymentIntents.create({

    amount, // in cents
    currency: 'USD',
    confirm: true,
    payment_method: token,

    // cuz i live in india stripe requires me to provide desc.

    description: `Buying stuff from Old store of $${amount} !`,
    shipping: {
      name: user.name,
      address: {
        line1: 'Earth',
        postal_code: '98140',
        city: 'Earth',
        state: 'Milky Way Galaxy',
        country: 'US',
      },
    }

  }).catch(err => {
    console.log('error', err);
    throw new Error(err.message);
  });

  console.log(charge);

  // update the total sold items for each owner of the products
  for (const cartItem of cartItems) {

    const cproduct = cartItem.product;

    const owner = await context.lists.Product.findOne({
      where: { id: cproduct.id },
      resolveFields: `
        user {
          id
          totalSales {
            quantity
          }
          name
        }
      `
    });

    if (owner?.user) {
      const updatedSalesCount = (owner.user.totalSales?.quantity || 0) + cartItem.quantity;

      if (!owner.user.totalSales) {
        const sales = await context.lists.TotalSale.createOne({
          data: {
            quantity: updatedSalesCount,
            user: { connect: { id: owner.user.id } }
          }
        })
      } else {

        const old_sales = await context.lists.TotalSale.findMany({
          where: { user: { id: owner.user.id } },
          resolveFields: 'id'
        })

        const [old_sale] = old_sales;

        await context.lists.TotalSale.updateOne({
          id: old_sale.id,
          data: {
            quantity: updatedSalesCount,
            user: { connect: { id: owner.user.id } }
          }
        })

      }

      console.log(owner.user.name + " updated sales to " + updatedSalesCount + " because of sale on " + cproduct.name)

    }
    else
      console.log("no one really ówns the product :( ", cproduct.name);

  }

  // update the total sales for the product of the cart
  for (const cartItem of cartItems) {

    const cproduct = cartItem.product;

    if (cproduct.sold && typeof cproduct.sold === "number")
      cproduct.sold = null;

    const updatedCount = (cproduct.sold?.quantity || 0) + cartItem.quantity;

    if (!cproduct.sold) {
      await context.lists.TotalSale.createOne({
        data: {
          quantity: updatedCount,
          product: { connect: { id: cproduct.id } }
        }
      })
    }
    else {

      const old_sales = await context.lists.TotalSale.findMany({
        where: { product: { id: cproduct.id } },
        resolveFields: 'id'
      })

      const [old_sale] = old_sales;

      await context.lists.TotalSale.updateOne({
        id: old_sale.id,
        data: {
          quantity: updatedCount,
        }
      })

    }

    console.log(cproduct.name + " (product) updated sales to " + updatedCount);



  }

  // convert the cart items to orderitems
  const orderItems = cartItems.map((cartItem, idx) => {
    const orderItem = {
      name: cartItem.product.name,
      description: cartItem.product.description,
      price: cartItem.product.price,
      quantity: cartItem.quantity,
      originalProduct: { connect: { id: cartItem.product.id } },
      photo: { connect: { id: cartItem.product.photo.id } },
      customer: { connect: { id: userId } }
    }

    return orderItem;
  });

  // create order and return it to save in db
  const order = await context.lists.Order.createOne({
    data: {
      total: charge?.amount || amount || 0,
      charge: charge?.id || "Madeup-Id-Stripe-Payments-Not-Enabled",
      items: { create: orderItems },
      user: { connect: { id: userId } }
    }
  })

  // clean up old cart items
  const cartItemIds = user.cart.map(ci => ci.id);
  context.lists.CartItem.deleteMany({ ids: cartItemIds });

  return order;

}