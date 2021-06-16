import { useMutation, useQuery } from "@apollo/client";
import gql from "graphql-tag";
import useForm from "../lib/useForm";
import Form from "./styles/Form";
import DisplayError from "./ErrorMessage";
import { ALL_PRODUCTS_QUERY } from "./Products";
import Router from "next/router";
import { CURRENT_USER_QUERY } from "./User";

const CREATE_PRODUCT_MUTATION =  gql`

  mutation CREATE_PRODUCT_MUTATION(
    # Which variable are getting passed in and what types are they
    $name: String! # the exclamation mark indicates required
    $description: String!
    $price: Int!
    $image: Upload
  ) {
    createProduct(data: {
      name: $name
      description: $description
      price: $price
      status: "AVAILABLE"
      photo: {
        # nested graph ql query to create ProductImage (does it under the hood)
        create: {
          image: $image,
          altText: $name
        }
      }
    }) {

      # Get back the following of the product after creating the above mutation
      id
      price
      description
      name
    }
  }
`;

const CREATE_STOCK_FOR_PRODUCT =  gql`

  mutation CREATE_STOCK_FOR_PRODUCT(
    $id: ID!
    $quantity: Int = 1
  ) {
    createStock(data: {
      product: { connect : { id:  $id } },
      quantity: $quantity
    }) {
      id
      quantity
    }
  }

`;

export default function CreateProduct() {

  const { data: lop, loading: ld } = useQuery(CURRENT_USER_QUERY);
  const me =  lop?.authenticatedItem;

  console.log("me ");
  console.dir(me);

  const { inputs, handleChange, clearForm, resetForm } = useForm({
    image: '',
    name: 'Club Item',
    price: 300,
    description: "Specific details about the product",
    club: me?.club.name,
    inStock: 1
  });

  const [createProduct, { data, loading, error }] = useMutation(CREATE_PRODUCT_MUTATION, {

    variables: Object.keys(inputs)
      .filter(key => key !== 'inStock')
      .filter(key => key !== 'club')
      .reduce((obj, key) => {
        obj[key] = inputs[key];
        return obj;
      }, {}
    ),

    /**
     *
     * Once we create the mutation, if we don't refetch the all-products-query
     * then on going to products page you will NOT find the most up to date
     * list of items - because apollo would have already cached it when you first
     * visited the products page before coming here to sell page !
     *
     */
    refetchQueries: [{ query: ALL_PRODUCTS_QUERY }]
    //refetchQueries: [{ query: ALL_PRODUCTS_QUERY, [optional] => variables: { ...}}]


  });

  const [createStock, { data: jdata, loading: jloading, error: jerror }] = useMutation(CREATE_STOCK_FOR_PRODUCT);

  if(jloading || loading || ld)
    return <p> Loading ... </p>

  return (
    <Form onSubmit={ async (e) => {

      e.preventDefault();

      // Submit the inout fields to the backend
      const res = await createProduct();

      // reactive variable from useMutation Hook
      console.log(res.data);

      // Set stock quantity for product id = res.data.id
      await createStock({
        variables: {
          id: res.data.createProduct.id,
          quantity: inputs.inStock
        }
      })

      // res.data <---> (data -> from the useMutation hoo)
      clearForm();

      // redirect to product's individual page
      Router.push({
        pathname: `/product/${res.data.createProduct.id}`
      });

    }}>

      <DisplayError error={error} />

      <fieldset disabled={loading} aria-busy={loading}>

          <label htmlFor="image">
            Photo
            <input
              required
              type="file"
              id="image"
              name="image"
              onChange={handleChange}
              />
          </label>

          <label htmlFor="name">
            Name
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Name"
              value={inputs.name}
              onChange={handleChange}
              />
          </label>

          <label htmlFor="inStock">
            Quantity
            <input
              type="number"
              id="inStock"
              name="inStock"
              min="1"
              placeholder="Quantity In Stock"
              value={inputs.inStock}
              onChange={handleChange}
              />
          </label>

          <label htmlFor="price">
            Price
            <input
              type="number"
              id="price"
              name="price"
              placeholder="price"
              value={inputs.price}
              onChange={handleChange}
              />
          </label>


          <label htmlFor="description">

            Description
            <textarea
              id="description"
              name="description"
              placeholder="description"
              value={inputs.description}
              onChange={handleChange}
            ></textarea>

          </label>

          <label htmlFor="club">
            Club
            <input
              type="text"
              id="club"
              name="club"
              placeholder={me?.club.name + " Club, assigned by Admin"}
              value={me?.club.name}
              disabled={true}
              />
          </label>

          <button type="submit">+ Add Product</button>


          {/* <button type="button" onClick={ clearForm }>Clear Form</button>
          <button type="button" onClick={ resetForm }>Reset Form</button> */}

      </fieldset>

    </Form>
)}


