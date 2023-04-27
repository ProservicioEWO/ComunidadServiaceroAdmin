import { Button, ButtonProps } from "@chakra-ui/react";
import { forwardRef, ForwardRefRenderFunction } from "react";

type ProButtonProps = ButtonProps & {};

const ProButton: ForwardRefRenderFunction<HTMLButtonElement, ProButtonProps> = ({ children, ...rest }, ref) => {
  return (
    <Button ref={ref} {...rest}>
      {children}
    </Button>
  )
}

export default forwardRef(ProButton);
