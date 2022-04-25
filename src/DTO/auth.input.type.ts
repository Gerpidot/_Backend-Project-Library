import { Field, InputType, ObjectType } from "type-graphql";
import { IsEmail, Length } from "class-validator";

@InputType()
export class UserInput {
  @Field()
  @Length(3, 64)
  fullName!: string;

  @Field()
  @IsEmail()
  email!: string;

  @Field()
  @Length(3, 254)
  password!: string;
}

@ObjectType()
export class LoginResponse {
  @Field()
  userID!: number;

  @Field()
  jwt!: string;

  @Field()
  password!: string;
}

@InputType()
export class LoginInput {
  @Field()
  @IsEmail()
  email!: string;

  @Field()
  password!: string;
}

@InputType()
export class ActivateInput {
  @Field()
  @IsEmail()
  email!: string;

  @Field()
  confirmationCode!: string;
}

@InputType()
export class RecoverPassInput {
  @Field()
  @IsEmail()
  email!: string;
}
