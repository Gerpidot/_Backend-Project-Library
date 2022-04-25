import { Field, InputType } from "type-graphql";
import { Length } from "class-validator";

@InputType()
export class AuthorInput {
  @Field()
  @Length(3, 64)
  fullName!: string;
}
@InputType()
export class AuthorIdInput {
  @Field(() => Number)
  id!: number;
}

@InputType()
export class AuthorUpdateInput {
  @Field(() => Number)
  id!: number;

  @Field(() => String)
  @Length(3, 64)
  fullName?: string;
}
