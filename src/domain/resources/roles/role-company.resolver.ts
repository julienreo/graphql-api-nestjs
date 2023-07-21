import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Company } from '../companies/company.model';
import { Role } from '../roles/role.model';

@Resolver('Role')
export class RoleCompanyResolver {
  constructor(
    @InjectModel(Company.name)
    private readonly companyModel: Model<Company>,
  ) {}

  @ResolveField('company')
  getRoleCompany(@Parent() role: Role) {
    return this.companyModel.findById(role.company).exec();
  }
}
