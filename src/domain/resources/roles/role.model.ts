import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, now } from 'mongoose';
import { Company } from '../companies/company.model';
import { Permission } from '../permissions/permission.model';
import { Role as UserRole } from './enums/role.enum';

@Schema()
export class Role extends Document {
  @Prop({ type: String, enum: UserRole, default: UserRole.EMPLOYEE })
  name: UserRole;

  @Prop({ default: now() })
  createdAt: Date;

  @Prop({ default: now() })
  updatedAt: Date;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Company' })
  company: Company;

  @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: 'Permission' }])
  permissions: [Permission];
}

export const RoleSchema = SchemaFactory.createForClass(Role);
