import RegisterComponent from "../components/registerForm";
import Link from "next/link";
import { Title, Description } from "../styles/styled.home.module";
import { SetStateAction, useState } from "react";
import LoginForm from "../components/loginForm";
import { number } from "yup";
import ForgotForm from "../components/forgotForm";

const Home = () => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [showCurrent, setShowCurrent] = useState(false);
  
  const toggleCurrent = () => {
    if (!showCurrent) {
      setShowCurrent(true);
      return;
    }
  };
  
   const setCurrent = (index: number) => {
    setCurrentIdx(index);
    toggleCurrent();
    
  };
  const tagArray = [<RegisterComponent setCurrent={setCurrent} />, <LoginForm setCurrent={setCurrent} />,<ForgotForm setCurrent={setCurrent}/>];
  return (
    <div>
      <Title>Bienvenido a la biblioteca en linea</Title>
      <Description>
        Para utilizar el servicio deberá ser un usuario registrado, si aun no lo
        está por favor complete el formulario de registro.
      </Description>
      <div>
        <button onClick={() => setCurrent(1)}>Iniciar Sesión</button>
      </div>
      <div>{tagArray[currentIdx]}</div>
    </div>
  );
};

export default Home;
