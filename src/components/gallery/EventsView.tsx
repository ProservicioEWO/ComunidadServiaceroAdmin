import AddEventForm, { NewEventValue } from './AddEventForm';
import EventsMenuList from './EventsMenuList';
import EventsMenuListItem from './EventsMenuListItem';
import useAppContext from '../../hooks/useAppContext';
import useCustomToast from '../../hooks/useCustomToast';
import useDeleteData from '../../hooks/useDelete';
import useInsertData from '../../hooks/useInsertData';
import { Event } from '../../models/Event';
import { EventParams } from './EventsDetailView';
import { NavLink, useNavigate, useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { VStack } from '@chakra-ui/react';

const EventsView = () => {
  const navigate = useNavigate()
  const { newId, events } = useAppContext()
  const { eventId } = useParams<EventParams>()
  const { errorToast, successToast } = useCustomToast()
  const { deleteData, loading: deleting, error: deleteError } = useDeleteData()
  const { insertData, loading: inserting, error: insertError } = useInsertData<Event>()

  const handleDelete = async (id: string | number) => {
    const ok = await deleteData("/events", id)
    if (ok) {
      successToast("Se el evento con éxito")
      const newDatalist = events.get?.filter(e => e.id !== id)
      events.set(newDatalist ?? [])
      if (eventId && String(id) === eventId) {
        navigate(`/admin/gallery`)
      }
    }
  }

  const handleAdd = async ({ name }: NewEventValue) => {
    const newEvent = { id: newId, name }
    const ok = await insertData("/events", newEvent)
    if (ok) {
      successToast("Se creó el evento con éxito")
      events.set([...events.get ?? [], newEvent])
    }
  }

  useEffect(() => {
    if (events.state.error) {
      errorToast(events.state.error)
    }

    if (deleteError) {
      errorToast(deleteError)
    }

    if (insertError) {
      errorToast(insertError)
    }
  }, [events.state.error, deleteError, insertError])

  return (
    <VStack>
      <EventsMenuList<Event>
        isLoading={events.state.loading}
        dataList={events.get} >
        {
          ({ id, name }) => (
            <NavLink to={String(id)}>
              {
                ({ isActive }) => (
                  <EventsMenuListItem
                    text={name}
                    isActive={isActive}
                    isLoading={deleting}
                    onDelete={() => handleDelete(id)} />
                )
              }
            </NavLink>
          )
        }
      </EventsMenuList>
      <AddEventForm isLoading={inserting} onAdd={handleAdd} />
    </VStack>
  )
}

export default EventsView