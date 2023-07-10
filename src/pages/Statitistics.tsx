import CountUp from 'react-countup';
import Filters from '../components/statitistics/Filters';
import StatCard from '../components/statitistics/StatCard';
import useAppContext from '../hooks/useAppContext';
import {
  HStack,
  SimpleGrid,
  Text,
  VStack
} from '@chakra-ui/react';
import { Outlet } from 'react-router-dom';
import StatCardList from '../components/statitistics/StatCardList';

export interface FormDatesValue {
  start: string
  end: string
}

const Statitistics = () => {
  return (
    <VStack w="full" align="stretch" spacing={4}>
      <Filters />
      <StatCardList />
      <Outlet />
    </VStack>
  )
}

export default Statitistics