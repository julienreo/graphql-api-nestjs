import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, now } from 'mongoose';
import { Role } from '../roles/role.model';
import { User } from '../users/user.model';

@Schema()
export class Company extends Document {
  @Prop()
  name: string;

  @Prop()
  address: string;

  @Prop()
  postcode: string;

  @Prop()
  city: string;

  @Prop()
  country: string;

  @Prop({ default: now() })
  createdAt: Date;

  @Prop({ default: now() })
  updatedAt: Date;

  @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }])
  users: [User];

  @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: 'Role' }])
  roles: [Role];
}

export const CompanySchema = SchemaFactory.createForClass(Company);
