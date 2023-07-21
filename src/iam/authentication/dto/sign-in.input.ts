import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import * as GraphQLTypes from '../../../graphql/graphql-types';

export class SignInInput extends GraphQLTypes.SignInInput {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(12)
  password: string;
}
