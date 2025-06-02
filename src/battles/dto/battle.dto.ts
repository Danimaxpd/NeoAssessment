import { IsString, IsNotEmpty } from 'class-validator';

export class BattleDto {
  @IsString()
  @IsNotEmpty()
  character1Id: string;

  @IsString()
  @IsNotEmpty()
  character2Id: string;
}
