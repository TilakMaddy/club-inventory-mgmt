import { useQuery } from "@apollo/client";
import gql from "graphql-tag";
import styled from 'styled-components';
import Product from "./Product";

const STORE_QUERY = gql`
  query STORE_QUERY(
    $sellerId: ID!
  ) {
    # allProducts (where: {
    #   user: {
    #     id: $sellerId
    #   }
    # })
    User(where: { id: $sellerId }){
      products {
        id
        name
        sold {
          quantity
        }
        price
        description
        photo {
          id
          image {
            publicUrlTransformed
          }
        }
      }
    }
  }
`;


export const ProductsListStyles = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 60px;
`;

export default function Store({ sellerId }) {

  const { data, error, loading } = useQuery(STORE_QUERY, {
    variables: {
      sellerId
    }
  });

  if (loading)
    return <p> Loading ... </p>

  if(error)
    return <p> { error.message} </p>


  return <div>
    <ProductsListStyles>
      {
        data.User.products.map(p => <Product key={p.id} product={p} />)
      }
    </ProductsListStyles>
  </div>

}