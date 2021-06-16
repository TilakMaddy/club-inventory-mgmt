import { useQuery } from "@apollo/client";
import  gql from "graphql-tag";
import ErrorMessage from "../components/ErrorMessage";
import OrderStyles from "../components/styles/OrderStyles";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useUser } from "../components/User";
import CreateClub from "../components/CreateClub";

export const CLUBS_GENERAL_QUERY = gql`
  query {
   allClubs {
      id
      name
      _productsMeta {
        count
      }
      _workersMeta {
        count
      }
    }
  }
`;

export default function Clubs() {

  const { data, error, loading } = useQuery(CLUBS_GENERAL_QUERY);

  // i could/could not   be logged in to see this page
  const me = useUser();

  if(loading)
    return <p> Loading ... </p>

  if (error)
    return <ErrorMessage error={error} />

  let { allClubs: ats } = data;

  if(me) {

    ats = ats.slice();

    // if i am signed in, then show my club at the top

    let cid = -1;

    for(let i = 0; i < ats.length; ++i) {
      if(ats[i].id == me.club.id) {
        cid = i;
        break;
      }
    }

    let temp = ats[0];
    ats[0] = ats[cid];
    ats[cid] = temp;

  }

  return (
    <OrderStyles nored={true}>
      <Head>
        <title> C.I.M - Clubs </title>
      </Head>
      {

        // ability to add a club if you are admin/unrestricted
        me && me['typeof'] === "UNRESTRICTED" && (<>
          <CreateClub />
        </>)
      }
      <div className="items">
        {
          ats.map((s, idx) => (
            <div className="order-item" key={s.id}>

              <div className="sellersPhoto">
                <Image height={180} width={180} src={`https://picsum.photos/180/180?${idx}srjghww`} alt="seller's photo" />
              </div>

              <div className="item-details">

                <h2> <span> #{idx + 1} </span> </h2>

                <div className="item-meta-details">

                  <p className="sub-heading"> Name of the Club </p>
                  <p className="sub-heading"> Members </p>
                  <p className="sub-heading"> Products </p>

                  <p> { s.name } { (idx == 0 && " (Your Club) ")} </p>

                  <p style={{ textDecoration: "underline", color: "brown"}}>
                    <Link href={{
                      pathname: `people/[id]`,
                      query: { id: s.id, clubName: s.name }
                    }}><a>{ s._workersMeta.count }</a></Link>
                  </p>

                  <p style={{ textDecoration: "underline", color: "brown"}}>

                    <Link href={{
                      pathname: `club/[id]`,
                      query: { id: s.id, clubName: s.name }
                    }}><a>{ s._productsMeta.count }</a></Link>
                  </p>

                </div>

              </div>
            </div>
          ))
        }
      </div>

    </OrderStyles>
  )

}