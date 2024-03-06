import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Box, Button, FormControl, FormLabel, Input, VStack, Text, Heading } from '@chakra-ui/react';

const CreateTeams: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [tournamentDetails, setTournamentDetails] = useState<{ name: string, teamSize: number, enrolledTeamSize: number }>({
        name: '',
        teamSize: 0,
        enrolledTeamSize: 0,
    });
    const [teamName, setTeamName] = useState(''); // Added teamName state
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch tournament details when the component mounts
        const fetchTournamentDetails = async () => {
            const response = await fetch(`http://localhost:8000/tournaments/${id}`, {
                method: 'GET'
            });
            if (!response.ok) {
                // Handle HTTP errors here
                console.error("Failed to fetch tournament details.");
                return;
            }
            const data = await response.json();

            // Check if teamSize equals enrolledTeamSize, and if so, navigate to ViewGroups
            if (data.fields.team_size === data.fields.enrolled_team_size) {
                navigate(`/tournaments/${id}/groups`);
            }

            setTournamentDetails({
                name: data.fields.name,
                teamSize: data.fields.team_size,
                enrolledTeamSize: data.fields.enrolled_team_size,
            });
        };

        fetchTournamentDetails();
    }, [id, navigate]); // Dependency array to re-run the effect if the id changes

    const handleSubmit = async (e: React.FormEvent) => {
        const response = await fetch(`http://localhost:8000/tournaments/${id}/teams`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                'name': teamName,
            })
        });

        if (!response.ok) {
            throw new Error('Login failed');
        }

        const data = await response.json();
        window.location.reload()

    };

    const handleBack = () => {
        navigate("/")
        window.location.reload()
    };


    return (
        <Box minH="100vh" display="flex" alignItems="center" justifyContent="center" bg="gray.100">
            <Box as="form" onSubmit={handleSubmit} bg="white" p={8} borderRadius="lg" boxShadow="lg" width="full" maxW="md">
                <VStack spacing={4}>
                    <Heading as="h2" size="lg" textAlign="center">{tournamentDetails.name}</Heading>
                    <FormControl isRequired>
                        <FormLabel>Team Name</FormLabel>
                        <Input placeholder="Enter team name" value={teamName} onChange={(e) => setTeamName(e.target.value)} />
                    </FormControl>
                    <Text>
                        Enrolled Teams: {tournamentDetails.enrolledTeamSize}/{tournamentDetails.teamSize}
                    </Text>
                    <Button type="submit" colorScheme="blue" width="full">Add Team</Button>
                    <Button type="button" colorScheme="red" width="full" onClick={handleBack}>Back</Button>
                </VStack>
            </Box>
        </Box>
    );
};

export default CreateTeams;
