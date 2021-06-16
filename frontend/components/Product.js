import Link from "next/link";
import ItemStyles from "./styles/ItemStyles";
import Title from "./styles/Title";
import PriceTag from "./styles/PriceTag";
import formatMoney from "../lib/FormatMoney";
import DeleteProduct from "./DeleteProduct";
import AddToCart from "./AddToCart";
import EditButton from "./EditButton";
import styled from "styled-components";

const GoldBadge = styled.span`
  span {

    position: absolute;
    font-size: 1.8rem;
    padding: 1rem;
    display: inline-block;
    background: gold;
    color: white;
    transform: translateY(2rem) skew(-10deg);
    transform: rotateZ(-25deg);
    top: 0;
    border-radius: .2rem;
    opacity: 1;
  }
`;


export const BrokeBadge = styled.span`
  span {
    z-index: 3;
    position: absolute;
    font-size: 1.8rem;
    padding: 1rem;
    display: inline-block;
    background: red;
    color: white;
    transform: translateY(2rem) skew(-10deg);
    transform: rotateZ(-25deg);
    top: 0;
    border-radius: .2rem;
    opacity: 1;
  }
`;

export default function Product({ product, isFirst, broke }) {

  console.log(product?.name + " is out of stock ? " + broke);

  return <ItemStyles>

    <img src={product?.photo?.image?.publicUrlTransformed } alt={product.name} />

    <Title>
      <Link href={`/product/${product.id}`}>
        {product.name}
      </Link>
    </Title>

    <PriceTag>
      { formatMoney(product.price) }
    </PriceTag>

    {/* <p> {product.description} </p> */}

    <div className="buttonList">

      <EditButton id={product.id}>
        Edit ✏️
      </EditButton>

      {
        !broke &&  <AddToCart idq={product.id} />
      }

      <DeleteProduct id={ product.id }>
        Delete
      </DeleteProduct>

    </div>

    { isFirst && !broke && <GoldBadge> <span>BESTELLER</span> </GoldBadge>}
    { broke && <BrokeBadge> <span>Out of stock</span> </BrokeBadge>}
  </ItemStyles>

}