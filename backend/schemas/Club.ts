import { list } from "@keystone-next/keystone/schema";
import { integer, relationship, select, text } from "@keystone-next/fields";
import { permissions } from "../access";

const Club = list({

  access: {
    create: permissions.canManageRoles,
    update: permissions.canManageRoles,
    read: () => true,
    delete: permissions.canManageRoles,
  },


  fields: {

    name: text({
      isRequired: true,
      defaultValue: "Anonymous",
      isUnique: true
    }),

    products: relationship({
      ref: 'Product.club',
      many: true
    }),

    workers: relationship({
      ref: 'User.club',
      many: true
    }),

  }
})

export { Club };