import { list } from "@keystone-next/keystone/schema";
import { integer, relationship, select, text, virtual } from "@keystone-next/fields";
import { isSignedIn, permissions, rules } from "../access";

const TotalSale = list({

  access: {

    create: isSignedIn,
    update: isSignedIn,

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

    /**
     * In case 1, qty represents how many items did the `user` receive requests to in his lifetime ?
     * In case 2, qty represents how many `product` requests in its lifetime ?
     */
    quantity: integer({
      defaultValue: 0
    }),

    // Case 1 - owner of the product
    user: relationship({
      ref: 'User.totalSales',
    }),

    // Case 2 - product
    product: relationship({
      ref: 'Product.sold'
    })

  }
})

export { TotalSale };