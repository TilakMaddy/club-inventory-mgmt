import { list } from "@keystone-next/keystone/schema";
import { integer, relationship, select, text, timestamp } from "@keystone-next/fields";
import { isSignedIn, permissions, rules } from "../access";

// you cannot edit other people's reviews
function canUpdate({ session }) {

  if (!isSignedIn({ session })) {
    return false;
  }

  // admins should be able to edit reviews
  // (to censor foul language) , just my 💭

  if (permissions.canManageUsers({ session })) {
    return true;
  }

  return {
    customer: { id: session.itemId }
  }
}

const Review = list({

  access: {

    create: isSignedIn,
    read: () => true,
    update: canUpdate,
    delete: () => true

  },

  fields: {

    time: timestamp({
      isRequired: true,
      defaultValue: Date.now().toString()
    }),

    description: text({
      isRequired: true,
      ui: {
        displayMode: "textarea"
      }
    }),

    stars: integer({
      isRequired: true
    }),

    customer: relationship({
      ref: 'User.personalReviews',
      defaultValue: ({ context }) => ({
        connect: { id: context.session.itemId }
      }),
      // isUnique: true, ==> if you wanna permit only 1 review per user
    }),

    product: relationship({
      ref: 'Product.reviews'
    })

  }
})

export { Review };