import { useRouter } from "next/dist/client/router";
import Title from "../../components/styles/Title";
import Link from "next/link";
import { useQuery } from "@apollo/client";
import { useState, useEffect } from "react";
import  gql from "graphql-tag";
import ErrorMessage from "../../components/ErrorMessage";
import OrderStyles from "../../components/styles/OrderStyles";
import Head from "next/head";
import Image from "next/image";
import { decodeLanguage } from "../../components/Cart";
import { CURRENT_USER_QUERY } from "../../components/User";
import SignIn from "../../components/SignIn";

export const PEOPLE_QUERY_FOR_CLUB = gql`
  query(
    $clubId: ID!
  ){
    allUsers (where: {
      club: {
        id: $clubId
      }
    }){
      id
      name
      email
      typeof
    }
  }
`;


export function PeopleComponent({clubId}) {

  const { data, error, loading } = useQuery(PEOPLE_QUERY_FOR_CLUB, {
    variables: {
      clubId
    }
  });

  const [faces, setFaces] = useState(null);

  useEffect(() => {
    fetch('https://randomuser.me/api/?results=50')
    .then(res => res.json())
    .then(json => {
      console.log(json)
      const picArray = [];
      for(const person of json.results) {
        picArray.push(person.picture.large);
      }
      console.log(picArray);
      setFaces(picArray);
    })
  }, [])

  if(!faces)
    return <p> Loading ... </p>

  if(loading)
    return <p> Loading ... </p>

  if (error)
    return <ErrorMessage error={error} />

  const { allUsers: ats } = data;

  return (
    <OrderStyles nored={true}>
      <Head>
        <title> C.I.M - People </title>
      </Head>
      <div className="items">
        {
          ats.map((s, idx) => (
            <div className="order-item" key={s.id}>

              <div className="sellersPhoto">
                <Image height={180} width={180} src={faces[idx]} alt="seller's photo" />
              </div>

              <div className="item-details">

                <h2> <span> #{idx + 1} </span> </h2>

                <div className="item-meta-details">

                  <p className="sub-heading"> Name </p>
                  <p className="sub-heading"> Email </p>
                  <p className="sub-heading"> Role </p>

                  <p style={{
                    position: "relative",
                    top: "-3px"
                  }}> { s.name } </p>

                  <p style={{ textDecoration: "underline", color: "blue", fontSize: "15px",
                    position: "relative",
                    top: "6px"
                  }}>
                    <a href="#" target="_blank">{ s.email }</a>
                  </p>

                  <p style={{color: (s['typeof'] === "MEMBER" ? "brown" : "green"),
                    fontSize: "18px"
                  }}>
                    { decodeLanguage(s['typeof']) }
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

export default function ClubMembersPage() {

  const { query } = useRouter();

  const { data, loading: ld } = useQuery(CURRENT_USER_QUERY);

  const me =  data?.authenticatedItem;

  if(ld) {
    return <p> Loading ... </p>
  }

  if(!me) return <SignIn />

  const ClubMembers = () => (<div>

    <div style={{
      zIndex: 10,
      padding: 50,
    }}>

      <Title>
        <Link href={{ pathname: `/people/${query.id}`, query: {
          clubName: query.clubName
        }}}><a>
        {query.clubName} Club people
        </a></Link>
      </Title>

    </div>

    <PeopleComponent clubId={query.id} />

  </div>);


  if((me['typeof'] === 'UNRESTRICTED'))
    return <div>
          <ClubMembers />
      </div>

  if((me['typeof'] === 'CONVENER' && me.club.id === query.id))
    return <div>
          <ClubMembers />
      </div>

  if(me['typeof'] === 'MEMBER')
    return <div>
      <h2> You only have <b style={{
        color: "red"
      }}>Member</b> privilege for <b style={{
        color : "green"
      }}>{me?.club.name}</b> club ! <br /> <br /> You cannot view member details{`:(`}</h2>
    </div>

  // last case - convener, but not for this club

  return <div>
      <h2> You are not the <b style={{
        color: "red"
      }}>Convener</b> for this club. <br /><br />
      You can only view member details for <b style={{
        color : "green"
      }}>

        <Link href={{
          pathname: `/people/[id]`,
          query: { id: me.club.id, clubName: me.club.name }
        }}><a>{ me.club.name }</a></Link>

      </b> club !</h2>
    </div>

}
