import {
  Arg,
  Args,
  Field,
  InputType,
  Mutation,
  Query,
  Resolver,
} from "type-graphql";
import { Author } from "../entity/author.entity";
import { getRepository, Repository } from "typeorm";
import { Length } from "class-validator";

@InputType()
class AuthorInput {
  @Field()
  @Length(3, 64)
  fullName!: string;
}
@InputType()
class AuthorIdInput {
  @Field(() => Number)
  id!: number;
}

@InputType()
class AuthorUpdateInput {
  @Field(() => Number)
  id!: number;

  @Field(() => String)
  @Length(3, 64)
  fullName?: string;
}

@Resolver()
export class authorResolver {
  authorRepository: Repository<Author>;

  constructor() {
    this.authorRepository = getRepository(Author);
  }

  @Mutation(() => Author)
  async createAuthor(
    @Arg("input", () => AuthorInput) input: AuthorInput
  ): Promise<Author | undefined> {
    try {
      const createAuthor = await this.authorRepository.insert({
        fullName: input.fullName,
      });
      const result = await this.authorRepository.findOne(
        createAuthor.identifiers[0].id
      );
      return result;
    } catch (error) {
      console.log("Error en author resolver", error);
    }
  }

  @Query(() => [Author])
  async getAllAuthor(): Promise<Author[]> {
    return await this.authorRepository.find({ relations: ["Books"] });
  }

  @Query(() => Author)
  async getOneAuthor(
    @Arg("input", () => AuthorIdInput) input: AuthorIdInput
  ): Promise<Author | undefined> {
    const author = await this.authorRepository.findOne(input.id);

    try {
      if (!author) {
        const error = new Error();
        error.message = "Author does not exist";
        throw error;
      }
      return author;
    } catch (e) {
      throw new Error("El autor no existe man");
    }
  }

  @Mutation(() => Author)
  async updateAuthorByID(
    @Arg("input", () => AuthorUpdateInput) input: AuthorUpdateInput
  ): Promise<Author | undefined> {
    const authorExist = await this.authorRepository.findOne(input.id);

    if (!authorExist) {
      throw new Error("Author does not exist");
    }

    return await this.authorRepository.save({
      //save actualiza si existe o crea si no existes, por eso el if antes para evitar la creacion de nuevos datos por error
      id: input.id,
      fullName: input.fullName,
    });
  }

  @Mutation(() => Boolean)
  async deleteAuthorByID(
    @Arg("input", () => AuthorIdInput) input: AuthorIdInput
  ): Promise<Boolean> {
    try {
      const result = await this.authorRepository.delete(input.id);
      if (result.affected === 0) throw new Error("Author does not exist");
      return true;
    } catch (e) {
      throw e;
    }
  }
}
