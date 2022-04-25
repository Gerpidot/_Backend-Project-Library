import React, { useState } from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import {
  Button,
  DivForgot,
  FormReg,
  Input,
  InputContainer,
  LeftLabel,
  Paragraph,
  RightLabel,
  Titleh2,
} from "../styles/styled.home.module";
import SessionData from "../models/sessionData";
import { useContext } from "react";
import { SessionContext } from "../context/sessionProvider";
import { Login } from "../utils/mutations";
import { url } from "inspector";
import { NextResponse } from "next/server";
import MainContainer from "../container/mainContainer";
import { useRouter } from "next/router";
import Link from "next/link";
import ForgotForm from "./forgotForm";

const registerSchema = Yup.object().shape({
  email: Yup.string()
    .required("Este dato es obligatorio")
    .email("El email no es correcto"),
  password: Yup.string()
    .required("Este dato es obligatorio")
    .min(8, "Debe tener al menos 8 caracteres")
    .matches(
      /(^(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*? ]).*$)/,
      "Al menos 1 mayúscula, minúscula y caracter"
    ),
});

const LoginForm = ({ setCurrent }) => {
  const [visible, setVisible] = useState(false);
  const { sessionData, setSessionData } = useContext(SessionContext);
  const [setIsLoggedIn] = useState(false);
  const Router = useRouter();
  return (
    <div>
      <Formik
        initialValues={{
          email: "",
          password: "",
        }}
        validationSchema={registerSchema}
        validateOnChange
        validateOnBlur
        //validateOnSubmit
        onSubmit={async () => {
          const loginResponse = await Login(sessionData);
          const jwt = loginResponse;
          sessionData.jwt = jwt;
          setSessionData(sessionData);

          if (sessionData.jwt.length < 10) {
            //lol
            return;
          } else {
            sessionData.isLoggedIn = true;
            setSessionData(sessionData);
            console.log(sessionData);
            Router.push("/library");
            return;
          }
        }}
      >
        {({
          handleBlur,
          handleChange,
          handleSubmit,
          values,
          errors,
          touched,
        }) => {
          return (
            <>
              <FormReg action="POST" onSubmit={handleSubmit}>
                <Titleh2>Iniciar Sesión</Titleh2>

                <InputContainer>
                  <Input
                    name="email"
                    placeholder="Ingrese su email"
                    onChange={handleChange("email")}
                    value={values.email}
                    onBlur={handleBlur("email")}
                  />
                  {touched.email && errors.email && (
                    <Paragraph>{errors.email}</Paragraph>
                  )}
                </InputContainer>
                <InputContainer>
                  <Input
                    name="password"
                    placeholder="Ingrese su contraseña"
                    onChange={handleChange("password")}
                    value={values.password}
                    type={visible ? "text" : "password"}
                    onBlur={handleBlur("password")}
                  />
                  {touched.password && errors.password && (
                    <Paragraph>{errors.password}</Paragraph>
                  )}
                </InputContainer>

                <div>
                  <Button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => setVisible(!visible)}
                  >
                    {visible ? "Ocultar contraseña" : "Mostrar contraseña"}
                  </Button>
                </div>
                <DivForgot>
                  <Button
                    type="submit"
                    onClick={() =>
                      setSessionData({
                        email: values.email,
                        password: values.password,
                        jwt: "",
                        isLoggedIn: false,
                      })
                    }
                  >
                    Ingresar
                  </Button>
                </DivForgot>
                <div
                  style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "space-around",
                  }}
                >
                  <LeftLabel
                    onClick={() => {
                      setCurrent(0);
                    }}
                  >
                    Volver
                  </LeftLabel>

                  <RightLabel
                    onClick={() => {
                      setCurrent(2);
                    }}
                  >
                    Olvidó su contraseña?
                  </RightLabel>
                </div>
              </FormReg>
            </>
          );
        }}
      </Formik>
    </div>
  );
};

export default LoginForm;
