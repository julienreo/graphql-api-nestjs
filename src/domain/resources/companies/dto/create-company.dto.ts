import { IsString, IsNotEmpty, MaxLength, MinLength } from 'class-validator';
import * as GraphQLTypes from '../../../../graphql/graphql-types';

export class CreateCompanyInput extends GraphQLTypes.CreateCompanyInput {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(5)
  postcode: string;

  @IsString()
  @IsNotEmpty()
  city: string;

  @IsString()
  @IsNotEmpty()
  country: string;
}
