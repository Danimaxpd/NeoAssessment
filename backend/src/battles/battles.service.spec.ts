import { Test, TestingModule } from '@nestjs/testing';
import { BattlesService } from './battles.service';
import { CharactersService } from '../characters/characters.service';
import { NotFoundException } from '@nestjs/common';
import { Job } from '@common/enums/job.enum';

describe('BattlesService', () => {
  let service: BattlesService;
  let charactersService: CharactersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BattlesService, CharactersService],
    }).compile();

    service = module.get<BattlesService>(BattlesService);
    charactersService = module.get<CharactersService>(CharactersService);

    // Mock Math.random to return predictable values
    jest.spyOn(Math, 'random').mockImplementation(() => 0.5);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('simulateBattle', () => {
    it('should throw NotFoundException when character1 is not found', () => {
      const character2 = charactersService.create({
        name: 'Aragorn',
        job: Job.WARRIOR,
      });

      expect(() =>
        service.simulateBattle('non-existent-id', character2.id),
      ).toThrow(NotFoundException);
    });

    it('should throw NotFoundException when character2 is not found', () => {
      const character1 = charactersService.create({
        name: 'Gandalf',
        job: Job.MAGE,
      });

      expect(() =>
        service.simulateBattle(character1.id, 'non-existent-id'),
      ).toThrow(NotFoundException);
    });

    it('should simulate a battle between two characters', () => {
      const character1 = charactersService.create({
        name: 'Gandalf',
        job: Job.MAGE,
      });

      const character2 = charactersService.create({
        name: 'Aragorn',
        job: Job.WARRIOR,
      });

      const result = service.simulateBattle(character1.id, character2.id);

      expect(result).toBeDefined();
      expect(result.winner).toBeDefined();
      expect(result.loser).toBeDefined();
      expect(result.battleLog).toBeDefined();
      expect(result.battleLog.length).toBeGreaterThan(0);
      expect([character1, character2]).toContain(result.winner);
      expect([character1, character2]).toContain(result.loser);
      expect(result.winner).not.toBe(result.loser);
    });

    it('should simulate a battle where character1 wins', () => {
      // Mock Math.random to make character1 win
      jest.spyOn(Math, 'random').mockImplementation(() => 0.9);

      const character1 = charactersService.create({
        name: 'Gandalf',
        job: Job.WARRIOR, // Using Warrior for higher stats
      });

      const character2 = charactersService.create({
        name: 'Aragorn',
        job: Job.MAGE, // Using Mage for lower stats
      });

      const result = service.simulateBattle(character1.id, character2.id);

      expect(result.winner).toBe(character1);
      expect(result.loser).toBe(character2);

      // Verify HP updates
      const updatedCharacter1 = charactersService.findOne(character1.id);
      const updatedCharacter2 = charactersService.findOne(character2.id);
      expect(updatedCharacter1.currentHp).toBeGreaterThan(0);
      expect(updatedCharacter2.currentHp).toBe(0);
    });

    it('should simulate a battle where character2 wins', () => {
      // Mock Math.random to make character2 win
      jest.spyOn(Math, 'random').mockImplementation(() => 0.1);

      const character1 = charactersService.create({
        name: 'Gandalf',
        job: Job.MAGE, // Using Mage for lower stats
      });

      const character2 = charactersService.create({
        name: 'Aragorn',
        job: Job.WARRIOR, // Using Warrior for higher stats
      });

      const result = service.simulateBattle(character1.id, character2.id);

      expect(result.winner).toBe(character2);
      expect(result.loser).toBe(character1);

      // Verify HP updates
      const updatedCharacter1 = charactersService.findOne(character1.id);
      const updatedCharacter2 = charactersService.findOne(character2.id);
      expect(updatedCharacter1.currentHp).toBe(0);
      expect(updatedCharacter2.currentHp).toBeGreaterThan(0);
    });

    it('should generate battle log with correct format', () => {
      const character1 = charactersService.create({
        name: 'Gandalf',
        job: Job.MAGE,
      });

      const character2 = charactersService.create({
        name: 'Aragorn',
        job: Job.WARRIOR,
      });

      const result = service.simulateBattle(character1.id, character2.id);

      expect(result.battleLog).toBeDefined();
      expect(result.battleLog.length).toBeGreaterThan(0);

      // Check battle start message
      expect(result.battleLog[0]).toMatch(
        /^Battle between .* \(.*\) - \d+ HP and .* \(.*\) - \d+ HP begins!$/,
      );

      // Check speed comparison messages
      for (let i = 1; i < result.battleLog.length - 1; i += 3) {
        expect(result.battleLog[i]).toMatch(
          /^.*'s speed \(\d+\) was faster than .*'s speed \(\d+\) and will begin this round\.$/,
        );
      }

      // Check attack messages
      for (let i = 2; i < result.battleLog.length - 1; i += 3) {
        expect(result.battleLog[i]).toMatch(
          /^.* attacks .* for \d+ damage, .* has \d+ HP remaining\.$/,
        );
      }

      // Check battle end message
      expect(result.battleLog[result.battleLog.length - 1]).toMatch(
        /^.* wins the battle! .* still has \d+ HP remaining!$/,
      );
    });
  });
});
