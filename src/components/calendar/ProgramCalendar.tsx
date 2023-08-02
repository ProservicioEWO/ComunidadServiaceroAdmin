import dayGridPlugin from '@fullcalendar/daygrid';
import FullCalendar from '@fullcalendar/react';
import { Spinner, Text } from '@chakra-ui/react';

import 'primeicons/primeicons.css';

export interface ProgramEvent {
  title: string
  start: string
  end: string
  color: string
}

export interface ProgramCalendarProps {
  programList: ProgramEvent[] | undefined
  isLoading: boolean
}

const ProgramCalendar = ({ programList, isLoading }: ProgramCalendarProps) => {
  return (
    <div style={{
      backgroundColor: 'white',
      padding: '2em',
      width: "100%",
      position: 'relative',
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1),0 1px 2px 0 rgba(0, 0, 0, 0.06)',
      borderRadius: '0.375em'
    }}>
      <div style={{
        display: isLoading ? 'flex' : 'none',
        position: 'absolute',
        width: '100%',
        height: '100%',
        backgroundColor: '#00000077',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: '99'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          flexDirection: 'column',
          gap: '10px',
          color: 'white'
        }}>
          <Spinner size='xl' borderWidth='thick' />
          <Text>Cargando fechas...</Text>
        </div>
      </div>
      <FullCalendar
        locale="es-MX"
        buttonIcons={{}}
        buttonText={{
          today: 'Hoy',
        }}
        plugins={[dayGridPlugin]}
        events={programList}
      />
    </div>
  )
}

export default ProgramCalendar