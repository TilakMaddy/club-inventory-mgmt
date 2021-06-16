import { CURRENT_USER_QUERY } from "../components/User";
import SignIn from "../components/SignIn";
import { useQuery } from "@apollo/client";
import { backendURL } from "../config";
import Link from "next/link";
import MemberDashboard from "../components/MemberDashboard";


export default function Dashboard() {

  const { data, loading: ld } = useQuery(CURRENT_USER_QUERY);
  const me =  data?.authenticatedItem;

  if(ld) {
    return <p> Loading ... </p>
  }

  if(!me) return <SignIn />

  if(me['typeof'] !== 'UNRESTRICTED')
    return <div>
      <h2> SON, YOU SHOULDN'T BE HERE ! Go back to your mommie <b>{`(° ͜ʖ͡°)╭∩╮`} </b> </h2>
    </div>


  return <MemberDashboard />

  // return <MemberDashboard>
  //   <h1><Link href={backendURL}><a style={{
  //     textDecoration: "underline",
  //     color: "green"
  //   }}>Visit Admin Dashboard</a></Link></h1>

  //   <ul style={{ fontSize: "18px"}}>
  //     <li>Create Clubs and link them with Users in <b>Clubs tab</b></li>
  //     <li>Assign Convener/Member role to Users in <b>User.typeof</b></li>
  //     <li>Add Products and link them to Club in <b>Products tab</b></li>
  //     <li> ..... and much more !</li>
  //   </ul>

  //   <h1>
  //     📝 -  Permissions have been setup very explicitly
  //   </h1>
  //   <ul style={{ fontSize: "18px"}}>
  //     <li>Admin cannot accept/deny dispatch requests. Only 'Conveners' can.</li>
  //     <li>Normal users may be also able to login to their dashboard</li>
  //     <li>Editing fields that you have no permission to will not cause changes to take place (will be alerted) </li>
  //   </ul>

  //   <h1>
  //     📝 - As admin you can edit almost anything, but to keep the onus is on you to keep data consistent
  //   </h1>
  // </MemberDashboard>

}