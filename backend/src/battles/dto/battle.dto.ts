import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class BattleDto {
  @ApiProperty({
    description: 'ID of the first character',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsString()
  @IsNotEmpty()
  character1Id: string;

  @ApiProperty({
    description: 'ID of the second character',
    example: '123e4567-e89b-12d3-a456-426614174001',
  })
  @IsString()
  @IsNotEmpty()
  character2Id: string;
}
