import { AbsoluteCenter, Box } from '@chakra-ui/react';
import { ProgressSpinner } from 'primereact/progressspinner';

const LoadingSpinner = () => {
  return (
    <Box w="100vw" h="100vh">
      <AbsoluteCenter>
        <ProgressSpinner
          strokeWidth='5px'
          style={{ width: "80px", height: "80px" }}
          fill="var(--highlight-bg)"
          animationDuration=".5s" />
      </AbsoluteCenter>
    </Box>
  )
}

export default LoadingSpinner