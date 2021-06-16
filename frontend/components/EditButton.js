import { useUser } from "./User";
import Link from "next/link";
import { useQuery } from "@apollo/client";
import { PRODUCT_CLUB_QUERY } from "./DeleteProduct";

export default function EditButton({ id , children}) {

  const me = useUser();

  const { data: d, loading: lr, error: er } = useQuery(PRODUCT_CLUB_QUERY, {
    variables: {
      id
    }
  });

  if(!me) {
    return null;
  }

  if(me['typeof'] === "MEMBER")
    return null;

  if(lr)
    return <p> Loading ... </p>

  if(er) {
    return <p> Error bitch  </p>
  }

  // you must be the convener of the club to which this item belongs
  // or admin to delete product

  const clubIdOfProduct = d.Product.club.id;
  if(me["typeof"] === "CONVENER" && (me.club.id !== clubIdOfProduct)) {
    return null;
  }

  return <Link href={{
      pathname: '/update',
      query: {
        id
      }
    }}>{ children }</Link>

}
