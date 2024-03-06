import React, { useState } from 'react';
import { Box, Button, FormControl, FormLabel, Input, NumberInput, NumberInputField, VStack, useToast } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

const CreateTournament: React.FC = ({}) => {
  const [tournamentName, setTournamentName] = useState('');
  const [teamCount, setTeamCount] = useState(0);
  const toast = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const response = await fetch('http://localhost:8000/tournaments/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          'name': tournamentName,
          'team_size': teamCount,
        })
      });

      if (!response.ok) {
        throw new Error('Error');
      }

      const data = await response.json();
      toast({
        title: 'Tournament Created',
        description: `The tournament "${tournamentName}" with ${teamCount} teams has been created.`,
        status: 'success',
        duration: 9000,
        isClosable: true,
      });

      navigate(`/tournaments/${data.pk}`);
  };

  return (
    <Box minH="100vh" display="flex" alignItems="center" justifyContent="center" bg="gray.100">
      <Box as="form" onSubmit={handleSubmit} bg="white" p={8} borderRadius="lg" boxShadow="lg" width="full" maxW="md">
        <VStack spacing={4}>
          <FormControl isRequired>
            <FormLabel>Tournament Name</FormLabel>
            <Input value={tournamentName} onChange={(e) => setTournamentName(e.target.value)} placeholder="Enter tournament name" />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Number of Teams</FormLabel>
            <NumberInput min={9} max={16} defaultValue={teamCount} onChange={(value) => setTeamCount(parseInt(value))}>
              <NumberInputField placeholder="Enter number of teams" />
            </NumberInput>
          </FormControl>
          <Button type="submit" colorScheme="blue" width="full">Create Tournament</Button>
        </VStack>
      </Box>
    </Box>
  );
};

export default CreateTournament;
