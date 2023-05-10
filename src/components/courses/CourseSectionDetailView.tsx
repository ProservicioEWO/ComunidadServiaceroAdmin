import { Box, Card, CardBody, HStack, Image, Text, VStack } from '@chakra-ui/react';
import { NavLink, Outlet, useParams } from 'react-router-dom';
import { CourseParams } from './CourseDetailView';

const CourseSectionDetailView = () => {
  const { cityId } = useParams<CourseParams>()
  return (
    <VStack align="stretch">
      {
        cityId ?
          <Outlet /> :
          <Card>
            <CardBody>
              <Text>Selecciona una ciudad</Text>
            </CardBody>
          </Card>
      }
    </VStack>
  )
}

export default CourseSectionDetailView