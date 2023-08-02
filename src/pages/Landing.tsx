import { hexFromColorScheme } from '../shared/utils';
import {
  Card,
  CardBody,
  CardHeader,
  Divider,
  Grid,
  Heading,
  HStack,
  IconButton,
  SimpleGrid,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  VStack
} from '@chakra-ui/react';
import { useState } from 'react';
import useAppContext from '../hooks/useAppContext';
import { Accordion, AccordionTab } from 'primereact/accordion';
import { FiMoreVertical } from 'react-icons/fi';
import NewsCard from '../components/landing/news/NewsCard';
import NewsView from '../components/landing/news/NewsView';
import BannerView from '../components/landing/banner/BannerView';
import TestimonialsView from '../components/landing/testimonials/TestimonialsView';

const Landing = () => {
  const [color, setColor] = useState("red")
  return (
    <Card w="full">
      <CardBody>
        <Tabs colorScheme={color}>
          <TabList>
            <Tab onClick={() => setColor("red")}>Útimas noticias</Tab>
            <Tab onClick={() => setColor("blue")}>Banner</Tab>
            <Tab onClick={() => setColor("green")}>Testimonios</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <NewsView />
            </TabPanel>
            <TabPanel>
              <BannerView />
            </TabPanel>
            <TabPanel>
              <TestimonialsView/>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </CardBody>
    </Card>
  )
}

export default Landing