import { HStack, Box, Image } from '@chakra-ui/react'
import { NavLink, useParams } from 'react-router-dom'
import { CourseParams } from './CourseDetailView'

const CourseSectionTabs = () => {
  const { cityId, sectionId } = useParams<CourseParams>()
  
  return (
    <HStack justify="center" spacing='5' >
      {[1, 2, 3, 4].map(i => (
        <NavLink key={i} to={`/admin/courses/${cityId}/${i}`}>
          {
            ({ isActive }) => (
              <Box borderBottom={isActive ? '4px' : '0'} borderColor='blue.400' pb='1'>
                <Image src={`http://localhost:4566/cs-resources/courses-section/course${i}.png`} />
              </Box>
            )
          }
        </NavLink>
      ))}
    </HStack>
  )
}

export default CourseSectionTabs