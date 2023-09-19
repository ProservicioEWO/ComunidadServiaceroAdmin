import ProgramCalendar, { ProgramEvent, RRuleOptions} from '../components/calendar/ProgramCalendar';
import useAppContext from '../hooks/useAppContext';
import { AnyProgram } from '../shared/typeAlias';
import { InternalProgram } from '../models/InternalProgram';
import { useEffect } from 'react';
import { tiempo } from '../shared/utils';
import { Frequency } from '../shared/Frecuency';


const isInternalProgram = (program: AnyProgram): program is InternalProgram => (
  'locationId' in (program as InternalProgram)
)

const Calendar = () => {
  const { programs } = useAppContext()
  const programList = programs.list?.filter(isInternalProgram).map<ProgramEvent>(e => ({
    ...(e.days.length < 7 ?
      {
        title: e.shortName,
        rrule: {
          byweekday: undefined,
          freq: e.frequency,
          ...(e.frequency === Frequency.W && { byweekday: e.days }),
          dtstart: tiempo(e.date),
          until: tiempo(e.end),
        },
        color: e.color
      } :
      {
        title: e.shortName,
        start: tiempo(e.date),
        end: tiempo(e.end),
        color: e.color
      })
  }))

  useEffect(() => {
    programs.fetch()
  }, [])

  return (
    <ProgramCalendar
      programList={programList}
      isLoading={programs.state.loading} />
  )
}

export default Calendar
