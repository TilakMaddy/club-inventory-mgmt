import { useMutation } from "@apollo/client";
import gql from "graphql-tag";
import {CURRENT_USER_QUERY, useUser} from "./User";

const ADD_TO_CART_MUTATION = gql`
  mutation ADD_TO_CART_MUTATION($id: ID!) {
    addToCart(productID: $id) {
      id
      #quantity -> we dont need it
    }
  }
`;


export default function AddToCart({ idq }) {
  const [addToCart, { loading }] = useMutation(ADD_TO_CART_MUTATION, {
    variables: {
      id: idq
    },
    refetchQueries: [{ query: CURRENT_USER_QUERY }]
  })

  const me = useUser();
  if(!me) {
    return null;
  }

  return <button type="button" disabled={loading} onClick={addToCart}>
    Add {loading && "ing "} To Cart 🛒
  </button>
}