import { permissionsList } from './schemas/fields';
import { ListAccessArgs } from './types';

export function isSignedIn({ session }: ListAccessArgs) {
  return !!session;
}

export const permissions = Object.fromEntries(
  permissionsList.map(p =>
    [
      p,
      function ({ session }) {
        return !!session?.data.role?.[p];
      }
    ]
  )
);

// Rule based functions
// Rules can return a boolean or a filter which limits which prodcuts they can CRUD

export const rules = {

  canManageProducts({ session }: ListAccessArgs) {

    if (!isSignedIn({ session })) {
      return false;
    }

    // do they have permission to manage products ?
    if (permissions.canManageProducts({ session }))
      return true;

    // if not do they own this item ?
    // use graphql where-api
    return { user: { id: session.itemId } }
  },

  canReadProducts({ session }: ListAccessArgs) {
    return { status: 'AVAILABLE' };
  },

  canOrder({ session }: ListAccessArgs) {

    if (!isSignedIn({ session })) {
      return false;
    }

    // do they have permission to manage products ?
    if (permissions.canManageCart({ session }))
      return true;

    // if not do they own this item ?
    // use graphql where-api
    return { user: { id: session.itemId } }
  },


  canManageUsers({ session }: ListAccessArgs) {

    if (!isSignedIn({ session })) {
      return false;
    }

    // do they have permission to manage products ?
    if (permissions.canManageUsers({ session }))
      return true;

    // otherwise they may on;y update themselvs
    return { id: session.itemId };
  },

};

