import { useRouter } from "next/dist/client/router";
import Title from "../../components/styles/Title";
import Link from "next/link";
import gql from "graphql-tag";
import Product from "../../components/Product";
import { useQuery} from "@apollo/client";
import { ProductsListStyles } from "../../components/Store";

const CLUB_PRODUCTS_QUERY_SPECIFIC = gql`
  query CLUB_PRODUCTS_QUERY_SPECIFIC(
    $clubId: ID!
  ) {
    allProducts (where: {
      club: {
        id: $clubId
      }
    }){
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
`;

function CStore({ clubId }) {

  const { data, error, loading } = useQuery(CLUB_PRODUCTS_QUERY_SPECIFIC, {
    variables: {
      clubId
    }
  });

  if (loading)
    return <p> Loading ... </p>

  if(error)
    return <p> { error.message} </p>


  return <div>
    <ProductsListStyles>
      {
        data.allProducts.map(p => <Product key={p.id} product={p} />)
      }
    </ProductsListStyles>
  </div>

}

export default function ClubStore() {

  const { query } = useRouter();

  return <div>

    <div style={{
      zIndex: 10,
      padding: 50,
    }}>

      <Title>
        <Link href={{ pathname: `/club/${query.id}`, query: { name: query.clubName }}}>
          {`${query.clubName} Club Products`}
        </Link>
      </Title>

    </div>

    <CStore clubId={query.id} />

  </div>
}
