import "./Input.scss"

import _ from "lodash"
import { ChangeEvent, DetailedHTMLProps, InputHTMLAttributes, ReactNode, useEffect, useRef, useState } from "react"
import { classWithModifiers } from "utils/common"

import Icon, { IconName } from "../Icon/Icon"

export type InputConstraint = [RegExp | string, string]

export interface InputProps extends Omit<DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>, "placeholder"> {
  width?: string
  icon?: IconName | ReactNode
  customValidity?: false | string
  children?: ReactNode
  constraints?: InputConstraint[]
  pending?: boolean
  tooltip?: string
  value?: string
  defaultValue?: string
  onIconClick?(): void
}

function Input(props: InputProps) {
  const inputRef = useRef<HTMLInputElement | null>(null)

  const [value, setValue] = useState(props.defaultValue || "")
  const [invalid, setInvalid] = useState(false)
  const [tooltip, setTooltip] = useState("")

  function onChange(event: ChangeEvent<HTMLInputElement>) {
    const target = event.currentTarget

    props.value ?? setValue(target.value)
    props.onChange?.(event)

    checkConstrains(target)
    checkValidity(target)
  }

  function onInvalid(event: ChangeEvent<HTMLInputElement>) {
    const target = event.currentTarget

    checkValidity(target)
  }

  function checkValidity(target: EventTarget & HTMLInputElement) {
    if (props.pending) return

    const invalid = !target.validity.valid
    setInvalid(invalid)
  }

  function checkConstrains(target: EventTarget & HTMLInputElement) {
    if (props.constraints == null) return

    setTooltip("")
    target.setCustomValidity("")

    if (target.value.length === 0) return

    for (const [constraint, errorMessage] of props.constraints) {
      if (constraint instanceof RegExp) {
        if (!constraint.test(target.value)) {
          setTooltip(errorMessage)
          target.setCustomValidity(errorMessage)
          break
        }
      }

      if (typeof constraint === "string") {
        if (constraint !== target.value) {
          setTooltip(errorMessage)
          target.setCustomValidity(errorMessage)
          break
        }
      }
    }
  }

  useEffect(() => {
    if (props.pending) return

    if (inputRef.current == null) return
    if (inputRef.current.value.length === 0) return

    checkValidity(inputRef.current)
  }, [props.pending])

  useEffect(() => {
    if (inputRef.current == null) return
    if (inputRef.current.validationMessage.length > 0 && inputRef.current.validationMessage !== props.customValidity) return

    inputRef.current.setCustomValidity(props.customValidity || "")
    checkValidity(inputRef.current)
  }, [props.customValidity])

  const modifiers: string[] = []
  if (props.pending) modifiers.push("pending")
  else if (invalid || !!props.customValidity) modifiers.push("invalid")
  else if (String(value).length > 0 && !(invalid || !!props.customValidity)) modifiers.push("fulfilled")

  return (
    <label className="input" style={{ "--input-width": props.width }}>
      <div className={classWithModifiers("input__appearance", ...modifiers)}>
        <input {..._.omit(props, "icon", "customValidity", "children", "onIconClick", "pending")} className="input__input" value={props.value ?? value} onChange={onChange} onInvalid={onInvalid} ref={inputRef} />
        <div className="input__label">{props.children}{props.required && "*"}</div>
        <div className="input__tooltip">{tooltip || props.customValidity || props.tooltip}</div>
        {typeof props.icon === "string" && (
          <Icon className={classWithModifiers("input__icon", !!props.onIconClick && "clickable")} name={props.icon} onClick={props.onIconClick} />
        )}
        {typeof props.icon !== "string" && props.icon != null && (
          <div className={classWithModifiers("input__icon", !!props.onIconClick && "clickable")} onClick={props.onIconClick}>{props.icon}</div>
        )}
      </div>
    </label>
  )
}

export default Input
