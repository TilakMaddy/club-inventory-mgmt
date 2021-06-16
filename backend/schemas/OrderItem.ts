import { list } from "@keystone-next/keystone/schema";
import { integer, relationship, select, text, virtual } from "@keystone-next/fields";
import { isSignedIn, rules, permissions } from "../access";

function canR({ session }) {

  if (!isSignedIn({ session })) {
    return false;
  }

  // do they have permission to read orders ? (admin)
  if (permissions.canManageOrders({ session }))
    return true;

  return {
    OR: [
      { order: { user: { id: session.itemId } } }, // read this in 'my orders'
      { originalProduct: { club: { id: session.data.club.id } } } // read this in 'dispatch customer orders'
    ]
  }
}

function canU({ session }) {

  if (!isSignedIn({ session })) {
    return false;
  }

  // admins cannot accept/deny and requests (mentioned in task description)
  if (permissions.canManageOrders({ session }))
    return false;

  // you cannot be a MEMBER
  if (session.data['typeof'] == 'MEMBER') {
    return false;
  }

  // you must be a convener of the club to which the item belongs
  return {
    originalProduct: { club: { id: session.data.club.id } }
  }

}


const OrderItem = list({

  access: {
    create: isSignedIn,
    read: canR,
    update: canU,
    delete: () => false
  },

  fields: {

    name: text({
      isRequired: true,
      access: {
        update: () => false
      }
    }),

    photo: relationship({

      ref: 'ProductImage', // 1 way relationship cuz we store the products image at the time of purchase
      ui: {
        displayMode: "cards",
        cardFields: ['image', 'altText'],
        inlineCreate: { fields: ['image', 'altText'] },
        inlineEdit: { fields: ['image', 'altText'] },
      },

      access: {
        update: () => false
      }
    }),

    description: text({
      ui: {
        displayMode: "textarea"
      },
      access: {
        update: () => false
      }
    }),

    // always store in cents to avoid decimals
    price: integer({
      access: {
        update: () => false
      }
    }),
    quantity: integer({
      access: {
        update: () => false
      }
    }),

    order: relationship({
      ref: 'Order.items',
      access: {
        update: () => false
      }
    }),

    originalProduct: relationship({
      ref: 'Product',
      access: {
        update: () => false
      }
    }),

    delivered: select({

      options: [
        { label: 'Delivered', value: 'DELIVERED' },
        { label: 'Awaiting Approval', value: 'COMING_SOON' },
        { label: 'Rejected Request', value: 'REJECTED' },
      ],

      defaultValue: 'COMING_SOON',

      ui: {
        displayMode: "segmented-control", // dropdown mode sucks this is slick
      }

    }),

    reasonForDeliveryStatus: text({
      defaultValue: ' ',
    }),

    customer: relationship({
      ref: 'User',
      defaultValue: null,
      access: {
        update: () => false
      }
    }),

  }
})

export { OrderItem };