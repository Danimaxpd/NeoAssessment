import { PartialType } from '@nestjs/mapped-types';
import { IsNumber, Min } from 'class-validator';
import { CreateCharacterDto } from './create-character.dto';

export class UpdateCharacterDto extends PartialType(CreateCharacterDto) {
  @IsNumber()
  @Min(0)
  currentHp?: number;
}
