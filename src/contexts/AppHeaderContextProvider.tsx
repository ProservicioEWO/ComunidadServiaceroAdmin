import { createContext, Dispatch, ReactNode, SetStateAction, useMemo, useState } from "react"
import { SVGComponent } from "../shared/typeAlias"

type ContextSetter<T> = Dispatch<SetStateAction<T>>
type ContextEncapsulate<T> = { get: T, set: ContextSetter<T> }

interface AppHeaderContextValues {
  title: ContextEncapsulate<string>,
  icon: ContextEncapsulate<SVGComponent | null>
}

export const AppHeaderContext = createContext<AppHeaderContextValues>({
  title: {
    get: "",
    set: () => { }
  },
  icon: {
    get: null,
    set: () => { }
  }
})

const AppHeaderContextProvider = ({ children }: { children: ReactNode }) => {
  const [currentTitle, setCurrentTitle] = useState("")
  const [currentIcon, setCurrentIcon] = useState<SVGComponent | null>(null)

  const value = useMemo<AppHeaderContextValues>(() => ({
    title: {
      get: currentTitle, set: setCurrentTitle
    },
    icon: {
      get: currentIcon, set: setCurrentIcon
    }
  }), [currentTitle, currentIcon])

  return (
    <AppHeaderContext.Provider value={value}>
      {children}
    </AppHeaderContext.Provider>
  )
}

export default AppHeaderContextProvider