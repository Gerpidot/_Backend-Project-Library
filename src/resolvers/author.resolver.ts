import { Arg, Mutation, Query, Resolver, UseMiddleware } from "type-graphql";
import { Author } from "../entity/author.entity";
import { getRepository, Repository } from "typeorm";
import {
  AuthorIdInput,
  AuthorInput,
  AuthorUpdateInput,
} from "../DTO/author.input.type";
import { isAuth } from "../middlewares/auth.middleware";

@Resolver()
export class authorResolver {
  authorRepository: Repository<Author>;

  constructor() {
    this.authorRepository = getRepository(Author);
  }

  @Mutation(() => Author)
  @UseMiddleware(isAuth)
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
    } catch (error) {}
  }

  @Query(() => [Author])
  @UseMiddleware(isAuth)
  async getAllAuthor(): Promise<Author[]> {
    try {
      return await this.authorRepository.find({ relations: ["books"] });
    } catch (e) {
      throw e;
    }
  }

  @Query(() => Author)
  @UseMiddleware(isAuth)
  async getOneAuthor(
    @Arg("input", () => AuthorIdInput) input: AuthorIdInput
  ): Promise<Author | undefined> {
    try {
      const author = await this.authorRepository.findOne(input.id, {
        relations: ["books"],
      });

      if (!author) {
        const error = new Error();
        error.message = "Author does not exist";
        throw error;
      }
      return author;
    } catch (e) {
      throw e;
    }
  }

  @Mutation(() => Author)
  @UseMiddleware(isAuth)
  async updateAuthorByID(
    @Arg("input", () => AuthorUpdateInput) input: AuthorUpdateInput
  ): Promise<Author | undefined> {
    try {
      const authorExist = await this.authorRepository.findOne(input.id);

      if (!authorExist) {
        throw new Error("Author does not exist");
      }

      return await this.authorRepository.save({
        id: input.id,
        fullName: input.fullName,
      });
    } catch (e) {
      throw e;
    }
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
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
