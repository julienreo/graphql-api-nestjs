import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, now } from 'mongoose';

@Schema()
export class Seeder extends Document {
  @Prop()
  name: string;

  @Prop({ default: now() })
  createdAt: Date;
}

export const SeederSchema = SchemaFactory.createForClass(Seeder);
