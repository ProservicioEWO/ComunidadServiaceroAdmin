import { Box, HStack, Image } from '@chakra-ui/react'
import { NavLink, useParams } from 'react-router-dom'
import { BASE_URL_IMG_CDN } from '../../shared/cs-constants'
import { CourseParams } from './CourseDetailView'

const CourseSectionTabs = () => {
  const { cityId, sectionId } = useParams<CourseParams>()

  return (
    <HStack justify="center" spacing='5' >
      {[1, 2, 3, 4].map(i => (
        <NavLink key={i} to={`/courses/${cityId}/${i}`} title=''>
          {
            ({ isActive }) => (
              <Box
                borderBottom={isActive ? '4px' : '0'}
                borderColor='blue.400' pb='1'>
                <Image src={`${BASE_URL_IMG_CDN}/courses-sections/course${i}.png`} />
              </Box>
            )
          }
        </NavLink>
      ))}
    </HStack>
  )
}

export default CourseSectionTabs