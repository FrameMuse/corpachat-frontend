import { ReactNode } from "react"

type ButtonSize = "small" | "big"
type ButtonColor = "white" | "gray"

export interface ButtonBaseProps {
  size?: ButtonSize
  color?: ButtonColor
  outline?: boolean

  className?: string

  iconLeft?: ReactNode
  iconRight?: ReactNode

  children: ReactNode
}
