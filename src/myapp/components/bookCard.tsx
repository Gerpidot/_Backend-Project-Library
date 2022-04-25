import { BookCardProps } from "../models/bookCardProps";
import { Book } from "../models/books";

const BookCard = ({ book, available }) => {
  

  return (
    <div>
      <h1>{book.title}</h1>
      <h4>id: {book.id}</h4>
      <h3>{book.author.fullName}</h3>
      <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit.</p>
      <button>{available(book)}</button>
    </div>
  );
};

export default BookCard;
