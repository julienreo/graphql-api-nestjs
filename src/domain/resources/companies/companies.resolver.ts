import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CompaniesService } from './companies.service';
import { CreateCompanyInput } from './dto/create-company.dto';
import { UpdateCompanyInput } from './dto/update-company.dto';
import { Permissions } from 'src/iam/authorization/decorators/permissions.decorator';
import { Permission } from '../permissions/enums/permission.enum';

@Resolver()
export class CompaniesResolver {
  constructor(private readonly companiesService: CompaniesService) {}

  @Permissions(Permission.GET_COMPANY)
  @Query('company') // Bind 'company' query to the 'get' method
  get(@Args('id') id: string) {
    return this.companiesService.get(id);
  }

  @Permissions(Permission.LIST_COMPANIES)
  @Query('companies')
  list(@Args('limit') limit: number, @Args('offset') offset: number) {
    return this.companiesService.list(limit, offset);
  }

  @Permissions(Permission.CREATE_COMPANY)
  @Mutation('createCompany')
  create(
    @Args('createCompanyInput')
    createCompanyInput: CreateCompanyInput,
  ) {
    return this.companiesService.create(createCompanyInput);
  }

  @Permissions(Permission.UPDATE_COMPANY)
  @Mutation('updateCompany')
  update(
    @Args('id') id: string,
    @Args('updateCompanyInput')
    updateCompanyInput: UpdateCompanyInput,
  ) {
    return this.companiesService.update(id, updateCompanyInput);
  }

  @Permissions(Permission.DELETE_COMPANY)
  @Mutation('deleteCompany')
  delete(@Args('id') id: string) {
    return this.companiesService.delete(id);
  }
}
