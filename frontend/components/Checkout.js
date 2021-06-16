import gql from "graphql-tag";
import styled from 'styled-components';
import { loadStripe } from '@stripe/stripe-js';
import { CardElement, Elements, useElements, useStripe } from '@stripe/react-stripe-js';
import SickButton from './styles/SickButton';
import { useState } from 'react';
import { useCart } from "../lib/CartState";
import nProgress from 'nprogress';
import { useMutation } from "@apollo/client";
import { useRouter } from "next/dist/client/router";
import { CURRENT_USER_QUERY } from "./User";
import { USER_ORDERS_QUERY } from "../pages/orders";
import { TOP_SELLERS_QUERY } from "../pages/top-sellers";
import { debounce } from "lodash";

const CheckoutFormStyles = styled.form`
  box-shadow: 0 1px 2px 2px rgba(0, 0, 0, 0.04);
  border: 1px solid rgba(0, 0, 0, 0.06);
  border-radius: 5px;
  padding: 1rem;
  display: grid;
  grid-gap: 1rem;
`;

const CREATE_ORDER_MUTATION = gql`
  mutation CREATE_ORDER_MUTATION($token: String!) {
    checkout(token: $token) {
      id
      charge
      total
      items {
        id
        name
      }
    }
  }
`;

const stripeLib = loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY);

function CheckoutForm() {

  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);
  const [checkout,{ error: gqlError }] = useMutation(CREATE_ORDER_MUTATION, {
    refetchQueries: [{ query: CURRENT_USER_QUERY }, { query: USER_ORDERS_QUERY}, {query: TOP_SELLERS_QUERY}]
  });

  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const {closeCart} = useCart();

  async function handleSubmit(e) {

    e.preventDefault();
    setLoading(true);

    // Start page transition
    nProgress.start();

    const {error, paymentMethod} = await stripe.createPaymentMethod({
      type: 'card',
      card: elements.getElement(CardElement)
    })

    if(error) {
      setError(error);
      setLoading(false);
      nProgress.done();
      return;
    }

    console.log(paymentMethod);

    // send the paymentMethod aka token to server
    const order = await checkout({
      variables: {
        token: paymentMethod.id
      }
    })

    console.log('Finished with the oder!')
    console.log('order', order);

    // change the page to view order
    router.push({
      pathname: '/order/[id]',
      query: { id: order.data.checkout.id }
    })

    // close cart
    closeCart();
    setLoading(false);
    nProgress.done();
  }

  // const safeHandleSubmit = debounce(handleSubmit, 1500);

  return (
    <CheckoutFormStyles onSubmit={handleSubmit}>
     {error && <p style={{fontSize: 12}}>  {error.message} </p>}
     {gqlError && <p style={{fontSize: 12}}>  {gqlError.message} </p>}
      <CardElement />
      <SickButton disabled={loading}>Check Out Now</SickButton>
    </CheckoutFormStyles>
  );
}

function Checkout() {
  return <Elements stripe={stripeLib}>
    <CheckoutForm />
  </Elements>
}

export { Checkout };