import { useEffect, useState } from 'react';
import AppContextProvider from '../contexts/AppContextProvider';
import useAuthContext from '../hooks/useAuthContext';
import useRedirect from '../hooks/useRedirect';
import MainLayout from '../shared/MainLayout';
import MessageStatusInvalid from '../shared/MessageStatusInvalid';
import { SessionStatus } from '../shared/SessionStatus';

const Dashboard = () => {
  const {
    authSessionData,
    signOut
  } = useAuthContext()
  const { status } = useRedirect({ accessToken: authSessionData.accessToken! })
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleConfirm = async () => {
    signOut()
  }

  useEffect(() => {
    if (status === SessionStatus.INVALID_SESSION) {
      setIsModalOpen(true)
    }
  }, [status])

  return (
    <AppContextProvider sessionData={authSessionData}>
      <MainLayout />
      {isModalOpen && <MessageStatusInvalid OnConfirm={handleConfirm} />}
    </AppContextProvider>
  )
}

export default Dashboard