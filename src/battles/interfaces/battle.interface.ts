import { Character } from '../../characters/entities/character.entity';

export interface BattleTurn {
  attacker: Character;
  defender: Character;
  damage: number;
  remainingHp: number;
}

export interface BattleRound {
  firstAttacker: Character;
  secondAttacker: Character;
  turns: BattleTurn[];
}

export interface BattleResult {
  winner: Character;
  loser: Character;
  rounds: BattleRound[];
  log: string[];
}
