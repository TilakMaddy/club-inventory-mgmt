import styled from "styled-components"

export const CenterIt = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 5rem;
`;

export default function Page404() {
  return <CenterIt>
    <img src={`https://pics.me.me/404-error-page-not-found-wow-your-boyfriend-got-banned-63578150.png`} />
   </CenterIt>
}