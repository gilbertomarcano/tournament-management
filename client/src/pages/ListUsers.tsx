import * as React from 'react';
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Container,
  Heading,
  VStack,
  Input,
  Button,
  HStack,
} from '@chakra-ui/react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ListUsers = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = React.useState(''); // Search term state
  const [debouncedSearchTerm, setDebouncedSearchTerm] = React.useState(searchTerm);
  const [users, setUsers] = React.useState([]);
  const [page, setPage] = React.useState(1);
  const [totalPages, setTotalPages] = React.useState(1);

  React.useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500); // 500ms delay

    return () => {
      clearTimeout(timerId);
    };
  }, [searchTerm]);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/users/?page=${page}&search=${debouncedSearchTerm}`, {
          headers: { Authorization: `Token ${token}` },
        });
        setUsers(data.data);
        setTotalPages(Math.ceil(data.count / data.page_size));
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, [page, debouncedSearchTerm]);

  const handleDraftClick = (userId: number) => {
    navigate(`/signup/${userId}/complete`);
  };

  const handleGradesClick = (studentId: number) => {
    console.log(studentId)
    navigate(`/students/${studentId}/grades`)
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
        p={8}
        spacing={6}
        width="100%"
        maxWidth={{ base: '90%', md: '80%', lg: '60%' }}
      >
        <Heading textAlign="center" size="xl" fontWeight="extrabold">
          Lista de Usuarios
        </Heading>
        <Input // Add search input
          placeholder="Buscar usuario..."
          value={searchTerm}
          onChange={(e) => {console.log("search"); setSearchTerm(e.target.value)}}
        />
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Nombre</Th>
              <Th>Apellido</Th>
              <Th>Correo</Th>
              <Th>Es Estudiante?</Th>
              <Th>Acción</Th>
              <Th>Notas</Th>
            </Tr>
          </Thead>
          <Tbody>
            {users.map((user) => (
              <Tr key={user.id}>
                <Td>{user.first_name}</Td>
                <Td>{user.last_name}</Td>
                <Td>{user.email}</Td>
                <Td>{user.student ? 'Sí' : 'No'}</Td>
                <Td>
                  {!user.student && !user.is_staff && (
                    <Button onClick={() => handleDraftClick(user.id)}>Borrador</Button>
                  )}
                </Td>
                <Td>
                  {user.student && (
                    <Button onClick={() => handleGradesClick(user.student)}>Ver Notas</Button>
                  )}
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
        <HStack spacing="4">
          <Button disabled={page === 1} onClick={() => setPage((current) => Math.max(current - 1, 1))}>
            Anterior
          </Button>
          <Button disabled={page === totalPages} onClick={() => setPage((current) => current + 1)}>
            Siguiente
          </Button>
        </HStack>
      </VStack>
    </Container>
  );
};

export default ListUsers;
