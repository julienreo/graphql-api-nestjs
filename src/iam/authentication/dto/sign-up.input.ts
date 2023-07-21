import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import * as GraphQLTypes from '../../../graphql/graphql-types';

export class SignUpInput extends GraphQLTypes.SignUpInput {
  @IsString()
  @IsNotEmpty()
  readonly firstname: string;

  @IsString()
  @IsNotEmpty()
  readonly lastname: string;

  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @MinLength(12)
  @IsString()
  @IsNotEmpty()
  readonly password: string;
}
