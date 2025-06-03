import { useState } from 'react';
import type { Character, ApiError } from '../services/api';
import { apiService } from '../services/api';
import { Job } from '@common/enums/job.enum';
import {
    Button,
    Input,
    Stack,
    Text,
    Badge,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton,
    FormControl,
    FormLabel,
    Select,
    useToast,
    HStack,
    Flex,
    Box,
    SimpleGrid,
} from '@chakra-ui/react';
import { FaHeart } from 'react-icons/fa';
import { GiBroadsword, GiShield, GiMuscleUp, GiRunningShoe, GiBrain } from 'react-icons/gi';

interface CharacterModalProps {
    character?: Character;
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: (character: Character) => void;
    mode: 'view' | 'create';
}

export default function CharacterModal({ character, isOpen, onClose, onSuccess, mode }: CharacterModalProps) {
    const [formData, setFormData] = useState({
        name: '',
        job: Job.WARRIOR,
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const toast = useToast();

    const handleSubmit = async () => {
        if (!formData.name.trim()) {
            toast({
                title: 'Error',
                description: 'Character name is required',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
            return;
        }

        setIsSubmitting(true);
        try {
            const newCharacter = await apiService.createCharacter(formData);
            onSuccess?.(newCharacter);
            toast({
                title: 'Success',
                description: 'Character created successfully',
                status: 'success',
                duration: 5000,
                isClosable: true,
            });
            setFormData({
                name: '',
                job: Job.WARRIOR,
            });
        } catch (error) {
            const apiError = error as ApiError;
            toast({
                title: 'Error',
                description: apiError.message || 'Failed to create character',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    if (mode === 'view' && character) {
        return (
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Character Name: {character.name}</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Stack spacing={4} pb={2}>
                            <Flex align="center" justify="space-between" mb={2}>
                                <HStack>
                                    <Text fontSize="md" fontWeight="bold">Status:</Text>
                                    <Badge colorScheme={character.currentHp > 0 ? 'green' : 'red'} px={2} py={1} borderRadius="md">
                                        {character.currentHp > 0 ? 'ALIVE' : 'DEAD'}
                                    </Badge>
                                </HStack>
                                <Text fontSize="md" fontWeight="bold">Job: {character.job}</Text>
                            </Flex>
                            <Box>
                                <Text fontSize="md" fontWeight="bold" mb={2}>Stats:</Text>
                                <SimpleGrid columns={2} spacingX={6} spacingY={2}>
                                    <HStack><FaHeart color="#E53E3E" /><Text>HP: {character.currentHp} / {character.health}</Text></HStack>
                                    <HStack><GiBrain color="#805AD5" /><Text>Intelligence: {character.intelligence}</Text></HStack>
                                    <HStack><GiBroadsword color="#3182CE" /><Text>Attack: {character.attack}</Text></HStack>
                                    <HStack><GiMuscleUp color="#ECC94B" /><Text>Strength: {character.strength}</Text></HStack>
                                    <HStack><GiShield color="#718096" /><Text>Defense: {character.defense}</Text></HStack>
                                    <HStack><GiRunningShoe color="#38A169" /><Text>Dexterity: {character.dexterity}</Text></HStack>
                                </SimpleGrid>
                            </Box>
                        </Stack>
                    </ModalBody>
                </ModalContent>
            </Modal>
        );
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Create Character</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <Stack spacing={4} pb={4}>
                        <FormControl isRequired>
                            <FormLabel>Name</FormLabel>
                            <Input
                                value={formData.name}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                    setFormData(prev => ({ ...prev, name: e.target.value }))}
                                placeholder="Enter character name"
                            />
                        </FormControl>
                        <FormControl isRequired>
                            <FormLabel>Job</FormLabel>
                            <Select
                                value={formData.job}
                                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                                    setFormData(prev => ({ ...prev, job: e.target.value as Job }))}
                            >
                                {Object.values(Job).map((job) => (
                                    <option key={job} value={job}>
                                        {job}
                                    </option>
                                ))}
                            </Select>
                        </FormControl>
                        <Button
                            colorScheme="blue"
                            onClick={handleSubmit}
                            isLoading={isSubmitting}
                            loadingText="Creating..."
                            disabled={!formData.name.trim() || isSubmitting}
                        >
                            Create
                        </Button>
                    </Stack>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
} 