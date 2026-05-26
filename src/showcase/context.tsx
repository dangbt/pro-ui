import { createContext, useContext } from 'react'
import type { Size } from '../lib/size'

export const ShowcaseSizeCtx = createContext<Size>('md')
export const useShowcaseSize = () => useContext(ShowcaseSizeCtx)
