import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
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

interface Subject {
  id: number;
  name: string;
  code: string;
}

function SubjectList() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_BACKEND_URL}/syllabus/subjects/`)
      .then(response => setSubjects(response.data))
      .catch(error => console.log(error));
  }, []);

  const handleDetails = (subjectId) => {
    navigate(`/syllabus/edit/${subjectId}`);
  };

  const handleCreate = () => {
    navigate(`/syllabus/create`);
  }

  const handleUpload = () => {
    navigate(`/syllabus/upload`);
  }

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
          Lista de Materias
        </Heading>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Nombre</Th>
              <Th>Código</Th>
              <Th>Carrera</Th>
              <Th>Semestre</Th>
              <Th>Prerrequisitos</Th>
              <Th>Acciones</Th>
            </Tr>
          </Thead>
          <Tbody>
            {subjects.map(subject => (
              <Tr key={subject.id}>
                <Td>{subject.name}</Td>
                <Td>{subject.code}</Td>
                <Td>{subject.career}</Td>
                <Td>{subject.semester}</Td>
                <Td>{subject.prerequisites || 'N/A'}</Td>
                <Td>
                  <Button onClick={() => handleDetails(subject.id)}>Detalles</Button>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
        <Button onClick={handleCreate} colorScheme="teal" size="lg" fontSize="md">
          Crear Materia
        </Button>
        <Button onClick={handleUpload} colorScheme="teal" size="lg" fontSize="md">
          Subir Materias
        </Button>
      </VStack>
    </Container>
  );
}

export default SubjectList;
