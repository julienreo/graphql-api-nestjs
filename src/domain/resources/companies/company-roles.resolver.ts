import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Company } from '../companies/company.model';
import { Role } from '../roles/role.model';

@Resolver('Company')
export class CompanyRolesResolver {
  constructor(
    @InjectModel(Role.name) private readonly roleModel: Model<Role>,
  ) {}

  @ResolveField('roles')
  listCompanyRoles(@Parent() company: Company) {
    return this.roleModel.find({ company: company.id }).exec();
  }
}
