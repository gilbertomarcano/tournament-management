import React, { useEffect, useState } from 'react';
import { Box, VStack, Heading, Table, Thead, Tbody, Tr, Th, Td, Button } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

interface Tournament {
    id: number;
    name: string;
    teamSize: number;
    status: string;
    startedAt: number;
}

const ViewTournament: React.FC = () => {
    const navigate = useNavigate();
    const [tournaments, setTournaments] = useState<Tournament[]>([]);

    useEffect(() => {
        // Fetch all tournaments when the component mounts
        const fetchTournaments = async () => {
            try {
                const response = await fetch('http://localhost:8000/tournaments/', {
                    method: 'GET'
                });
                if (!response.ok) {
                    // Handle HTTP errors here
                    console.error("Failed to fetch tournaments.");
                    return;
                }
                const responseData = await response.json();

                // Access the nested array within the 'data' property
                const data = responseData.data;

                // Check if data is an array
                if (!Array.isArray(data)) {
                    console.error("Fetched data is not an array.");
                    return;
                }

                // Map the response data to the Tournament interface
                const mappedTournaments: Tournament[] = data.map((tournament: any) => ({
                    id: tournament.pk,
                    name: tournament.fields.name,
                    teamSize: tournament.fields.team_size,
                    status: tournament.fields.status,
                    startedAt: tournament.fields.started_at,
                }));

                setTournaments(mappedTournaments);
            } catch (error) {
                console.error("Error fetching tournaments:", error);
            }
        };

        fetchTournaments();
    }, []); // Dependency array is empty, so it only runs once when the component mounts

    const handleViewTournament = (tournamentId: number) => {
        navigate(`/tournaments/${tournamentId}/groups`);
    };

    const handleBack = () => {
        navigate("/");
        window.location.reload();
    };

    return (
        <Box minH="100vh" display="flex" alignItems="center" justifyContent="center" bg="gray.100">
            <VStack spacing={4} bg="white" p={8} borderRadius="lg" boxShadow="lg" width="full" maxW="lg">
                <Heading as="h2" size="lg" textAlign="center">Tournaments</Heading>
                <Table variant="simple">
                    <Thead>
                        <Tr>
                            <Th>ID</Th>
                            <Th>Name</Th>
                            <Th>Team Size</Th>
                            <Th>Status</Th>
                            <Th>Action</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {tournaments.map((tournament) => (
                            <Tr key={tournament.id}>
                                <Td>{tournament.id}</Td>
                                <Td>{tournament.name}</Td>
                                <Td>{tournament.teamSize}</Td>
                                <Td>{tournament.status}</Td>
                                <Td>
                                    {/* Pass tournament id to handleViewTournament */}
                                    <Button colorScheme="blue" size="sm" onClick={() => handleViewTournament(tournament.id)}>View</Button>
                                </Td>
                            </Tr>
                        ))}
                    </Tbody>
                </Table>
                <Button type="button" colorScheme="red" width="full" onClick={handleBack}>Back</Button>
            </VStack>
        </Box>
    );
};

export default ViewTournament;
