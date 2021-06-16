import { useQuery } from "@apollo/client";
import  gql from "graphql-tag";
import { useRouter } from "next/dist/client/router"
import ErrorMessage from "../../components/ErrorMessage";
import OrderStyles from "../../components/styles/OrderStyles";
import formateMoney from "../../lib/FormatMoney";
import Head from "next/head";
import Image from "next/image";
import formatMoney from "../../lib/FormatMoney";

const SINGLE_ORDER_QUERY = gql`
  query SINGLE_ORDER_QUERY($id: ID!) {
    Order(where: { id: $id }) {
      id
      charge
      total
      user {
        id
      }
      items {
        id
        name
        description
        price
        quantity
        photo {
          image {
            publicUrlTransformed
          }
        }
        delivered
        reasonForDeliveryStatus
      }
    }
  }
`;

export default function SingleOrderPage() {

  const router = useRouter();
  const { id } = router.query;

  const { data, error, loading } = useQuery(SINGLE_ORDER_QUERY, {
    variables: { id }
  });

  if(loading)
    return <p> Loading ... </p>

  if (error)
    return <ErrorMessage error={error} />

  const { Order: order } = data;

  return (
    <OrderStyles>
      <Head>
        <title> C.I.M - { order.id } </title>
      </Head>
      <p>
        <span>Order Id: </span>
        <span>{ order.id } </span>
      </p>
      <p>
        <span>Order charge: </span>
        <span>{ order.charge } </span>
      </p>
      <p>
        <span>Order total: </span>
        <span>{ formateMoney(order.total) } </span>
      </p>
      <p>
        <span> Items count </span>
        <span> { order.items.length } </span>
      </p>
      <div className="items">
        {
          order.items.map(item => (
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
                  <span></span>
                  <span style={{ color: item.delivered == "COMING_SOON" ? "brown" : item.delivered == "DELIVERED" ? "green" : "red" }}>
                    { item.delivered == "COMING_SOON" ? "Awaiting Approval " :
                      item.delivered == "REJECTED" ? "Rejected Request " :  "Delivered "
                    }
                    <br />

                    {(item.reasonForDeliveryStatus != "No Comments !") && (`${item.reasonForDeliveryStatus}`) }
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