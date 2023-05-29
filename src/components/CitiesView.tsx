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

const CitiesView = () => {
  const navigate = useNavigate()
  const { newId, cities } = useAppContext()
  const { cityId } = useParams<LocationParams>()
  const { errorToast, successToast } = useCustomToast()
  const { deleteData, loading: deleting, error: deleteError } = useDeleteData()
  const { insertData, loading: inserting, error: insertError } = useInsertData<City>()

  const handleDelete = async (id: string | number) => {
    const ok = await deleteData("/cities", id)
    if (ok) {
      successToast("Se eliminó ciudad con éxito")
      const newDatalist = cities.get?.filter(e => e.id !== id)
      cities.set(newDatalist ?? [])
      if (cityId && String(id) === cityId) {
        navigate(`/admin/locations`)
      }
    }
  }

  const handleAdd = async (newLocation: NewLocationValue) => {
    const newCity = { ...newLocation, id: newId, count: 0 }
    const ok = await insertData("/cities", newCity)
    if (ok) {
      successToast("Se creó la nueva ciudad con éxito")
      cities.set([...cities.get ?? [], newCity])
    }
  }

  useEffect(() => {
    if (cities.state.error) {
      errorToast(cities.state.error)
    }

    if (deleteError) {
      errorToast(deleteError)
    }

    if (insertError) {
      errorToast(insertError)
    }
  }, [cities.state.error, deleteError, insertError])

  return (
    <VStack>
      <LocationMenuList<City>
        isLoading={cities.state.loading}
        dataList={cities.get} >
        {
          ({ id, name, count }) => (
            <NavLink to={String(id)}>
              {
                ({ isActive }) => (
                  <LocationMenuListItem
                    counter={count}
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

export default CitiesView