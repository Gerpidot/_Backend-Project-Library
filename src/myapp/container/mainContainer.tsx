import { useContext, useState } from "react";
import BookCard from "../components/bookCard";
import { SessionContext } from "../context/sessionProvider";
import SessionData from "../models/sessionData";
import { Button, Input } from "../styles/styled.home.module";
import {
  AuthorListContainer,
  AuthorListStyled,
} from "../styles/styled.authorlist";

import {
  getAllAuthor,
  getAllBooks,
  getAuthorById,
  getBookByID,
} from "../utils/quries";
import { BookCardDiv, DivContainer } from "../styles/styled.bookCard.js";
import { AuthorList } from "../components/authorList";
import withAuth from "../utils/hoc";

const MainContainer = () => {
  const mockData = [
    {
      id: 102,
      title: "El Señor de los Anillos",
      author: { id: 100, fullName: "J. R. R. Tolkien" },
      isBorrowed: true,
    },
    {
      id: 99,
      title: "El Temor de un Hombre Sabio",
      author: { id: 7, fullName: "Patrick Rothfuss" },
      isBorrowed: true,
    },
  ];
  const mockAuthor = [
    {
      id: 8,
      fullName: "Jorge Luis Borges",
      books: [
        {
          title: "El otro, el mismo",
          id: 12,
          isBorrowed: false,
          borrowedAt: "1648651244513",
        },
      ],
    },
  ];
  const { sessionData, setSessionData } = useContext(SessionContext);

  const [selected, setSelected] = useState(0);
  const [books, setBooks] = useState(mockData);
  const [authors, setAuthors] = useState(mockAuthor);
  const [isHidden, setIsHidden] = useState(false);
  const queries = {
    "0": getAllBooks,
    "1": getBookByID,
    "2": getAllAuthor,
    "3": getAuthorById,
  };
  let idInput: number;

  const argumentTransform = () => {
    const querySelected = queries[selected + ""];

    if (hidden() == true) {
      console.log("idinput falsy");
      return querySelected(sessionData);
    } else if (hidden() == false && idInput) {
      console.log("idinput true");

      return querySelected(idInput, sessionData);
    } else {
      return;
    }
  };

  const selectedQuery = async () => {
    const selectedQuery = await argumentTransform();
    const serverResponse = await selectedQuery;
    if (!serverResponse) {
      console.log("input id de selected query undefined");
      return;
    }
    if (serverResponse.errors) {
      console.log(serverResponse.errors);
      return;
    } else if (selected == 0 || selected == 1) {
      setIsHidden(false);
      setBooks(await serverResponse);
      return;
    } else {
      setIsHidden(true);
      setAuthors(await serverResponse);
      return;
    }
  };
  const available = (books) => {
    const valor = books.isBorrowed ? "Prestado" : "Disponible";

    return valor;
  };
  const hidden = () => {
    if (selected == 0 || selected == 2) {
      return true;
    } else {
      return false;
    }
  };

  return (
    <div>
      <h1>Soy la main</h1>

      <label> Tipo de busqueda </label>
      <form>
        <select
          onChange={(event: any) => {
            setSelected(event.target.value);
          }}
        >
          <option value={0}>Buscar todos los libros</option>
          <option value={1}>Buscar libro por su Id</option>
          <option value={2}>Buscar todos los autores</option>
          <option value={3}>Buscar autor por Id</option>
        </select>
        <div>
          <input
            id="inputId"
            type="number"
            min={1}
            hidden={hidden()}
            onChange={(event) => {
              idInput = event.target.value;
              console.log(idInput);
            }}
            placeholder="iD del Libro"
            required
          />
        </div>
        <div>
          <button
            type="button"
            onClick={() => {
              selectedQuery();
            }}
          >
            Buscar
          </button>
        </div>
      </form>

      <DivContainer>
        {books.map((book, index) => {
          return (
            <BookCardDiv key={index} hidden={isHidden}>
              <BookCard book={book} available={available} />
            </BookCardDiv>
          );
        })}
      </DivContainer>
      <AuthorListContainer>
        <AuthorListStyled hidden={!isHidden}>
          <h2>Autor Destacado</h2>
          <AuthorList authors={authors} />
        </AuthorListStyled>
      </AuthorListContainer>
    </div>
  );
};

export default withAuth(MainContainer);

/*export async function getStaticProps() {
 
  const moked={"email":"","isLoggedIn":false,"password":"","jwt":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTUsImlhdCI6MTY0ODA3NDI0OH0.jxiFUrpNexUJQ8-70xQiLXJ2vfYUQCAZEt5JX5N54DE"}
  const getallBooks = await getAllBooks(moked);
  console.log(getallBooks);
  return {
    props: {  book: getallBooks },
  };
}*/
