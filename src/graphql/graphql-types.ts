/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export class CreateCompanyInput {
  name: string;
  address: string;
  postcode: string;
  city: string;
  country: string;
}

export class UpdateCompanyInput {
  name?: Nullable<string>;
  address?: Nullable<string>;
  postcode?: Nullable<string>;
  city?: Nullable<string>;
  country?: Nullable<string>;
}

export class CreateUserInput {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  companyId?: Nullable<string>;
}

export class UpdateUserInput {
  firstname?: Nullable<string>;
  lastname?: Nullable<string>;
  email?: Nullable<string>;
  password?: Nullable<string>;
  companyId?: Nullable<string>;
}

export class SignInInput {
  email: string;
  password: string;
}

export class SignUpInput {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
}

export class RefreshTokensInput {
  refreshToken: string;
}

export class Company {
  id: string;
  name: string;
  address: string;
  postcode: string;
  city: string;
  country: string;
  users?: Nullable<Nullable<User>[]>;
  roles?: Nullable<Nullable<Role>[]>;
}

export abstract class IQuery {
  company?: Company;
  companies?: Nullable<Company>[];
  user?: User;
  users?: Nullable<User>[];
}

export abstract class IMutation {
  createCompany?: Company;
  updateCompany?: Company;
  deleteCompany?: Company;
  createUser?: User;
  updateUser?: User;
  deleteUser?: User;
  signUp?: User;
  signIn?: AuthPayload;
  refreshTokens?: AuthPayload;
}

export class Permission {
  id: string;
  name: string;
  roles?: Nullable<Nullable<Role>[]>;
}

export class Role {
  id: string;
  name: string;
  permissions?: Nullable<Nullable<Permission>[]>;
  company?: Nullable<Company>;
}

export class User {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  company?: Nullable<Company>;
  role?: Nullable<Role>;
}

export class AuthPayload {
  accessToken: string;
  refreshToken: string;
}

type Nullable<T> = T | null;
