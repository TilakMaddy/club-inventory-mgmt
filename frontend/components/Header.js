import Link from 'next/link';
import styled from 'styled-components';
import Nav from './Nav';
import Cart from "./Cart";
import Search from './Search';

export const BH = styled.h1`
  padding: 1rem 1.5rem;
  background: #ffffff;
  font-size: 1.5rem;
  box-shadow: inset -9px -9px 18px #dbdbdb,
              inset 9px 9px 18px #ffffff;
`;

const Logo = styled.h1`

  font-size: 2.8rem;
  font-family: 'Dancing Script', cursive;
  margin-left: 2rem;
  position: relative;
  z-index: 2;
  cursor: pointer;

  @media (max-width: 500px) {
    padding-right: 10px;
  }

  a {

    @media (max-width: 500px) {
      font-size: 1.2rem;
    }

    text-decoration: none;
    text-transform: uppercase;
    padding: 1rem 1.5rem;

    background: #ffffff;
    box-shadow: inset -9px -9px 18px #dbdbdb,
            inset 9px 9px 18px #ffffff;
  }
`;

const HeaderStyles = styled.header`
  .bar {
    border-bottom: 10px solid var(--black, black);
    display: grid;
    grid-template-columns: auto 1fr;
    justify-content: space-between;
    align-items: stretch;

    .ss-only {
      display: none;
    }

    @media (max-width:500px) {
      .ss-only {
        display: block !important;
      }
      .bs-only {
        display: none;
      }
    }

  }
  .sub-bar {
    display: grid;
    grid-template-columns: 1fr auto;
    border-bottom: 1px solid var(--black, black);
  }

`;

export default function Header() {
  return (
    <HeaderStyles>
      <div className="bar">
        <Logo>
          <Link href="/">
            <div className="bs-only">
              Club Inventory Mgt.
            </div>
          </Link>
          <Link href="/">
            <div className="ss-only">
              C.I.M
            </div>
          </Link>
        </Logo>
        <Nav />
      </div>
      <div className="sub-bar">
        <Search />
      </div>
      <Cart />
    </HeaderStyles>
  );
}