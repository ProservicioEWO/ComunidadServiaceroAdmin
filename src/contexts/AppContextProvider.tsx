import useFetch from '../hooks/useFetch';
import { City } from '../models/City';
import {
  ContextSetter,
  ContextState,
  FilterPredicate,
  UUID
} from '../shared/typeAlias';
import {
  createContext,
  ReactNode,
  useEffect,
  useMemo,
  useState
} from 'react';
import { Event } from '../models/Event';
import { ExternalProgram } from '../models/ExternalProgram';
import { formatDate } from '../shared/utils';
import { InternalProgram } from '../models/InternalProgram';
import { Location } from '../models/Location';
import { Log } from '../models/Log';
import { Module } from '../models/Module';
import { NIL as NIL_UUID, v4 as uuidv4 } from 'uuid';
import { User } from '../models/User';
import { AccessTokenState } from './AuthContextProvider';

export interface ContextLogFilters {
  dateStart: string
  dateEnd: string
  moduleId?: string
}

export interface AppContextProps {
  children: ReactNode
  accessToken: AccessTokenState
}

export interface AppContextValue {
  readonly newId: UUID
  readonly starting: boolean
  readonly _accessToken: AccessTokenState
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
  userInfo: {
    state: ContextState,
    data: User | null
    fetch: (userId: string) => Promise<void>
  }
}

export const AppContext = createContext<AppContextValue>({
  get newId() { return NIL_UUID },
  get starting() { return false },
  get _accessToken() {
    return {
      token: null,
      tokenLoading: true,
      tokenError: null
    }
  },
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
  },
  userInfo: {
    data: null,
    state: { loading: true, error: null },
    fetch: async () => { }
  }
})

const AppContextProvider = ({ children, accessToken }: AppContextProps) => {
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
  const {
    data: userInfoData,
    loading: userInfoLoading,
    error: userInfoError,
    fetchData: fetchUserInfo
  } = useFetch<User>()

  const [users, setUsers] = useState<User[]>([])
  const [cities, setCities] = useState<City[]>([])
  const [locations, setLocations] = useState<Location[]>([])
  const [events, setEvents] = useState<Event[]>([])
  const [programs, setPrograms] = useState<(ExternalProgram | InternalProgram)[]>([])
  const [logs, setLogs] = useState<Log[]>([])
  const [modules, setModules] = useState<Module[]>([])
  const [userInfo, setUserInfo] = useState<User | null>(null)
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
    get _accessToken() { return accessToken },
    users: {
      state: { loading: usersLoading, error: usersError },
      get: users,
      set: setUsers
    },
    password: {
      fetch: async (id?: string) => {
        if (accessToken.token) {
          await fetchPassword("/users/:id", accessToken.token, { id })
        }
      },
      state: { loading: passwordLoading, error: passwordError },
      value: password
    },
    locations: {
      fetch: async (cityId?: string) => {
        if (accessToken.token) {
          await fetchLocations(
            "/cities/:cityId/locations",
            accessToken.token,
            { cityId }
          )
        }
      },
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
        if (accessToken.token) {
          if (!cityId && !sectionId) {
            await fetchPrograms("/programs", accessToken.token)
          } else {
            await fetchPrograms(
              "/cities/:cityid/programs/",
              accessToken.token,
              { cityid: cityId },
              sectionId ? { section: sectionId } : null
            )
          }

        }
      }
    },
    logs: {
      list: logs,
      state: { loading: logsLoading, error: logsError },
      set: setLogs,
      fetch: async (moduleId?: string) => {
        if (accessToken.token) {
          if (!moduleId) {
            await fetchLogs("/logs", accessToken.token)
          } else {
            await fetchLogs(
              "/logs",
              accessToken.token,
              undefined,
              { _append: ["module", "user"], moduleId }
            )
          }

        }
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
    },
    userInfo: {
      data: userInfo,
      state: { loading: userInfoLoading, error: userInfoError },
      fetch: async (userId) => {
        if (accessToken.token) {
          await fetchUserInfo(
            "/users/:userId",
            accessToken.token,
            { userId },
            { _append: 'enterprise' }
          )
        }
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
      logsFilters,
      userInfoData,
      userInfoError,
      userInfoLoading,
      accessToken.token
    ])

  useEffect(() => {
    console.log(accessToken.token)
    if (accessToken.token !== null) {
      fetchUsers("/users", accessToken.token, undefined, { _append: "enterprise" })
      fetchCities("/cities", accessToken.token)
      fetchEvents("/events", accessToken.token)
      fetchModules("/modules", accessToken.token, undefined, { _join: "logs" })
    }
  }, [accessToken.token])

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

  useEffect(() => {
    if (userInfoData) {
      setUserInfo(userInfoData)
    }
  }, [userInfoData])

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  )
}

export default AppContextProvider