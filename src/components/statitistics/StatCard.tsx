import CountUp from 'react-countup';
import {
  Box,
  Divider,
  Heading,
  HStack,
  Text,
  VStack
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { NavLink } from 'react-router-dom';

export interface StatCardProps {
  bg: string,
  title: string
  value: number
  to: string
}

const StatCard = ({ bg, title, value, to }: StatCardProps) => {
  return (
    <NavLink to={to}>
      {
        ({ isActive }) => (
          <Box
            as={motion.div}
            maxH="180px"
            whileHover={{ scale: 1.05 }}
            border={isActive ? "5px solid white" : "2px solid transparent"}
            color="white"
            bg={bg}
            borderRadius="lg"
            p="4"
            shadow={isActive ? "lg" : "md"}>
            <VStack>
              <HStack>
                <Heading p='1' fontSize='2xl'>{title}</Heading>
              </HStack>
              <Divider />
              <Text fontSize="6xl" fontWeight="bold">
                <CountUp end={value} duration={1} />
              </Text>
            </VStack>
          </Box>
        )
      }
    </NavLink>
  )
}

export default StatCard