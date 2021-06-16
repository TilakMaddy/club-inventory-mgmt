import styled from "styled-components";
import SignIn from "../components/SignIn";
import SignUp from "../components/SignUp";
import RequestReset from "../components/RequestReset";
import { useUser } from "../components/User";
import Link from "next/link";
import Title from "../components/styles/Title";
import ItemStyles from "../components/styles/ItemStyles";


const GridStyles = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
`;

export default function SignInPage() {

  const me = useUser();

  return <GridStyles>
    { me && <h1>You are now signed in ! Please Continue shopping
        <Link href={`/products`}>
          <a>
           <Title> <a> Home page </a> </Title>
          </a>
        </Link>
      </h1>}
    { !me && <SignIn /> }
    { !me && <SignUp /> }
    <RequestReset />
  </GridStyles>
}
