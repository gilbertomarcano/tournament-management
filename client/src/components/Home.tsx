import React from 'react';
import { Box, Button, Text, VStack, useToast } from '@chakra-ui/react';

const Home: React.FC = () => {
  const toast = useToast();

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    window.location.reload()
    toast({
      title: 'Logout Successful',
      description: "You've been logged out successfully.",
      status: 'info',
      duration: 5000,
      isClosable: true,
    });
  };

  return (
    <Box minH="100vh" display="flex" alignItems="center" justifyContent="center" bg="gray.50">
      <Box bg="white" p={8} borderRadius="lg" boxShadow="lg" width="full" maxW="md">
        <VStack spacing={4}>
          <Text fontSize="2xl" color="blue.600">Welcome Home</Text>
          <Button colorScheme="blue" width="full" onClick={handleLogout}>Logout</Button>
        </VStack>
      </Box>
    </Box>
  );
};

export default Home;
