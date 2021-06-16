import { useMutation } from "@apollo/client";
import gql from "graphql-tag";
import styled from "styled-components"

const BigButton = styled.button`
  font-size: 3rem;
  border: 0;
  background: none;
  &:hover {
    color: var(--red);
    cursor: pointer;
  }
`;

const REMOVE_FROM_CART_MUTATION = gql`
  mutation REMOVE_FROM_CART_MUTATION($id: ID!) {
     deleteCartItem(id: $id) {
       id
     }
  }
`;

// run after mutation is performed
function update(cache, payload) {
  const deleted_item = payload.data.deleteCartItem;
  cache.evict(cache.identify(deleted_item));
}

export default function RemoveFromCart({ id }){
  const [removeFromCart, { loading } ] = useMutation(REMOVE_FROM_CART_MUTATION, {
    variables: {
      id
    },
    update,
    //
    // !DOESNT WORK AS OF NOW IN KEYSTONE JS :)
    // optimisticResponse: {
    //   deleteCartItem: {
    //     __typename: 'CartItem',
    //     id: id
    //   }
    // }
  })
  return <BigButton disabled={loading} onClick={removeFromCart} type="button" title="Remove this button from cart">
    &times;
  </BigButton>
}