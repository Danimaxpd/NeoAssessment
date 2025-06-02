import { ApiProperty } from '@nestjs/swagger';
import { Character } from '../../characters/entities/character.entity';

export class BattleTurnDto {
  @ApiProperty({ type: Character })
  attacker: Character;

  @ApiProperty({ type: Character })
  defender: Character;

  @ApiProperty()
  damage: number;

  @ApiProperty()
  remainingHp: number;
}

export class BattleRoundDto {
  @ApiProperty({ type: Character })
  firstAttacker: Character;

  @ApiProperty({ type: Character })
  secondAttacker: Character;

  @ApiProperty({ type: [BattleTurnDto] })
  turns: BattleTurnDto[];
}

export class BattleResultDto {
  @ApiProperty({
    description: 'The winning character',
    type: Character,
  })
  winner: Character;

  @ApiProperty({
    description: 'The losing character',
    type: Character,
  })
  loser: Character;

  @ApiProperty({
    description: 'The sequence of events that occurred during the battle',
    type: [String],
    example: [
      'Gandalf attacks Sauron for 5 damage!',
      'Sauron attacks Gandalf for 3 damage!',
      'Gandalf wins the battle!',
    ],
  })
  battleLog: string[];
}
