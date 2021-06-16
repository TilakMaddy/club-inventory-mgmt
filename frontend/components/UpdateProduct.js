import { useMutation, useQuery } from "@apollo/client";
import { useState } from "react";
import gql from "graphql-tag";
import Form from "./styles/Form";
import DisplayError from "../components/ErrorMessage";
import useForm from "../lib/useForm";

const SINGLE_PRODUCT_QUERY = gql`
  query SINGLE_PRODUCT_QUERY($id: ID!) {
    Product(where: { id: $id }) {
      id
      name
      description
      price
    }
  }
`;
const SINGLE_PRODUCT_STOCK_QUERY = gql`
  query SINGLE_PRODUCT_STOCK_QUERY($id: ID!) {
    Product(where: { id: $id }) {
      id
      inStock {
        id
        quantity
      }
    }
  }
`;

const UPDATE_PRODUCT_MUTATION = gql`
  mutation UPDATE_PRODUCT_MUTATION(
    $id: ID!
    $name: String
    $description: String
    $price: Int
  ) {
    updateProduct(
      id: $id
      data: {
        name: $name
        description: $description
        price: $price
      }
    ) {
      id
      name
      description
      price
    }
  }
`;

const UPDATE_STOCK_MUTATION = gql`
  mutation UPDATE_STOCK_MUTATION(
    $id: ID!,
    $quantity: Int
  ) {
    updateStock(
      id: $id
      data: {
        quantity: $quantity
      }
    ) {
      id
      quantity
    }
  }
`;

const POLL_INTERVAL = 500;

export default function UpdateProduct({ id }) {

  // get the existing data

  const { data, error, loading } = useQuery(SINGLE_PRODUCT_QUERY, {
    variables: {
      id
    }
  })

  const { data: sd, loading: ld, error: ed } = useQuery(SINGLE_PRODUCT_STOCK_QUERY, {
    variables: {
      id
    },
    pollInterval: POLL_INTERVAL
  })

  // create a mutation for updated data
  const [updateProduct, mutationResponse] = useMutation(UPDATE_PRODUCT_MUTATION);

  // create a mutation for updated stock
  const [updateStock, stockRes] = useMutation(UPDATE_STOCK_MUTATION);

  // form to collect new data
  const { inputs, handleChange } = useForm(data?.Product);
  const {inputs: stock, handleChange: handleStock } = useForm(sd?.Product?.inStock);

  // these if statements have to come after all hooks have ben used
  if(loading || ld)
    return <p>Loading ... </p>

  if(error || ed)
    return <DisplayError error={error ? error : ed} />

  return ( <>
    <Form onSubmit={ async (e) => {

      e.preventDefault();

      const res = await updateProduct({
        variables: {
          id,
          name: inputs.name,
          description: inputs.description,
          price: inputs.price,
        },
      }).catch(console.error);

      console.log(res);

    }}>

      <DisplayError error={error || mutationResponse.error } />

      <fieldset disabled={mutationResponse.loading} aria-busy={mutationResponse.loading}>

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
              onChange={handleChange}>
            </textarea>

          </label>

          <button type="submit">Update Product</button>

      </fieldset>

    </Form>

    <br /><br /><br />

    <Form onSubmit={ async (e) => {

      e.preventDefault();

      const res = await updateStock({
        variables: {
          id: stock.id,
          quantity: stock.quantity,
        },
      }).catch(console.error);

      console.log(res);

      console.log(stock.quantity, " --> qty stock");

    }}>

    <DisplayError error={ed || stockRes.error } />

      <fieldset disabled={stockRes.loading} aria-busy={stockRes.loading}>

        <label htmlFor="quantity">
          Stock Quantity (live updates every { POLL_INTERVAL }ms)
          <input
            type="number"
            id="quantity"
            name="quantity"
            placeholder="quantity"
            value={stock?.quantity || 0}
            onChange={handleStock}
            />
        </label>

        <button type="submit">Update Product Stock</button>

      </fieldset>

    </Form>

  </>)
}