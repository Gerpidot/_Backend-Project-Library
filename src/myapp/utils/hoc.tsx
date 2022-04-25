import { NextComponentType } from "next";
import { useContext, useState } from "react";
import ForgotForm from "../components/forgotForm";
import LoginForm from "../components/loginForm";
import RegisterComponent from "../components/registerForm";
import { SessionContext } from "../context/sessionProvider";

function withAuth<T>(Component: NextComponentType<T>, setCurrent: any) {
  const Auth = (props: T) => {
    // Login data added to props
    const { sessionData }: any = useContext(SessionContext);
    const [currentIdx, setCurrentIdx] = useState(1);
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
    const tagArray = [
      <RegisterComponent setCurrent={setCurrent} />,
      <LoginForm setCurrent={setCurrent} />,
      <ForgotForm setCurrent={setCurrent} />,
    ];
    // If user is not logged in, return login component
    if (!sessionData.isLoggedIn) {
      return (
        <div>
          Inicia sesión para continuar
          <div>{tagArray[currentIdx]}</div>
        </div>
      );
    }

    // If user is logged in, return original component
    return <Component {...props} />;
  };

  // Copy getInitial props so it will run as well
  if (Component.getInitialProps) {
    Auth.getInitialProps = Component.getInitialProps;
  }

  return Auth;
}

export default withAuth;
