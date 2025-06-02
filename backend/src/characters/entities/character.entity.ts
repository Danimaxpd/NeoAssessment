import { ApiProperty } from '@nestjs/swagger';
import { BadRequestException } from '@nestjs/common';

export enum Job {
  WARRIOR = 'Warrior',
  THIEF = 'Thief',
  MAGE = 'Mage',
}

export class Character {
  @ApiProperty({
    description: 'The unique identifier of the character',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'The name of the character',
    example: 'Gandalf',
  })
  name: string;

  @ApiProperty({ enum: Job, description: 'Character class/job' })
  job: Job;

  @ApiProperty({
    description: 'The health points of the character',
    example: 100,
    minimum: 0,
  })
  health: number;

  @ApiProperty({
    description: 'The attack power of the character',
    example: 15,
    minimum: 1,
  })
  attack: number;

  @ApiProperty({
    description: 'The defense power of the character',
    example: 10,
    minimum: 0,
  })
  defense: number;

  @ApiProperty({ description: 'Strength attribute' })
  strength: number;

  @ApiProperty({ description: 'Dexterity attribute' })
  dexterity: number;

  @ApiProperty({ description: 'Intelligence attribute' })
  intelligence: number;

  @ApiProperty({ description: 'Attack modifier based on attributes and job' })
  attackModifier: number;

  @ApiProperty({ description: 'Speed modifier based on attributes and job' })
  speedModifier: number;

  @ApiProperty({ description: 'Current health points' })
  currentHp: number;

  constructor(partial: Partial<Character>) {
    Object.assign(this, partial);
  }

  calculateAttackModifier(): number {
    switch (this.job) {
      case Job.WARRIOR:
        return 0.8 * this.strength + 0.2 * this.dexterity;
      case Job.THIEF:
        return 0.25 * this.strength + this.dexterity + 0.25 * this.intelligence;
      case Job.MAGE:
        return (
          0.2 * this.strength + 0.2 * this.dexterity + 1.2 * this.intelligence
        );
      default:
        return 0;
    }
  }

  calculateSpeedModifier(): number {
    switch (this.job) {
      case Job.WARRIOR:
        return 0.6 * this.dexterity + 0.2 * this.intelligence;
      case Job.THIEF:
        return 0.8 * this.dexterity;
      case Job.MAGE:
        return 0.4 * this.dexterity + 0.1 * this.strength;
      default:
        return 0;
    }
  }

  static getInitialStats(job: Job): Partial<Character> {
    switch (job) {
      case Job.WARRIOR:
        return {
          health: 20,
          attack: 15,
          defense: 10,
          strength: 10,
          dexterity: 5,
          intelligence: 5,
        };
      case Job.THIEF:
        return {
          health: 15,
          attack: 12,
          defense: 8,
          strength: 4,
          dexterity: 10,
          intelligence: 4,
        };
      case Job.MAGE:
        return {
          health: 12,
          attack: 10,
          defense: 6,
          strength: 5,
          dexterity: 6,
          intelligence: 10,
        };
      default:
        throw new BadRequestException(
          `Invalid job, try again with a valid job: ${Object.values(Job).join(
            ', ',
          )}`,
        );
    }
  }
}
