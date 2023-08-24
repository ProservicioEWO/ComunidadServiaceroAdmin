import SitesView from '../components/SitesView';
import { Box, HStack } from '@chakra-ui/react';
import { Outlet } from 'react-router-dom';

const Locations = () => {
  return (
    <HStack align="stretch" w="full">
      <SitesView />
      <Box w="full">
        <Outlet />
      </Box>
    </HStack>
  )
}

export default Locations