import { list } from "@keystone-next/keystone/schema";
import { integer, relationship, select, text, virtual } from "@keystone-next/fields";
import { isSignedIn, permissions, rules } from "../access";

// only dispacthers/convers and admins can update stock
function canUpdateStock({ session }) {

  if (!isSignedIn({ session })) {
    return false;
  }

  // you must be an admin ...
  if (permissions.canManageOrders({ session }))
    return true;

  // you cannot be a MEMBER to decrease the stock, cuz you dont dispatch
  if (session.data['typeof'] == 'MEMBER') {
    return false;
  }

  // .. or you must be a convener of the club to which the item belongs
  return {
    product: { club: { id: session.data.club.id } }
  }

}


const Stock = list({

  access: {

    create: isSignedIn,
    update: canUpdateStock,

    read: () => true,
    delete: permissions.canManageUsers

  },

  fields: {

    label: virtual({
      graphQLReturnType: 'String',
      resolver(o) {
        return `${o.quantity}`; // instead of id, we see quantity in dashboard
      }
    }),

    quantity: integer({
      defaultValue: 1
    }),

    product: relationship({
      ref: 'Product.inStock'
    })

  }
})

export { Stock };