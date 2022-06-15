import { isValidResponse } from "infrastructure/persistence/api/client"
import { getUsername } from "infrastructure/persistence/api/data/actions"
import { FocusEvent, useRef, useState } from "react"
import { useMutation } from "react-fetching-library"

import Loader from "../Loader/Loader"
import Input, { InputProps } from "./Input"


const USERNAME_CHECK_TOOL_TIP = "Checking username availability..."
const USERNAME_EXISTS_TOOL_TIP = "Username already exists"

function InputUsername(props: InputProps) {
  const prevRef = useRef<string>(props.defaultValue ?? "")
  const [pending, setPending] = useState(false)
  const { mutate: checkUsername } = useMutation(getUsername)
  async function onBlur(event: FocusEvent<HTMLInputElement>) {
    const target = event.currentTarget
    if (prevRef.current === target.value) return

    event.preventDefault()
    prevRef.current = target.value

    target.setCustomValidity(USERNAME_CHECK_TOOL_TIP)
    setPending(true)
    const response = await checkUsername(target.value)
    setPending(false)
    if (isValidResponse(response)) {
      if (response.payload.exists) {
        target.setCustomValidity(USERNAME_EXISTS_TOOL_TIP)
        props.onBlur?.(event)

        return
      }
    }

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