import styled from "styled-components"
import formatMoney from "../lib/FormatMoney";
import RemoveFromCart from "./RemoveFromCart";
import Image from "next/image";

const CartItemStyles = styled.li`
  padding: 1rem 0;
  border-bottom: 1px solid var(--lightGrey);
  display: grid;
  grid-template-columns: auto 1fr auto;
  img {
    margin-right: 1rem;
  }
  h3, p {
    margin: 0;
  }
`;

export default function CartItem({ cartItem: { product, quantity, id } }) {

  if(!product)
    return null;

  return <CartItemStyles>

    <Image width={100} height={100} layout="fixed" src={product.photo.image.publicUrlTransformed} alt="imhop" />
    <div>
      <h3> { product.name } </h3>
      <p>
        { formatMoney(product.price * quantity) }
        -
        <em> {quantity} &times; {formatMoney(product.price)} </em>
        each
      </p>
    </div>
    <RemoveFromCart id={id}/>
  </CartItemStyles>
}