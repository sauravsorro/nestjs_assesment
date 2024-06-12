import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsIn,
  IsMongoId,
  IsNotEmpty,
  IsNumberString,
  IsString,
  Length,
} from 'class-validator';

export class StudentDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  address: string;

  @ApiProperty({ type: 'file', required: true, format: 'binary' })
  photo: string;

  @ApiProperty()
  @IsMongoId()
  @IsNotEmpty()
  schoolId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumberString()
  @Length(10, 10, {
    message: 'Phone number must be 10 characters',
  })
  parentsNumber: string;

  @ApiProperty({ description: 'Format should be yyyy-mm-dd' })
  @IsNotEmpty()
  @IsString()
  dob: string;

  @ApiProperty({ description: 'Std should be between 1 to 10' })
  @IsIn(['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'], {
    message: 'Please enter between 1 to 10 std',
  })
  std: string;
}

export class ListStudentsDto {
  @ApiPropertyOptional({
    type: Number,
    description: 'Page number for pagination',
    default: 1,
  })
  page?: number = 1;

  @ApiPropertyOptional({
    type: Number,
    description: 'Number of items per page',
    default: 10,
  })
  limit?: number = 10;

  @ApiPropertyOptional({ type: String, description: 'Search by name' })
  search?: string = '';

  @ApiPropertyOptional({ type: String, description: 'Field to sort by' })
  sortBy?: string = '';

  @ApiPropertyOptional({ type: String, description: 'Sort order (asc/desc)' })
  sortOrder?: string = '';

  @ApiPropertyOptional({
    type: String,
    description: 'Std should be between 1 to 10',
  })
  std?: string = '';
}
