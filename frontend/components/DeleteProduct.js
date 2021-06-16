import { useMutation, useQuery } from "@apollo/client";
import gql from "graphql-tag";
import { useUser } from "./User";

const DELETE_PRODUCT_MUTATION = gql`
  mutation DELETE_PRODUCT_MUTATION($id: ID!) {
    deleteProduct(id: $id) {
      id
      name
    }
  }
`;

export const PRODUCT_CLUB_QUERY = gql`
  query PRODUCT_CLUB_QUERY($id: ID!) {
    Product(where: {
      id: $id
    }) {
      inStock {
        id
      }
      club {
        id
      }
    }
  }
`;

const DEL_INSTOCK = gql`
  mutation DEL_INSTOCK($id: ID!) {
    deleteStock(id: $id) {
      id
      name
    }
  }
`;


// we must evict the deleted item from cache
function runAfterMutation(cache, payload) {
  cache.evict(cache.identify(payload.data.deleteProduct));
}

export default function DeleteProduct({ id, children }) {

  const me = useUser();
  const [deleteProduct, { loading }] = useMutation(DELETE_PRODUCT_MUTATION, {
    variables: {
      id
    },
    update: runAfterMutation
  })

  const { data: d, loading: lr, error: er } = useQuery(PRODUCT_CLUB_QUERY, {
    variables : {
      id
    }
  });

  const[delStock,  { data: dw, loading: lrw, error: erw }] = useMutation(DEL_INSTOCK);

  if(!me) {
    return null;
  }

  if(me['typeof'] === "MEMBER")
    return null;

  if(lr || lrw)
    return <p> Loading ... </p>

  if(er || erw) {
    return <p> Error bitch : {er} </p>
  }

  // you must be the convener of the club to which this item belongs
  // or admin to delete product

  const clubIdOfProduct = d.Product.club.id;
  if(me["typeof"] === "CONVENER" && (me.club.id !== clubIdOfProduct)) {
    return null;
  }


  return <button
    type="button"
    disabled={loading}
    onClick={() => {
      if(confirm("Do you want to delete the item ? ")) {
        deleteProduct().catch(err => alert(err.message));
        delStock({
          variables: {
            id: d.Product.inStock.id
          }
        })
        console.log("DELETED ! ");
      }
    }}>
      {children}

  </button>
}