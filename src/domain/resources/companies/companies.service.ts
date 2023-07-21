import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as GraphQLTypes from 'src/graphql/graphql-types';
import { NotFoundError } from '../../errors/not-found.error';
import { Company } from './company.model';

@Injectable()
export class CompaniesService {
  constructor(
    @InjectModel(Company.name) private readonly companyModel: Model<Company>,
  ) {}

  /**
   * Get a company
   *
   * @param id
   */
  async get(id: string) {
    const company = await this.companyModel.findById(id).exec();
    if (!company) {
      throw new NotFoundError('Company not found');
    }
    return company;
  }

  /**
   * List all companies
   *
   * @param limit
   * @param offset
   */
  list(limit: number, offset: number) {
    return this.companyModel.find().limit(limit).skip(offset).exec();
  }

  /**
   * Create a company
   *
   * @param createCompanyInput
   */
  create(createCompanyInput: GraphQLTypes.CreateCompanyInput) {
    const company = new this.companyModel(createCompanyInput);
    return company.save();
  }

  /**
   * Update a company
   *
   * @param id
   * @param updateCompanyInput
   */
  async update(
    id: string,
    updateCompanyInput: GraphQLTypes.UpdateCompanyInput,
  ) {
    const company = await this.companyModel
      .findByIdAndUpdate(id, { $set: updateCompanyInput }, { new: true })
      .exec();
    if (!company) {
      throw new NotFoundError('Company not found');
    }
    return company;
  }

  /**
   * Delete a company
   *
   * @param id
   */
  async delete(id: string) {
    const company = await this.companyModel.findByIdAndDelete(id).exec();
    if (!company) {
      throw new NotFoundError('Company not found');
    }
    return company;
  }
}
