import moment from 'moment';
import ProgramCalendar, { ProgramEvent } from '../components/calendar/ProgramCalendar';
import useAppContext from '../hooks/useAppContext';
import { AnyProgram } from '../shared/typeAlias';
import { InternalProgram } from '../models/InternalProgram';
import { useEffect, useState } from 'react';

const isInternalProgram = (program: AnyProgram): program is InternalProgram => (
  'locationId' in (program as InternalProgram)
)

const Calendar = () => {
  const { programs } = useAppContext()
  const programList = programs.list?.filter(isInternalProgram).map<ProgramEvent>(e => ({
    title: e.name,
    start: e.date,
    end: moment(e.date).add(e.duration, 'weeks').format('YYYY-MM-DD'),
    color: e.color
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