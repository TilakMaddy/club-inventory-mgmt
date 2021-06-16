import 'dotenv/config';
import { sendPasswordResetEmail } from './lib/mail';
import { config, createSchema } from '@keystone-next/keystone/schema';
import { createAuth } from '@keystone-next/auth';
import { User } from './schemas/User';
import { Stock } from './schemas/Stock';
import { Club } from './schemas/Club';
import { Review } from "./schemas/Review";
import { Product } from "./schemas/Product";
import { CartItem } from "./schemas/CartItem";
import { OrderItem } from "./schemas/OrderItem";
import { TotalSale } from "./schemas/TotalSale";
import { permissionsList } from "./schemas/fields";
import { Order } from "./schemas/Order";
import { Role } from "./schemas/Role";
import { ProductImage } from "./schemas/ProductImage";
import { withItemData, statelessSessions } from '@keystone-next/keystone/session';
import { extendGraphqlSchema } from "./mutations/index";

const databaseURL = process.env.DATABASE_URL;


const sessionConfig = {
  maxAge: 360 * 24 * 60 * 60,
  secret: process.env.COOKIE_SECRET
}

const { withAuth } = createAuth({
  listKey: 'User',
  identityField: 'email',
  secretField: 'password',
  initFirstItem: {
    fields: ['name', 'email', 'password']
  },
  passwordResetLink: {
    async sendToken(args) {
      await sendPasswordResetEmail(args.token, args.identity);
    }
  }
});

export default withAuth(config({

  server: {

    cors: {
      origin: [process.env.FRONTEND_URL],
      credentials: true, // to pass in the cookies on connecting to front end
    }

  },
  db: {
    adapter: 'mongoose',
    url: databaseURL
  },
  lists: createSchema({
    User,
    Product,
    ProductImage,
    CartItem,
    OrderItem,
    Order,
    Role,
    TotalSale,
    Review,
    Stock,
    Club
  }),

  extendGraphqlSchema, // from mutations/index.ts

  ui: {
    isAccessAllowed: ({ session }) => {
      console.log(session)
      return !!session?.data;
    }
  },

  session: withItemData(statelessSessions(sessionConfig), {
    // graphql query will return to session.data
    User: `id name typeof club { id name } email role { ${permissionsList.join(' ')} } `
  }),


}));