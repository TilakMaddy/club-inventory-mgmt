import { useRouter } from "next/dist/client/router";
import Title from "../components/styles/Title"
import Link from "next/link";
import { useMutation, useQuery } from "@apollo/client";
import { useState, useEffect } from "react";
import  gql from "graphql-tag";
import ErrorMessage from "./ErrorMessage";
import OrderStyles from "../components/styles/OrderStyles";
import Head from "next/head";
import Image from "next/image";
import { decodeLanguage } from "../components/Cart";
import { CURRENT_USER_QUERY } from "../components/User";
import SignIn from "../components/SignIn";
import Select from "react-select";
import { CLUBS_QUERY } from "./CreateProductAsAdmin";
import { ToggleSwitch } from "../pages/dispatch-items";

export const groupStyles = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
};

export const groupBadgeStyles = {
  backgroundColor: '#EBECF0',
  borderRadius: '2em',
  color: '#172B4D',
  display: 'inline-block',
  fontSize: 6,
  fontWeight: 'normal',
  lineHeight: '1',
  minWidth: 1,
  padding: '0.16666666666667em 0.5rem',
  textAlign: 'center',
};


export const formatGroupLabel = data => (
  <div style={groupStyles}>
    <span>{data.label}</span>
    <span style={groupBadgeStyles}>{data.options.length}</span>
  </div>
);

export const PEOPLE_QUERY_FOR_CLUB = gql`
  query {
    allUsers(where:{
      typeof_not :"UNRESTRICTED"
    }) {
      id
      name
      email
      typeof
      club {
        name
        id
      }
    }
  }
`;

const CLUB_CHANGE_MUTATION = gql`

  mutation CLUB_CHANGE_MUTATION(
    $clubId: ID!,
    $userId: ID!
  ) {
    updateUser (
      id: $userId
      data: {
        club : {
          connect : {
            id: $clubId
          }
        }
      }
    ) {
      id
      club {
        id
        name
      }
    }
  }

`;


const TYPEOF_MUTATION = gql`

  mutation TYPEOF_MUTATION(
    $val: String!
    $userId: ID!
  ) {
    updateUser (
      id: $userId
      data: {
        typeof: $val
      }
    ) {
      id
      typeof
    }
  }

`;

export function PeopleComponent() {

  const { data, error, loading } = useQuery(PEOPLE_QUERY_FOR_CLUB);

  const { data: clubData, loading: lc, error: ec } = useQuery(CLUBS_QUERY);

  const [faces, setFaces] = useState(null);

  const [clubs, setClubs] = useState(data?.allUsers.map(user => ({ value: user.club.id, label: user.club.name })));

  const [changeClub, ccres] = useMutation(CLUB_CHANGE_MUTATION);

  const [changeTypeof, cct] = useMutation(TYPEOF_MUTATION);

  useEffect(() => {
    fetch('https://randomuser.me/api/?results=50')
    .then(res => res.json())
    .then(json => {
      console.log(json)
      const picArray = [];
      for(const person of json.results) {
        picArray.push(person.picture.large);
      }
      // console.log(picArray);
      setFaces(picArray);
    })
  }, [])

  if(!faces)
    return <p> Loading ... </p>

  if(loading || lc)
    return <p> Loading ... </p>

  if (error || ec)
    return <ErrorMessage error={error ? error: ec} />

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

                <div className="item-meta-details-small">

                  <p className="sub-heading"> User </p>
                  <p className="sub-heading"> Club </p>
                  <p className="sub-heading"> Role </p>

                  <p style={{
                    position: "relative",
                    top: "-3px",
                    textAlign: "center"
                  }}>

                    { s.name }

                    <br/>

                    <span style={{ textDecoration: "underline", color: "blue", fontSize: "15px",
                      position: "relative",
                      top: "6px"
                    }}>
                      <a href="#" target="_blank">{ s.email }</a>
                    </span>

                  </p>

                 <div>

                  <label htmlFor="club">
                    <Select
                      styles={{fontSize: "6px", width: "100px"}}
                      value = {clubs[idx]}
                      onChange = {async (e) => {

                        let oldClubs = clubs.slice();

                        console.log("Updating club for " , s.name, " to ", e.label);
                        oldClubs[idx] = { value: e.value, label: "Updating ..." }
                        setClubs(oldClubs);

                        const _res = await changeClub({
                          variables: {
                            userId: s.id,
                            clubId: e.value
                          }
                        })

                        oldClubs[idx] = { value: e.value, label: e.label }
                        setClubs(oldClubs.slice());

                        console.log("Updated club for " , s.name, " to ", e.label);
                        console.dir(_res);

                      }}
                      instanceId={`club-select-for-clubs${idx}-ha`}
                      id={`select-dropwdown-for-clubs${idx}-bo`}

                      options={clubData.allClubs.map(club => ({
                        value: club.id,
                        label: club.name
                      }))}
                      formatGroupLabel={formatGroupLabel}
                    />
                  </label>

                </div>

                  <div style={{color: (s['typeof'] === "MEMBER" ? "brown" : "green"),
                    fontSize: "18px"
                  }}>
                     <ToggleSwitch style={{
                        position: "relative",
                        top: "-20px",
                        fontSize: "1rem"
                     }}>

                     {
                       s.typeof === "MEMBER" &&  <input type="checkbox" id={`checkbox1-index-${idx}`} onChange={

                        async (e) => {
                          const _res = await changeTypeof({
                            variables: {
                              userId: s.id,
                              val: "CONVENER"
                            },
                            refetchQueries: [{ query: PEOPLE_QUERY_FOR_CLUB}]
                          })

                          console.log("Changed from member to convener")
                          console.log(_res);
                        }

                       } />
                     }

                     {
                       s.typeof === "CONVENER" &&  <input checked type="checkbox" id={`checkbox1-index-${idx}`} onChange={

                        async (e) => {
                          const _res = await changeTypeof({
                            variables: {
                              userId: s.id,
                              val: "MEMBER"
                            },
                            refetchQueries: [{ query: PEOPLE_QUERY_FOR_CLUB}]
                          })

                          console.log("Changed from convener to member")
                          console.log(_res);
                        }

                       } />
                     }



                      <label htmlFor={`checkbox1-index-${idx}`}></label>

                      <p>Convener</p>
                      <p>Member</p>

                    </ToggleSwitch>
                  </div>

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
        <Link href='/dashboard'><a>
         Members
        </a></Link>
      </Title>

    </div>

    <PeopleComponent />

  </div>);

  return <ClubMembers />

}
