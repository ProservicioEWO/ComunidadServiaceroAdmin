import { useEffect } from 'react'
import useAppContext from '../hooks/useAppContext'
import useAuthContext from '../hooks/useAuthContext'

const Test2 = () => {
  const { current } = useAuthContext()
  const { userInfo } = useAppContext()
  
  useEffect(() => {
    current().then(e => {
      e?.getUserAttributes((err, attr) => {
        const sub = attr?.find(e => e.Name === 'sub')?.Value
        if (sub){
          console.log("asdad")
          userInfo.fetch(sub)
        }
      })
    })
  }, [])

  return (
    userInfo.state.loading ?
      <span>loading...</span> :
      <div>{userInfo.data?.username ?? "loading..."}</div>
  )
}

export default Test2