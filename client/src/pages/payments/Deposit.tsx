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
  HStack
} from "@chakra-ui/react";
import axios from "axios";
import { useNavigate, useParams } from "react-router";


const Deposit = () => {
  const [date, setDate] = useState("");
  const [reference, setReference] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [balance, setBalance] = useState("");
  const [users, setUsers] = useState([]);
  const { id } = useParams();

  useEffect(() => {
    const fetchPayment = async () => {
      try {
        const token = localStorage.getItem('token');
        const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/payments/${id}`, {
          headers: { Authorization: `Token ${token}` },
        });
        setDate(data.date);
        setReference(data.reference);
        setDescription(data.description);
        setAmount(data.amount);
        setBalance(data.balance);
        //if (data.user) setUsers(data.user);
      } catch (error) {
        // Handle error...
      }
    };

    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/users`, {
          headers: { Authorization: `Token ${token}` },
        });
        console.log(data.data)
        setUsers(data.data.map(({ id, username }) => [id, username]));
      } catch (error) {
        // Handle error...
      }
    };

    fetchPayment();
    fetchUsers();
  }, [id]);

  const toast = useToast();
  const navigate = useNavigate();

  const [state, setState] = React.useState({
    user: "",
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
      const { data } = await axios.post<{ token: string }>(`${import.meta.env.VITE_BACKEND_URL}/payments/verify/${id}`, {
        user: state.user
      }, {
        headers: { Authorization: `Token ${token}` },
      })
      navigate(`/payments`);
    } catch (error) {
      toast({
        title: "Verify error",
        description: error.response.data.message,
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
            <FormControl id="date">
                <FormLabel>Date</FormLabel>
                <Input
                name="date"
                type="date"
                required
                value={date}
                onChange={handleChange}
                readOnly
                />
            </FormControl>
            <FormControl id="reference">
                <FormLabel>Reference</FormLabel>
                <Input
                name="reference"
                type="reference"
                required
                value={reference}
                onChange={handleChange}
                readOnly
                />
            </FormControl>
            <FormControl id="description">
                <FormLabel>Description</FormLabel>
                <Input
                name="description"
                type="description"
                required
                value={description}
                onChange={handleChange}
                readOnly
                />
            </FormControl>
            <FormControl id="amount">
                <FormLabel>Amount</FormLabel>
                <Input
                name="amount"
                type="amount"
                required
                value={amount}
                onChange={handleChange}
                readOnly
                />
            </FormControl>
            <FormControl id="user">
                <FormLabel>User</FormLabel>
                <Select name="user" value={state.user} onChange={handleChange}>
                <option value="" disabled selected>Selecciona una usuario</option>
                  {users.map((user, index) => (
                    <option key={index} value={user[0]}>{user[1]}</option>
                  ))}
                </Select>
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

export default Deposit;