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


const CompleteSignup = () => {
  const [name, setName] = useState("");
  const [careers, setCareers] = useState([]);
  const [regions, setRegions] = useState([]);
  const [genders, setGenders] = useState([]);
  const [nationalIdPrefixes, setNationalIdPrefixes] = useState(["V", "E"]);
  const { id } = useParams();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/users/${id}`, {
          headers: { Authorization: `Token ${token}` },
        });
        setName(data.first_name);
      } catch (error) {
        // Handle error...
      }
    };

    const fetchOptions = async () => {
      try {
        const token = localStorage.getItem('token');
        const careerResponse = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/students/careers`, {
          headers: { Authorization: `Token ${token}` },
        });
        setCareers(careerResponse.data);
        
        const regionResponse = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/students/regions`, {
          headers: { Authorization: `Token ${token}` },
        });
        console.log(regionResponse.data)
        setRegions(regionResponse.data);

        const genderResponse = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/students/genders`, {
          headers: { Authorization: `Token ${token}` },
        });
        setGenders(genderResponse.data);
      } catch (error) {
        // Handle error...
      }
    };


    fetchOptions();
    fetchUser();
  }, [id]);

  const toast = useToast();
  const navigate = useNavigate();

  const [state, setState] = React.useState({
    career: "",
    region: "",
    gender: "",
    nationalIdPrefix: nationalIdPrefixes[0],
    nationalIdNumber: "",
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
      const {} = await axios.post<{ token: string }>(`${import.meta.env.VITE_BACKEND_URL}/students/`, {
        user: id,
        career: state.career,
        region: state.region,
        gender: state.gender,
        national_id_prefix: state.nationalIdPrefix,
        national_id_number: state.nationalIdNumber
      }, {
        headers: { Authorization: `Token ${token}` },
      })
      navigate(`/admin`);
    } catch (error) {
      toast({
        title: "Sign up error",
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
          Complete {name}'s Information
        </Heading>

        <form onSubmit={handleSubmit}>
          <Stack spacing="6">
            <FormControl id="career">
                <FormLabel>Career</FormLabel>
                <Select name="career" value={state.career} onChange={handleChange}>
                <option value="" disabled selected>Selecciona una carrera</option>
                  {careers.map((career, index) => (
                    <option key={index} value={career[0]}>{career[1]}</option>
                  ))}
                </Select>
            </FormControl>
            <FormControl id="region">
                <FormLabel>Region</FormLabel>
                <Select name="region" value={state.region} onChange={handleChange}>
                <option value="" disabled selected>Selecciona una region</option>
                  {regions.map((region, index) => (
                    <option key={index} value={region[0]}>{region[1]}</option>
                  ))}
                </Select>
            </FormControl>
            <FormControl id="gender">
                <FormLabel>Gender</FormLabel>
                <Select name="gender" value={state.gender} onChange={handleChange}>
                <option value="" disabled selected>Selecciona un género</option>
                  {genders.map((gender, index) => (
                    <option key={index} value={gender[0]}>{gender[1]}</option>
                  ))}
                </Select>
            </FormControl>
            <FormControl id="nationalId">
                <FormLabel>National ID</FormLabel>
                <HStack spacing="24px">
                    <Select name="nationalIdPrefix" value={state.nationalIdPrefix} onChange={handleChange}>
                      {nationalIdPrefixes.map((prefix) => (
                        <option key={prefix} value={prefix}>{prefix}</option>
                      ))}
                    </Select>
                    <Input
                        name="nationalIdNumber"
                        type="text"
                        required
                        value={state.nationalIdNumber}
                        onChange={handleChange}
                    />
                </HStack>
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

export default CompleteSignup;