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
import { MdEventAvailable } from 'react-icons/md';
import EventsMenuListItem from './EventsMenuListItem';

export type EventsMenuItem = typeof EventsMenuListItem

export interface EventsMenuListProps<T> {
  dataList: T[] | null,
  isLoading: boolean,
  children: (data: T) => React.ReactElement<EventsMenuItem>
}

const EventsMenuList = <T,>({ dataList, isLoading, children }: EventsMenuListProps<T>) => {
  return (
    <Box w="xs" rounded="md" overflow="hidden" shadow="sm" border={BORDER} bg="white">
      <HStack bg="#152536" color="white" p="2">
        <Icon boxSize="8" as={MdEventAvailable} />
        <Text fontSize="xl" fontWeight="bold">Eventos</Text>
      </HStack>
      {
        isLoading ?
          <Flex p="2" flexDirection='column' align="center">
            <Spinner thickness='5px' color='teal.400' size='lg' />
            <Text>Cargando eventos...</Text>
          </Flex> :
          <VStack spacing={0} align="stretch">
            {
              dataList?.map((e, i, a) => (
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

export default EventsMenuList