import { ToastPosition, useToast, UseToastOptions } from "@chakra-ui/react";
import { useCallback } from "react";

export type ToastType = "success" | "error" | "warning" | "info"

export type ToastFunc = (description: string) => void

export interface CustomToastContext {
  closeAll: () => void
  successToast: ToastFunc
  errorToast: ToastFunc
}

const useCustomToast = (): CustomToastContext => {
  const toast = useToast();

  const showToast = useCallback((type: ToastType, position: ToastPosition, title: string) =>
    (description: string) => {
      toast({
        title,
        description,
        position,
        isClosable: true,
        status: type
      });
    }, [toast])

  return {
    closeAll: () => toast.closeAll(),
    successToast: showToast("success", 'bottom', 'Genial!'),
    errorToast: showToast("error", 'bottom-right', '¡Oh no!')
  }
}

export default useCustomToast