import { list } from "@keystone-next/keystone/schema";
import { text, password, relationship, integer, select } from '@keystone-next/fields';
import { isSignedIn, permissions, rules } from "../access";

export const User = list({

  access: {

    create: () => true,
    read: () => true,

    // with checkbox or yourself
    update: rules.canManageUsers,

    // only with chekbox, you cant delete yourself
    delete: permissions.canManageUsers
  },

  ui: {

    // hide backend UI from regular users
    hideCreate: args => !permissions.canManageUsers(args),
    hideDelete: args => !permissions.canManageUsers(args),

  },

  fields: {

    name: text({
      isRequired: true,
      // isIndexed: true, ==> do this if you have to frequently search
      // for a user based on name but usually we do using slug or ID so
      // we omit it here
    }),

    email: text({
      isRequired: true,
      isUnique: true
    }),

    password: password(),

    cart: relationship({
      ref: 'CartItem.user',
      many: true,
      ui: {
        createView: { fieldMode: 'hidden' },
        itemView: { fieldMode: 'read' }
      }
    }),

    orders: relationship({
      ref: 'Order.user',
      many: true
    }),

    role: relationship({
      ref: 'Role.assignedTo',
      access: {
        create: permissions.canManageUsers,
        update: permissions.canManageUsers
      }
    }),

    typeof: select({

      options: [
        { label: 'Convener', value: 'CONVENER' },
        { label: 'Member', value: 'MEMBER' },
        { label: 'Unrestricted', value: 'UNRESTRICTED' }
      ],

      defaultValue: 'MEMBER',

      ui: {
        displayMode: "segmented-control", // dropdown mode sucks this is slick
      },

      access: {
        update: permissions.canManageUsers
      }

    }),

    club: relationship({
      ref: 'Club.workers',
      access: {
        update: permissions.canManageUsers
      }
    }),

    // products that user sells
    products: relationship({
      ref: 'Product.user',
      many: true
    }),

    totalSales: relationship({
      ref: 'TotalSale.user'
    }),

    personalReviews: relationship({
      ref: 'Review.customer',
      many: true
    })

  }
})