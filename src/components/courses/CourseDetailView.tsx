import AddCourseMenu from './AddCourseMenu';
import DataList from '../DataList';
import DataListItem from '../DataListItem';
import ExternalForm, { ExternalFormValues } from './ExternalForm';
import FormModal from './FormModal';
import InternalForm, { InternalFormValues } from './InternalForm';
import useAppContext from '../../hooks/useAppContext';
import useCustomToast from '../../hooks/useCustomToast';
import useInsertData from '../../hooks/useInsertData';
import { AiFillFire } from 'react-icons/ai';
import {
  Badge,
  HStack,
  Icon,
  Text,
  useDisclosure,
  VStack
} from '@chakra-ui/react';
import { DeleteIcon } from '@chakra-ui/icons';
import { ExternalProgram } from '../../models/ExternalProgram';
import { InputChangeEvent } from '../../shared/typeAlias';
import { InternalProgram } from '../../models/InternalProgram';
import { Program, ProgramType } from '../../models/Program';
import {
  useCallback,
  useEffect,
  useRef,
  useState
} from 'react';
import { useParams } from 'react-router-dom';
import useDeleteData from '../../hooks/useDelete';
import useAuthContext from '../../hooks/useAuthContext';

export interface CourseParams extends Record<string, string> {
  cityId: string
  sectionId: string
}

const filterCallback = (search: string) => {
  const regex = new RegExp(`^${search.toUpperCase()}[\\s\\w]*`)
  return (data: Program) => (
    search === "" || regex.test(data.name.toUpperCase())
  )
}

const getPrgramInfo = (type: ProgramType) => {
  switch (type) {
    case ProgramType.internal:
      return {
        typename: "interno",
        colorScheme: "blue"
      }
    case ProgramType.external:
      return {
        typename: "externo",
        colorScheme: "red"
      }

    default:
      throw new Error("El tipo de programa es desconocido")
  }
}

const CourseDetailView = () => {
  const { authSessionData: { accessToken } } = useAuthContext()
  const { newId, programs } = useAppContext()
  const [searchValue, setSearchValue] = useState("")
  const { successToast, errorToast } = useCustomToast()
  const { cityId, sectionId } = useParams<CourseParams>()
  const {
    error: deleteError,
    loading: deleteLoading,
    deleteData
  } = useDeleteData()
  const {
    insertData,
    loading: loadingInsert,
    error: errorInsert
  } = useInsertData<InternalProgram | ExternalProgram>()
  const {
    isOpen: isOpenI,
    onOpen: onOpenI,
    onClose: onCloseI
  } = useDisclosure()
  const {
    isOpen: isOpenE,
    onOpen: onOpenE,
    onClose: onCloseE
  } = useDisclosure()
  const formRefI = useRef<HTMLFormElement>(null)
  const formRefE = useRef<HTMLFormElement>(null)

  const handleSearch = useCallback(({ target: { value } }: InputChangeEvent) => {
    setSearchValue(value)
  }, [])

  const handleFilter = useCallback(filterCallback(searchValue), [searchValue])

  const handleConfirmI = () => {
    if (formRefI.current) {
      const submitEvent = new Event('submit', { bubbles: true, cancelable: true })
      formRefI.current.dispatchEvent(submitEvent)
    }
  }

  const handleConfirmE = () => {
    if (formRefE.current) {
      const submitEvent = new Event('submit', { bubbles: true, cancelable: true })
      formRefE.current.dispatchEvent(submitEvent)
    }
  }

  const handleSubmitI = async (values: InternalFormValues) => {
    const newProgram: InternalProgram = {
      id: newId,
      cityId: cityId ?? "",
      section: Number(sectionId),
      type: ProgramType.internal,
      ...values
    }
    const ok = await insertData("/programs", newProgram, {
      jwt: accessToken!,
      method: 'PUT'
    })
    if (ok) {
      programs.set([...(programs.list ?? []), newProgram])
      successToast("Se creó el programa exitosamente.")
      onCloseI()
    }
  }

  const handleSubmitE = async (values: ExternalFormValues) => {
    const newProgram: ExternalProgram = {
      id: newId,
      cityId: cityId ?? "",
      section: Number(sectionId),
      type: ProgramType.external,
      ...values
    }
    const ok = await insertData("/programs", newProgram, {
      jwt: accessToken!,
      method: 'PUT'
    })
    if (ok) {
      programs.set([...(programs.list ?? []), newProgram])
      successToast("Se creó el programa exitosamente.")
      onCloseE()
    }
  }

  const handleDelete = async (id: string) => {
    const ok = await deleteData("/programs", id, {
      jwt: accessToken!
    })

    if (ok) {
      const filtered = programs.list?.filter(e => e.id != id) ?? []
      programs.set([...filtered])
      successToast("El programa se elimino con éxito.")
    }
  }

  useEffect(() => {
    if (sectionId) {
      programs.fetch(cityId, sectionId)
    }
  }, [sectionId])

  useEffect(() => {
    if (deleteError) {
      errorToast(deleteError)
    }
  }, [deleteError])

  useEffect(() => {
    if (errorInsert) {
      errorToast(errorInsert)
    }
  }, [errorInsert])

  return (
    <>
      <FormModal
        isOpen={isOpenI}
        isSubmitting={loadingInsert}
        onClose={onCloseI}
        onConfirm={handleConfirmI}
        title='Configuración de programa (interno)'>
        <InternalForm
          formRef={formRefI}
          onSubmit={handleSubmitI}
          onError={() => console.log("hubo un error")} />
      </FormModal>
      <FormModal
        isOpen={isOpenE}
        isSubmitting={loadingInsert}
        onClose={onCloseE}
        onConfirm={handleConfirmE}
        title='Configuración de programa (externo)'>
        <ExternalForm
          formRef={formRefE}
          onSubmit={handleSubmitE}
          onError={() => { }} />
      </FormModal>
      <VStack align="stretch">
        {
          sectionId &&
          <AddCourseMenu
            isDisabled={programs.state.loading}
            onClick={{
              internal: onOpenI,
              external: onOpenE
            }} />
        }
        {
          programs.list &&
          <DataList<Program>
            list={programs.list}
            error={!!programs.state.error}
            onSearch={handleSearch}
            onFilter={handleFilter}
            searchValue={searchValue}
            isLoading={programs.state.loading}>
            {
              (program) => (
                <DataListItem
                  key={program.id}
                  loading={deleteLoading}
                  onDelete={async () => await handleDelete(program.id)}
                  options={{
                    icon: <DeleteIcon color="red.500" />
                  }}>
                  <HStack>
                    {'auto' in program && Boolean(program.auto) && <Icon color="tomato" as={AiFillFire} />}
                    <Text>{program.shortName}</Text>
                    <Badge
                      rounded="2xl"
                      colorScheme={getPrgramInfo(program.type).colorScheme}>
                      {getPrgramInfo(program.type).typename}
                    </Badge>
                  </HStack>
                </DataListItem>
              )
            }
          </DataList>
        }
      </VStack>
    </>
  )
}

export default CourseDetailView