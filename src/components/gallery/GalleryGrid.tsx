import { SimpleGrid, Text } from '@chakra-ui/react';
import { ReactNode } from 'react';
import { PulseLoader } from 'react-spinners';

export interface GalleryGridProps<T> {
  list: T[] | null
  isLoading: boolean
  emptyMessage: string
  children: (key: T, name: string | null, index?: number) => ReactNode
  mapName?: (key: T) => string
}

const GalleryGrid = <T,>({ list, isLoading, emptyMessage, children, mapName }: GalleryGridProps<T>) => {
  return (
    isLoading ?
      <PulseLoader
        color="#6461ff"
        size={10}
      /> :
      list ?
        <SimpleGrid w="full" columns={4} spacing={4}>
          {
            list.map((e, i) => children(e, mapName ? mapName(e) : null, i))
          }
        </SimpleGrid> :
        <Text>{emptyMessage}</Text>
  )
}

export default GalleryGrid