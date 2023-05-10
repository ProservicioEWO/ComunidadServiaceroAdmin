import { HStack, IconButton, Input, Tooltip } from "@chakra-ui/react"
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons"

import { useEffect, useState } from "react"

export interface DisplayPasswordProps {
  value: string | null,
  isLoading: boolean
}

const DisplayPassword = ({ value, isLoading }: DisplayPasswordProps) => {
  const [showPassword, setShowPassword] = useState(false)

  const toggleShowPassword = () => {
    setShowPassword(!showPassword)
  }

  useEffect(() => {
    setShowPassword(false)
  }, [isLoading])

  return (
    <HStack>
      <Input
        readOnly
        variant='unstyled'
        type={isLoading ? 'text' : showPassword ? 'text' : 'password'}
        value={isLoading ? "cargando..." : value ?? ""} />
      <Tooltip hasArrow label={showPassword ? 'ocultar contraseña' : 'mostrar contraseña'}>
        <IconButton
          isLoading={isLoading}
          icon={
            !showPassword ?
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
