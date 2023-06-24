import CourseSectionTabs from './CourseSectionTabs';
import { Card, CardBody, VStack } from '@chakra-ui/react';
import { CourseParams } from './CourseDetailView';
import { Outlet, useParams } from 'react-router-dom';

const CourseSectionDetailView = () => {
  const { cityId } = useParams<CourseParams>()
  return (
    <Card>
      <CardBody>
        <VStack align="stretch">
          <CourseSectionTabs />
          <Outlet />
        </VStack>
      </CardBody>
    </Card>
  )
}

export default CourseSectionDetailView