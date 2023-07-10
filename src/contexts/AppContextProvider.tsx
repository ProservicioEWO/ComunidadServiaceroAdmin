import useFetch from '../hooks/useFetch';
import { City } from '../models/City';
import { ContextSetter, ContextState, FilterPredicate, UUID } from '../shared/typeAlias';
import {
  createContext,
  ReactNode,
  useEffect,
  useMemo,
  useState
} from 'react';
import { Event } from '../models/Event';
import { ExternalProgram } from '../models/ExternalProgram';
import { InternalProgram } from '../models/InternalProgram';
import { Location } from '../models/Location';
import { Log } from '../models/Log';
import { Module } from '../models/Module';
import { NIL as NIL_UUID, v4 as uuidv4 } from 'uuid';
import { User } from '../models/User';
import { formatDate } from '../shared/utils';

export interface ContextLogFilters {
  dateStart: string
  dateEnd: string
  moduleId?: string
}

export interface AppContextValue {
  readonly newId: UUID
  readonly starting: boolean
  users: {
    state: ContextState
    get: User[] | null,
    set: ContextSetter<User[]>
  }
  password: {
    state: ContextState,
    readonly value: string | null,
    fetch: (id?: string) => Promise<void>
  }
  locations: {
    state: ContextState
    fetch: (cityId?: string) => Promise<void>,
    list: Location[] | null
  }
  cities: {
    state: ContextState,
    get: City[] | null,
    set: ContextSetter<City[]>
  }
  events: {
    state: ContextState,
    get: Event[] | null,
    set: ContextSetter<Event[]>
  }
  programs: {
    state: ContextState,
    list: (ExternalProgram | InternalProgram)[] | null,
    set: ContextSetter<(ExternalProgram | InternalProgram)[]>,
    fetch: (cityId?: string, sectionId?: string) => Promise<void>
  }
  logs: {
    state: ContextState,
    list: Log[] | null,
    filters: {
      set: (filters: ContextLogFilters) => void,
      value: ContextLogFilters
    },
    set: ContextSetter<Log[]>,
    fetch: (moduleId?: string) => Promise<void>
  }
  modules: {
    state: ContextState,
    get: Module[] | null,
    filtered: Module[],
    applyFilter: (predicate: FilterPredicate<Log>) => void
  }
}

export const AppContext = createContext<AppContextValue>({
  get newId() { return NIL_UUID },
  get starting() { return false },
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
    fetch: async (cityId?: string, sectionId?: string) => { },
    list: null,
    state: { loading: false, error: null },
    set: () => { }
  },
  logs: {
    fetch: async (moduleId?: string) => { },
    state: { loading: false, error: null },
    list: null,
    set: () => { },
    filters: {
      value: { dateStart: "", dateEnd: "", moduleId: "" },
      set: () => { }
    },
  },
  modules: {
    get: null,
    filtered: [],
    state: { loading: false, error: null },
    applyFilter: () => { }
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
    data: locationsData,
    loading: locationsLoading,
    error: locationsError,
    fetchData: fetchLocations
  } = useFetch<Location[]>()
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
  } = useFetch<(ExternalProgram | InternalProgram)[]>()
  const {
    data: logsData,
    loading: logsLoading,
    error: logsError,
    fetchData: fetchLogs
  } = useFetch<Log[]>()
  const {
    data: modulesData,
    loading: modulesLoading,
    error: modulesError,
    fetchData: fetchModules
  } = useFetch<Module[]>()
  const [users, setUsers] = useState<User[]>([])
  const [cities, setCities] = useState<City[]>([])
  const [locations, setLocations] = useState<Location[]>([])
  const [events, setEvents] = useState<Event[]>([])
  const [programs, setPrograms] = useState<(ExternalProgram | InternalProgram)[]>([])
  const [logs, setLogs] = useState<Log[]>([])
  const [modules, setModules] = useState<Module[]>([])
  const [filteredModules, setFilteredModules] = useState<Module[]>([])
  const [password, setPassword] = useState("")
  const [logsFilters, setLogsFilters] = useState<ContextLogFilters>({
    dateStart: formatDate(new Date("2023-01-01")),
    dateEnd: formatDate(new Date("2100-12-31")),
    moduleId: ""
  })
  const value = useMemo<AppContextValue>(() => ({
    get starting() {
      return citiesLoading ||
        usersLoading ||
        eventsLoading ||
        modulesLoading
    },
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
      fetch: async (cityId?: string) => await fetchLocations("/cities/:cityId/locations", { cityId }),
      state: { loading: locationsLoading, error: locationsError },
      list: locations
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
      list: programs,
      set: setPrograms,
      fetch: async (cityId?: string, sectionId?: string) => {
        if (!cityId && !sectionId) {
          return await fetchPrograms("/programs")
        }
        return await fetchPrograms(
          "/cities/:cityid/programs/",
          { cityid: cityId },
          sectionId ? { section: sectionId } : null
        )
      }
    },
    logs: {
      list: logs,
      state: { loading: logsLoading, error: logsError },
      set: setLogs,
      fetch: async (moduleId?: string) => {
        if (!moduleId) {
          return await fetchLogs("/logs")
        }
        return await fetchLogs(
          "/logs",
          undefined,
          { _expandA: ["module", "user"], moduleId }
        )
      },
      filters: {
        value: {
          ...logsFilters
        },
        set: (filters) => {
          setLogsFilters({ ...filters })
        }
      },
    },
    modules: {
      get: modules,
      filtered: !filteredModules.length ? modules : filteredModules,
      state: { loading: modulesLoading, error: modulesError },
      applyFilter: (predicate) => {
        const fm = modules
          .map<Module>(({ logs, ...rest }) => ({
            ...rest,
            logs: logs.filter(predicate)
          }))
        setFilteredModules(fm)
      }
    }
  }),
    [
      users,
      usersLoading,
      usersError,
      cities,
      citiesLoading,
      citiesError,
      locations,
      locationsLoading,
      locationsError,
      events,
      eventsLoading,
      eventsError,
      programs,
      programsLoading,
      programsError,
      logs,
      logsLoading,
      logsError,
      modules,
      filteredModules,
      modulesError,
      modulesLoading,
      password,
      passwordLoading,
      passwordError,
      logsFilters
    ])

  useEffect(() => {
    fetchUsers("/users?_expand=enterprise")
    fetchCities("/cities")
    fetchEvents("/events")
    fetchModules("/modules?_embed=logs")
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
    if (locationsData) {
      setLocations(locationsData)
    }
  }, [locationsData])

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
    if (logsData) {
      setLogs(logsData)
    }
  }, [logsData])

  useEffect(() => {
    if (userPassword) {
      setPassword(userPassword.password)
    }
  }, [userPassword])

  useEffect(() => {
    if (modulesData) {
      setModules(modulesData)
    }
  }, [modulesData])

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  )
}

export default AppContextProvider