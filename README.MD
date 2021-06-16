## Club Inventory Management Tool
### E-commerce app for institutions across the globe 
&nbsp;
 
#### Installation

We need to get the Backend running first and then the Frontend so that **Next JS** can connect to the **Graph QL** endpoint on the backend. Each 📁 in the master branch is a separate node deployment in itself. (backend and frontend)

##### Initial setup

Open `.env_sample` in `backend` and fill it with your own details. For that you'll need to create an account in Mongo DB, Cloudinary (for storing product photos) and Stripe. Then rename  `.env_sample` to  `.env`. 

Also fill in your Stripe public key in `frontend/.env.local` 

##### Further steps

1.Comment out the shown highlighted code in `backend/schemas/Role.ts` 

![RoleImage](https://res.cloudinary.com/returnoftheking/image/upload/v1623886796/Screenshot_2021-06-17_at_5.07.31_AM_dbfh6r.png)


2.Run the below commands in root folder of `backend` and `frontend`

```bash
npm install
npm run build
npm run start
```

3.Visit `http://localhost:3000/`

 You'll prompted to create an initial account , this is going 
 to be the administrator account. 

 After logging in, go the `Roles` tab and create a new Role 
 called 'Admin' and check all the boxes. Assign the `Admin` 
 Role to yourself. 

4.Now uncomment the previously commented code and restart the 
 backend server

5.Now visit `http://localhost:7777/` which is the frontend Next JS deployment.

#### How to use

Create clubs from Admin account, then assign the Convener role to any user from the member dashboard . The convener can add products and dispatch requests made by any regular member user. Leave reviews, rank bestsellers, other cool stuff like caching, etc taken care of!

#### References

My all time favourite CMS - Keystone JS 
https://www.keystonejs.com/quick-start/adapters

Next JS - frontend ssr react
http://nextjs.com/

Apollo Graph QL queries/mutations/polls
https://www.apollographql.com/docs/react/data/queries/

