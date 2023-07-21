import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, now } from 'mongoose';
import { Role } from '../roles/role.model';
import { Permission as RolePermission } from './enums/permission.enum';

@Schema()
export class Permission extends Document {
  @Prop({ type: String, enum: RolePermission })
  name: RolePermission;

  @Prop({ default: now() })
  createdAt: Date;

  @Prop({ default: now() })
  updatedAt: Date;

  @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: 'Role' }])
  roles: [Role];
}

export const PermissionSchema = SchemaFactory.createForClass(Permission);
