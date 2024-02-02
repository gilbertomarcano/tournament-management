import * as React from "react";
import { useEffect, useState } from "react";
import {
  Button,
  FormControl,
  FormLabel,
  VStack,
  Heading,
  Container,
  useToast,
} from '@chakra-ui/react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xls';

const UploadExcel = () => {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const toast = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast({
        title: 'Error',
        description: 'No file selected',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      const token = localStorage.getItem('token');
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/payments/upload`,
        formData,
        {
          headers: {
            Authorization: `Token ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      toast({
        title: 'Success',
        description: 'File uploaded successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      console.log('Response:', response.data);
      navigate(`/payments`);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to upload file',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      console.error('Error:', error);
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
        bg={'white'}
        spacing={6}
        width="100%"
        maxWidth={{ base: '90%', md: '80%', lg: '60%' }}
      >
        <Heading textAlign="center" size="xl" fontWeight="extrabold">
          Upload Excel
        </Heading>

        <FormControl>
          <FormLabel>Select Excel File</FormLabel>
          <input type="file" accept=".xlsx, .xls" onChange={handleFileChange} />
        </FormControl>

        <Button
          colorScheme="teal"
          size="lg"
          fontSize="md"
          onClick={handleUpload}
          disabled={!selectedFile}
        >
          Upload
        </Button>
      </VStack>
    </Container>
  );
};

export default UploadExcel;
