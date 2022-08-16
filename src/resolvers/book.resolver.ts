import { getRepository, Repository } from "typeorm";
import { Arg, Mutation, Query, Resolver, UseMiddleware } from "type-graphql";
import { Book } from "../entity/book.entity";
import { Author } from "../entity/author.entity";
import { isAuth } from "../middlewares/auth.middleware";
import { sendMailAtGiveBackBook, sendMailAtLoanBook } from "../utils/sendGridConfig";
import {
  BookIdInput,
  BookInput,
  BookUpdateInput,
  BookUpdateParsedInput,
  TitlieInput,
  TookAndPutBookInput,
} from "../DTO/book.input.type";
import { returnDate } from "../utils/moment";

@Resolver()
export class bookResolver {
  bookRepository: Repository<Book>;
  authorRepository: Repository<Author>;

  constructor() {
    this.bookRepository = getRepository(Book);
    this.authorRepository = getRepository(Author);
  }

  @Mutation(() => Book)
  @UseMiddleware(isAuth)
  async createBook(@Arg("input", () => BookInput) input: BookInput) {
    try {
      const author: Author | undefined = await this.authorRepository.findOne(
        input.author
      );
      if (!author) {
        const error = new Error();
        error.message = "Author does not exist";
        throw error;
      }

      const book = await this.bookRepository.insert({
        //insert no devuelve los datos del libro, como para ver que creamos
        //por eso haremos lo siguiente
        title: input.title,
        author: author,
      });
      return await this.bookRepository.findOne(book.identifiers[0].id, {
        relations: ["author"],
      });
    } catch (e) {
      throw e;
    }
  }
  @Query(() => [Book])
  @UseMiddleware(isAuth)
  async getAllBooks(): Promise<Book[]> {
    try {
      const bookArray = await this.bookRepository.find({
        relations: ["author", "author.books"],
      });
      //Antes de devolver los libros, si alguno de estos está prestado, se le pasa la fecha en
      //que debería ser devuelto
      const parsedDataTime = bookArray.map((book) => {
        if (book.isBorrowed) {
          const returnData = returnDate(book.borrowedAt);
          const data = { ...book, returnData: returnData };
          return data;
        } else {
          return book;
        }
      });

      return parsedDataTime;
    } catch (error) {
      throw new Error("Error trying to display books");
    }
  }

  @Query(() => Book)
  @UseMiddleware(isAuth)
  async getBookByID(
    @Arg("input", () => BookIdInput) input: BookIdInput
  ): Promise<Book | undefined> {
    try {
      const book = await this.bookRepository.findOne(input.id, {
        relations: ["author", "author.books"],
      });
      if (!book) {
        const error = new Error();
        error.message = "Book does not exist";
        throw error;
      }

      const returnData = returnDate(book.borrowedAt);
      const data = { ...book, returnData: returnData };

      return data;
    } catch (e) {
      throw e;
    }
  }
  @Query(() => [Book])
  @UseMiddleware(isAuth)
  async searchByTitle(
    @Arg("input", () => TitlieInput) input: TitlieInput
  ): Promise<Book[]> {
    try {
      const allBooks = await this.getAllBooks();
      const result: Book[] = [];

      allBooks.filter((book) => {
        if (
          book.title
            .toLocaleUpperCase().match(`\\b${input.title.toLocaleUpperCase()}\\b`)
           
        ) {
          result.push(book);
        }
      });
      return result;
    } catch (error) {
      throw new Error("No se encontró ningún libro con ese título");
    }
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async updateBookByID(
    @Arg("input", () => BookIdInput) input: BookIdInput,
    @Arg("input2", () => BookUpdateInput) input2: BookUpdateInput
  ): Promise<Boolean> {
    try {
      const book = await this.bookRepository.findOne(input.id);
      if (!book) {
        const error = new Error();
        error.message = "There is not a book with that ID";
        throw error;
      }
      await this.bookRepository.update(
        input.id,
        await this.parseAuthorID(input2)
      );

      return true;
    } catch (e) {
      throw e;
    }
  }
  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async putTookBookById(
    @Arg("input", () => BookIdInput) input: BookIdInput,
    @Arg("input2", () => TookAndPutBookInput) input2: TookAndPutBookInput
  ): Promise<Boolean> {
    try {
      const book = await this.bookRepository.findOne(input.id);
      if (!book) {
        const error = new Error();
        error.message = "There is not a book with that ID";
        throw error;
      }
      
      await this.bookRepository.update(
        input.id,
        await this.loanOrReturnABook(input2, input)
      );

      return true;
    } catch (e) {
      throw e;
    }
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async deleteBookByID(
    @Arg("input", () => BookIdInput) input: BookIdInput
  ): Promise<Boolean> {
    try {
      const result = await this.bookRepository.delete(input.id); //devuelve un objeto con items, las filas afectadas y el contador de objetos afectados
      if (result.affected === 0 || !input.id) {
        throw new Error("Book does not exist");
      }
      return true;
    } catch (e) {
      throw e;
    }
  }

  private async parseAuthorID(input: BookUpdateInput) {
    try {
      const _input: BookUpdateParsedInput = {};

      if (input.title) {
        _input["title"] = input.title;
      }

      if (input.author) {
        const author = await this.authorRepository.findOne(input.author);
        if (!author) {
          const error = new Error();
          error.message = "There is not author with that id";
          throw error;
        }
        _input["author"] = await this.authorRepository.findOne(input.author);
      }

      return _input;
    } catch (e) {
      throw e;
    }
  }

  private loanOrReturnABook = async (
    input: TookAndPutBookInput,
    inputID: BookIdInput
  ) => {
    //si el usuario tiene límite y el libro no fue prestado se puede pedir el libro
    try {
      const _input: TookAndPutBookInput = {};
      const bookStatusCheck = await this.bookRepository.findOne(inputID.id , {
        relations: ["author", "author.books"],//lo relaciono para traer el nombre del autor
      }); //se busca el libro
      //si se pide un libro:
      if (input.isBorrowed) {
        //Se obtiene el número de libros que posee el usuario
        const countByUser = await this.borrowedCountByUser(input.borrowedTo);

        if (bookStatusCheck?.isBorrowed === true) {
          const error = new Error();
          error.message = "The book has already been borrowed.";
          throw error;
        }
        if (!countByUser) {
          const error = new Error();
          error.message = "Can not took more than 3 books";
          throw error;
        }

        _input["isBorrowed"] = input.isBorrowed; // isborrowed pasa a true, se prestó
        _input["borrowedTo"] = input.borrowedTo; // se registra el email del usuario
        await this.bookRepository.update(inputID.id, {
          borrowedAt: new Date().toString(),
        }); // se registra la fecha
        sendMailAtLoanBook(input.borrowedTo || "default",bookStatusCheck)
      }

      // se devuelve el libro si isBorrowed es falso
      if (input.isBorrowed === false) {
        if (bookStatusCheck?.isBorrowed === false) {
          const error = new Error();
          error.message = "The book was not borrowed";
          throw error;
        }
        if(input.borrowedTo!==bookStatusCheck?.borrowedTo){
          const error =new Error();
          error.message="The book was not loaned to you"
          throw error;
        }
        _input["isBorrowed"] = input.isBorrowed; //isBorrowed pasa a false, se devolvió
        _input["borrowedTo"] = "atLibrary"; // texto default, libro en biblio
        await this.bookRepository.update(inputID.id, {
          borrowedAt: new Date().toString(),
          //enviar un mail avisando que devolvió el libro
        });
        //fecha en la que se devolvió, si isBorrowed está en false
        sendMailAtGiveBackBook(input.borrowedTo || "default", bookStatusCheck) 
      }
      return _input;
    } catch (e) {
      throw e;
    }
  };
  private async borrowedCountByUser(borrowedTo: string | undefined) {
    try {
      //faltaría relacionar la tabla users para verificar que el usuario exista en
      // la base de datos
      const borrowedCount = await this.bookRepository.count({
        borrowedTo: borrowedTo,
      }); // devuelve el número de veces que se repite

      if (borrowedCount < 3) {
        return true;
      }

      return false;
    } catch (e) {
      throw e;
    }
  }
  
}
