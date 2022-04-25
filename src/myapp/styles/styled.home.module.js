//Hello
import styled from "styled-components";

export const Title = styled.h1`
  font-size: 2em;
  text-align: center;
  color: crimson;
  margin: none;
`;
export const Button = styled.button`
  background: rgba(12, 165, 94, 0.87);
  border: none;
  border-radius: 10px;
  text-transform: uppercase;
  cursor: pointer;
  padding: 15px;
  margin: 5px;
  width: 100%;
`;

export const FormReg = styled.form`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  width: 400px;
  margin: auto;
  border: 5px solid gray;
  border-radius: 10px;
  background-color: rgba(244, 248, 29, 0.336);
`;

export const Input = styled.input`
  width: 350px;
  height: 40px;
  padding: 4px;
  color: rgba(29, 25, 25, 0.74);
  background: transparent;
  border: none;
  font-size: 18px;
  border-bottom: 1px solid green;

  outline: none; /*quita el marco que aparece cuando se hace foco en el input*/
  /*sirve para que a la hora de seleccionar una opcion guardada no muestre color de fondo y el color de la letra sea parecida a la anterior  */
  transition: background-color 10000s ease-in-out 0s;
  box-shadow: 0 0 0px 1000px unset;
  -webkit-text-fill-color: rgba(31, 27, 27, 0.705);
`;

export const InputContainer = styled.div`
  height: 80px;
`;

export const Paragraph = styled.p`
  color: red;
  font-size: 12px;
  font-weight: bold;
`;
export const Titleh2 = styled.h2`
  margin: 10px;
  padding: 0px;
  font-size: 30px;
  text-align: center;
  color: rgb(0, 0, 85);
`;

export const Description = styled.h3`
  text-align: center;
  color: yellow;
  margin: none;
`;
export const DivForgot = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
`;

export const LeftLabel = styled.label`
  text-align: left;
  text-decoration: underline;
  color: blue;
  cursor: pointer;
`;

export const RightLabel = styled.label`
  text-align: right;
  text-decoration: underline;
  color: blue;
  cursor: pointer;
`;
