import useAppContext from '../hooks/useAppContext';
import useCustomToast from '../hooks/useCustomToast';
import useDeleteData from '../hooks/useDelete';
import useInsertData from '../hooks/useInsertData';
import { AddLocationForm, LocationMenuList, LocationMenuListItem } from './locations';
import { City } from '../models/City';
import { LocationParams } from './locations/LocationDetailView';
import { NavLink, useNavigate, useParams } from 'react-router-dom';
import { NewLocationValue } from './locations/AddLocationForm';
import { useEffect } from 'react';
import { VStack } from '@chakra-ui/react';
import useAuthContext from '../hooks/useAuthContext';
import useDeleteAll from '../hooks/useDeleteAll';

const SitesView = () => {
  const navigate = useNavigate()
  const { authSessionData: { accessToken } } = useAuthContext()
  const { newId, sites } = useAppContext()
  const { siteId } = useParams<LocationParams>()
  const { errorToast, successToast } = useCustomToast()
  const { deleteData, loading: deleting, error: deleteError } = useDeleteData()
  const { deleteAll, loading: loadingDAll, error: errorDAll } = useDeleteAll()
  const { insertData, loading: inserting, error: insertError } = useInsertData<City>()

  const handleDelete = async (id: string | number) => {
    const ok = await deleteData("/sites", id, {
      jwt: accessToken!
    })

    if (ok) {
      const _ok = await deleteAll(`/locations?siteId=${id}`, {
        jwt: accessToken!
      })

      if(_ok){
        successToast("Se eliminó ciudad con éxito")
        
        const newDatalist = sites.get?.filter(e => e.id !== id)
        sites.set(newDatalist ?? [])
        if (siteId && String(id) === siteId) {
          navigate(`/locations`)
        }
      }
    }
  }

  const handleAdd = async (newLocation: NewLocationValue) => {
    const newCity = { ...newLocation, id: newId } as City
    const ok = await insertData("/sites", newCity, {
      jwt: accessToken!,
      method: 'PUT'
    })
    if (ok) {
      successToast("Se creó la nueva ciudad con éxito")
      sites.set([...sites.get ?? [], newCity])
    }
  }

  useEffect(() => {
    if (sites.state.error) {
      errorToast(sites.state.error)
    }

    if (deleteError) {
      errorToast(deleteError)
    }
    
    if (errorDAll) {
      errorToast(errorDAll)
    }

    if (insertError) {
      errorToast(insertError)
    }
  }, [sites.state.error, deleteError, insertError, errorDAll])

  return (
    <VStack>
      <LocationMenuList<City>
        isLoading={sites.state.loading}
        dataList={sites.get} >
        {
          ({ id, name }) => (
            <NavLink to={String(id)}>
              {
                ({ isActive }) => (
                  <LocationMenuListItem
                    text={name}
                    isActive={isActive}
                    isLoading={deleting}
                    onDelete={() => handleDelete(id)} />
                )
              }
            </NavLink>
          )
        }
      </LocationMenuList>
      <AddLocationForm isLoading={inserting} onAdd={handleAdd} />
    </VStack>
  )
}

export default SitesView