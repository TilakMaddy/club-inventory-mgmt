import { useQuery } from "@apollo/client";
import { perPage } from "../config";
import gql from "graphql-tag";
import styled from 'styled-components';
import Product from "./Product";

// i am exporting the below query to be used in CreateProduct.js
export const ALL_PRODUCTS_QUERY = gql`
  query ALL_PRODUCTS_QUERY(
    $skip: Int = 0,
    $first: Int = 0
  ){
  # query ALL_PRODUCTS_QUERY {
    allProducts (skip: $skip, first: $first){

    # allProducts {
      id
      name
      sold {
        quantity
      }
      price
      inStock {
        quantity
      }
      description
      photo {
        id
        image {
          publicUrlTransformed
        }
      }
    }
  }
`;


const BESTSELLER = gql`
  query {
  allTotalSales(first: 2, sortBy: quantity_DESC, where:{
    user_is_null: true
  }) {
    quantity
    product {
      name
      id
    }
  }
}
`;

const ProductsListStyles = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 60px;
`;

export default function Products({ page }) {

  const { data, error, loading } = useQuery(ALL_PRODUCTS_QUERY, {
    variables: {
      first: perPage,
      skip: page * perPage - perPage
    }
  });

  const { data: bdata, error: berror, loading: bloading } = useQuery(BESTSELLER);

  // console.log(data);

  if (loading || bloading)
    return <p> Loading ... </p>

  if(error || berror)
    return <p> { error?.message + " and " + berror?.message } </p>


  const isBestseller = (tgt) => {

    for (const sale of bdata.allTotalSales) {
      if(sale.product.id == tgt)
        return true;
    }
    return false;

  };

  const isBroke = (p) => {
    if(!p.inStock) {
      return false;
    }
    // console.log(p.inStock?.quantity + " is broke ? ")
    const ans =  (parseInt(p.inStock?.quantity)) <= 0;
    // console.log(ans);
    return ans;
  }

  data.allProducts.forEach(p =>
    console.log(p.name + " ==> " + p.inStock?.quantity)
  );

  return <div>
    <ProductsListStyles>
      {
        data.allProducts.map(p => <Product key={p.id} product={p} isFirst={isBestseller(p.id)} broke={isBroke(p)}/>)
      }
    </ProductsListStyles>
  </div>

}