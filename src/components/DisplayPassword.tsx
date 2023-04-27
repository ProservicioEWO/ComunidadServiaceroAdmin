import { HStack, IconButton, Input, Tooltip } from "@chakra-ui/react"
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons"

import { useState } from "react"

export interface DisplayPasswordProps {
  value: string
}

const DisplayPassword = ({ value }: DisplayPasswordProps) => {
  const [showPassword, setShowPassword] = useState(false)

  const toggleShowPassword = () => {
    setShowPassword(!showPassword)
  }

  return (
    <HStack>
      <Input readOnly variant='unstyled' type={showPassword ? 'text' : 'password'} value={value} />
      <Tooltip hasArrow label={showPassword ? 'ocultar contraseña' : 'mostrar contraseña'}>
        <IconButton
          icon={
            showPassword ?
              <ViewIcon /> :
              <ViewOffIcon />
          }
          aria-label={""}
          onClick={toggleShowPassword} />
      </Tooltip>
    </HStack>
  )
}

export default DisplayPassword;
