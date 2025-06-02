import { Injectable } from '@nestjs/common';
import { CharactersService } from '../characters/characters.service';
import { Character } from '../characters/entities/character.entity';
import { BattleDto } from './dto/battle.dto';
import {
  BattleResult,
  BattleRound,
  BattleTurn,
} from './interfaces/battle.interface';

@Injectable()
export class BattlesService {
  constructor(private readonly charactersService: CharactersService) {}

  private getRandomInt(max: number): number {
    return Math.floor(Math.random() * (max + 1));
  }

  private determineFirstAttacker(
    character1: Character,
    character2: Character,
  ): Character {
    let speed1 = this.getRandomInt(character1.speedModifier);
    let speed2 = this.getRandomInt(character2.speedModifier);

    while (speed1 === speed2) {
      speed1 = this.getRandomInt(character1.speedModifier);
      speed2 = this.getRandomInt(character2.speedModifier);
    }

    return speed1 > speed2 ? character1 : character2;
  }

  private createBattleTurn(
    attacker: Character,
    defender: Character,
  ): BattleTurn {
    const damage = this.getRandomInt(attacker.attackModifier);
    const remainingHp = Math.max(0, defender.currentHp - damage);

    return {
      attacker,
      defender,
      damage,
      remainingHp,
    };
  }

  private createBattleRound(
    character1: Character,
    character2: Character,
  ): BattleRound {
    const firstAttacker = this.determineFirstAttacker(character1, character2);
    const secondAttacker =
      firstAttacker === character1 ? character2 : character1;

    const turns: BattleTurn[] = [];

    // First attacker's turn
    const firstTurn = this.createBattleTurn(firstAttacker, secondAttacker);
    turns.push(firstTurn);

    // If second attacker is still alive, they get their turn
    if (firstTurn.remainingHp > 0) {
      const secondTurn = this.createBattleTurn(secondAttacker, firstAttacker);
      turns.push(secondTurn);
    }

    return {
      firstAttacker,
      secondAttacker,
      turns,
    };
  }

  private generateBattleLog(rounds: BattleRound[]): string[] {
    const log: string[] = [];

    rounds.forEach((round, index) => {
      const { firstAttacker, secondAttacker, turns } = round;

      // Round start log
      log.push(
        `Round ${index + 1}: ${firstAttacker.name} (${firstAttacker.job}) - ${firstAttacker.currentHp} HP and ${secondAttacker.name} (${secondAttacker.job}) - ${secondAttacker.currentHp} HP`,
      );
      log.push(
        `${firstAttacker.name}'s speed (${firstAttacker.speedModifier}) was faster than ${secondAttacker.name}'s speed (${secondAttacker.speedModifier}) and will begin this round.`,
      );

      // Turn logs
      turns.forEach((turn) => {
        const { attacker, defender, damage, remainingHp } = turn;
        log.push(
          `${attacker.name} attacks ${defender.name} for ${damage} damage, ${defender.name} has ${remainingHp} HP remaining.`,
        );
      });
    });

    return log;
  }

  private createBattleCharacter(
    character: Character,
    currentHp: number,
  ): Character {
    const battleCharacter = new Character(character);
    battleCharacter.currentHp = currentHp;
    return battleCharacter;
  }

  battle(battleDto: BattleDto): BattleResult {
    const character1 = this.charactersService.findOne(battleDto.character1Id);
    const character2 = this.charactersService.findOne(battleDto.character2Id);

    const rounds: BattleRound[] = [];
    let currentHp1 = character1.currentHp;
    let currentHp2 = character2.currentHp;

    while (currentHp1 > 0 && currentHp2 > 0) {
      const round = this.createBattleRound(
        this.createBattleCharacter(character1, currentHp1),
        this.createBattleCharacter(character2, currentHp2),
      );

      rounds.push(round);

      // Update HP based on the last turn of the round
      const lastTurn = round.turns[round.turns.length - 1];
      if (lastTurn.defender === character1) {
        currentHp1 = lastTurn.remainingHp;
      } else {
        currentHp2 = lastTurn.remainingHp;
      }
    }

    const winner = currentHp1 > 0 ? character1 : character2;
    const loser = currentHp1 > 0 ? character2 : character1;

    // Update characters' HP in the database
    this.charactersService.update(character1.id, { currentHp: currentHp1 });
    this.charactersService.update(character2.id, { currentHp: currentHp2 });

    const log = this.generateBattleLog(rounds);
    log.push(
      `${winner.name} wins the battle! ${winner.name} still has ${winner.currentHp} HP remaining!`,
    );

    return {
      winner,
      loser,
      rounds,
      log,
    };
  }
}
