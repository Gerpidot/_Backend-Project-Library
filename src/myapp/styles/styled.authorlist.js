import styled from "styled-components";

export const AuthorListStyled = styled.div`
  ul {
     
    width: 100%;
    background: rgba(12, 165, 94, 0.87);
    padding: 20px;
  }
  ul li {
    background: lightgreen;
    color: black;
    margin: 5px;
  }
`;

export const AuthorListContainer = styled.div`
  display: flex;
  flex-direction: colunm;
  justify-content: center;
  align-items: center;
  align-content: center;
  width: 100%;
  flex-wrap: wrap;
 
`;
