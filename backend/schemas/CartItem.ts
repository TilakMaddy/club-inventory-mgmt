import { list } from "@keystone-next/keystone/schema";
import { integer, relationship, select, text } from "@keystone-next/fields";
import { isSignedIn, rules } from "../access";

const CartItem = list({

  access: {
    create: isSignedIn,
    read: rules.canOrder,
    update: rules.canOrder,
    delete: rules.canOrder,
  },

  ui: {
    listView: {
      initialColumns: ['product', 'quantity', 'user'],
    },
  },

  fields: {
    quantity: integer({
      isRequired: true,
      defaultValue: 1
    }),
    product: relationship({
      ref: 'Product'
    }),
    user: relationship({
      ref: 'User.cart'
    })

  }
})

export { CartItem };