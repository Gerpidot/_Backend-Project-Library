
import { RegisterData } from "../models/registerData";
import  SessionData  from "../models/sessionData";

export const Register = async (registerData: RegisterData) => {
  try {
    const response = await fetch("http://localhost:4000/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        query: `mutation{register(input:{fullName:"${registerData.fullName}",email:"${registerData.email}", password:"${registerData.password}"})
        {id}}` 
      }),
    });
    const jsonResponse = await response.json();
    console.log(jsonResponse);
    //a modo de prueba lo siguiente.... reever o borrar segun buenas practicas
    if (jsonResponse.data == null) {
      alert(jsonResponse.errors[0].message);
      return;
    } else {
      // alert("successful connection, press button go");
      alert("Usuario creado correctamente");
    }
  } catch (e) {
    throw new Error("register error");
  }
};
 export const Login = async (sessionData: SessionData ) => {
  try {
    
    
    const response = await fetch("http://localhost:4000/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        query: `mutation{login(input:{email: "${sessionData.email.toLowerCase()}"  , password: "${sessionData.password}"}){userID jwt}}`,
      }),
    });
    const jsonResponse = await response.json();
    //console.log(jsonResponse);
    //a modo de prueba lo siguiente.... reever o borrar segun buenas practicas
    if (jsonResponse.data == null) {
      alert(jsonResponse.errors[0].message);
      return;
    } else {
      alert("successful connection")
     const jwt=jsonResponse.data.login.jwt
      return jwt;
    }
  } catch (e) {
    throw new Error("error en el login");
  }
};

export const forgotPassword= async(sessionData:SessionData)=>{

  try {
    
    const response = await fetch("http://localhost:4000/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        query: `mutation{forgotPassword(input:{email:"${sessionData.email}"}){password}}`,
      }),
    });
    const jsonResponse = await response.json();
    //console.log(jsonResponse);
    //a modo de prueba lo siguiente.... reever o borrar segun buenas practicas
    if (jsonResponse.data == null) {
      alert(jsonResponse.errors[0].message);
      return false;
    } else {
      alert(`El email con su nueva contraseña 
      fue enviado correctamente`)
     
      return true;
    }
  } catch (e) {
    throw new Error("Error en el el forgot");
  }
}

export const CreateBook=()=>{

}

export const updateBookByID=()=>{

}

export const deleteBookByID=()=>{

}

export const createAuthor=()=>{

}

export const updateAuthorByID=()=>{

}

export const deleteAuthorByID=()=>{
  
}
