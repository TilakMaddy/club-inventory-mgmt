import styled from 'styled-components';

const PaginationStyles = styled.div`
  text-align: center;
  display: inline-grid;
  grid-template-columns: repeat(4, auto);
  align-items: stretch;
  justify-content: center;
  align-content: center;
  margin: .5rem 0;
  margin-bottom: 1.2rem;
  margin-top: 1.2rem;
  border: 1px solid var(--lightGray);
  border-radius: 10px;
  font-size: 1.2rem;
  gap: 15px;
  color: white;

  .ssonly {
    display: none;
  }

  @media (max-width: 500px) {
    .ssonly {
      display: inline-block !important;
    }
    .bsonly {
      display: none !important;
    }
  }

  & > * {
    color: rgba(0,0,0, 0.8);
    border-radius: 10000px;

    background: #f7f7f7;
    box-shadow:  24px 24px 48px #e8e8e8,
             -24px -24px 48px #ffffff;

    margin: 10px;
    padding: 10px 20px;
    /* margin-right: 15px;
    margin-bottom: 15px; */

    //background: var(--red);
    &:last-child {
      border-right: 0;
    }

    @media (max-width: 500px) {
      margin: 1px;
      font-size: 1rem;
    }

  }
  a[aria-disabled='true'] {
    color: grey;
    pointer-events: none;
  }
`;

export default PaginationStyles;
