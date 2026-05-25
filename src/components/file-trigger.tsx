import { FileTrigger as RAFileTrigger, type FileTriggerProps } from 'react-aria-components'
import type { ReactNode } from 'react'

interface FileTriggerProps_ extends FileTriggerProps {
  children: ReactNode
}

export function FileTrigger({ children, ...props }: FileTriggerProps_) {
  return <RAFileTrigger {...props}>{children}</RAFileTrigger>
}
