import { Injectable, NotFoundException } from '@nestjs/common';
import { CharactersService } from '../characters/characters.service';
import { Character } from '../characters/entities/character.entity';
import { BattleResultDto } from './dto/battle-result.dto';
import { BattleTurn, BattleRound } from './interfaces/battle.interface';

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
    let currentHealth1 = character1.currentHp;
    let currentHealth2 = character2.currentHp;

    // Battle start log
    battleLog.push(
      `Battle between ${character1.name} (${character1.job}) - ${currentHealth1} HP and ${character2.name} (${character2.job}) - ${currentHealth2} HP begins!`,
    );

    while (currentHealth1 > 0 && currentHealth2 > 0) {
      // Determine first attacker based on speed
      const speed1 = this.getRandomInt(character1.speedModifier);
      const speed2 = this.getRandomInt(character2.speedModifier);

      let firstAttacker: Character;
      let secondAttacker: Character;
      let firstSpeed: number;
      let secondSpeed: number;

      if (speed1 > speed2) {
        firstAttacker = character1;
        secondAttacker = character2;
        firstSpeed = speed1;
        secondSpeed = speed2;
      } else {
        firstAttacker = character2;
        secondAttacker = character1;
        firstSpeed = speed2;
        secondSpeed = speed1;
      }

      battleLog.push(
        `${firstAttacker.name}'s speed (${firstSpeed}) was faster than ${secondAttacker.name}'s speed (${secondSpeed}) and will begin this round.`,
      );

      // First attacker's turn
      const damage1 = this.getRandomInt(firstAttacker.attackModifier);
      if (firstAttacker === character1) {
        currentHealth2 = Math.max(0, currentHealth2 - damage1);
      } else {
        currentHealth1 = Math.max(0, currentHealth1 - damage1);
      }

      battleLog.push(
        `${firstAttacker.name} attacks ${secondAttacker.name} for ${damage1} damage, ${secondAttacker.name} has ${firstAttacker === character1 ? currentHealth2 : currentHealth1} HP remaining.`,
      );

      if (currentHealth1 <= 0 || currentHealth2 <= 0) break;

      // Second attacker's turn
      const damage2 = this.getRandomInt(secondAttacker.attackModifier);
      if (secondAttacker === character1) {
        currentHealth2 = Math.max(0, currentHealth2 - damage2);
      } else {
        currentHealth1 = Math.max(0, currentHealth1 - damage2);
      }

      battleLog.push(
        `${secondAttacker.name} attacks ${firstAttacker.name} for ${damage2} damage, ${firstAttacker.name} has ${secondAttacker === character1 ? currentHealth2 : currentHealth1} HP remaining.`,
      );
    }

    const winner = currentHealth1 > 0 ? character1 : character2;
    const loser = currentHealth1 > 0 ? character2 : character1;

    battleLog.push(
      `${winner.name} wins the battle! ${winner.name} still has ${
        winner === character1 ? currentHealth1 : currentHealth2
      } HP remaining!`,
    );

    return {
      winner,
      loser,
      battleLog,
    };
  }
}
