import styled from 'styled-components';

const OrderStyles = styled.div`
  min-height: 200px;
  font-size: 1.2rem;
  max-width: 1000px;
  margin: 0 auto;
  border: 1px solid var(--offWhite);
  box-shadow: var(--bs);
  padding: 2rem;
  border-top: 10px solid ${props => (props.nored ? 'transparent' : 'red')};
  & > p {
    display: grid;
    grid-template-columns: 1fr 5fr;
    margin: 0;
    border-bottom: 1px solid var(--offWhite);
    span {
      padding: 1rem;
      &:first-child {
        font-weight: 900;
        text-align: right;
      }
    }
  }
  .order-item {
    position: relative;
    border-bottom: 1px solid var(--offWhite);
    display: grid;
    grid-template-columns: 35rem 1fr;
    @media (max-width: 630px) {
      grid-template-columns: 1fr;
    }
    height: 100%;
    align-items: center;
    grid-gap: 2rem;
    margin: 2rem 0;
    padding-bottom: 2rem;

    img {
      width: 100%;
      height: 100%;
      @media (max-width: 500px) {
        max-height: 20rem;
      }
      object-fit: cover;
    }
  }

    /* p {
      display:inline-block;
      background: #f7f7f7;
    box-shadow:  24px 24px 48px #e8e8e8,
             -24px -24px 48px #ffffff;
    } */

    .item-details {

      height: 100%;
      display: grid;
      grid-auto-flow: row;
      align-items: space-between;

      .item-meta-details {
        height: 100%;
        background: #f7f7f7;
        box-shadow:  24px 24px 48px #e8e8e8,
              -24px -24px 48px #ffffff;
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        align-items: space-around;
        align-content: space-around;
        justify-items: center;
        justify-content: center;
        border-radius: 2rem;
        padding: 2rem;
        padding-bottom: 1rem;

        .sub-heading{
          font-weight: 200 !important;
          color: rgba(0,0,0, 0.4);
        }

        p:not(.sub-heading) {
          font-size: 2rem;
        }


      }

      .item-meta-details-small {

        height: 100%;
        background: #f7f7f7;
        box-shadow:  24px 24px 48px #e8e8e8,
              -24px -24px 48px #ffffff;
        display: grid;
        grid-template-columns: 4fr 5fr 2fr;
        align-items: space-around;
        align-content: space-around;
        justify-items: stretch;
        justify-content: center;
        border-radius: 2rem;
        padding: 2rem;
        padding-bottom: 1rem;
        gap: 2.5rem;

        .sub-heading{
          text-align: center;
          font-weight: 80 !important;
          color: rgba(0,0,0, 0.4);
        }

        p:not(.sub-heading) {
          font-size: 1.6rem;
        }


      }

      .desc-stuff {
        color: rgba(0,0,0, 0.6);
      }


      h2 {
        @media (max-width: 500px) {
          position: absolute;
          top: 0;

        }
        span {
          font-size: 2.5rem;
          text-align: center;
          color: white;
          padding: 0 1.1rem;
          border-radius: 10000px;
          background: #878c82;
          box-shadow: 20px 20px 60px #73776f, -20px -20px 60px #9ba196;
        }
      }
    }


    @media (max-width: 500px) {
      .bsonly {
        display: none !important;
      }

    }

`;
export default OrderStyles;
