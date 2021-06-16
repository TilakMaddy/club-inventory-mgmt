import { useState } from "react";
import { useQuery, useMutation, useLazyQuery } from "@apollo/client";
import  gql from "graphql-tag";
import ErrorMessage from "../components/ErrorMessage";
import OrderStyles from "../components/styles/OrderStyles";
import Head from "next/head";
import Image from "next/image";
import formatMoney from "../lib/FormatMoney";
import { CURRENT_USER_QUERY } from "../components/User";
import styled from "styled-components";
import SignIn from "../components/SignIn";
import Link from "next/link";

const DISPATCH_ITEMS_QUERY = gql`
  query($id: ID!) {
    allOrderItems (
      where: {
        originalProduct : {
          club: {
            id: $id
          }
        }
      }
    ) {
      id
      name
      description
      price
      quantity
      delivered
      customer {
        name
        email
        club {
          name
        }
      }
      photo {
        id
        image {
          publicUrlTransformed
        }
      }
      originalProduct {
        id
        inStock {
          id
          quantity
        }
      }
    }
  }

`;

const UPDATE_ORDER_ITEM = gql`
  mutation UPDATE_ORDER_ITEM(
    $id: ID!
    $delivered: String
    $reasonForDeliveryStatus: String
  ) {
    updateOrderItem(
      id: $id
      data: {
        delivered: $delivered
        reasonForDeliveryStatus: $reasonForDeliveryStatus
      }
    ) {
      id
      delivered
    }
  }
`;

// const STOCK_QUERY = gql`
//   query STOCK_QUERY(
//     $id: ID!
//   ) {
//     Product(where: {
//       id: $id
//     }) {
//       id
//       inStock {
//         id
//         quantity
//       }
//     }
//   }
// `;

const STOCK_DECREASE_MUTATION = gql`
  mutation STOCK_DECREASE_MUTATION(
    $id: ID!
    $quantity: Int = 1
  ) {
    updateStock(
      id: $id
      data: {
        quantity: $quantity
      }
    ) {
      id
    }
  }
`;


export const ToggleSwitch = styled.div`

    text-align: center;
    width: 160px;
    display: inline-block;
    position: absolute;
    z-index: 500;

    input {
      display: block;
      opacity: 0;
    }
    label {
      width: 60px;
      height: 30px;
      cursor: pointer;
      display: inline-block;
      position: relative;
      background: rgb(189, 189, 189);
      border-radius: 30px;

      transition: background-color 0.4s;
      -moz-transition: background-color 0.4s;
      -webkit-transition: background-color 0.4s;
    }
    label:after {
      left: 0;
      width: 20px;
      height: 20px;
      margin: 5px;
      content: '';
      position: absolute;
      background: #FFF;
      border-radius: 10px;
    }
    input:checked + label {
      background: rgb(39, 173, 95);
    }
    input:checked + label:after {
      left: auto;
      right: 0;
    }

    p {
      font: normal 8px/40px Arial;
      color: rgb(189, 189, 189);
      display: none;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    input:checked ~ p:nth-of-type(1) {
      color: rgb(39, 173, 95);
      display: block;
    }
    input:not(:checked) ~ p:nth-of-type(2) {
      display: block;
    }
`;


function DispatchItems() {

  const { data: udata } = useQuery(CURRENT_USER_QUERY);

  const { data, error, loading } = useQuery(DISPATCH_ITEMS_QUERY, {
    // variables: { id: udata?.authenticatedItem?.id }
    variables: { id: udata?.authenticatedItem?.club.id }
  });

  const [showAllItems, setShowAllItems] = useState(true);

  const [updateOrderItem, mutationResponse] = useMutation(UPDATE_ORDER_ITEM);

  const [decStock, decResponse] = useMutation(STOCK_DECREASE_MUTATION);

  // const [findStock, sres] =  useLazyQuery(
  //   STOCK_QUERY,
  //   {
  //     fetchPolicy: "no-cache"
  //   }
  // );

  if(!udata?.authenticatedItem?.id)
    return <p> YOU ARE NOT SUPPOSED TO BE HERE SON </p>

  if(loading || mutationResponse.loading || decResponse.loading || 0)
    return <p> Loading ... </p>

  if (error  || mutationResponse.error)
    return <ErrorMessage error={error ? error : mutationResponse.error } />

  if (decResponse.error || 0)
    return <ErrorMessage error={0 ? 0 : decResponse.error } />


  const { allOrderItems: order } = data;

  async function handleDelivery(itemId, delivered, { originalProduct: { id: pid, inStock: {id: stockid, quantity: _currInStock}}, quantity: howMany }) {

    let currInStock =  _currInStock;

    console.log(0);
    console.log("handling delivery for " + pid + " for " + howMany + " items");
    console.log("currInStock for " + currInStock);
    console.log("stockid is  " + stockid);

    // @{param} howMany =>  number of items in the order

    // if you wanna deliver the product, its inStock decreases by quantity
    if(delivered == "DELIVERED") {

      if(currInStock - howMany < 0) {
        return alert("YOU CANNOT DELIVER THIS ITEM CUZ YOU HAVE LESS STOCK THAN WHAT THE USER REQUESTED !");
      }


      const _res = await decStock({
        variables: {
          id: stockid,
          quantity: currInStock - howMany
        }
      })

      console.log("decreasing stock ... by " + howMany + " from " + currInStock);
      console.dir(_res);

    }

    const reasonTitle = delivered == "REJECTED" ? "Explain in short the reason for rejection " :
      "Explain in short the reason for approval ";

    const reasonForDeliveryStatus = prompt(reasonTitle, "No Comments !");

    if(!reasonForDeliveryStatus) {
      return alert("You can't leave it empty");
    }

    // perform mutation on orderItem with id = itemId and change status
    const res =  await updateOrderItem({
      variables: {
        id: String(itemId),
        delivered,
        reasonForDeliveryStatus
      },

      update: function(cache, payload) {
        cache.evict(cache.identify(payload.data.updateOrderItem))
      }
    })
    .catch(console.log)

    console.log(res);
  }

  function switchDisplay () {
    setShowAllItems(!showAllItems);
  }

  return (
    <OrderStyles nored={true}>
      <Head>
        <title> Dispatch customer orders </title>
      </Head>
      <ToggleSwitch>
        <input type="checkbox" id="checkbox1" onClick={switchDisplay} />
        <label htmlFor="checkbox1"></label>

        <p>Undelivered items only</p>
        <p>Show All items</p>

      </ToggleSwitch>
      <div className="items">
        {
          order.map(item => (
            (showAllItems || (!showAllItems && item.delivered == "COMING_SOON")) &&
            <div className="order-item" key={item.id}>


              {/* <div className="the_image"> */}
                <Image layout="responsive" height={300} width={300} src={item.photo.image.publicUrlTransformed} alt={item.title} />
                {/* <Image className="ssonly" height={100} width={100} src={item.photo.image.publicUrlTransformed} alt={item.title} /> */}
              {/* </div> */}


              <div className="item-details">

                <h2> <span> {item.name} </span> </h2>

                <div className="item-meta-details">

                  <p className="sub-heading"> Quantity </p>
                  <p className="sub-heading">  Cost of Each </p>
                  <p className="sub-heading"> Sub Total </p>

                  <p> { item.quantity }<span style={{ color: 'gray', fonWeight: 'thin' }}>x</span> </p>
                  <p>{ formatMoney(item.price) } </p>
                  <p> { formatMoney(item.quantity * item.price)} </p>

                </div>

                <div className="item-meta-details" style={{ marginTop: 20}}>

                  <span style={{ color: 'gray', fonWeight: 'thin' }}>STATUS</span>

                  { item.delivered == "COMING_SOON" &&
                    <span style={{ color: item.delivered == "COMING_SOON" ? "brown" : "red" }}>
                      <button style={{
                        color: 'brown',
                        fontStyle: 'inherit',
                        padding: 15
                      }}
                      onClick={() => handleDelivery(item.id, "REJECTED", item)}> REJECT </button>
                      {/* { item.delivered } */}
                    </span>
                  }

                  { item.delivered == "COMING_SOON" && item.originalProduct.inStock.quantity >= item.quantity &&

                    <span style={{ color: item.delivered == "COMING_SOON" ? "brown" : "green" }}>
                      <button style={{
                        color: 'brown',
                        fontStyle: 'inherit',
                        padding: 15
                      }}
                      onClick={() => handleDelivery(item.id, "DELIVERED", item)}> DELIVER </button>

                    </span>
                  }

                  {
                    item.delivered == "COMING_SOON" && item.originalProduct.inStock.quantity < item.quantity &&

                    <span style={{ color: "red" }}>
                     Demand for {`${item.quantity}`} items but you only have
                     { ` ${item.originalProduct.inStock.quantity}` } in your store !

                    <Link href={{ pathname: `/update`, query: {
                      id: item.originalProduct.id
                    }}}><span style={{
                      fontSize: "18px",
                      textDecoration: "underline",
                      color: "blue"
                    }}>Click here</span></Link> to update your stock.

                    </span>

                  }

                  <span style={{ color: item.delivered == "DELIVERED" ? "green" : "red" }}>
                    { item.delivered != "COMING_SOON" &&
                      (item.delivered == "REJECTED" ? "Rejected Request" : "Delivered")
                    }
                  </span>

                </div>

                <div className="item-meta-details" style={{ marginTop: 20}}>
                  <span>
                  { `Ordered by ${item.customer?.name}  `}
                  </span>
                  <span>
                  { `${item.customer?.email}  `}
                  </span>
                  <span>
                    {`From ${item.customer?.club.name} Club`}
                  </span>

                </div>

                <p className="desc-stuff bsonly" style={{marginTop: 40, maxWidth: 600}}>
                  { item.description }
                </p>

              </div>
            </div>
          ))
        }
      </div>

    </OrderStyles>
  )

}

export default function DispatchItemsPage() {
  const { data, loading: ld } = useQuery(CURRENT_USER_QUERY);
  const me =  data?.authenticatedItem;

  if(ld) {
    return <p> Loading ... </p>
  }

  if(!me) return <SignIn />

  if(me['typeof'] === 'CONVENER')
   return <div>
        <DispatchItems />
    </div>

  if(me['typeof'] === 'MEMBER')
  return <div>
    <h2> You only have <b style={{
      color: "red"
    }}>Member</b> privilege for <b style={{
      color : "green"
    }}>{me?.club.name}</b> club ! <br /> <br /> You cannot dispatch any items {`:(`}</h2>
  </div>

  if(me['typeof'] === 'UNRESTRICTED')
    return <div>
      <h2> Dear Admin {me.name}, we sincerely apologise cuz you are not allowed to accept/deny any requests from users. Only Conveners can do so.</h2>
    </div>

  return <h2> Unidentified member type !! WEBSITE HACKED 😡</h2>

}