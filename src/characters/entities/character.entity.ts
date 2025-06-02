export enum Job {
  WARRIOR = 'Warrior',
  THIEF = 'Thief',
  MAGE = 'Mage',
}

export class Character {
  id: string;
  name: string;
  job: Job;
  health: number;
  strength: number;
  dexterity: number;
  intelligence: number;
  attackModifier: number;
  speedModifier: number;
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
          strength: 10,
          dexterity: 5,
          intelligence: 5,
        };
      case Job.THIEF:
        return {
          health: 15,
          strength: 4,
          dexterity: 10,
          intelligence: 4,
        };
      case Job.MAGE:
        return {
          health: 12,
          strength: 5,
          dexterity: 6,
          intelligence: 10,
        };
      default:
        throw new Error('Invalid job');
    }
  }
}
