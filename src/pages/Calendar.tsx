import { Calendar as CalendarReact, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'

const localizer = momentLocalizer(moment)

const Calendar = () => {

  return (
    <CalendarReact
      localizer={localizer}
      events={[
        {start: '2023-05-01', end: '2023-05-12'}
      ]}
      startAccessor="start"
      endAccessor="end"
      style={{ height: 500 }}
    />
  )
}

export default Calendar