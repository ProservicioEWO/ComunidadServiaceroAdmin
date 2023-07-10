import CountUp from 'react-countup';
import StatCard from './StatCard';
import useAppContext from '../../hooks/useAppContext';
import { HStack, SimpleGrid, Text } from '@chakra-ui/react';

const StatCardList = () => {
  const { modules } = useAppContext()

  return (
    <SimpleGrid
      rounded="3xl"
      columns={4}
      spacing={6}
      bg="gray.500"
      p={8}>
      {
        modules.filtered?.map(({ id, name, color, logs }, i) => (
          <StatCard
            key={i}
            bg={color}
            title={name}
            to={id}
            value={logs.length} />
        ))
      }
      <HStack color="white">
        <Text opacity={0.8}>
          Visitas totales:
        </Text>
        <Text fontWeight="bold">
          <CountUp
            end={
              modules.filtered
                ?.map(e => e.logs.length)
                .reduce((a, b) => a + b, 0) ?? 0
            }
            duration={1} />
        </Text>
      </HStack>
    </SimpleGrid>
  )
}

export default StatCardList