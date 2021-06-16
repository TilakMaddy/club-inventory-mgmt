import { KeystoneContext } from "@keystone-next/types";
import { CartItemCreateInput } from "../.keystone/schema-types";
import { User } from "../schemas/User";
import { Session } from "../types";

export default async function addToCart(root: any, { productID }: { productID: string }, context: KeystoneContext): Promise<CartItemCreateInput> {
  console.log('adding to cart')

  //Step 1 :  Query the current user to see if they are signed in
  const sesh = context.session as Session;

  if (!sesh.itemId) {
    throw new Error(
      " YOU MUST BE LOGGED IN TO DO THIS "
    );
  }

  // Step 2: Query the cart items

  const allCartItems = await context.lists.CartItem.findMany({
    where: { user: { id: sesh.itemId }, product: { id: productID } },
    resolveFields: 'id,quantity',
  })

  console.log('all cart items')
  console.dir(allCartItems)

  const [existingCartItem] = allCartItems;

  if (existingCartItem) {
    console.log('this item is already in the cart');

    return await context.lists.CartItem.updateOne({
      id: existingCartItem.id,
      data: {
        quantity: existingCartItem.quantity + 1
      }
    })

  }

  return await context.lists.CartItem.createOne({
    data: {
      product: { connect: { id: productID } },
      user: { connect: { id: sesh.itemId } }
    }
  })

}