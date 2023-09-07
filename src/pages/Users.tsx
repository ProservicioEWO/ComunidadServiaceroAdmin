import { AddUserView, ImportUsersView, UsersListView } from '../components/users';
import {
  Box,
  Card,
  CardBody,
  HStack,
  Spacer,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text
} from '@chakra-ui/react';
import { Outlet } from 'react-router-dom';
import useAppContext from '../hooks/useAppContext';

const Users = () => {
  const tabsSeed = ["Todos", "+ Agregar"]
  const {users} = useAppContext() 
  return (
    <Card w="full">
      <CardBody>
        <Tabs isLazy variant="line" colorScheme="red">
          <HStack >
            <TabList w="full">
              {tabsSeed.map((text, i) =>
                <Tab key={i}>
                  <Text>{text}</Text>
                </Tab>
              )}
            </TabList>
            <Spacer/>
            <Text whiteSpace="nowrap">Juntos somos <b>{users.get?.length ?? 0}</b> usuarios</Text>
          </HStack>
          <TabPanels>
            <TabPanel>
              <HStack align='start' spacing='6'>
                <Box w='full'>
                  <UsersListView />
                </Box>
                <Outlet />
              </HStack>
            </TabPanel>
            <TabPanel>
              <Tabs isLazy variant="line" colorScheme="green">
                <TabList>
                  <Tab>Individual</Tab>
                  <Tab>Importar</Tab>
                </TabList>
                <TabPanels>
                  <TabPanel>
                    <AddUserView />
                  </TabPanel>
                  <TabPanel>
                    <ImportUsersView />
                  </TabPanel>
                </TabPanels>
              </Tabs>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </CardBody>
    </Card>
  )
}

export default Users