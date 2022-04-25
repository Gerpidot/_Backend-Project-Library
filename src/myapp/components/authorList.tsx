export const AuthorList = ({authors}) => {
  

  return authors.map((author, index) => {
    return (
      <div key={index}>
        <ul>
          <li>Atutor : {author.fullName} </li>
          <li>ID : {author.id}</li>
          <ul>
            Libros:
            {author.books.map((book) => {
              return (
                <div key={book.id}>
                  <li>Título : {book.title}</li>
                  <li>ID : {book.id} </li>
                  <li>Prestado hace x dias</li>
                </div>
              );
            })}
          </ul>
        </ul>
      </div>
    );
  });
};
