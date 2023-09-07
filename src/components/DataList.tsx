import { ReactNode, useMemo, useState } from 'react'
import { CSNextIcon, CSPreviousIcon, CSSearchUser } from '../icons/CSIcons'
import { ALWAYS_TRUE, BORDER } from '../shared/cs-constants'
import DataListItem from './DataListItem'
import {
  List, ListProps, Skeleton,
  VStack, HStack,
  Input, InputGroup, InputLeftAddon,
  ButtonGroup, Button, IconButton, Select, Text, Flex
} from '@chakra-ui/react'
import { InputChangeEvent } from '../shared/typeAlias'
import { clamp } from '../shared/utils'
import { WarningTwoIcon } from '@chakra-ui/icons'
import useAppContext from '../hooks/useAppContext'

export type DataListItem = typeof DataListItem

export interface DataListOptions {
  searchIcon?: ReactNode
  placeholder?: string
}

export interface DataListProps<T> extends Omit<ListProps, 'children'> {
  list: T[] | null
  isLoading: boolean
  error?: boolean
  searchValue: string
  options?: DataListOptions
  onSearch: (e: InputChangeEvent) => void
  onFilter?: (value: T) => boolean
  children: (data: T) => React.ReactElement<DataListItem>
}

const DataList = <T,>({ list, isLoading, error, searchValue, options, onFilter, onSearch, children, ...props }: DataListProps<T>) => {
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)  
  const filteredData = useMemo(() => list?.filter(onFilter ?? ALWAYS_TRUE) ?? [], [list, onFilter])
  const {users} = useAppContext()
  const handlePageChange = {
    previous: () => page > 1 ? setPage(page - 1) : setPage(1),
    next: () => page < Math.ceil(filteredData.length / pageSize) ? setPage(page + 1) : setPage(Math.ceil(filteredData.length / pageSize)),
    set: (index: number) => () => setPage(index)
  }

  console.log(Math.ceil(filteredData.length / pageSize))
  if (error) {
    return (
      <HStack fontSize='2xl'>
        <WarningTwoIcon/>
        <Text>Error</Text>
      </HStack>
    )
  }

  return (
    isLoading ?
      <List {...props} spacing="1" rounded="md">
        {[1, 2, 3, 4, 5].map(e => <Skeleton key={e} startColor="gray.100" endColor="gray.300" p="7" w="full" />)}
      </List> :
      <VStack align="stretch">
        <HStack>
          <InputGroup size="lg">
            <InputLeftAddon>
              {(options?.searchIcon) ?? <CSSearchUser boxSize="7" />}
            </InputLeftAddon>
            <Input placeholder={options?.placeholder ?? "Buscar usuario"} value={searchValue} onChange={onSearch} />
          </InputGroup>
          <Select w='24' value={pageSize} onChange={({ target: { value } }) => {
            setPageSize(Number(value))
            setPage(clamp(page, 1, Math.ceil(filteredData.length / Number(value))))
          }}>
            <option value={1}>1</option>
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={100}>100</option>
          </Select>
        </HStack>
        <List {...props} rounded="md" border={BORDER}>
          {
            filteredData.slice((page * pageSize) - pageSize, page * pageSize).map((e, i, a) =>
              <Flex key={i} borderBottom={i === a.length - 1 ? "none" : BORDER}>
                {children(e)}
              </Flex>)
          }
        </List>
        <ButtonGroup isAttached variant="outline" style={{alignSelf: "center"}}>
          <IconButton icon={<CSPreviousIcon />} aria-label='previous' onClick={handlePageChange.previous} isDisabled={page === 1} />
          {
            Array(Math.ceil(10))
              .fill('')
              .map((_e, i) => ( 
                  <Button key={i} isDisabled={i +1 +(page -5) > Math.ceil(filteredData.length / pageSize) || i +1 +(page -5) <=0} bg={i +1 +(page-5) === page ? "gray.200" : "white"} onClick={handlePageChange.set(i +1 +(page-5))}> {(i +1 +(page-5)) > 0  && (i +1 +(page-5)) <= Math.ceil((filteredData.length / pageSize)) ? i +1 +(page-5) : null }</Button>
              ))
          }
          <IconButton icon={<CSNextIcon />} aria-label='next' onClick={handlePageChange.next} isDisabled={page === Math.ceil(filteredData.length / pageSize)} />
        </ButtonGroup>
      </VStack >
      )
}

export default DataList