import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Company } from '../companies/company.model';
import { User } from './user.model';

@Resolver('User') // Parent type
export class UserCompanyResolver {
  constructor(
    @InjectModel(Company.name) private readonly companyModel: Model<Company>,
  ) {}

  @ResolveField('company')
  getUserCompany(@Parent() user: User) {
    return this.companyModel.findById(user.company).exec();
  }
}
