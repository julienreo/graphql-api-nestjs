import {
  MinLength,
  IsEmail,
  IsOptional,
  IsString,
  IsNotEmpty,
  IsMongoId,
} from 'class-validator';
import * as GraphQLTypes from '../../../../graphql/graphql-types';

export class CreateUserInput extends GraphQLTypes.CreateUserInput {
  @IsString()
  @IsNotEmpty()
  firstname: string;

  @IsString()
  @IsNotEmpty()
  lastname: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(12)
  password: string;

  @IsMongoId()
  @IsOptional()
  companyId?: string;
}
