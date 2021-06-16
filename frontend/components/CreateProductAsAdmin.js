import { useMutation, useQuery } from "@apollo/client";
import gql from "graphql-tag";
import { useState } from "react";
import useForm from "../lib/useForm";
import Form from "./styles/Form";
import DisplayError from "./ErrorMessage";
import { ALL_PRODUCTS_QUERY } from "./Products";
import Router from "next/router";
import { CURRENT_USER_QUERY } from "./User";
import Select from "react-select";

export const groupStyles = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
};

export const groupBadgeStyles = {
  backgroundColor: '#EBECF0',
  borderRadius: '2em',
  color: '#172B4D',
  display: 'inline-block',
  fontSize: 12,
  fontWeight: 'normal',
  lineHeight: '1',
  minWidth: 1,
  padding: '0.16666666666667em 0.5em',
  textAlign: 'center',
};


export const formatGroupLabel = data => (
  <div style={groupStyles}>
    <span>{data.label}</span>
    <span style={groupBadgeStyles}>{data.options.length}</span>
  </div>
);

const CREATE_PRODUCT_MUTATION =  gql`

  mutation CREATE_PRODUCT_MUTATION(
    $name: String!
    $description: String!
    $price: Int!
    $image: Upload
    $clubId: ID!
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
      club: {
        connect: {
          id: $clubId
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

export const CLUBS_QUERY = gql`
  query {
   allClubs {
      id
      name
    }
  }
`;


export default function CreateProductAsAdmin() {

  const { data: lop, loading: ld } = useQuery(CURRENT_USER_QUERY);
  const me =  lop?.authenticatedItem;

  const [createStock, { data: jdata, loading: jloading, error: jerror }] = useMutation(CREATE_STOCK_FOR_PRODUCT);

  const { data: clubData, loading: lc, error: ec } = useQuery(CLUBS_QUERY);

  const reqClub = clubData?.allClubs.find(club => club.name === "Anonymous");

  const [club, setClub] = useState({ value: reqClub?.id, label: reqClub?.name});

  const { inputs, handleChange, clearForm, resetForm } = useForm({
    image: '',
    name: 'Club Item',
    price: 300,
    description: "Specific details about the product",
    inStock: 1,
  });

  const [createProduct, { data, loading, error }] = useMutation(CREATE_PRODUCT_MUTATION);

  if(ld || lc)
    return <p> Loading ... </p>

  if(ec || jerror || error)
    return <p> Some error occured while talking to the server !</p>

  return (
    <Form onSubmit={ async (e) => {

      e.preventDefault();

      const withoutInStock = Object.keys(inputs)
        .filter(key => key !== 'inStock')
        .reduce((obj, key) => {
          obj[key] = inputs[key];
          return obj;
        }, {})

      console.log("FORM STUFF")

      // console.log( {
      //   ...withoutInStock,
      //   clubId: club.value
      // })

      // Submit the input fields to the backend
      const res = await createProduct({

        variables: {
          ...withoutInStock,
          clubId: club.value
        } ,

        refetchQueries: [{ query: ALL_PRODUCTS_QUERY }]

      });

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

      <fieldset disabled={jloading || loading} aria-busy={jloading || loading}>

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
            <Select
              value = {club}
              onChange = {(e) => setClub(e)}
              instanceId="club-select"
              id="select-dropwdown-for-clubs"
              options={clubData.allClubs.map(club => ({
                value: club.id,
                label: club.name
              }))}
              formatGroupLabel={formatGroupLabel}
            />
          </label>

          <button type="submit">+ Add Product</button>

          {/* <button type="button" onClick={ clearForm }>Clear Form</button>
          <button type="button" onClick={ resetForm }>Reset Form</button> */}

      </fieldset>

    </Form>
)}


