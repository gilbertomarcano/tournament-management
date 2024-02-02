import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams, Link } from 'react-router-dom';
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
} from '@chakra-ui/react';

interface Subject {
  id?: number;
  career: string;
  semester: number;
  name: string;
  code: string;
  prerequisites?: string[];
}

interface RouteParams {
  id: string;
}

function SubjectForm() {
  const { id } = useParams<RouteParams>();
  const [subject, setSubject] = useState<Subject>({
    career: '',
    semester: 1,
    name: '',
    code: '',
    prerequisites: [],
  });
  const [careers, setCareers] = useState<{ id: number; name: string }[]>([]);

  useEffect(() => {    
    const fetchCareers = async () => {
      const token = localStorage.getItem('token');
        
      axios.get(`${import.meta.env.VITE_BACKEND_URL}/syllabus/careers`, {
        headers: { Authorization: `Token ${token}` },
      })
          .then((response) => setCareers(response.data))
          .catch((error) => console.log(error));
    }
    
    const fetchSubject = async () => {
      if (id) {
        const token = localStorage.getItem('token');
        
        axios.get(`${import.meta.env.VITE_BACKEND_URL}/syllabus/subjects/${id}/`, {
          headers: { Authorization: `Token ${token}` },
        })
          .then(response => {
            const prerequisitesArray = response.data.prerequisites?.split(',').map(prerequisite => prerequisite.trim()) || [];
            setSubject(prevState => ({
              ...prevState,
              ...response.data,
              prerequisites: prerequisitesArray,
            }));
          })
          .catch(error => console.log(error));      
      }
    }

    fetchCareers();
    fetchSubject();
  }, [id]);
  
  const navigate = useNavigate();
  const toast = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'prerequisites') {
      // Separar los prerrequisitos por comas y eliminar espacios en blanco
      const prerequisitesArray = value.split(',').map(prerequisite => prerequisite.trim());
      setSubject(prevState => ({
        ...prevState,
        [name]: prerequisitesArray,
      }));
    } else {
      setSubject(prevState => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const prerequisitesString = subject.prerequisites?.join(',');
    
    if (id) {
      axios.put(`${import.meta.env.VITE_BACKEND_URL}/syllabus/subjects/${id}/`, {
        ...subject,
        prerequisites: prerequisitesString,
      }, {
        headers: { Authorization: `Token ${token}` },
      })
        .then(() => {
          toast({
            title: 'Success',
            description: 'Subject updated successfully',
            status: 'success',
            duration: 3000,
            isClosable: true,
          });
          navigate(`/syllabus`);
        })
        .catch(error => console.log(error));
    } else {
      axios.post(`${import.meta.env.VITE_BACKEND_URL}/syllabus/subjects/`, {
        ...subject,
        prerequisites: prerequisitesString,
      }, {
        headers: { Authorization: `Token ${token}` },
      })
        .then(() => {
          toast({
            title: 'Success',
            description: 'Subject created successfully',
            status: 'success',
            duration: 3000,
            isClosable: true,
          });
          navigate(`/syllabus`);
        })
        .catch(error => console.log(error));
    }
  };

  const handleCancel = async () => {    
    navigate('/syllabus');
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
          {id ? 'Editar Materia' : 'Crear Materia'}
        </Heading>

        <form onSubmit={handleSubmit}>
          <Stack spacing="6">
            <FormControl id="career">
              <FormLabel>Carrera:</FormLabel>
              <Select
                name="career"
                value={subject.career}
                onChange={handleChange}
              >
                <option value="" disabled selected>
                  Selecciona una carrera
                </option>
                {careers.map((career) => (
                  <option key={career.id} value={career.id}>
                    {career.name}
                  </option>
                ))}
              </Select>
            </FormControl>
            <FormControl id="semester">
              <FormLabel>Semestre:</FormLabel>
              <Input
                type="number"
                id="semester"
                name="semester"
                value={subject.semester}
                onChange={handleChange}
              />
            </FormControl>
            <FormControl id="name">
              <FormLabel>Nombre:</FormLabel>
              <Input
                type="text"
                id="name"
                name="name"
                value={subject.name}
                onChange={handleChange}
              />
            </FormControl>
            <FormControl id="code">
              <FormLabel>Código:</FormLabel>
              <Input
                type="text"
                id="code"
                name="code"
                value={subject.code}
                onChange={handleChange}
              />
            </FormControl>
            <FormControl id="prerequisites">
              <FormLabel>Prerrequisitos:</FormLabel>
              <Input
                type="text"
                id="prerequisites"
                name="prerequisites"
                value={subject.prerequisites?.join(', ')}
                onChange={handleChange}
              />
            </FormControl>
            <Button type="submit" colorScheme="teal" size="lg" fontSize="md">
              {id ? 'Guardar cambios' : 'Crear'}
            </Button>
            <Button onClick={handleCancel} colorScheme="teal" size="lg" fontSize="md" variant="outline">
              Cancelar
            </Button>
          </Stack>
        </form>
      </VStack>
    </Container>
  );
}

export default SubjectForm;
