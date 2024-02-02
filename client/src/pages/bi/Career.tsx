import * as React from 'react';
import { Box, Heading, VStack, Text } from '@chakra-ui/react';
import axios from 'axios';
import { VictoryScatter, VictoryChart, VictoryAxis, VictoryTheme } from 'victory';

const getInitials = (career) => {
    let words = career.split(' ');

    if(words.length === 1) {
        return career.substring(0, 3).toUpperCase();
    } else {
        return words
            .filter(word => !word.startsWith('En') && !word.startsWith('De'))
            .map(word => word[0])
            .join('')
            .toUpperCase();
    }
};

  
const BICareer = () => {
  const [data, setData] = React.useState([]);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/bi/career`, {
          headers: { Authorization: `Token ${token}` },
        });
        setData(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  return (
    <Box>
      <Heading mb={4}>Analisis de Carrera</Heading>
      <VictoryChart
        theme={VictoryTheme.material}
      >
        <VictoryAxis
          tickValues={data.map((item, i) => i)}
          tickFormat={data.map(item => getInitials(item.career))}
          style={{ tickLabels: { angle: -45, textAnchor: 'end' } }}
        />
        <VictoryAxis
          dependentAxis
          tickFormat={(x) => (`${x.toFixed(2)}`)}
        />
        <VictoryScatter
          data={data}
          x={(item, i) => i}
          y="average_grade"
          size={5}
        />
      </VictoryChart>
      <VStack align="start" mt={4}>
        {data.map((item, i) => (
          <Text key={i}>{`${getInitials(item.career)}: ${item.career}`}</Text>
        ))}
      </VStack>
    </Box>
  );
};

export default BICareer;
