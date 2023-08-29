import AddCourseMenu from './AddCourseMenu';
import DataList from '../DataList';
import DataListItem from '../DataListItem';
import ExternalForm, { ExternalFormValues } from './ExternalForm';
import FormModal from './FormModal';
import InternalForm, { InternalFormValues } from './InternalForm';
import useAppContext from '../../hooks/useAppContext';
import useAuthContext from '../../hooks/useAuthContext';
import useCustomToast from '../../hooks/useCustomToast';
import useDeleteData from '../../hooks/useDelete';
import useFetch from '../../hooks/useFetch';
import useInsertData from '../../hooks/useInsertData';
import { AiFillFire } from 'react-icons/ai';
import { AnyProgram, InputChangeEvent } from '../../shared/typeAlias';
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
import { InternalProgram } from '../../models/InternalProgram';
import { Program, ProgramType } from '../../models/Program';
import {
  useCallback,
  useEffect,
  useRef,
  useState
} from 'react';
import { useParams } from 'react-router-dom';


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

const getProgramInfo = (type: ProgramType) => {
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
  const [formType, setFormType] = useState<'interno' | 'externo'>()
  const [modalMode, setModalMode] = useState<'edit' | 'set'>('set')
  const [editId, setEditId] = useState<string>()
  const [initValues, setInitValues] = useState<AnyProgram>()
  const [searchValue, setSearchValue] = useState("")
  const { successToast, errorToast } = useCustomToast()
  const { cityId, sectionId } = useParams<CourseParams>()
  const {
    error: deleteError,
    loading: deleteLoading,
    deleteData
  } = useDeleteData()
  const {
    data: programData,
    error: programError,
    loading: programLoading,
    fetchData: fetchProgram
  } = useFetch<AnyProgram>()
  const {
    insertData,
    loading: loadingInsert,
    error: errorInsert
  } = useInsertData<AnyProgram>()
  const {
    isOpen,
    onOpen,
    onClose
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
    if (!editId) {
      errorToast(
        `Error: ID del programa no encontrado. 
        Por favor, inténtelo nuevamente; si el problema continúa, contacte a TI.`
      )
      return
    }
    const newProgram: InternalProgram = {
      id: modalMode === 'edit' ? editId : newId,
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
      if (modalMode === 'edit') {
        const newProgramsList = programs.list?.map(e => (
          e.id === editId ? { ...newProgram, id: editId } : e
        ))
        if (newProgramsList) {
          programs.set(newProgramsList)
        }
      } else {
        programs.set([...(programs.list ?? []), newProgram])
        successToast("Se creó el programa exitosamente.")
      }
      onClose()
    }
  }

  const handleSubmitE = async (values: ExternalFormValues) => {
    if (!editId) {
      errorToast(
        `Error: ID del programa no encontrado. 
        Por favor, inténtelo nuevamente; si el problema continúa, contacte a TI.`
      )
      return
    }
    const newProgram: ExternalProgram = {
      id: modalMode === 'edit' ? editId : newId,
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
      if (modalMode === 'edit') {
        const newProgramsList = programs.list?.map(e => (
          e.id === editId ? { ...newProgram, id: editId } : e
        ))
        if (newProgramsList) {
          programs.set(newProgramsList)
        }
      } else {
        programs.set([...(programs.list ?? []), newProgram])
        successToast("Se creó el programa exitosamente.")
      }
      onClose()
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

  const handleClickItem = async (id: string) => {
    onOpen()
    setEditId(id)
    setModalMode('edit')
    await fetchProgram(`/programs/:id`, {
      jwt: accessToken!,
      param: { id }
    })
  }

  useEffect(() => {
    if (programData) {
      setInitValues(programData)
      console.log(programData)
      setFormType(programData.type === ProgramType.internal ? 'interno' : 'externo')
    }
  }, [programData])

  useEffect(() => {
    if (sectionId) {
      programs.fetch(cityId, sectionId)
    }
  }, [sectionId])

  useEffect(() => {
    if (deleteError) {
      errorToast(deleteError)
    }

    if (errorInsert) {
      errorToast(errorInsert)
    }

    if (programError) {
      errorToast(programError)
      onClose()
    }
  }, [deleteError, errorInsert, programError])

  return (
    <>
      <FormModal
        mode={modalMode}
        isOpen={isOpen}
        isSubmitting={loadingInsert}
        isLoading={programLoading}
        onClose={onClose}
        onConfirm={formType === 'interno' ? handleConfirmI : handleConfirmE}
        title={formType ? `Configuración de programa (${formType})` : 'Cargando...'}>
        {
          formType === 'interno' ?
            <InternalForm
              ref={formRefI}
              init={initValues as InternalFormValues}
              onSubmit={handleSubmitI}
              onError={() => console.log("hubo un error en form interno")} /> :
            <ExternalForm
              ref={formRefE}
              init={initValues as ExternalFormValues}
              onSubmit={handleSubmitE}
              onError={() => console.log("hubo un error en form externo")} />
        }
      </FormModal>
      <VStack align="stretch">
        {
          sectionId &&
          <AddCourseMenu
            isDisabled={programs.state.loading}
            onClick={(type) => {
              setModalMode('set')
              setInitValues(undefined)
              setFormType(type)
              onOpen()
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
                  onDelete={async () => {
                    await handleDelete(program.id)
                  }}
                  onClick={async () => await handleClickItem(program.id)}
                  options={{
                    icon: <DeleteIcon color="red.500" />
                  }}>
                  <HStack>
                    {'auto' in program && Boolean(program.auto) && <Icon color="tomato" as={AiFillFire} />}
                    <Text>{program.shortName}</Text>
                    <Badge
                      rounded="2xl"
                      colorScheme={getProgramInfo(program.type).colorScheme}>
                      {getProgramInfo(program.type).typename}
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