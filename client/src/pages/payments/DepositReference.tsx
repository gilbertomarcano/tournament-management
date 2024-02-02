import * as React from "react";
import { useEffect, useState } from "react";
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Stack,
  VStack,
  Heading,
  useToast,
  Container,
  Select,
  useColorModeValue,
  HStack,
  StatHelpText
} from "@chakra-ui/react";
import axios from "axios";
import { useNavigate, useParams } from "react-router";


const DepositReference = () => {
  const [id, setId] = useState("");
  const [reference, setReference] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/users/me`, {
          headers: { Authorization: `Token ${token}` },
        });
        setId(response.data.id);
      } catch (error) {
        // Handle error...
      }
    };
    fetchUser();
  }, [id]);

  const toast = useToast();
  const navigate = useNavigate();

  const [state, setState] = React.useState({
    reference: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
  setState({ ...state, [e.target.name]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Add your own validation logic.
    // ...

    // Call your API to complete the signup.
    // ...
    try {
      const token = localStorage.getItem('token');
      const { } = await axios.post<{ token: string }>(`${import.meta.env.VITE_BACKEND_URL}/payments/verify`, {
        id: id,
        reference: state.reference
      }, {
        headers: { Authorization: `Token ${token}` },
      })
      navigate(`/payments`);
    } catch (error) {
      toast({
        title: "Verify error",
        //description: error.response.data.message,
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
  };

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
          Register Deposit
        </Heading>

        <form onSubmit={handleSubmit}>
          <Stack spacing="6">
            <FormControl id="reference">
                <FormLabel>Reference</FormLabel>
                <Input
                name="reference"
                type="reference"
                required
                value={state.reference}
                onChange={handleChange}
                inputMode="numeric"
                pattern="[0-9]*"
                />
            </FormControl>
            <Button type="submit" colorScheme="teal" size="lg" fontSize="md">
                Completar Registro
            </Button>
            <Button onClick={handleLogout} colorScheme="teal" size="lg" fontSize="md" variant="outline">
                Cerrar Sesión
            </Button>
          </Stack>
        </form>
      </VStack>
    </Container>
  );
};

export default DepositReference;