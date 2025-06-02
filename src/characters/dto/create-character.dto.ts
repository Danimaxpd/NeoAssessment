import {
  IsEnum,
  IsString,
  Matches,
  MinLength,
  MaxLength,
} from 'class-validator';
import { Job } from '../entities/character.entity';

export class CreateCharacterDto {
  @IsString()
  @MinLength(4)
  @MaxLength(15)
  @Matches(/^[a-zA-Z_]+$/, {
    message: 'Name can only contain letters and underscores',
  })
  name: string;

  @IsEnum(Job)
  job: Job;
}
