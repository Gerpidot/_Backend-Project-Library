import { Field, InputType } from "type-graphql";
import { Length } from "class-validator";
import { Author } from "../entity/author.entity";

@InputType()
export class BookInput {
  @Field()
  @Length(3, 64)
  title!: string;

  @Field()
  author!: number;
}

@InputType()
export class BookIdInput {
  @Field(() => Number)
  id!: number;
}

@InputType()
export class BookUpdateInput {
  @Field(() => String, { nullable: true })
  @Length(3, 64)
  title?: string;

  @Field(() => Number, { nullable: true })
  author?: number;
}

@InputType()
export class BookUpdateParsedInput {
  @Field(() => String, { nullable: true })
  @Length(3, 64)
  title?: string;

  @Field(() => Author, { nullable: true })
  author?: Author;
}

@InputType()
export class TookAndPutBookInput {
  @Field(() => Boolean)
  isBorrowed?: boolean;

  @Field(() => String)
  borrowedTo?: string;
}

@InputType()
export class TitlieInput {
  @Field(() => String)
  @Length(3, 64)
  title!: string;
}
