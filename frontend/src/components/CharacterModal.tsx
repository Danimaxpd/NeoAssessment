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
} from '@chakra-ui/react';

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
                    <ModalHeader>{character.name}</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Stack spacing={4} align="start" pb={4}>
                            <Badge
                                colorScheme={character.currentHp > 0 ? 'green' : 'red'}
                                px={2}
                                py={1}
                                borderRadius="md"
                                fontSize="sm"
                            >
                                {character.currentHp > 0 ? 'Alive' : 'Dead'}
                            </Badge>
                            <Text>Job: {character.job}</Text>
                            <Text>Health: {character.currentHp}/{character.health}</Text>
                            <Text>Attack: {character.attack}</Text>
                            <Text>Defense: {character.defense}</Text>
                            <Text>Strength: {character.strength}</Text>
                            <Text>Dexterity: {character.dexterity}</Text>
                            <Text>Intelligence: {character.intelligence}</Text>
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