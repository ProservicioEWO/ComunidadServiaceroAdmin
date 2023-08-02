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
import { AuthSessionData } from './AuthContextProvider';
import { News } from '../models/News';
import { Testimonial } from '../models/Testimonial';

export interface ContextLogFilters {
  dateStart: string
  dateEnd: string
  moduleId?: string
}

export interface AppContextProps {
  sessionData: AuthSessionData
  children: ReactNode
}

export interface AppContextValue {
  readonly newId: UUID
  readonly starting: boolean

  users: {
    state: ContextState
    get: User[] | null,
    set: ContextSetter<User[]>
    fetch: () => Promise<void>
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
  }
  news: {
    list: News[] | null
    state: ContextState
  }
}

export const AppContext = createContext<AppContextValue>({
  get newId() { return NIL_UUID },
  get starting() { return false },
  users: {
    state: { loading: true, error: null },
    get: null,
    set: () => { },
    fetch: async () => { }
  },
  password: {
    value: '',
    fetch: async (id?: string) => { },
    state: { loading: true, error: null },
  },
  locations: {
    fetch: async (cityId?: string) => { },
    list: null,
    state: { loading: true, error: null }
  },
  cities: {
    state: { loading: true, error: null },
    get: null,
    set: () => { }
  },
  events: {
    state: { loading: true, error: null },
    get: null,
    set: () => { }
  },
  programs: {
    fetch: async (cityId?: string, sectionId?: string) => { },
    list: null,
    state: { loading: true, error: null },
    set: () => { }
  },
  logs: {
    fetch: async (moduleId?: string) => { },
    state: { loading: true, error: null },
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
    state: { loading: true, error: null },
    applyFilter: () => { }
  },
  userInfo: {
    data: null,
    state: { loading: true, error: null }
  },
  news: {
    list: null,
    state: { loading: true, error: null }
  }
})

const AppContextProvider = ({ children, sessionData }: AppContextProps) => {
  // const {
  //   authSessionData: {
  //     accessToken,
  //     isAuthenticated,
  //     userId
  //   }
  // } = useAuthContext()

  const { accessToken, userId } = sessionData

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
  const {
    data: newsData,
    loading: newsLoading,
    error: newsError,
    fetchData: fetchNews
  } = useFetch<News[]>()
  const {
    data: testimonialsData,
    loading: testimonialsLoading,
    error: testimonialsError,
    fetchData: fetchTestionials
  } = useFetch<Testimonial[]>()

  const [users, setUsers] = useState<User[]>([])
  const [cities, setCities] = useState<City[]>([])
  const [locations, setLocations] = useState<Location[]>([])
  const [events, setEvents] = useState<Event[]>([])
  const [programs, setPrograms] = useState<(ExternalProgram | InternalProgram)[]>([])
  const [logs, setLogs] = useState<Log[]>([])
  const [modules, setModules] = useState<Module[]>([])
  const [userInfo, setUserInfo] = useState<User | null>(null)
  const [news, setNews] = useState<News[] | null>(null)
  const [testimonials, setTestimonials] = useState<Testimonial[] | null>(null)
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
        modulesLoading ||
        userInfoLoading ||
        newsLoading
    },
    get newId() {
      return uuidv4()
    },
    users: {
      state: { loading: usersLoading, error: usersError },
      get: users,
      set: setUsers,
      fetch: async () => {
        await fetchUsers("/users", {
          jwt: accessToken!,
          query: { _append: "enterprise" }
        })
      }
    },
    password: {
      fetch: async (id?: string) => {
        await fetchPassword("/users/:id", {
          jwt: accessToken!,
          param: { id }
        })
      },
      state: { loading: passwordLoading, error: passwordError },
      value: password
    },
    locations: {
      fetch: async (cityId?: string) => {
        await fetchLocations("/cities/:cityId/locations", {
          jwt: accessToken!,
          param: { cityId }
        })
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
        if (!cityId && !sectionId) {
          await fetchPrograms("/programs", {
            jwt: accessToken!
          })
        } else {
          await fetchPrograms("/cities/:cityid/programs", {
            jwt: accessToken!,
            param: { cityid: cityId },
            query: sectionId ? { section: sectionId } : null
          })
        }
      }
    },
    logs: {
      list: logs,
      state: { loading: logsLoading, error: logsError },
      set: setLogs,
      fetch: async (moduleId?: string) => {
        if (!moduleId) {
          await fetchLogs("/logs", {
            jwt: accessToken!
          })
        } else {
          await fetchLogs("/logs", {
            jwt: accessToken!,
            query: { _append: ["module", "user"], moduleId }
          })
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
      state: { loading: userInfoLoading, error: userInfoError }
    },
    news: {
      list: news,
      state: { loading: newsLoading, error: newsError }
    },
    testimonials: {
      list: testimonials,
      state: { loading: testimonialsLoading, error: testimonialsError }
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
      accessToken,
      news,
      newsLoading,
      newsError
    ])

  useEffect(() => {
    fetchUsers("/users", {
      jwt: accessToken!,
      query: { _append: "enterprise" }
    })
    fetchCities("/cities", {
      jwt: accessToken!
    })
    fetchEvents("/events", {
      jwt: accessToken!
    })
    fetchModules("/modules", {
      jwt: accessToken!,
      query: { _join: "logs" }
    })
    fetchUserInfo("/users/:userId", {
      jwt: accessToken!,
      param: { userId: userId! },
      query: { _append: 'enterprise' }
    })
    fetchNews("/news", {
      jwt: accessToken!
    })

  }, [accessToken, userId])

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

  useEffect(() => {
    if (newsData) {
      setNews(newsData)
    }
  }, [newsData])

  useEffect(() => {
    if (testimonialsData) {
      setTestimonials(testimonialsData)
    }
  }, [testimonialsData])

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  )
}

export default AppContextProvider