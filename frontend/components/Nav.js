import Link from 'next/link';
import { useCart } from '../lib/CartState';
import CartCount from './CartCount';
import SignOut from './SignOut';
import NavStyles from "./styles/NavStyles";
import { useUser } from './User';

export default function Nav() {

  const user = useUser();
  console.log("nav.js");
  console.log(user);

  const { openCart } = useCart();

  const isMember = user?.typeof === 'MEMBER';
  const isUnrestricted = user?.typeof === "UNRESTRICTED";
  const isConvener = user?.typeof === "CONVENER";

  return <NavStyles>

    <Link href="/products">Products</Link>
    <Link href="/clubs">Clubs</Link>

    {
      user && (
        <>

          { isConvener && <Link href="/sell">Sell Item</Link> }

          { isUnrestricted && <Link href="/sell">Add Item</Link> }


          { isUnrestricted && <Link href="/dashboard"> Member Dashboard </Link> }


          { isConvener && <Link href="/dispatch-items">Dispatch Customer Orders</Link> }


          { (isMember || isConvener) && <Link href="/orders">My Orders</Link> }

          { isUnrestricted && <Link href="/orders">Everybody's Orders</Link>}

          <SignOut />

          <button type="button" onClick={openCart}>
            My Cart
            <CartCount count={user.cart.reduce(((t, i) =>  t + i.quantity), 0)}/>
          </button>

        </>
      )
    }

    {
      !user && (
        <>
          <Link href="/signin">Sign In</Link>
        </>
      )
    }

  </NavStyles>
}