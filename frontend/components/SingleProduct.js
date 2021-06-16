import {useMutation, useQuery } from "@apollo/client";
import gql from "graphql-tag";
import DisplayError from "../components/ErrorMessage";
import Link from "next/link";
import Head from 'next/head';
import styled from "styled-components";
import DeleteProduct from "./DeleteProduct";
import AddToCart from "./AddToCart";
import ItemStyles from "./styles/ItemStyles";
import Title from "./styles/Title";
import EditButton from "./EditButton";
import { BH } from "./Header";
import { useUser } from "./User";
import { BrokeBadge } from './Product';
import SignIn from "./SignIn";

const SINGLE_PRODUCT_QUERY = gql`
  query SINGLE_PRODUCT_QUERY( $id: ID!) {
    Product(where: { id: $id}) {
      name
      price
      description
      id
      inStock {
        quantity
      }
      reviews(first: 10, sortBy: time_DESC) {
        id
        description
        stars
        customer {
          name
        }
      }
      photo {
        id
        altText
        image {
          publicUrlTransformed
        }
      }
    }
  }

`;

const DID_USER_BUY = gql`
  query DID_USER_BUY($custId: ID!) {
    allOrderItems(where: { customer : { id: $custId }}) {
      id
      customer {
        id
      }
      originalProduct {
        id
      }
    }
  }
`;

const REVIEW_PRODUCT = gql`
  mutation REVIEW_PRODUCT(
    $prodId: ID!,
    $description: String,
    $stars: Int
  ){
    createReview(data: {
      description: $description,
      stars: $stars,
      product: { connect: { id: $prodId }}
    }) {
      id
    }
  }
`;

const ProductStyles = styled.div`
  display: grid;
  grid-auto-columns: 1fr;
  grid-auto-flow: row;
  min-height: 800px;
  margin-top: 3rem;

  @media (max-width: 500px) {
    min-height: 600px;

  }
  max-width: var(--maxWidth);
  align-items: flex-start;
  gap:2rem;
  h3 { padding: 3rem; }
  img {
    width: 100%;
    object-fit: contain;
  }
`;

const ReviewsStyles = styled.div`
  font-size: 1.3rem;
  margin-top: 3rem;
  background-color: var(--color-grey-light);
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(270px, 1fr));
  grid-auto-flow: dense;
  gap: 30px;
`;

const ReviewStyle = styled.div`

/* .codepen-wrapper {
  height: 100vh;
  background-color: var(--color-grey-light);
  display: flex;
  align-items: center;
  justify-content: center;
} */

.review {
  color: var(--color-grey-dark);
  font-size: 1.4rem;
  padding: 3rem;
  position: relative;
  background-color: #fff;
  box-shadow: var(--shadow-light);
  overflow: hidden;
  flex: 0 0 50%;
  z-index: 1;
}
@media screen and (max-width: 56.25em) {
  .review {
    padding: 2rem;
  }
}
@media screen and (max-width: 37.5em) {
  .review {
    padding: 1rem;
    font-size: 1.2rem;
  }
}
.review::before {
  content: "“";
  position: absolute;
  left: -0.9rem;
  top: -2.5rem;
  font-size: 20rem;
  color: var(--color-grey-light);
  line-height: 1;
  z-index: 1;
  font-family: sans-serif;
}
.review__text {
  margin-bottom: 2rem;
  z-index: 2;
  position: relative;
}
@media screen and (max-width: 56.25em) {
  .review__text {
    margin: 0;
    padding: 1rem;
  }
}
.review__person {
  display: flex;
  align-items: center;
}
.review__photo {
  height: 4.5rem;
  width: 4.5rem;
  border-radius: 50%;
  margin-right: 1rem;
}
@media screen and (max-width: 37.5em) {
  .review__photo {
    margin-right: 0.5rem;
  }
}
.review__info {
  display: flex;
  flex-flow: row wrap;
  margin-right: auto;
}
.review__info--name {
  flex: 0 0 80%;
  font-size: 1.1rem;
  text-transform: uppercase;
  font-weight: 600;
  margin-bottom: -0.5rem;
}
@media screen and (max-width: 37.5em) {
  .review__info--name {
    font-size: 0.9rem;
  }
}
.review__info--date {
  font-size: 0.9rem;
}
@media screen and (max-width: 37.5em) {
  .review__info--date {
    font-size: 0.7rem;
  }
}
.review__rating {
  color: var(--color-grey-dark);
  font-size: 2.2rem;
  font-weight: 300;
}
`;


export default function SingleProduct({ id }) {

  const me = useUser();

  if(!me)
    return <SignIn/>

  const { data, error, loading } = useQuery(SINGLE_PRODUCT_QUERY, {
    variables: {
      id
    }
  });

  const { data: D, error: E, loading: L } = useQuery(DID_USER_BUY, {
    variables: {
      custId: me.id
    }
  });

  const [reviewMutation, { data: DM, error: EM, loading: LM}] = useMutation(REVIEW_PRODUCT);


  if (loading)
    return <p> Loading product .. . </p>

  if(error || E)
    return <DisplayError error={ error || E } />;

  if(L)
    return <p> Loading ... </p>


  console.log(D);
  console.log(me.id);

  let i_bought_it = false;

  if(D?.allOrderItems) {

    for(const i of D.allOrderItems) {
      if(!i.originalProduct) {
        continue;
      }
      console.log(i.originalProduct.id, " found 1", data.Product.id);
      if(i.originalProduct.id == data.Product.id && i.customer.id == me.id) {
        i_bought_it = true;
        break;
      }
    }

  }

  console.log("i_bought_it", i_bought_it);

  const { Product } = data;

  const broke = Product?.inStock?.quantity <= 0;

  function reviewProduct() {

    let stars = (prompt("How many stars ? (1 - 5) "));

    try {

      stars = parseInt(stars);
      if(stars < 1 || stars > 5)
        return alert("stars should be a number (1 to 5)");

    } catch(e) {
      alert("stars should be a number (1 to 5)");
      return;
    }

    const description = prompt("Your review in < 100 words");

    if(description.length === 0) {
      alert("review should not be empty !");
      return;
    }

    if(description.length > 150) {
      alert("review should be < 150 characters ");
      return;
    }

    const prodId = Product.id;

    reviewMutation({
      variables: {
        description,
        stars,
        prodId
      },
      refetchQueries: [{ query: SINGLE_PRODUCT_QUERY , variables: {
        id: prodId
      }}]
    })

  }

  return <>
  <ProductStyles>

    {/* https://nextjs.org/docs/api-reference/next/head */}
    {/** you can use Head whererver you want to control the title - it will append NOT override the pre existing children element in head tag */}

    <Head>
      <title> C.I.M | { Product.name }</title>
    </Head>

    <div style={{ position: "relative"}}>
    { broke && <BrokeBadge> <span>Out of stock</span> </BrokeBadge> }

    <img
      src={Product.photo.image.publicUrlTransformed}
      alt={Product.photo.altText}
    />
    </div>
  <div>
  <Title>
      <Link href={`/product/${Product.id}`}>
        {Product.name}
      </Link>

    </Title>
      <p style={{ fontSize: "1.5rem", color: "#000"}}> { Product.description } </p>
    <ItemStyles className="details">

      <div className="buttonList">
        <EditButton id={ Product.id }>
          Edit ✏️
        </EditButton>

        {
          !broke &&
          <AddToCart idq={ Product.id} />
        }

        <DeleteProduct id={ Product.id }>
          Delete
        </DeleteProduct>

        {
          i_bought_it &&
          <button
            type="button"
            disabled={L}
            onClick={reviewProduct}>

              Review ✏️

          </button>
        }

      </div>

    </ItemStyles>

  {

    Product.reviews.length > 0 &&

    <Title style={{
      textAlign: "left",
      paddingLeft: 0,
      marginLeft: 0,
      marginTop: 50
    }}>
      <Link href={`/product/${Product.id}`}> Recent Reviews </Link>
    </Title>
  }
    <ReviewsStyles>
      {
        Product.reviews.map(review => (

          <ReviewStyle key={review.id}>
            <div className="codepen-wrapper">
              <figure className="review">
                <blockquote className="review__text">
                  { review.description }
                </blockquote>
                <figcaption className="review__person">
                  <img src="http://alexsommers.com/codepen/user-6.jpg" alt="User 1" className="review__photo" />
                  <div className="review__info">
                    <p className="review__info--name">{ review.customer.name }</p>
                    <p className="review__info--date"> </p>
                  </div>
                  <div className="review__rating" style={{ color: "darkgray"}}> { review.stars }</div>
                </figcaption>
              </figure>
            </div>
          </ReviewStyle>

        ))
      }
    </ReviewsStyles>

  </div>
  </ProductStyles>
</>
}