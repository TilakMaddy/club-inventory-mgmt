import UpdateProduct from "../components/UpdateProduct";
import { useRouter } from "next/router";
import { PRODUCT_CLUB_QUERY } from "../components/DeleteProduct";
import { useQuery } from "@apollo/client";
import { useUser } from "../components/User";

export default function UpdatePage() {

  const router = useRouter();
  const { id } = router.query;

  const me = useUser();

  const { data: d, loading: lr, error: er } = useQuery(PRODUCT_CLUB_QUERY, {
    variables: {
      id
    }
  });

  if(!me || me['typeof'] === "MEMBER")
    return <h2> You are not allowed to do this operation ୧༼ಠ益ಠ╭∩╮༽</h2>;

  if(lr)
    return <p> Loading ... </p>

  if(er) {
    return <p> Error bitch : {er} </p>
  }

  // you must be the convener of the club to which this item belongs
  // or admin to delete product

  const clubIdOfProduct = d.Product.club.id;
  if(me["typeof"] === "CONVENER" && (me.club.id !== clubIdOfProduct)) {
    return <h2> You are not allowed to do this operation ୧༼ಠ益ಠ╭∩╮༽</h2>;
  }

  return <div>
    <UpdateProduct id={ id } />
  </div>
}
