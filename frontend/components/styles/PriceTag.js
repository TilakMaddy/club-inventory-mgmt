import styled from 'styled-components';

const PriceTag = styled.span`
  background: var(--red);
  transform: rotate(3deg);
  color: white;
  font-weight: 600;
  padding: 5px;
  line-height: 1;
  font-size: 3rem;
  display: inline-block;
  position: absolute;
  top: -3px;
  right: -3px;
  background: #8989ae;
  box-shadow:  -24px 24px 48px #6c6c89,
             24px -24px 48px #a6a6d3;
`;

export default PriceTag;
