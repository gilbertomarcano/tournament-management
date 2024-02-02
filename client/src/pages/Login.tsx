import * as React from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Heading,
  useToast,
  useColorModeValue,
  VStack,
  Container,
} from '@chakra-ui/react';
import axios from 'axios';
import { useNavigate } from 'react-router';

const Login = () => {
  const url = import.meta.env.VITE_BACKEND_URL;
  const toast = useToast();
  const navigate = useNavigate();
  const formBg = useColorModeValue('gray.200', 'gray.600');

  const [state, setState] = React.useState({
    username: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setState({ ...state, [e.target.name]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!state.username || !state.password) {
      toast({
        title: 'Invalid Input',
        description: 'Both username and password must be provided.',
        status: 'error',
        duration: 9000,
        isClosable: true,
      });
    } else {
      const { data } = await axios.post<{ token: string }>(`${import.meta.env.VITE_BACKEND_URL}/users/auth`, {
        username: state.username,
        password: state.password,
      });

      localStorage.setItem('token', data.token);
      const userData = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/users/me`, {
        headers: { Authorization: `Token ${data.token}` },
      });
      if (userData.data.is_staff) {
        navigate('/admin');
      } else {
        if (userData.data.student) {
          navigate('/home');
        } else {
          alert('Contact Admin')
        }
      }
    }
  };

  return (
    <Container
      height="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
    >
      <VStack
        boxShadow={'2xl'}
        p={8}
        rounded={'xl'}
        bg={useColorModeValue('white', 'gray.800')}
        spacing={6}
        width="100%"
        maxWidth={{ base: '90%', md: '80%', lg: '60%' }}
      >
        <Heading textAlign="center" size="xl" fontWeight="extrabold">
          Bienvenido
        </Heading>
        <form onSubmit={handleSubmit}>
          <Stack spacing="6">
            <FormControl id="username">
              <FormLabel>Correo</FormLabel>
              <Input
                name="username"
                type="username"
                autoComplete="username"
                required
                value={state.username}
                onChange={handleChange}
              />
            </FormControl>
            <FormControl id="password">
              <FormLabel>Contraseña</FormLabel>
              <Input
                name="password"
                type="password"
                required
                value={state.password}
                onChange={handleChange}
              />
            </FormControl>
            <Button type="submit" colorScheme="teal" size="lg" fontSize="md">
              Iniciar Sesión
            </Button>
          </Stack>
        </form>
      </VStack>
    </Container>
  );
};

export default Login;