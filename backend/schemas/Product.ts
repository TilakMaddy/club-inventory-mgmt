import { list } from "@keystone-next/keystone/schema";
import { integer, relationship, select, text } from "@keystone-next/fields";
import { isSignedIn, permissions, rules } from "../access";

function canCreate({ session }) {

  if (!isSignedIn({ session })) {
    return false;
  }

  // you must be a CONVENER or have UNRESTRICTED access
  if (session.data['typeof'] == 'MEMBER') {
    return false;
  }

  return true;

}

function canUD({ session }) {

  if (!isSignedIn({ session })) {
    return false;
  }

  if (session.data['typeof'] == "MEMBER")
    return false;

  // you must be either an admin ...
  if (session.data['typeof'] == 'UNRESTRICTED') {
    return true;
  }

  // ... or the convener of the club and this product belongs to
  return {
    club: { id: session.data.club.id }
  }

}

const Product = list({

  access: {
    create: canCreate,
    read: rules.canReadProducts,
    update: canUD,
    delete: canUD
  },

  fields: {

    name: text({
      defaultValue: "Item"
    }),

    photo: relationship({

      ref: 'ProductImage.product',
      ui: {
        displayMode: "cards",
        cardFields: ['image', 'altText'],
        inlineCreate: { fields: ['image', 'altText'] },
        inlineEdit: { fields: ['image', 'altText'] },
      },

    }),

    description: text({
      ui: {
        displayMode: "textarea"
      }
    }),

    status: select({

      options: [
        { label: 'Draft', value: 'DRAFT' },
        { label: 'Unavailable', value: 'UNAVAILABLE' },
        { label: 'Available', value: 'AVAILABLE' },
      ],

      defaultValue: 'DRAFT',

      ui: {

        displayMode: "segmented-control", // dropdown mode sucks this is slick

        createView: { fieldMode: "hidden" }  // dont show while creating, only while editing  it should be visible

      }

    }),

    // always store in cents to avoid decimals
    price: integer({
      isRequired: true
    }),

    user: relationship({
      ref: 'User.products',
      defaultValue: ({ context }) => ({
        connect: { id: context.session.itemId }
      })
    }),

    inStock: relationship({
      ref: 'Stock.product'
    }),

    // how many of this got sold
    sold: relationship({
      ref: 'TotalSale.product'
    }),

    reviews: relationship({
      ref: 'Review.product',
      many: true
    }),

    club: relationship({
      ref: 'Club.products',
      defaultValue: ({ context }) => ({
        connect: { id: context.session.data.club.id }
      }),
      access: {
        update: permissions.canManageProducts
      }
    }),

  }
})

export { Product };