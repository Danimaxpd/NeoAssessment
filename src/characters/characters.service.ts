import {
  Injectable,
  NotFoundException,
  ConflictException,
  Logger,
} from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { Character, Job } from './entities/character.entity';
import { CreateCharacterDto } from './dto/create-character.dto';
import { UpdateCharacterDto } from './dto/update-character.dto';

@Injectable()
export class CharactersService {
  private characters: Map<string, Character> = new Map();
  private readonly logger = new Logger(CharactersService.name);

  create(createCharacterDto: CreateCharacterDto): Character {
    // Check for existing character with same name
    const existingCharacter = Array.from(this.characters.values()).find(
      (char) => char.name === createCharacterDto.name,
    );

    if (existingCharacter) {
      throw new ConflictException(
        `A character with name "${createCharacterDto.name}" already exists`,
      );
    }

    const id = uuidv4();
    const initialStats = Character.getInitialStats(createCharacterDto.job);

    const character = new Character({
      id,
      name: createCharacterDto.name,
      job: createCharacterDto.job,
      health: initialStats.health,
      attack: initialStats.attack,
      defense: initialStats.defense,
      strength: initialStats.strength,
      dexterity: initialStats.dexterity,
      intelligence: initialStats.intelligence,
      currentHp: initialStats.health,
    });

    character.attackModifier = character.calculateAttackModifier();
    character.speedModifier = character.calculateSpeedModifier();

    this.characters.set(id, character);
    return character;
  }

  findAll(): Character[] {
    return Array.from(this.characters.values());
  }

  findOne(id: string): Character {
    const character = this.characters.get(id);
    this.logger.debug(`Finding character with ID: ${id}`);
    if (!character) {
      throw new NotFoundException(`Character with ID ${id} not found`);
    }
    return character;
  }

  update(id: string, updateCharacterDto: UpdateCharacterDto): Character {
    this.logger.debug(`Updating character with ID: ${id}`);
    const character = this.findOne(id);

    if ('name' in updateCharacterDto) {
      character.name = updateCharacterDto.name as string;
    }

    if ('job' in updateCharacterDto) {
      character.job = updateCharacterDto.job as Job;
      const newStats = Character.getInitialStats(updateCharacterDto.job as Job);
      Object.assign(character, newStats);
      character.currentHp = newStats.health ?? 0;
      character.attackModifier = character.calculateAttackModifier();
      character.speedModifier = character.calculateSpeedModifier();
    }

    if ('currentHp' in updateCharacterDto) {
      character.currentHp = updateCharacterDto.currentHp as number;
    }
    this.logger.debug(
      `Updating characters ${JSON.stringify(Array.from(this.characters.values()))}`,
    );
    this.characters.set(id, character);
    this.logger.debug(
      `Updated characters ${JSON.stringify(Array.from(this.characters.values()))}`,
    );
    this.logger.debug(`Updated character ${JSON.stringify(character)}`);
    return character;
  }

  remove(id: string): void {
    if (!this.characters.has(id)) {
      throw new NotFoundException(`Character with ID ${id} not found`);
    }
    this.characters.delete(id);
  }
}
