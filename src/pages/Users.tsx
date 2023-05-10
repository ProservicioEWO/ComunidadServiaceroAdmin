import { DownloadIcon } from '@chakra-ui/icons';
import {
  Box,
  Card,
  CardBody,
  Flex,
  HStack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  VStack
} from '@chakra-ui/react';
import Dropzone from 'react-dropzone';
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
                    <Dropzone
                      accept={{
                        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
                        'text/xml': ['.xml'],
                        'application/json': ['.json'],
                        'text/csv': ['.csv']
                      }}
                      onDrop={acceptedFiles => console.log(acceptedFiles)}
                      multiple={false} 
                      maxFiles={1}>
                      {
                        ({ getRootProps, getInputProps }) => (
                          <Flex
                            {...getRootProps()}
                            justify='center'
                            border='2px dashed'
                            borderColor={'gray.300'}
                            borderRadius='md'
                            px={3}
                            py={8}
                            cursor="pointer">
                            <input {...getInputProps()} />
                            <VStack>
                              <DownloadIcon fontSize='2xl' transform='rotate(180deg)' />
                              <Text>Subir archivo de Excel, CSV, XML o JSON</Text>
                            </VStack>
                          </Flex>
                        )
                      }
                    </Dropzone>
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