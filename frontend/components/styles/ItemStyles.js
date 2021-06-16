import styled from 'styled-components';

const ItemStyles = styled.div`
  margin: 1.6rem;
  background: #e0e0e0;
  //border: 3px solid var(--offWhite);
  box-shadow: var(--bs);
  position: relative;
  display: flex;
  flex-direction: column;
  img {
    width: 100%;
    height: 30rem;
    object-fit: cover;
    border-radius: 50px;
background: #e0e0e0;
box-shadow:  20px 20px 60px #bebebe,
             -20px -20px 60px #ffffff;
  }
  p {
    line-height: 2;
    font-weight: 300;
    flex-grow: 1;
    padding: 0 3rem;
    font-size: 1.3rem;
  }
  .description-product {
    font-size: 3rem;
  }
  .buttonList {
    margin-top:1.2rem;
    display: grid;
    width: 100%;
    border-top: 1px solid var(--lightGray);
    grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
    grid-gap: 10px;
    /* background: var(--lightGray); */
    & > * {
      border-radius:100000px;
      border: 10px solid var(--lightGray);
      background: whitesmoke;
      font-size: 1.2rem;
      padding: 1rem;
      text-align: center;
    }

  }
`;

export default ItemStyles;
