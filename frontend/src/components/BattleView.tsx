import { useState, useEffect, useRef } from 'react';
import {
    Box,
    VStack,
    Text,
    Button,
    useToast,
    Container,
    Heading,
    Badge,
    Card,
    CardBody,
    Flex,
    Spacer,
} from '@chakra-ui/react';
import { useNavigate, useParams } from 'react-router-dom';
import { apiService } from '../services/api';
import type { BattleResult } from '../services/api';

export default function BattleView() {
    const { character1Id, character2Id } = useParams();
    const [battleResult, setBattleResult] = useState<BattleResult | null>(null);
    const [currentLogIndex, setCurrentLogIndex] = useState(0);
    const [isTyping, setIsTyping] = useState(false);
    const navigate = useNavigate();
    const toast = useToast();
    const hasFetched = useRef(false);

    useEffect(() => {
        if (hasFetched.current) return;
        hasFetched.current = true;
        const simulateBattle = async () => {
            try {
                if (!character1Id || !character2Id) {
                    throw new Error('Character IDs are required');
                }
                const result = await apiService.simulateBattle(character1Id, character2Id);
                setBattleResult(result);
                setIsTyping(true);
            } catch (error) {
                console.error('Error simulating battle:', error);
                toast({
                    title: 'Error',
                    description: 'Failed to simulate battle',
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                });
                navigate('/');
            }
        };
        simulateBattle();
    }, [character1Id, character2Id, navigate, toast]);

    useEffect(() => {
        if (!battleResult || !isTyping) return;
        const typingInterval = setInterval(() => {
            setCurrentLogIndex((prev) => {
                if (prev >= battleResult.battleLog.length - 1) {
                    setIsTyping(false);
                    clearInterval(typingInterval);
                    return prev;
                }
                return prev + 1;
            });
        }, 100);
        return () => clearInterval(typingInterval);
    }, [battleResult, isTyping]);

    const handleReturnHome = () => {
        navigate('/');
    };

    if (!battleResult) {
        return (
            <Container centerContent py={10}>
                <Text>Loading battle...</Text>
            </Container>
        );
    }

    return (
        <Container maxW="container.md" py={10}>
            <VStack spacing={8} align="stretch">
                <Heading textAlign="center">Battle Simulation</Heading>
                {/* Battle Summary */}
                <Card boxShadow="lg" borderRadius="lg" p={4} mb={4}>
                    <CardBody>
                        <Flex align="center" justify="space-between">
                            <Box textAlign="center">
                                <Text fontSize="lg" fontWeight="bold">
                                    {battleResult.winner.name}
                                </Text>
                                <Badge colorScheme="green" fontSize="sm" borderRadius="md" px={2}>
                                    Winner
                                </Badge>
                                <Text fontSize="sm" color="gray.400">
                                    HP: {battleResult.winner.currentHp}
                                </Text>
                            </Box>
                            <Spacer />
                            <Box textAlign="center">
                                <Text fontSize="lg" fontWeight="bold">
                                    {battleResult.loser.name}
                                </Text>
                                <Badge colorScheme="red" fontSize="sm" borderRadius="md" px={2}>
                                    Loser
                                </Badge>
                                <Text fontSize="sm" color="gray.400">
                                    HP: {battleResult.loser.currentHp}
                                </Text>
                            </Box>
                        </Flex>
                    </CardBody>
                </Card>
                {/* Battle Log */}
                <Card bg="gray.100" borderRadius="md" minH="300px" maxH="400px" overflowY="auto" p={6}>
                    <CardBody>
                        {battleResult.battleLog.slice(0, currentLogIndex + 1).map((log, index) => (
                            <Text key={index} mb={2} color="gray.700">
                                {log}
                            </Text>
                        ))}
                    </CardBody>
                </Card>
                {/* Winner Section */}
                {!isTyping && (
                    <Box textAlign="center">
                        <Heading size="md" mb={4} color="green.500">
                            {battleResult.winner.name} wins the battle!
                        </Heading>
                        <Button colorScheme="blue" onClick={handleReturnHome} size="lg">
                            Return to Character Selection
                        </Button>
                    </Box>
                )}
            </VStack>
        </Container>
    );
} 