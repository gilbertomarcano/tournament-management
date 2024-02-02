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
  Button,
  HStack,
} from '@chakra-ui/react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';

const ListGrades = () => {
  const navigate = useNavigate();
  const [student, setStudent] = React.useState({})
  const [user, setUser] = React.useState({})
  const [grades, setGrades] = React.useState([]);
  const [page, setPage] = React.useState(1);
  const [totalPages, setTotalPages] = React.useState(1);

  const { id } = useParams();

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        var { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/students/${id}`, {
          headers: { Authorization: `Token ${token}` },
        });
        setStudent(data)
        setUser(data.user)

        var { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/grades/${id}`, {
          headers: { Authorization: `Token ${token}` },
        });
        setGrades(data);
        setTotalPages(Math.ceil(data.count / data.page_size));
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, [page]);

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
          Rendimiento Académico de {user.first_name} {user.last_name}
        </Heading>
        <Heading textAlign="center" size="l" fontWeight="extrabold">
          {student.national_id_prefix}-{student.national_id_number}
        </Heading>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Semestre</Th>
              <Th>Curso</Th>
              <Th>Calificación</Th>
            </Tr>
          </Thead>
          <Tbody>
            {grades.map((grade) => (
              <Tr key={grade.pk}>
                <Td>{grade.fields.term}</Td>
                <Td>{grade.fields.course_id}</Td>
                <Td>{grade.fields.grade}</Td>
                <Td>
                  {grade.grade && (
                    <Button onClick={() => handleGradesClick(grade.id)}>Aprobado</Button>
                  )}
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
        {/* <HStack spacing="4">
          <Button disabled={page === 1} onClick={() => setPage((current) => Math.max(current - 1, 1))}>
            Anterior
          </Button>
          <Button disabled={page === totalPages} onClick={() => setPage((current) => current + 1)}>
            Siguiente
          </Button>
        </HStack> */}
      </VStack>
    </Container>
  );
};

export default ListGrades;
