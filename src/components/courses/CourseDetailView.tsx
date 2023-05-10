import AddCourseMenu from './AddCourseMenu';
import DataList from '../DataList';
import DataListItem from '../DataListItem';
import useFetch from '../../hooks/useFetch';
import {
  Card,
  CardBody,
  Text,
  VStack
} from '@chakra-ui/react';
import { Course } from '../../models/Course';
import { DeleteIcon } from '@chakra-ui/icons';
import { InputChangeEvent } from '../../shared/typeAlias';
import { useParams } from 'react-router-dom';
import { useCallback, useEffect, useState } from 'react';
import CourseSectionTabs from './CourseSectionTabs';

export interface CourseParams extends Record<string, string> {
  cityId: string
  sectionId: string
}

const filterCallback = (search: string) => {
  const regex = new RegExp(`^${search.toUpperCase()}[\\s\\w]*`)
  return (data: Course) => (
    search === "" || regex.test(data.name.toUpperCase())
  )
}

const CourseDetailView = () => {
  const { cityId, sectionId } = useParams<CourseParams>()
  const { data, loading, error, fetchData } = useFetch<Course[]>()
  const [searchValue, setSearchValue] = useState("")
  const handleSearch = useCallback(({ target: { value } }: InputChangeEvent) => {
    setSearchValue(value)
  }, [])
  const handleFilter = useCallback(filterCallback(searchValue), [searchValue])
  useEffect(() => {
    if (sectionId) {
      fetchData("/cities/:cityid/courses", { cityid: cityId }, { section: sectionId })
    }
  }, [sectionId])

  return (
    <Card>
      <CardBody>
        <VStack align="stretch">
          <CourseSectionTabs />
          {
            sectionId &&
            <AddCourseMenu isDisabled={loading} />
          }
          {
            data && sectionId ?
            <DataList<Course>
              list={data}
              error={!!error}
              onSearch={handleSearch}
              onFilter={handleFilter}
              searchValue={searchValue}
              isLoading={loading}>
              {
                ({ id, name }) => (
                  <DataListItem
                    key={id}
                    loading={loading}
                    onDelete={async () => { }}
                    options={{
                      icon: <DeleteIcon color="red.500" />
                    }}>
                    <Text>{name}</Text>
                  </DataListItem>
                )
              }
            </DataList> :
            <Text>Selecciona una sección</Text>
          }
        </VStack>
      </CardBody>
    </Card>
  )
}

export default CourseDetailView