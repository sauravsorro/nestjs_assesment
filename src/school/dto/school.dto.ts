import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateSchoolDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  address: string;

  @ApiProperty({ type: 'file', required: true, format: 'binary' })
  photo: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  zipCode: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  city: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  state: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  country: string;
}

export class UpdateSchoolDto {
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
  @IsString()
  @IsNotEmpty()
  zipCode: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  city: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  state: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  country: string;
}

export class ListSchoolsDto {
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

  @ApiPropertyOptional({
    type: String,
    description: 'Search by name and email',
  })
  search?: string = '';

  @ApiPropertyOptional({ type: String, description: 'Field to sort by' })
  sortBy?: string = '';

  @ApiPropertyOptional({ type: String, description: 'Sort order (asc/desc)' })
  sortOrder?: string = '';

  @ApiPropertyOptional({ type: String, description: 'City name' })
  city?: string = '';
}
