import CitiesView from '../components/CitiesView';
import { Box, Card, CardBody, HStack, Text } from '@chakra-ui/react';
import { Outlet, useParams } from 'react-router-dom';
import { LocationParams } from '../components/locations/LocationDetailView';
import useAppContext from '../hooks/useAppContext';

const Locations = () => {
  const { cityId } = useParams<LocationParams>()
  const { cities } = useAppContext()
  return (
    <HStack align="stretch" w="full">
      <CitiesView />
      <Box w="full">
        <Outlet />
      </Box>
    </HStack>
  )
}

export default Locations