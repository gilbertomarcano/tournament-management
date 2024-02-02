import * as React from 'react';
import { Box, Heading, Select } from '@chakra-ui/react';
import axios from 'axios';
import { VictoryBar, VictoryChart, VictoryAxis, VictoryTheme } from 'victory';

const BIAnalysis = () => {
  const [data, setData] = React.useState({});
  const [selectedTerm, setSelectedTerm] = React.useState('1');

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const params = { term: selectedTerm };
        const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/bi/performance`, {
          headers: { Authorization: `Token ${token}` },
          params
        });
        setData(data);
        console.log(data)
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, [selectedTerm]);

  const handleChange = (event) => {
    setSelectedTerm(event.target.value);
  };

  return (
    <Box>
      <Heading mb={4}>Analisis de Rendimiento</Heading>
      <Select onChange={handleChange} mb={4}>
        <option value="1">Term 1</option>
        <option value="2">Term 2</option>
        <option value="3">Term 3</option>
      </Select>
      {data.grade_distribution ? (
        <Box mb={4} key={data.term}>
          <Heading size="md" mb={2}>Term {data.term}</Heading>
          <VictoryChart
            theme={VictoryTheme.material}
            domainPadding={20}
          >
            <VictoryAxis
              tickValues={data.grade_distribution.map((gd, i) => i)}
              tickFormat={data.grade_distribution.map(gd => gd.range)}
            />
            <VictoryAxis
              dependentAxis
              tickFormat={(x) => (`${x}`)}
            />
            <VictoryBar
              data={data.grade_distribution}
              x={(gd, i) => i}
              y="count"
              style={{ data: { width: 20 } }}
            />
          </VictoryChart>
        </Box>
      ) : (
        <div>Loading...</div>
      )}
    </Box>
  );
};

export default BIAnalysis;
