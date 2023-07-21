import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Company } from '../companies/company.model';
import { User } from '../users/user.model';

@Resolver('Company')
export class CompanyUsersResolver {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  @ResolveField('users')
  listCompanyUsers(@Parent() company: Company) {
    return this.userModel.find({ company: company.id }).exec();
  }
}
