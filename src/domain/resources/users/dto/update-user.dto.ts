import { IsEmail, IsMongoId, IsOptional, IsString } from 'class-validator';
import * as GraphQLTypes from '../../../../graphql/graphql-types';

export class UpdateUserInput extends GraphQLTypes.UpdateCompanyInput {
  @IsString()
  @IsOptional()
  firstname?: string;

  @IsString()
  @IsOptional()
  lastname?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  password?: string;

  @IsMongoId()
  @IsOptional()
  companyId?: string;
}
