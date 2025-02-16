import "./Form.scss"

import _ from "lodash"
import { ChangeEvent, DetailedHTMLProps, FormEvent, FormHTMLAttributes, MutableRefObject } from "react"
import { classWithModifiers, FileToURLDataBase64 } from "utils/common"

type FormValue = string | string[] | number | number[] | boolean | null | undefined
type FormValues = Record<string, FormValue>

/**
 * @param Key - Keys union (may be Enum)
 * @param Value - Values union (may be any)
 * 
 * @example FormState<MyEnum, string>
 * @example FormState<"myKey1" | "myKey2", number>
 */
export interface FormState<Key extends keyof never, Value> { // Type-safe Values
  keys: (Key extends (String) ? Key : never)[]
  values: Value extends { [P in Key]?: unknown } ? Pick<Value, Key> & Record<Exclude<keyof Value, Key>, unknown> : Record<Key, Value>
  formData: FormData
}

interface FormProps<K extends keyof never, V> extends Omit<DetailedHTMLProps<FormHTMLAttributes<HTMLFormElement>, HTMLFormElement>, "onSubmit" | "onChange"> {
  formRef?: MutableRefObject<HTMLFormElement | null>
  onChange?: (state: FormState<K, V>, event: FormEvent<HTMLFormElement>) => void
  onSubmit?: (state: FormState<K, V>, event: FormEvent<HTMLFormElement>) => void
}

function Form<K extends keyof never, V>(props: FormProps<K, V>) {
  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const formState = (await getFormState(event.currentTarget)) as FormState<K, V>

    props.onSubmit?.(formState, event)
  }
  async function onChange(event: ChangeEvent<HTMLFormElement>) {
    event.preventDefault()

    const formState = (await getFormState(event.currentTarget)) as FormState<K, V>

    props.onChange?.(formState, event)
  }
  return (
    <form {..._.omit(props, "centered")} ref={props.formRef} className={classWithModifiers(props.className || "form")} onChange={onChange} onSubmit={onSubmit} />
  )
}

async function getFormState(form: HTMLFormElement): Promise<{
  keys: string[]
  values: FormValues
  formData: FormData
}> {
  const formData = new FormData(form)
  const keys: string[] = []
  for (const element of form.elements) {
    if (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement) {
      if (keys.includes(element.name)) continue
      keys.push(element.name)
    }
  }

  const values: FormValues = {}
  for (const key of keys) {
    const next = form.elements.namedItem(key)

    if (next instanceof HTMLInputElement) {
      if (next.checked) {
        values[next.name] = true
        continue
      }

      const file = next.files?.[0]
      if (file instanceof File) {
        values[next.name] = await FileToURLDataBase64(file)
      }
    }

    if (next instanceof HTMLInputElement || next instanceof HTMLTextAreaElement) {
      if (next.value.length === 0) continue
      values[next.name] = isNaN(Number(next.value)) ? next.value : Number(next.value)
    }

    if (next instanceof RadioNodeList) {
      const radios = [...next] as HTMLInputElement[]
      const checks = radios.map(radio => radio.checked && radio.value)

      values[radios[0].name] = checks.flatMap(check => (!check || isNaN(Number(check))) ? [] : Number(check))
    }
  }

  return { keys, values, formData }
}

export default Form