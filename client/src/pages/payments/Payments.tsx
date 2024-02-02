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

const PaymentList = () => {
  const navigate = useNavigate();
  const [payments, setPayments] = React.useState([]);
  const [page, setPage] = React.useState(1);
  const [totalPages, setTotalPages] = React.useState(1);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/payments?page=${page}`, {
          headers: { Authorization: `Token ${token}` },
        });
        setPayments(data.data);
        setTotalPages(Math.ceil(data.count / data.page_size));
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, [page]);

  const handleClaimClick = (paymentId) => {
    navigate(`/payments/deposit/${paymentId}`);
  };

  const handleDeposit = async () => {
    navigate(`/payments/deposit`);
  };

  const handleUpload = async () => {
    navigate(`/payments/upload`);
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
          Lista de Pagos
        </Heading>
        <Button onClick={handleDeposit} type="button" width="80%" colorScheme="teal" size="lg" fontSize="md">
          Ingresar deposito
        </Button>
        <Button onClick={handleUpload} type="button" width="80%" colorScheme="teal" size="lg" fontSize="md">
          Cargar depositos
        </Button>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Fecha</Th>
              <Th>Referencia</Th>
              <Th>Descripcion</Th>
              <Th>Monto</Th>
              <Th>Balance</Th>
              <Th>Usuario</Th>
            </Tr>
          </Thead>
          <Tbody>
            {payments.map((payment) => (
              <Tr key={payment.id}>
                <Td>{payment.date}</Td>
                <Td>{payment.reference}</Td>
                <Td>{payment.description}</Td>
                <Td>{payment.amount}</Td>
                <Td>{payment.balance}</Td>
                <Td>
                  {!payment.user && (
                    <Button onClick={() => handleClaimClick(payment.id)}>Reclamar</Button>
                  ) || (
                    payment.user
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

export default PaymentList;
