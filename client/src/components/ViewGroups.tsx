import React, { useState, useEffect } from 'react';
import { Box, Button, VStack, Table, Thead, Tbody, Tr, Th, Td, Heading } from '@chakra-ui/react';
import { useNavigate, useParams } from 'react-router-dom';

interface Team {
  id: number;
  name: string;
  goals: number;
  wins: number;
  losses: number;
  draws: number;
  points: number
}


const ViewGroups: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [groupData, setGroupData] = useState<{ [group: string]: Team[] }>({});

  useEffect(() => {
    const fetchGroupData = async () => {
      const groups = ['A', 'B', 'C', 'D'];
      const dataPromises = groups.map(async (group) => {
        const response = await fetch(`http://localhost:8000/tournaments/${id}/teams?group=${group}&order_by=-points`);
        if (!response.ok) {
          console.error(`Failed to fetch teams for group ${group}`);
          return [];
        }
        const responseData: { data: any[] } = await response.json();
        return responseData.data.map((team) => ({
          id: team.pk,
          name: team.fields.name,
          goals: team.fields.goals, // Assuming these fields are directly available
          wins: team.fields.wins,
          losses: team.fields.losses,
          draws: team.fields.draws,
          points: team.fields.points
        }));
      });

      const groupDataArray = await Promise.all(dataPromises);
      const groupDataObject: { [group: string]: Team[] } = {};
      groups.forEach((group, index) => {
        groupDataObject[group] = groupDataArray[index] || []; // Set an empty array if data for group is not available
      });

      setGroupData(groupDataObject);
    };


    fetchGroupData();
  }, [id]);

  const handleSimulator = async () => {
    const response = await fetch(`http://localhost:8000/tournaments/${id}/matches`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        simulate: 'groups',
      })
    });

    const data = await response.json();

  }
  const handleBack = () => {
    navigate("/");
    window.location.reload();
  };

  return (
    <Box minH="100vh" display="flex" alignItems="center" justifyContent="center" bg="gray.100">
      <VStack spacing={4} bg="white" p={8} borderRadius="lg" boxShadow="lg" width="full" maxW="lg">
        <Heading as="h2" size="lg" textAlign="center">View Groups</Heading>
        {['A', 'B', 'C', 'D'].map((group) => (
          <Box key={`Group ${group}`} w="full">
            <Heading as="h3" size="md" textAlign="center">{`Group ${group}`}</Heading>
            <Table variant="simple" size="sm">
              <Thead>
                <Tr>
                  <Th>Team Name</Th>
                  <Th isNumeric>Goals</Th>
                  <Th isNumeric>Wins</Th>
                  <Th isNumeric>Draws</Th>
                  <Th isNumeric>Losses</Th>
                  <Th isNumeric fontWeight="bold">Points</Th>
                </Tr>
              </Thead>
              <Tbody>
                {groupData[group]?.map((team) => (
                  <Tr key={team.id}>
                    <Td>{team.name}</Td>
                    <Td isNumeric>{team.goals}</Td>
                    <Td isNumeric>{team.wins}</Td>
                    <Td isNumeric>{team.draws}</Td>
                    <Td isNumeric>{team.losses}</Td>
                    <Td isNumeric fontWeight="bold">{team.points}</Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>

          </Box>
        ))}
        <Button type="button" colorScheme="blue" width="full" onClick={handleSimulator}>Simular Fase de Grupos</Button>
        <Button type="button" colorScheme="red" width="full" onClick={handleBack}>Back</Button>
      </VStack>
    </Box>
  );
};

export default ViewGroups;
