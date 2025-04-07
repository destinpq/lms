import { IsString, IsOptional, IsBoolean, IsArray } from 'class-validator';

export class CreateCourseDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsString()
  @IsOptional()
  thumbnail?: string;

  @IsBoolean()
  @IsOptional()
  isPublished?: boolean;

  @IsString()
  @IsOptional()
  duration?: string;

  @IsArray()
  @IsOptional()
  tags?: string[];

  @IsBoolean()
  @IsOptional()
  hasCertificate?: boolean;

  @IsString()
  @IsOptional()
  certificateTemplate?: string;

  @IsOptional()
  settings?: any;
}
