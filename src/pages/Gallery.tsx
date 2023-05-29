import { HStack } from '@chakra-ui/react'
import { Outlet } from 'react-router-dom'
import EventsView from '../components/gallery/EventsView'
import useAppContext from '../hooks/useAppContext'

const Gallery = () => {
  const { users } = useAppContext()
  return (
    <HStack align="start" w="full">
      <EventsView/>
      <Outlet/>
    </HStack>
  )
}

export default Gallery