import LocationMenuListItem from './LocationMenuListItem';
import { BORDER } from '../../shared/cs-constants';
import {
  Box,
  HStack,
  Icon,
  Text,
  VStack,
  Spinner,
  Flex
} from '@chakra-ui/react';
import { TiLocation } from 'react-icons/ti';

export type LocationMenuListItem = typeof LocationMenuListItem

export interface LocationMenuListProps<T> {
  dataList: T[],
  isLoading: boolean,
  children: (data: T) => React.ReactElement<LocationMenuListItem>
}

const LocationMenuList = <T,>({ dataList, isLoading, children }: LocationMenuListProps<T>) => {
  return (
    <Box w="xs" rounded="md" overflow="hidden" shadow="sm" border={BORDER} bg="white">
      <HStack bg="#152536" color="white" p="2">
        <Icon boxSize="8" as={TiLocation} />
        <Text fontSize="xl" fontWeight="bold">Ciudades</Text>
      </HStack>
      {
        isLoading ?
          <Flex p="2" flexDirection='column' align="center">
            <Spinner thickness='5px' color='teal.400' size='lg' />
            <Text>Cargando ciudades...</Text>
          </Flex> :
          <VStack spacing={0} align="stretch">
            {
              dataList.map((e, i, a) => (
                <Box key={i} borderBottom={a.length > i + 1 ? BORDER : ""}>
                  {children(e)}
                </Box>
              ))
            }
          </VStack>
      }
    </Box>
  )
}

export default LocationMenuList