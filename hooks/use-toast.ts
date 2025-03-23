// hooks/use-toast.ts
import { useState } from "react"

type ToastVariant = "default" | "destructive"

type ToastProps = {
  title: string
  description?: string
  variant?: ToastVariant
}

type ToastWithId = ToastProps & { id: string }

export function useToast() {
  const [toasts, setToasts] = useState<ToastWithId[]>([])
  const timeouts = new Map<string, NodeJS.Timeout>()

  const toast = (props: ToastProps) => {
    const id = Math.random().toString(36).substring(2, 9)
    const newToast = { ...props, id }

    setToasts((prevToasts) => [...prevToasts, newToast])

    const timeout = setTimeout(() => {
      dismissToast(id)
    }, 5000)

    timeouts.set(id, timeout)

    return id
  }

  const dismissToast = (id: string) => {
    clearTimeout(timeouts.get(id))
    timeouts.delete(id)
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id))
  }

  const clearAll = () => {
    timeouts.forEach((timeout) => clearTimeout(timeout))
    timeouts.clear()
    setToasts([])
  }

  return {
    toast,
    toasts,
    dismissToast,
    clearAll,
  }
}
