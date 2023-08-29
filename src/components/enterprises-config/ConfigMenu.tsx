import EntityDynamicList from './EntityDynamicList';
import Lottie from 'lottie-react';
import SettingLoadingAnimation from '../../lotties/setting-loading.json';
import useAuthContext from '../../hooks/useAuthContext';
import useCustomToast from '../../hooks/useCustomToast';
import useFetch from '../../hooks/useFetch';
import useUpdateData from '../../hooks/useUpdateData';
import {
  Box,
  HStack,
  Icon,
  Image,
  Text
} from '@chakra-ui/react';
import { BsChevronRight } from 'react-icons/bs';
import { Enterprise } from '../../models/Enterprise';
import { ListBox, ListBoxChangeEvent } from 'primereact/listbox';
import { useEffect, useState } from 'react';
'./EntityDynamicList';

const ConfigMenu = () => {
  const { authSessionData: { accessToken } } = useAuthContext()
  const { errorToast } = useCustomToast()
  const [selectedEnt, setSelectedEnt] = useState<Enterprise | null>(null)
  const {
    data: enterprisesData,
    loading: enterprisesLoading,
    error: enterprisesError,
    fetchData: fetchEnterprises
  } = useFetch<Enterprise[]>()
  const {
    updateData: updateEnterprise,
    error: updateError,
    loading: updateLoading
  } = useUpdateData<{ entities: string[] }>()

  const handleChange = (e: ListBoxChangeEvent) => {
    const selected = e.value as Enterprise
    setSelectedEnt(selected)
  }

  const handleAcept = async (value: string) => {
    if (selectedEnt) {
      const ok = await updateEnterprise(
        "/enterprises/:id",
        { id: String(selectedEnt.id) },
        { entities: [...(selectedEnt.entities ?? []), value] },
        { jwt: accessToken! }
      )
      if (ok) {
        setSelectedEnt({
          ...selectedEnt,
          entities: [...(selectedEnt.entities ?? []), value]
        })
      }
    }
  }

  useEffect(() => {
    fetchEnterprises("/enterprises", {
      jwt: accessToken!
    })
  }, [])

  useEffect(() => {
    if (enterprisesError) {
      errorToast("Ocurrió un error al obtener la configuración. ERROR: " + enterprisesError)
    }

    if (updateError) {
      errorToast("Ocurrió un error al actualizar la configuración. ERROR: " + updateError)
    }
  }, [enterprisesError, updateError])

  return (
    enterprisesLoading ?
      <Box boxSize='sm'>
        <Lottie animationData={SettingLoadingAnimation} />
      </Box> :
      <HStack align="stretch" spacing={5}>
        <Box w="full" borderRight='1px solid #eeeeee'>
          <ListBox
            style={{ border: 'none' }}
            value={selectedEnt}
            onChange={handleChange}
            options={enterprisesData ?? []}
            optionLabel='name'
            itemTemplate={
              (opts: Enterprise) => (
                <HStack>
                  <Image src={opts.logo} w={6} />
                  <Text w="full">{opts.name}</Text>
                  <Icon as={BsChevronRight} />
                </HStack>
              )
            } />
        </Box>
        <Box w="full">
          {
            !selectedEnt ?
              <Text>Selecciona una empresa para empezar a configurar</Text> :
              <EntityDynamicList
                data={selectedEnt.entities ?? []}
                emptyMessage="Esta empresa no tiene entidades registradas"
                onAcept={handleAcept} />
          }
        </Box>
      </HStack >
  )
}

export default ConfigMenu