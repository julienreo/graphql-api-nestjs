import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DB_ERROR_CODES } from 'src/constants/app.constants';
import { BadRequestError } from 'src/domain/errors/bad-request.error';
import { ConflictError } from 'src/domain/errors/conflict.error';
import * as GraphQLTypes from 'src/graphql/graphql-types';
import { HashingService } from 'src/iam/hashing/hashing.service';
import { NotFoundError } from '../../errors/not-found.error';
import { Company } from '../companies/company.model';
import { User } from './user.model';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(Company.name) private readonly companyModel: Model<Company>,
    private readonly hashingService: HashingService,
  ) {}

  /**
   * Get a user
   *
   * @param id
   */
  async get(id: string) {
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new NotFoundError('User not found');
    }
    return user;
  }

  /**
   * List all users
   *
   * @param limit
   * @param offset
   */
  list(limit: number, offset: number) {
    return this.userModel.find().limit(limit).skip(offset).exec();
  }

  /**
   * Create a user
   *
   * @param createUserInput
   */
  async create(createUserInput: GraphQLTypes.CreateUserInput) {
    let company: Company;

    if (createUserInput.companyId) {
      company = await this.companyModel
        .findById(createUserInput.companyId)
        .exec();
      if (!company) {
        throw new BadRequestError('Company does not exist');
      }
    }

    try {
      let user = new this.userModel({
        ...createUserInput,
        password: await this.hashingService.hash(createUserInput.password),
        ...(company && { company }),
      });
      user = await user.save();
      return user;
    } catch (err) {
      // If email already exists, MongoDB will raise an error whose code is 11000
      if (err.code === DB_ERROR_CODES.DUPLICATE_KEY_CODE) {
        throw new ConflictError('User already exists');
      }
      throw err;
    }
  }

  /**
   * Update a user
   *
   * @param id
   * @param updateUserInput
   */
  async update(id: string, updateUserInput: GraphQLTypes.UpdateUserInput) {
    let company: Company;

    if (updateUserInput.companyId) {
      company = await this.companyModel
        .findById(updateUserInput.companyId)
        .exec();
      if (!company) {
        throw new BadRequestError('Company does not exist');
      }
    }

    const user = await this.userModel
      .findByIdAndUpdate(
        id,
        {
          $set: {
            ...updateUserInput,
            ...(updateUserInput.password && {
              password: await this.hashingService.hash(
                updateUserInput.password,
              ),
            }),
            ...(company && { company }),
          },
        },
        { new: true },
      )
      .exec();
    if (!user) {
      throw new NotFoundError('user not found');
    }
    return user;
  }

  /**
   * Delete a user
   *
   * @param id
   */
  async delete(id: string) {
    const user = await this.userModel.findByIdAndDelete(id).exec();
    if (!user) {
      throw new NotFoundError('User not found');
    }
    return user;
  }
}
