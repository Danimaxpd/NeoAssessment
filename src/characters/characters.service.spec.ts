import { Test, TestingModule } from '@nestjs/testing';
import { CharactersService } from './characters.service';
import { CreateCharacterDto } from './dto/create-character.dto';
import { Job } from './entities/character.entity';
import { NotFoundException, ConflictException } from '@nestjs/common';

describe('CharactersService', () => {
  let service: CharactersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CharactersService],
    }).compile();

    service = module.get<CharactersService>(CharactersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a character with valid data', () => {
      const createCharacterDto: CreateCharacterDto = {
        name: 'Gandalf',
        job: Job.MAGE,
      };

      const character = service.create(createCharacterDto);

      expect(character).toBeDefined();
      expect(character.id).toBeDefined();
      expect(character.name).toBe(createCharacterDto.name);
      expect(character.job).toBe(createCharacterDto.job);
      expect(character.health).toBe(12); // MAGE initial health
      expect(character.attack).toBe(10); // MAGE initial attack
      expect(character.defense).toBe(6); // MAGE initial defense
      expect(character.currentHp).toBe(12); // MAGE initial health
    });

    it('should throw ConflictException when creating character with duplicate name', () => {
      const createCharacterDto: CreateCharacterDto = {
        name: 'Gandalf',
        job: Job.MAGE,
      };

      service.create(createCharacterDto);

      expect(() => service.create(createCharacterDto)).toThrow(
        ConflictException,
      );
    });

    it('should throw ConflictException when creating character with same name but different job', () => {
      service.create({
        name: 'Gandalf',
        job: Job.MAGE,
      });

      expect(() =>
        service.create({
          name: 'Gandalf',
          job: Job.WARRIOR,
        }),
      ).toThrow(ConflictException);
    });

    it('should allow creating characters with same job but different names', () => {
      const character1 = service.create({
        name: 'Gandalf',
        job: Job.MAGE,
      });

      const character2 = service.create({
        name: 'Merlin',
        job: Job.MAGE,
      });

      expect(character1.name).not.toBe(character2.name);
      expect(character1.job).toBe(character2.job);
      expect(character1.health).toBe(character2.health); // Both MAGE
    });
  });

  describe('findAll', () => {
    it('should return an empty array initially', () => {
      expect(service.findAll()).toEqual([]);
    });

    it('should return all created characters', () => {
      const character1 = service.create({
        name: 'Gandalf',
        job: Job.MAGE,
      });

      const character2 = service.create({
        name: 'Aragorn',
        job: Job.WARRIOR,
      });

      const characters = service.findAll();
      expect(characters).toHaveLength(2);
      expect(characters).toContainEqual(character1);
      expect(characters).toContainEqual(character2);
    });
  });

  describe('findOne', () => {
    it('should throw NotFoundException for non-existent character', () => {
      expect(() => service.findOne('non-existent-id')).toThrow(
        NotFoundException,
      );
    });

    it('should return a character by id', () => {
      const character = service.create({
        name: 'Gandalf',
        job: Job.MAGE,
      });

      const found = service.findOne(character.id);
      expect(found).toEqual(character);
    });
  });

  describe('update', () => {
    it('should throw NotFoundException for non-existent character', () => {
      expect(() =>
        service.update('non-existent-id', { name: 'New Name' }),
      ).toThrow(NotFoundException);
    });

    it('should update character name', () => {
      const character = service.create({
        name: 'Gandalf',
        job: Job.MAGE,
      });

      const updated = service.update(character.id, {
        name: 'Gandalf the Grey',
      });
      expect(updated.name).toBe('Gandalf the Grey');
    });

    it('should update character job and recalculate stats', () => {
      const character = service.create({
        name: 'Gandalf',
        job: Job.MAGE,
      });

      const updated = service.update(character.id, { job: Job.WARRIOR });
      expect(updated.job).toBe(Job.WARRIOR);
      expect(updated.health).toBe(20); // Warrior's initial health
      expect(updated.currentHp).toBe(20);
    });

    it('should update currentHp', () => {
      const character = service.create({
        name: 'Gandalf',
        job: Job.MAGE,
      });

      const updated = service.update(character.id, { currentHp: 50 });
      expect(updated.currentHp).toBe(50);
    });
  });

  describe('remove', () => {
    it('should throw NotFoundException for non-existent character', () => {
      expect(() => service.remove('non-existent-id')).toThrow(
        NotFoundException,
      );
    });

    it('should remove a character', () => {
      const character = service.create({
        name: 'Gandalf',
        job: Job.MAGE,
      });

      service.remove(character.id);
      expect(() => service.findOne(character.id)).toThrow(NotFoundException);
    });
  });
});
