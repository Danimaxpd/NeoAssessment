import { Injectable, NotFoundException } from '@nestjs/common';
import { CharactersService } from '../characters/characters.service';
import { Character } from '../characters/entities/character.entity';
import { BattleDto } from './dto/battle.dto';
import {
  BattleResult,
  BattleRound,
  BattleTurn,
} from './interfaces/battle.interface';
import { BattleResultDto } from './dto/battle-result.dto';

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

  simulateBattle(character1Id: string, character2Id: string): BattleResultDto {
    const character1 = this.charactersService.findOne(character1Id);
    const character2 = this.charactersService.findOne(character2Id);

    if (!character1 || !character2) {
      throw new NotFoundException('One or both characters not found');
    }

    const battleLog: string[] = [];
    let currentHealth1 = character1.health;
    let currentHealth2 = character2.health;

    while (currentHealth1 > 0 && currentHealth2 > 0) {
      // Character 1 attacks Character 2
      const damage1 = Math.max(1, character1.attack - character2.defense);
      currentHealth2 -= damage1;
      battleLog.push(
        `${character1.name} attacks ${character2.name} for ${damage1} damage!`,
      );

      if (currentHealth2 <= 0) break;

      // Character 2 attacks Character 1
      const damage2 = Math.max(1, character2.attack - character1.defense);
      currentHealth1 -= damage2;
      battleLog.push(
        `${character2.name} attacks ${character1.name} for ${damage2} damage!`,
      );
    }

    const winner = currentHealth1 > 0 ? character1 : character2;
    const loser = currentHealth1 > 0 ? character2 : character1;

    return {
      winner,
      loser,
      battleLog,
    };
  }
}
