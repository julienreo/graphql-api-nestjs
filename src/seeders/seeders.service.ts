import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Company } from 'src/domain/resources/companies/company.model';
import { Permission } from 'src/domain/resources/permissions/permission.model';
import { Role } from 'src/domain/resources/roles/role.model';
import { User } from 'src/domain/resources/users/user.model';
import { Seeder } from './seeder.model';

@Injectable()
export class SeedersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(Company.name) private readonly companyModel: Model<Company>,
    @InjectModel(Role.name) private readonly roleModel: Model<Role>,
    @InjectModel(Permission.name)
    private readonly permissionModel: Model<Permission>,
    @InjectModel(Seeder.name)
    private readonly seederModel: Model<Seeder>,
  ) {}

  /*
   * Seed database
   */
  async seedDatabase() {
    // Return if database has already been seeded
    const seeder = await this.seederModel
      .findOne({
        name: 'SeedDatabase',
      })
      .exec();

    if (seeder) {
      return;
    }

    // Create companies
    const biblioCompany = new this.companyModel({
      name: 'Biblio',
      address: '2 Quai des Francs-Bourgeois',
      city: 'Mérignac',
      postcode: '33281',
      country: 'France',
    });
    await biblioCompany.save();

    const infinitySportCompany = new this.companyModel({
      name: 'Infinity Sport',
      address: '4 Impasse des Grands Augustins',
      postcode: '92012',
      city: 'Boulogne-Billancourt',
      country: 'France',
    });
    await infinitySportCompany.save();

    // Create roles
    const biblioAdminRole = new this.roleModel({
      name: 'ADMIN',
    });
    await biblioAdminRole.save();

    const infinitySportEmployeeRole = new this.roleModel({
      name: 'EMPLOYEE',
    });
    await infinitySportEmployeeRole.save();

    // Create users
    const biblioUser = new this.userModel({
      firstname: 'Charlotte',
      lastname: 'Buisson',
      email: 'charlotte.buisson@biblio.com',
      password: '$2b$10$WVN6lt1weamTzUB69rzMjOO7hZSY2DY3cZF.o3osXtgNyxdj3liSS',
    });
    await biblioUser.save();

    const infinitySportUser = new this.userModel({
      firstname: 'Antonin',
      lastname: 'Martin',
      email: 'antonin.martin@infinity-sport.com',
      password: '$2b$10$qJCSxCnnYfrozefsca.Ytepvn3vwCO7xSYVKThrRMcIylTyOBX6Ty',
    });
    await infinitySportUser.save();

    // Create permissions
    const getUserPermission = new this.permissionModel({
      name: 'GET_USER',
    });
    await getUserPermission.save();

    const listUsersPermission = new this.permissionModel({
      name: 'LIST_USERS',
    });
    await listUsersPermission.save();

    const createUserPermission = new this.permissionModel({
      name: 'CREATE_USER',
    });
    await createUserPermission.save();

    const updateUserPermission = new this.permissionModel({
      name: 'UPDATE_USER',
    });
    await updateUserPermission.save();

    const deleteUserPermission = new this.permissionModel({
      name: 'DELETE_USER',
    });
    await deleteUserPermission.save();

    const getCompanyPermission = new this.permissionModel({
      name: 'GET_COMPANY',
    });
    await getCompanyPermission.save();

    const listCompaniesPermission = new this.permissionModel({
      name: 'LIST_COMPANIES',
    });
    await listCompaniesPermission.save();

    const createCompanyPermission = new this.permissionModel({
      name: 'CREATE_COMPANY',
    });
    await createCompanyPermission.save();

    const updateCompanyPermission = new this.permissionModel({
      name: 'UPDATE_COMPANY',
    });
    await updateCompanyPermission.save();

    const deleteCompanyPermission = new this.permissionModel({
      name: 'DELETE_COMPANY',
    });
    await deleteCompanyPermission.save();

    /*
     * Set two-way references between entities
     */

    // Link users to companies and roles
    await this.userModel
      .findByIdAndUpdate(biblioUser.id, {
        $set: {
          company: biblioCompany,
          role: biblioAdminRole,
        },
      })
      .exec();

    await this.userModel
      .findByIdAndUpdate(infinitySportUser.id, {
        $set: {
          company: infinitySportCompany,
          role: infinitySportEmployeeRole,
        },
      })
      .exec();

    // Link companies to users and roles
    await this.companyModel
      .findByIdAndUpdate(biblioCompany.id, {
        $set: {
          users: [biblioUser],
          roles: [biblioAdminRole],
        },
      })
      .exec();

    await this.companyModel
      .findByIdAndUpdate(infinitySportCompany.id, {
        $set: {
          users: [infinitySportUser],
          roles: [infinitySportEmployeeRole],
        },
      })
      .exec();

    // Link roles to permissions and companies
    await this.roleModel
      .findByIdAndUpdate(biblioAdminRole.id, {
        $set: {
          permissions: [
            getUserPermission,
            listUsersPermission,
            createUserPermission,
            updateUserPermission,
            deleteUserPermission,
            getCompanyPermission,
            listCompaniesPermission,
            updateCompanyPermission,
            createCompanyPermission,
            deleteCompanyPermission,
          ],
          company: biblioCompany,
        },
      })
      .exec();

    await this.roleModel
      .findByIdAndUpdate(infinitySportEmployeeRole.id, {
        $set: {
          company: infinitySportCompany,
        },
      })
      .exec();

    // Link permissions to roles
    await this.permissionModel
      .findByIdAndUpdate(getUserPermission.id, {
        $set: {
          roles: [biblioAdminRole],
        },
      })
      .exec();

    await this.permissionModel
      .findByIdAndUpdate(listUsersPermission.id, {
        $set: {
          roles: [biblioAdminRole],
        },
      })
      .exec();

    await this.permissionModel
      .findByIdAndUpdate(createUserPermission.id, {
        $set: {
          roles: [biblioAdminRole],
        },
      })
      .exec();

    await this.permissionModel
      .findByIdAndUpdate(updateUserPermission.id, {
        $set: {
          roles: [biblioAdminRole],
        },
      })
      .exec();

    await this.permissionModel
      .findByIdAndUpdate(deleteUserPermission.id, {
        $set: {
          roles: [biblioAdminRole],
        },
      })
      .exec();

    await this.permissionModel
      .findByIdAndUpdate(getCompanyPermission.id, {
        $set: {
          roles: [biblioAdminRole],
        },
      })
      .exec();

    await this.permissionModel
      .findByIdAndUpdate(listCompaniesPermission.id, {
        $set: {
          roles: [biblioAdminRole],
        },
      })
      .exec();

    await this.permissionModel
      .findByIdAndUpdate(updateCompanyPermission.id, {
        $set: {
          roles: [biblioAdminRole],
        },
      })
      .exec();

    await this.permissionModel
      .findByIdAndUpdate(createCompanyPermission.id, {
        $set: {
          roles: [biblioAdminRole],
        },
      })
      .exec();

    await this.permissionModel
      .findByIdAndUpdate(updateCompanyPermission.id, {
        $set: {
          roles: [biblioAdminRole],
        },
      })
      .exec();

    // Save seeder
    const databaseSeeder = new this.seederModel({
      name: 'SeedDatabase',
    });
    await databaseSeeder.save();
  }
}
