import CitiesView from '../components/CitiesView';
import { Box, HStack } from '@chakra-ui/react';
import { Outlet } from 'react-router-dom';

const Courses = () => {
  return (
    <HStack align="stretch" w="full">
      <CitiesView />
      <Box w="full">
        <Outlet />
      </Box>
    </HStack>
  )
}

export default Courses