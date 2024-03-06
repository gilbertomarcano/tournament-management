import React, { useState, useEffect } from 'react';
import { Box, Button, VStack, Table, Thead, Tbody, Tr, Th, Td, Heading } from '@chakra-ui/react';
import { useNavigate, useParams } from 'react-router-dom';

interface Team {
  id: number;
  name: string;
  goals: number;
  goals_conceded: number;
  goals_difference: number;
  wins: number;
  losses: number;
  draws: number;
  points: number
}


const ViewGroups: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [groupData, setGroupData] = useState<{ [group: string]: Team[] }>({});
  const [tournament, setTournament] = useState<{ status: string } | null>(null);

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
          goals: team.fields.goals,
          goals_conceded: team.fields.goals_conceded,
          goals_difference: team.fields.goals_difference,
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

    const fetchTournamentData = async () => {
      // Fetch tournament data and handle response...
      // Assuming you get a response with tournament status
      const tournamentResponse = await fetch(`http://localhost:8000/tournaments/${id}`);
      const tournamentData = await tournamentResponse.json();
      setTournament(tournamentData);
      console.log(tournament)
    };


    fetchGroupData();
    fetchTournamentData()
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
    <Box minH="105vh" display="flex" alignItems="center" justifyContent="center" bg="gray.100">
      <VStack spacing={4} bg="white" p={8} borderRadius="lg" boxShadow="lg" width="full" maxW="lg">
        <Heading as="h2" size="lg" textAlign="center">Grupos</Heading>
        {['A', 'B', 'C', 'D'].map((group) => (
          <Box key={`Group ${group}`} w="full">
            <Heading as="h3" size="md" textAlign="center">{`Grupo ${group}`}</Heading>
            <Table variant="simple" size="sm">
              <Thead>
              <Tr>
                    <Th px={4}>Equipo</Th>
                    <Th isNumeric px={2}>V</Th>
                    <Th isNumeric px={2}>E</Th>
                    <Th isNumeric px={2}>D</Th>
                    <Th isNumeric px={2}>G</Th>
                    <Th isNumeric px={2}>GE</Th>
                    <Th isNumeric px={2}>GD</Th>
                    <Th isNumeric px={2} fontWeight="bold">Puntos</Th>
                  </Tr>
              </Thead>
              <Tbody>
                {groupData[group]?.map((team) => (
                 <Tr key={team.id}>
                      <Td px={4}>{team.name}</Td>
                      <Td isNumeric px={2}>{team.wins}</Td>
                      <Td isNumeric px={2}>{team.draws}</Td>
                      <Td isNumeric px={2}>{team.losses}</Td>
                      <Td isNumeric px={2}>{team.goals}</Td>
                      <Td isNumeric px={2}>{team.goals_conceded}</Td>
                      <Td isNumeric px={2}>{team.goals_difference}</Td>
                      <Td isNumeric px={2} fontWeight="bold">{team.points}</Td>
                    </Tr>
                ))}
              </Tbody>
            </Table>

          </Box>
        ))}
        <Button type="button" colorScheme="blue" width="full" onClick={handleSimulator} isDisabled={tournament?.fields.status === 'closed'}>Simular Fase de Grupos</Button>
        <Button type="button" colorScheme="red" width="full" onClick={handleBack}>Back</Button>
      </VStack>
    </Box>
  );
};

export default ViewGroups;
