import { PartialType } from '@nestjs/swagger';
import { IsNumber, Min } from 'class-validator';
import { CreateCharacterDto } from './create-character.dto';

export class UpdateCharacterDto extends PartialType(CreateCharacterDto) {
  @IsNumber()
  @Min(0)
  currentHp?: number;
}
