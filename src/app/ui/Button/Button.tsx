import "./Button.scss"

import { MouseEvent, MouseEventHandler, useRef, useState } from "react"
import ReactGA from "react-ga4"
import { classMerge, classWithModifiers } from "utils/common"

import Loader from "../Loader/Loader"
import { ButtonBaseProps } from "./Button.types"

interface ButtonProps extends ButtonBaseProps {
  type?: "reset" | "submit"
  eventLabel?: string
  pending?: boolean
  disabled?: boolean
  await?: boolean
  onClick?: MouseEventHandler<HTMLButtonElement>
}

function Button(props: ButtonProps) {
  const buttonRef = useRef<HTMLButtonElement | null>(null)

  const [pending, setPending] = useState(false)

  async function onClick(event: MouseEvent<HTMLButtonElement>) {
    if (props.await) {
      setPending(true)
      await props.onClick?.(event)
      setPending(false)
    } else {
      props.onClick?.(event)
    }
    /* --- Google Analytics --- */
    if (props.eventLabel) {
      ReactGA.event({
        category: "User",
        action: "Clicked Button",
        label: props.eventLabel
      })
    }
  }

  const modifiers: string[] = []
  if (props.size) modifiers.push(props.size)
  if (props.color) modifiers.push(props.color)
  if (props.outline) modifiers.push("outline")
  if (props.pending || pending) modifiers.push("pending")

  return (
    <button className={classMerge(classWithModifiers("button", ...modifiers), props.className)} type={props.type || "button"} disabled={props.disabled || props.pending || pending} aria-busy={props.pending || pending} onClick={onClick} ref={buttonRef}>
      {props.iconLeft && (
        <div className="button__icon">{props.iconLeft}</div>
      )}
      <div className="button__text">{props.children}</div>
      {props.iconRight && (
        <div className="button__icon">{props.iconRight}</div>
      )}
      <Loader className="button__loader" />
    </button>
  )
}

export default Button
