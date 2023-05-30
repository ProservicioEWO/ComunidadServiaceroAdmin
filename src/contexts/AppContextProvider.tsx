import useFetch from '../hooks/useFetch';
import { City } from '../models/City';
import { Event } from '../models/Event';
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useEffect,
  useMemo,
  useState
} from 'react';
import { Location } from '../models/Location';
import { NIL as NIL_UUID, v4 as uuidv4, v5 as uuidv5 } from 'uuid';
import { User } from '../models/User';
import { UUID } from '../shared/typeAlias';
import { Program } from '../models/Program';

type ContextState = { loading: boolean, error: string | null }
type ContextSetter<T> = Dispatch<SetStateAction<T>>

export interface AppContextValue {
  readonly newId: UUID,
  users: {
    state: ContextState
    get: User[] | null,
    set: ContextSetter<User[]>
  },
  password: {
    state: ContextState,
    readonly value: string | null,
    fetch: (id?: string) => Promise<void>
  },
  locations: {
    state: ContextState
    fetch: (cityId?: string) => Promise<void>,
    list: Location[] | null
  },
  cities: {
    state: ContextState,
    get: City[] | null,
    set: ContextSetter<City[]>
  },
  events: {
    state: ContextState,
    get: Event[] | null,
    set: ContextSetter<Event[]>
  },
  programs: {
    state: ContextState,
    get: Program[] | null,
    set: ContextSetter<Program[]>
  }
}

export const AppContext = createContext<AppContextValue>({
  get newId() { return NIL_UUID },
  users: {
    state: { loading: false, error: null },
    get: null,
    set: () => { },
  },
  password: {
    value: '',
    fetch: async (id?: string) => { },
    state: { loading: false, error: null },
  },
  locations: {
    fetch: async (cityId?: string) => { },
    list: null,
    state: { loading: false, error: null }
  },
  cities: {
    state: { loading: false, error: null },
    get: null,
    set: () => { }
  },
  events: {
    state: { loading: false, error: null },
    get: null,
    set: () => { }
  },
  programs: {
    state: { loading: false, error: null },
    get: null,
    set: () => { }
  }
})

const AppContextProvider = ({ children }: { children: ReactNode }) => {
  const {
    fetchData: fetchPassword,
    data: userPassword,
    error: passwordError,
    loading: passwordLoading
  } = useFetch<{ password: string }>()
  const {
    data: usersData,
    loading: usersLoading,
    error: usersError,
    fetchData: fetchUsers
  } = useFetch<User[]>()
  const {
    data: citiesData,
    loading: citiesLoading,
    error: citiesError,
    fetchData: fetchCities
  } = useFetch<City[]>()
  const {
    data: eventsData,
    loading: eventsLoading,
    error: eventsError,
    fetchData: fetchEvents
  } = useFetch<Event[]>()
  const {
    data: programsData,
    loading: programsLoading,
    error: programsError,
    fetchData: fetchPrograms
  } = useFetch<Program[]>()
  const [users, setUsers] = useState<User[]>([])
  const [cities, setCities] = useState<City[]>([])
  const [events, setEvents] = useState<Event[]>([])
  const [programs, setPrograms] = useState<Program[]>([])
  const [password, setPassword] = useState("")
  const value = useMemo<AppContextValue>(() => ({
    get newId() {
      //const nid = this.get?.map(e => e.id)[Math.floor(Math.random() * (100))] ?? NIL_UUID
      return uuidv4()
    },
    users: {
      state: { loading: usersLoading, error: usersError },
      get: users,
      set: setUsers
    },
    password: {
      fetch: async (id?: string) => await fetchPassword("/users/:id", { id }),
      state: { loading: passwordLoading, error: passwordError },
      value: password
    },
    locations: {
      fetch: async (cityId?: string) => await fetchPassword("/cities/:id/locations", { cityId }),
      state: { loading: false, error: null },
      list: null
    },
    cities: {
      state: { loading: citiesLoading, error: citiesError },
      get: cities,
      set: setCities
    },
    events: {
      state: { loading: eventsLoading, error: eventsError },
      get: events,
      set: setEvents
    },
    programs: {
      state: { loading: programsLoading, error: programsError },
      get: programs,
      set: setPrograms
    }
  }),
    [
      users,
      usersLoading,
      usersError,
      cities,
      citiesLoading,
      citiesError,
      events,
      eventsLoading,
      eventsError,
      programs,
      programsLoading,
      programsError,
      password,
      passwordLoading,
      passwordError
    ])

  useEffect(() => {
    fetchUsers("/users?_expand=enterprise")
    fetchCities("/cities")
    fetchEvents("/events")
    fetchPrograms("/programs")
  }, [])

  useEffect(() => {
    if (usersData) {
      setUsers(usersData)
    }
  }, [usersData])

  useEffect(() => {
    if (citiesData) {
      setCities(citiesData)
    }
  }, [citiesData])

  useEffect(() => {
    if (eventsData) {
      setEvents(eventsData)
    }
  }, [eventsData])

  useEffect(() => {
    if (programsData) {
      setPrograms(programsData)
    }
  }, [programsData])

  useEffect(() => {
    if (userPassword) {
      setPassword(userPassword.password)
    }
  }, [userPassword])

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  )
}

export default AppContextProvider