import React, { useState } from 'react';
import { Box, Button, FormControl, FormLabel, Input, NumberInput, NumberInputField, VStack, useToast } from '@chakra-ui/react';

const CreateTournament: React.FC = ({ onTournamentCreated }) => {
  const [tournamentName, setTournamentName] = useState('');
  const [teamCount, setTeamCount] = useState(0);
  const toast = useToast();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Implement the logic to create a tournament here
    // For example, sending the data to your backend
    toast({
      title: 'Tournament Created',
      description: `The tournament "${tournamentName}" with ${teamCount} teams has been created.`,
      status: 'success',
      duration: 9000,
      isClosable: true,
    });

    // Optionally, call onTournamentCreated to update the parent component or redirect
    onTournamentCreated();
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
            <NumberInput min={2} max={32} defaultValue={teamCount} onChange={(value) => setTeamCount(parseInt(value))}>
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
