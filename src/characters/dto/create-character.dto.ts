import {
  IsEnum,
  IsString,
  Matches,
  MinLength,
  MaxLength,
  IsNumber,
  Min,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Job } from '../entities/character.entity';

export class CreateCharacterDto {
  @ApiProperty({
    description: 'The name of the character (4-15 characters, letters and underscores only)',
    example: 'Gandalf',
    minLength: 4,
    maxLength: 15,
  })
  @IsString()
  @MaxLength(15)
  @Matches(/^[a-zA-Z_]+$/, {
    message: 'Name can only contain letters and underscores',
  })
  name: string;

  @ApiProperty({
    description: 'The health points of the character',
    example: 100,
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  health: number;

  @ApiProperty({
    description: 'The attack power of the character',
    example: 15,
    minimum: 1,
  })
  @IsNumber()
  @Min(1)
  attack: number;

  @ApiProperty({
    description: 'The defense power of the character',
    example: 10,
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  defense: number;

  @ApiProperty({
    description: 'Character class/job',
    enum: Job,
    example: Job.MAGE,
  })
  @IsEnum(Job)
  job: Job;
}
