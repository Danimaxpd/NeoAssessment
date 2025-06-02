import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
} from '@nestjs/common';
import { CharactersService } from './characters.service';
import { CreateCharacterDto } from './dto/create-character.dto';
import { UpdateCharacterDto } from './dto/update-character.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { Character } from './entities/character.entity';

@ApiTags('characters')
@Controller('characters')
export class CharactersController {
  constructor(private readonly charactersService: CharactersService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new character' })
  @ApiBody({ type: CreateCharacterDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Character successfully created',
    type: Character,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid character data',
  })
  create(@Body() createCharacterDto: CreateCharacterDto) {
    return this.charactersService.create(createCharacterDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all characters' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Return all characters',
    type: [Character],
  })
  findAll() {
    return this.charactersService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a character by id' })
  @ApiParam({
    name: 'id',
    description: 'Character ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Return the character',
    type: Character,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Character not found',
  })
  findOne(@Param('id') id: string) {
    return this.charactersService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a character' })
  @ApiParam({
    name: 'id',
    description: 'Character ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiBody({ type: UpdateCharacterDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Character successfully updated',
    type: Character,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Character not found',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid update data',
  })
  update(
    @Param('id') id: string,
    @Body() updateCharacterDto: UpdateCharacterDto,
  ) {
    return this.charactersService.update(id, updateCharacterDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a character' })
  @ApiParam({
    name: 'id',
    description: 'Character ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Character successfully deleted',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Character not found',
  })
  remove(@Param('id') id: string) {
    return this.charactersService.remove(id);
  }
}
