import CreateProduct from "../components/CreateProduct";
import CreateProductAsAdmin from "../components/CreateProductAsAdmin";
import { CURRENT_USER_QUERY } from "../components/User";
import SignIn from "../components/SignIn";
import { useQuery } from "@apollo/client";

export default function SellPage() {

  const { data, loading: ld } = useQuery(CURRENT_USER_QUERY);
  const me =  data?.authenticatedItem;

  if(ld) {
    return <p> Loading ... </p>
  }

  if(!me) return <SignIn />

  if(me['typeof'] === "UNRESTRICTED") {
    return <div>
        <CreateProductAsAdmin />
    </div>
  }

  if(me['typeof'] === 'CONVENER')
   return <div>
        <CreateProduct />
    </div>

  if(me['typeof'] === 'MEMBER')
  return <div>
    <h2> You only have <b style={{
      color: "red"
    }}>Member</b> privilege for <b style={{
      color : "green"
    }}>{me?.club.name}</b> club ! <br /> <br /> You cannot sell items {`:(`}</h2>
  </div>


}
