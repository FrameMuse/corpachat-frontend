import { FocusEvent, useRef, useState } from "react"

import Loader from "../Loader/Loader"
import Input, { InputProps } from "./Input"


const USERNAME_CHECK_TOOL_TIP = "Checking username availability..."

function InputUsername(props: InputProps) {
  const prevRef = useRef<string>(props.defaultValue ?? "")
  const [pending, setPending] = useState(false)
  async function onBlur(event: FocusEvent<HTMLInputElement>) {
    const target = event.currentTarget
    if (prevRef.current === target.value) return

    event.preventDefault()
    prevRef.current = target.value

    target.setCustomValidity(USERNAME_CHECK_TOOL_TIP)
    setPending(true)
    await new Promise(r => setTimeout(r, 2500))
    setPending(false)
    target.setCustomValidity("")

    props.onBlur?.(event)
  }
  return (
    <Input
      {...props}
      onInvalid={console.log}
      icon={pending ? <Loader /> : props.icon}
      pending={pending}
      // disabled={pending || props.disabled}
      tooltip={pending ? USERNAME_CHECK_TOOL_TIP : props.tooltip}
      onBlur={onBlur}
    />
  )
}

export default InputUsername