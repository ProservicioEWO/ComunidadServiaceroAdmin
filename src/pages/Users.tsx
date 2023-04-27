import {
  Box,
  Card,
  CardBody,
  HStack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text
} from '@chakra-ui/react';
import { Outlet } from 'react-router-dom';
import { AddUserView, UsersListView } from '../components/users';

const Users = () => {
  const tabsSeed = ["Todos", "+ Agregar"]
  return (
    <Card w="full">
      <CardBody>
        <Tabs isLazy variant="line" colorScheme="red">
          <TabList>
            {tabsSeed.map((text, i) =>
              <Tab key={i}>
                <Text>{text}</Text>
              </Tab>
            )}
          </TabList>
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
              <AddUserView />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </CardBody>
    </Card>
  )
}

export default Users