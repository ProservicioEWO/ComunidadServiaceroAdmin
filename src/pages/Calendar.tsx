import dayGridPlugin from '@fullcalendar/daygrid';
import FullCalendar from '@fullcalendar/react';
import moment from 'moment';
import ProgramCalendar from '../components/calendar/ProgramCalendar';
import useAppContext from '../hooks/useAppContext';

const Calendar = () => {
  const { programs } = useAppContext()
  const programList = programs.get?.map(e => ({
    title: e.name,
    start: e.date,
    end: moment(e.date).add(e.duration, 'weeks').format('YYYY-MM-DD'),
    color: e.color
  }))

  return (
    <ProgramCalendar
      programList={programList}
      isLoading={programs.state.loading} />
  )
}

export default Calendar