import {
  IsEnum,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Job } from '@common/enums/job.enum';

export class CreateCharacterDto {
  @ApiProperty({
    description:
      'The name of the character (4-15 characters, letters and underscores only)',
    example: 'Gandalf',
    minLength: 4,
    maxLength: 15,
  })
  @IsString()
  @MinLength(4)
  @MaxLength(15)
  @Matches(/^[a-zA-Z_]+$/, {
    message: 'Name can only contain letters and underscores',
  })
  name: string;

  @ApiProperty({
    description: 'Character class/job',
    enum: Job,
    example: Job.MAGE,
  })
  @IsEnum(Job)
  job: Job;
}
