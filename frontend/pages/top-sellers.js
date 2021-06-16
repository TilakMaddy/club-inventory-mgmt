import { useQuery } from "@apollo/client";
import  gql from "graphql-tag";
import ErrorMessage from "../components/ErrorMessage";
import OrderStyles from "../components/styles/OrderStyles";
import Head from "next/head";
import Image from "next/image";
import { useState, useEffect } from "react";
import Link from "next/link";

export const TOP_SELLERS_QUERY = gql`
  query {
    allTotalSales(sortBy: quantity_DESC, where:{
      user_is_null: false
    }) {
      id
      quantity
      user {
        id
        name
      }
    }
  }
`;

export default function TopSellers() {

  const { data, error, loading } = useQuery(TOP_SELLERS_QUERY);
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

  if(loading || !faces)
    return <p> Loading ... </p>


  if (error)
    return <ErrorMessage error={error} />

  const { allTotalSales: ats } = data;

  return (
    <OrderStyles nored={true}>
      <Head>
        <title> C.I.M - Top Sellers </title>
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
                  <p className="sub-heading"> Product Requests </p>
                  <p className="sub-heading"> Products </p>

                  <p> { s.user.name } </p>
                  <p> { s.quantity } </p>
                  <p style={{ textDecoration: "underline", color: "brown"}}>
                    <Link href={{
                      pathname: `store/[id]`,
                      query: { id: s.user.id, name: s.user.name},
                    }}> View store </Link>
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