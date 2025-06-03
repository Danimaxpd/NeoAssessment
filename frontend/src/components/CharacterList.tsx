import { useState, useEffect } from 'react';
import {
    Box,
    Text,
    Badge,
    Button,
    Stack,
    Center,
    Flex,
    Spacer,
    Card,
    CardBody,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    Checkbox,
} from '@chakra-ui/react';
import { AddIcon, DeleteIcon, HamburgerIcon } from '@chakra-ui/icons';
import type { Character } from '../services/api';
import { apiService } from '../services/api';
import CharacterModal from './CharacterModal';
import { useNavigate } from 'react-router-dom';

export default function CharacterList() {
    const [characters, setCharacters] = useState<Character[]>([]);
    const [selectedCharacters, setSelectedCharacters] = useState<Character[]>([]);
    const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
    const [isOpen, setIsOpen] = useState(false);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetchCharacters();
    }, []);

    const fetchCharacters = async () => {
        try {
            const data = await apiService.getAllCharacters();
            setCharacters(data);
        } catch (error) {
            console.error('Error fetching characters:', error);
        }
    };

    const handleCharacterClick = (character: Character, e: React.MouseEvent) => {
        if ((e.target as HTMLElement).closest('.card-checkbox') || (e.target as HTMLElement).closest('.card-menu')) {
            return;
        }
        setSelectedCharacter(character);
        setIsOpen(true);
    };

    const handleCharacterSelect = (character: Character, isChecked: boolean) => {
        if (character.currentHp <= 0) return;
        setSelectedCharacters((prev) => {
            if (isChecked) {
                if (prev.length >= 2) {
                    return [prev[1], character];
                }
                return [...prev, character];
            } else {
                return prev.filter((c) => c.id !== character.id);
            }
        });
    };

    const handleDeleteCharacter = async (characterId: string, e: React.MouseEvent) => {
        e.stopPropagation();
        try {
            await apiService.deleteCharacter(characterId);
            setCharacters(prev => prev.filter(c => c.id !== characterId));
            setSelectedCharacters(prev => prev.filter(c => c.id !== characterId));
        } catch (error) {
            console.error('Error deleting character:', error);
        }
    };

    const handleStartBattle = () => {
        if (selectedCharacters.length === 2) {
            const [char1, char2] = selectedCharacters as [Character, Character];
            navigate(`/battle/${char1.id}/${char2.id}`);
        }
    };

    const handleCreateSuccess = (newCharacter: Character) => {
        setCharacters(prev => [...prev, newCharacter]);
        setIsCreateOpen(false);
    };

    if (characters.length === 0) {
        return (
            <Center minH="60vh">
                <Card minW="320px" maxW="sm" p={8} boxShadow="md" borderRadius="lg">
                    <Stack spacing={6} align="center">
                        <Text fontSize="2xl" fontWeight="bold">No characters available</Text>
                        <Button
                            size="lg"
                            onClick={() => setIsCreateOpen(true)}
                        >
                            <AddIcon mr={2} />
                            Create Character
                        </Button>
                        <CharacterModal
                            isOpen={isCreateOpen}
                            onClose={() => setIsCreateOpen(false)}
                            onSuccess={handleCreateSuccess}
                            mode="create"
                        />
                    </Stack>
                </Card>
            </Center>
        );
    }

    return (
        <Box w="full">
            <Stack spacing={6} align="stretch" pb={4}>
                <Flex justify="space-between" wrap="wrap" gap={2}>
                    <Text fontSize="2xl" fontWeight="bold">
                        Characters
                    </Text>
                    <Flex gap={2}>
                        <Button
                            aria-label="Create character"
                            onClick={() => setIsCreateOpen(true)}
                            display={{ base: 'flex', md: 'none' }}
                        >
                            <AddIcon />
                        </Button>
                        <Button
                            onClick={() => setIsCreateOpen(true)}
                            display={{ base: 'none', md: 'flex' }}
                        >
                            <AddIcon mr={2} />
                            Create Character
                        </Button>
                        <Button
                            disabled={selectedCharacters.length !== 2}
                            onClick={handleStartBattle}
                            bg="battle.500"
                            color="white"
                            _hover={{
                                bg: "battle.600",
                            }}
                            _disabled={{
                                bg: "battle.200",
                                opacity: 0.7,
                                cursor: "not-allowed",
                                _hover: {
                                    bg: "battle.200",
                                },
                            }}
                        >
                            Start Battle
                        </Button>
                    </Flex>
                </Flex>
            </Stack>

            <Flex wrap="wrap" gap="24px" minH="60vh" w="full" justify="flex-start">
                {characters.map((character) => (
                    <Box key={character.id}>
                        <Card
                            minW="200px"
                            maxW="240px"
                            p={2}
                            borderRadius="lg"
                            boxShadow="md"
                            _hover={{ transform: 'translateY(-2px)', shadow: 'md' }}
                            transition="all 0.2s"
                            opacity={character.currentHp <= 0 ? 0.5 : 1}
                            onClick={(e: React.MouseEvent) => handleCharacterClick(character, e)}
                            borderWidth="0px"
                            overflow="hidden"
                        >
                            <Flex align="center" mb={2}>
                                <Checkbox
                                    className="card-checkbox"
                                    isChecked={selectedCharacters.some(c => c.id === character.id)}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                        handleCharacterSelect(character, e.target.checked)}
                                    isDisabled={character.currentHp <= 0}
                                    size="lg"
                                    mr={2}
                                    onClick={(e: React.MouseEvent) => e.stopPropagation()}
                                />
                                <Spacer />
                                <Menu>
                                    <MenuButton
                                        as={Button}
                                        variant="ghost"
                                        size="sm"
                                        className="card-menu"
                                        onClick={(e: React.MouseEvent) => e.stopPropagation()}
                                    >
                                        <HamburgerIcon />
                                    </MenuButton>
                                    <MenuList>
                                        <MenuItem
                                            color="red.500"
                                            onClick={(e: React.MouseEvent) => handleDeleteCharacter(character.id, e)}
                                        >
                                            <DeleteIcon mr={2} />
                                            Delete
                                        </MenuItem>
                                    </MenuList>
                                </Menu>
                            </Flex>
                            <CardBody>
                                <Stack spacing={2} align="start">
                                    <Text fontSize="lg" fontWeight="bold">
                                        {character.name}
                                    </Text>
                                    <Badge
                                        fontWeight="bold"
                                        px={2}
                                        py={0.5}
                                        borderRadius="md"
                                    >
                                        {character.currentHp > 0 ? 'ALIVE' : 'DEAD'}
                                    </Badge>
                                    <Text>{character.job}</Text>
                                    <Text>HP: {character.currentHp}/{character.health}</Text>
                                </Stack>
                            </CardBody>
                        </Card>
                    </Box>
                ))}
            </Flex>

            {selectedCharacter && (
                <CharacterModal
                    character={selectedCharacter}
                    isOpen={isOpen}
                    onClose={() => setIsOpen(false)}
                    mode="view"
                />
            )}
            <CharacterModal
                isOpen={isCreateOpen}
                onClose={() => setIsCreateOpen(false)}
                onSuccess={handleCreateSuccess}
                mode="create"
            />
        </Box>
    );
} 