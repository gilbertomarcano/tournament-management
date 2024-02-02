import * as React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router';
import { Container, HStack, Spinner, Avatar, Box, Button, Flex, Heading, Text, useColorModeValue, VStack } from '@chakra-ui/react';

const Home = () => {
  const [user, setUser] = React.useState(null);
  const [student, setStudent] = React.useState({})
  const fetchUserBg = useColorModeValue('gray.200', 'gray.600');
  const navigate = useNavigate();

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        var { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/users/me`, {
          headers: { Authorization: `Token ${token}` },
        });
        setUser(data);

        var { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/students/${data.student}`, {
          headers: { Authorization: `Token ${token}` },
        });
        setStudent(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/users/logout`, {}, {
        headers: { Authorization: `Token ${token}` },
      });
      localStorage.removeItem('token');
      navigate('/');
    } catch (err) {
      console.error(err);
    }
  };

  if (!user) {
    return <Spinner />;
  }

  return (
    <Container height="100vh" display="flex" flexDirection="column" justifyContent="center" alignItems="center">
      <Box
        bg={useColorModeValue('white', 'gray.800')}
        boxShadow={'2xl'}
        rounded={'xl'}
        p={6}
        overflow={'hidden'}
        width={{ base: '90%', md: '80%', lg: '60%' }}
      >
        <Flex justify="center" direction="column" align="center" mb={4}>
          <Avatar size="2xl" name={user.name} />
          <Heading fontSize="2xl" mt={4}>{user.first_name} {user.last_name}</Heading>
          <Text color={useColorModeValue('gray.500', 'gray.200')}>{student.career}</Text>
        </Flex>
        <VStack align="start" spacing={2} mb={4}>
          <Text fontSize="lg">Email: <b>{user.email}</b></Text>
          <Text fontSize="lg">Gender: <b>{student.gender}</b></Text>
          <Text fontSize="lg">Region: <b>{student.region}</b></Text>
          <Text fontSize="lg">National ID: <b>{student.national_id_prefix}-{student.national_id_number}</b></Text>
        </VStack>
        <VStack spacing={4}>
          <Button colorScheme="teal" size="lg" fontSize="md" width="80%" onClick={() => navigate(`/students/${student.id}/grades`)}>Notas</Button>
          {/* <Button colorScheme="teal" size="lg" fontSize="md" width="80%" onClick={() => navigate(`/students/${student.id}/courses`)}>My Current Courses</Button> */}
          <Button colorScheme="red" size="lg" fontSize="md" width="80%" onClick={handleLogout}>Cerrar Sesión</Button>
        </VStack>
      </Box>
    </Container>
  );
};

export default Home;