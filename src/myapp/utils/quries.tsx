import SessionData from "../models/sessionData";

const url = "http://localhost:4000/graphql";

const fetchData = (sessionData: SessionData) => {
  return {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: "Bearer " + sessionData.jwt,
    },
    body: JSON.stringify({
      query: "{ getAllBooks{id title author{fullName} isBorrowed}}",
    }),
  };
};

export const getAllBooks = async (sessionData: SessionData) => {
  try {
    const response = await fetch(url, fetchData(sessionData));
    const jsonResponse = await response.json();
    if (jsonResponse.data == null) {
      console.log(jsonResponse.errors[0].message);
      return jsonResponse;
    } else {
      console.log(jsonResponse.data.getAllBooks);
      return jsonResponse.data.getAllBooks;
    }
  } catch (e) {
    throw new Error("Error en getAllBooks");
  }
};

export const getBookByID = async (id: number, sessionData: SessionData) => {
  try {
    if (!id) {
      alert("no id");
      return;
    }
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: "Bearer " + sessionData.jwt,
      },
      body: JSON.stringify({
        query: `{ getBookByID(input:{id:${id}})
        {title
          isBorrowed
          author{id 
            fullName 
            books{
              title 
              id 
              isBorrowed}
          }
        }
      }`,
      }),
    });
    const jsonResponse = await response.json();
    if (jsonResponse.data == null) {
      console.log(jsonResponse.errors[0].message);
      return jsonResponse;
    } else {
      console.log(jsonResponse.data.getBookByID);
      return [jsonResponse.data.getBookByID];
    }
  } catch (e) {
    throw new Error("No se encontró el libro");
  }
};

export const getAllAuthor = async (sessionData: SessionData) => {
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: "Bearer " + sessionData.jwt,
      },
      body: JSON.stringify({
        query:
          "{ getAllAuthor{id fullName books{title id isBorrowed borrowedAt}}}",
      }),
    });
    const jsonResponse = await response.json();
    if (jsonResponse.data == null) {
      console.log(jsonResponse.errors[0].message);
      return jsonResponse;
    } else {
      console.log(jsonResponse.data.getAllAuthor);
      return jsonResponse.data.getAllAuthor;
    }
  } catch (e) {
    throw new Error("Error en getAllAuthor");
  }
};

export const getAuthorById = async (id: number, sessionData: SessionData) => {
  try {
    if (!id) {
      alert("no id");
      return;
    }
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: "Bearer " + sessionData.jwt,
      },
      body: JSON.stringify({
        query: `{ getOneAuthor(input:{id:${id}}){fullName id books{title id isBorrowed borrowedAt}}}`,
      }),
    });
    const jsonResponse = await response.json();
    if (jsonResponse.data == null) {
      console.log(jsonResponse.errors[0].message);
      return jsonResponse;
    } else {
      console.log(jsonResponse.data.getOneAuthor);
      return [jsonResponse.data.getOneAuthor];
    }
  } catch (e) {
    throw new Error("No se encontró el autor");
  }
};
