// school.model.ts

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

export type StudentDocument = Student & Document;

@Schema({ collection: 'student', timestamps: true, versionKey: false })
export class Student {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  address: string;

  @Prop({ required: true })
  parentsNumber: string;

  @Prop({ required: true })
  photo: string;

  @Prop({ required: true })
  dob: string;

  @Prop({ required: true })
  std: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, required: true })
  schoolId: mongoose.Schema.Types.ObjectId;

  @Prop({ default: true })
  isActive: boolean;
}

export const StudentSchema = SchemaFactory.createForClass(Student);
