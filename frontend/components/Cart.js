import CartStyles from "./styles/CartStyles";
import CloseButton from "./styles/CloseButton";
import { useUser } from "./User";
import Supreme from "./styles/Supreme";
import CartItem from "./CartItem";
import formatMoney from "../lib/FormatMoney";
import { useCart } from "../lib/CartState";
import { Checkout } from "./Checkout";
import { BH } from "./Header";

function calcTotalPrice(cart) {

  return cart.reduce((tally, cartItem) => {
    if (!cartItem.product) return tally; // products can be deleted, but they could still be in your cart
    return tally + cartItem.quantity * cartItem.product.price;
  }, 0);
}

function toTitleCase(str) {
  return str.replace(
    /\w\S*/g,
    function(txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    }
  );
}

export function decodeLanguage(str) {
  switch(str) {
    case "UNRESTRICTED":
      return "Club Authority";
    default:
      return toTitleCase(str);
  }
}

export default function Cart() {

  const me = useUser();
  const { cartOpen, closeCart } = useCart();

  if(!me)
  return null;

  return <CartStyles open={cartOpen}>
    <header>
      <BH> { me.name }'s Cart </BH>
      <BH>
        { decodeLanguage(me['typeof']) } {me["typeof"] != "UNRESTRICTED" &&` at ${me.club.name} club`}
      </BH>
    <CloseButton onClick={closeCart}>&times;</CloseButton>
    </header>
    <ul>
      {
        me.cart.map(cartItem => <CartItem key={cartItem.id} cartItem={cartItem} />)
      }
    </ul>
    <footer>
      <p> { formatMoney(calcTotalPrice(me.cart))} </p>
      <Checkout />
    </footer>
  </CartStyles>
}