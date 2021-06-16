import { useQuery } from "@apollo/client";
import gql from "graphql-tag";

export const CURRENT_USER_QUERY = gql`
  query {
    authenticatedItem {
      ... on User {
        id
        name
        email
        club {
          id
          name
        }
        typeof
        products {
          name
          id
          description
        }
        role {
          name
        }
        cart {
          id
          quantity
          product {
            id
            price
            name
            description
            photo {

              image {
                publicUrlTransformed
              }
            }

          }
        }
      }
    }
  }
`;

export function useUser() {
  const { data } = useQuery(CURRENT_USER_QUERY);
  return data?.authenticatedItem;
}