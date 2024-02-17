import React, { useEffect, useState } from 'react';
import { Box, VStack, Avatar, Text, Button, HStack, Badge, Divider } from '@chakra-ui/react';
import { useToast } from '@chakra-ui/react';

const Home: React.FC = () => {
  const [userData, setUserData] = useState(null);
  const toast = useToast();

  useEffect(() => {
    const fetchData = async () => {
      const authToken = localStorage.getItem('authToken');
      try {
        const response = await fetch('http://localhost:8000/users/me', {
          method: 'GET',
          headers: {
            'Authorization': `Token ${authToken}`,
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }
        const data = await response.json();
        setUserData(data.fields); // Assuming the structure as per your example
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to load user data.',
          status: 'error',
          duration: 9000,
          isClosable: true,
        });
      }
    };

    fetchData();
  }, [toast]);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    window.location.reload()
  };

  return (
    <Box minH="100vh" display="flex" alignItems="center" justifyContent="center" bg="gray.100">
      <Box maxW="sm" borderWidth="1px" borderRadius="lg" overflow="hidden" bg="white" p={6} boxShadow="xl">
        <VStack spacing={4} align="stretch">
          <Box textAlign="center">
            <Avatar name={userData ? `${userData.first_name} ${userData.last_name}` : 'User'} size="xl" mb={4} />
            <Text fontSize="2xl" fontWeight="bold" color="blue.600">
              {userData ? `${userData.first_name} ${userData.last_name}` : 'User'}
            </Text>
            <Text fontSize="md" color="gray.500">{userData ? userData.email : 'Loading...'}</Text>
          </Box>
          <Box py={4}>
            <Divider />
          </Box>
          <Box>
            <HStack justifyContent="space-between">
              <Text fontSize="md" fontWeight="semibold">Username</Text>
              <Text fontSize="md" color="gray.600">{userData ? userData.username : 'Loading...'}</Text>
            </HStack>
            <HStack justifyContent="space-between">
              <Text fontSize="md" fontWeight="semibold">Status</Text>
              <Badge colorScheme={userData?.is_superuser ? "green" : "red"}>
                {userData?.is_superuser ? "Superuser" : "Standard User"}
              </Badge>
            </HStack>
            <HStack justifyContent="space-between">
              <Text fontSize="md" fontWeight="semibold">Last Login</Text>
              <Text fontSize="md" color="gray.600">{userData ? new Date(userData.last_login).toLocaleString() : 'Loading...'}</Text>
            </HStack>
            <HStack justifyContent="space-between">
              <Text fontSize="md" fontWeight="semibold">Joined</Text>
              <Text fontSize="md" color="gray.600">{userData ? new Date(userData.date_joined).toLocaleString() : 'Loading...'}</Text>
            </HStack>
          </Box>
          <Button colorScheme="blue" width="full" mt={4} onClick={handleLogout}>Logout</Button>
        </VStack>
      </Box>
    </Box>
  );
};

export default Home;
