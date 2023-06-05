import { SimpleGrid, Text } from '@chakra-ui/react';
import { ReactNode } from 'react';

export interface GalleryGridProps<T> {
  list: T[] | null
  isLoading: boolean
  emptyMessage: string
  children: (key: T, name: string | null) => ReactNode
  mapName?: (key: T) => string
}

const GalleryGrid = <T,>({ list, isLoading, emptyMessage, children, mapName }: GalleryGridProps<T>) => {
  return (
    isLoading ?
      <Text>Cargado...</Text> :
      list ?
        <SimpleGrid w="full" columns={4} spacing={4}>
          {
            list.map(e =>  children(e, mapName ? mapName(e) : null))
          }
        </SimpleGrid> :
        <Text>{emptyMessage}</Text>
  )
}

export default GalleryGrid