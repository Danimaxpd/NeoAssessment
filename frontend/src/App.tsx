import { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Box, Container, Grid, GridItem, Heading, useToast, HStack } from '@chakra-ui/react';
import CharacterList from './components/CharacterList';
import BattleView from './components/BattleView';
import { apiService } from './services/api';
import { ThemeToggle } from './components/ThemeToggle';

function App() {
  const [isApiHealthy, setIsApiHealthy] = useState<boolean | null>(null);
  const toast = useToast();

  useEffect(() => {
    const checkApiHealth = async () => {
      try {
        await apiService.checkHealth();
        setIsApiHealthy(true);
      } catch (error) {
        console.error('API health check failed:', error);
        setIsApiHealthy(false);
        toast({
          title: 'API Error',
          description: 'Could not connect to the backend API',
          status: 'error',
          duration: null,
          isClosable: true,
        });
      }
    };

    checkApiHealth();
  }, [toast]);

  if (isApiHealthy === null) {
    return (
      <Box p={4} textAlign="center">
        Checking API connection...
      </Box>
    );
  }

  if (!isApiHealthy) {
    return (
      <Box p={4} textAlign="center">
        Unable to connect to the API. Please make sure the backend server is running.
      </Box>
    );
  }

  return (
    <Container maxW="container.xl" py={4} px={4}>
      <HStack mb={8} justify="space-between" align="center">
        <Heading textAlign={{ base: 'center', md: 'left' }}>Character Battle Simulator</Heading>
        <ThemeToggle />
      </HStack>
      <Grid
        templateColumns={{
          base: '1fr',
          md: '1fr',
          lg: '1fr'
        }}
        gap={6}
        minH="70vh"
      >
        <GridItem w="100%" minH="70vh">
          <Routes>
            <Route path="/" element={<CharacterList />} />
            <Route path="/battle/:character1Id/:character2Id" element={<BattleView />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </GridItem>
      </Grid>
    </Container>
  );
}

export default App;
