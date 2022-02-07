import { getRepository, Repository } from "typeorm";
import {
  Arg,
  Field,
  InputType,
  Mutation,
  Query,
  Resolver,
  UseMiddleware,
} from "type-graphql";
import { Book } from "../entity/book.entity";
import { Author } from "../entity/author.entity";
import { Length } from "class-validator";
import { isAuth } from "../middlewares/auth.middleware";

@InputType()
class BookInput {
  @Field()
  @Length(3, 64)
  title!: string;

  @Field()
  author!: number;
}

@InputType()
class BookIdInput {
  @Field(() => Number)
  id!: number;
}

@InputType()
class BookUpdateInput {
  @Field(() => String, { nullable: true })
  @Length(3, 64)
  title?: string;

  @Field(() => Number, { nullable: true })
  author?: number;
}

@InputType()
class BookUpdateParsedInput {
  @Field(() => String, { nullable: true })
  @Length(3, 64)
  title?: string;

  @Field(() => Author, { nullable: true })
  author?: Author;
}

@Resolver()
export class bookResolver {
  bookRepository: Repository<Book>;
  authorRepository: Repository<Author>;

  constructor() {
    this.bookRepository = getRepository(Book);
    this.authorRepository = getRepository(Author);
  }

  @Mutation(() => Book)
  async createBook(@Arg("input", () => BookInput) input: BookInput) {
    try {
      const author: Author | undefined = await this.authorRepository.findOne(
        input.author
      );
      if (!author) {
        const error = new Error();
        error.message = "No existe el autor";
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
      throw new Error("Error en createBook()");
    }
  }

  @Query(() => [Book])
  @UseMiddleware(isAuth)
  async getAllBooks(): Promise<Book[]> {
    //aqui irian los filtros
    try {
      return await this.bookRepository.find({
        relations: ["author", "author.books"],
      });
    } catch (error) {
      throw new Error("Error al mostrar los libros");
    }
  }

  @Query(() => Book)
  async getBookByID(
    @Arg("input", () => BookIdInput) input: BookIdInput
  ): Promise<Book | undefined> {
    try {
      const book = await this.bookRepository.findOne(input.id, {
        relations: ["author", "author.books"],
      });
      if (!book) {
        const error = new Error();
        error.message = "El libro no se encuentra en la base de datos";
        throw error;
      }
      return book;
    } catch (e) {
      throw new Error("There is not a book with that iD");
    }
  }

  @Mutation(() => Boolean)
  async updateBookByID(
    @Arg("input", () => BookIdInput) input: BookIdInput,
    @Arg("input2", () => BookUpdateInput) input2: BookUpdateInput
  ): Promise<Boolean> {
    try {
      await this.bookRepository.update(
        input.id,
        await this.parseAuthorID(input2)
      );
      return true;
    } catch (e) {
      throw new Error("Alaaaaaaarm");
    }
  }

  @Mutation(() => Boolean)
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
      throw e//new Error("Error on delete method");
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
          error.message = "El autor no existe";
          throw error;
        }
        _input["author"] = await this.authorRepository.findOne(input.author);
      }

      return _input;
    } catch (error) {
      throw new Error();
    }
  }
}
