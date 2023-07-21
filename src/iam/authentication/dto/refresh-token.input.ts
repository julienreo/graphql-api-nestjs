import { IsNotEmpty, IsString } from 'class-validator';
import * as GraphQLTypes from '../../../graphql/graphql-types';

export class RefreshTokensInput extends GraphQLTypes.RefreshTokensInput {
  @IsString()
  @IsNotEmpty()
  refreshToken: string;
}
