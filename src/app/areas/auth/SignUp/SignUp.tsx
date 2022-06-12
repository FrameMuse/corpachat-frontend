import "./SignUp.scss"

import { AbsoluteAppRoutes } from "app/AppRoutes"
import Button from "app/ui/Button/Button"
import ButtonLink from "app/ui/Button/ButtonLink"
import Form, { FormState } from "app/ui/Form/Form"
import Input, { InputConstraint } from "app/ui/Input/Input"
import InputUsername from "app/ui/Input/InputUsername"
import { useState } from "react"

const PASSWORD_MISMATCH_ERROR = "Password mismatch"
const passwordConstraints: InputConstraint[] = [
  [/[0-9]/, "At least one number"],
  [/(?=.*[a-z])(?=.*[A-Z])/, "At least one uppercase and lowercase letter"],
  [/.{8,}/, "At least 8 characters"],
]

enum SignUpFields {
  name = "name",
  username = "username",
  password = "password",
  passwordConfirm = "passwordConfirm",
}

export type SignUpFormState = FormState<SignUpFields, string>

interface SignUpProps {
  onSubmit: (state: SignUpFormState) => PromiseLike<void>
}

function SignUp(props: SignUpProps) {
  const [pending, setPending] = useState(false)
  const [passwordMismatch, setPasswordMismatch] = useState(false)

  async function onSubmit(state: SignUpFormState) {
    setPending(true)
    await props.onSubmit(state)
    setPending(false)
  }

  function onChange(state: SignUpFormState) {
    const passwordMismatch = state.values.password !== state.values.passwordConfirm

    setPasswordMismatch(passwordMismatch)
  }

  return (
    <Form className="sign-up" onChange={onChange} onSubmit={onSubmit}>
      <h2 className="sign-up__title">Sign Up</h2>
      <div className="sign-up__inputs">
        <Input className="sign-up__input" name={SignUpFields.name} required>Name</Input>
        <InputUsername className="sign-up__input" name={SignUpFields.username} required autoComplete="username">Username</InputUsername>
        <Input className="sign-up__input" name={SignUpFields.password} type="password" required autoComplete="current-password" tooltip="Should be at least 8 long, have numbers and special chars" constraints={passwordConstraints}>Password</Input>
        <Input className="sign-up__input" name={SignUpFields.passwordConfirm} type="password" required autoComplete="new-password" customValidity={passwordMismatch && PASSWORD_MISMATCH_ERROR}>Password Confirm</Input>
      </div>
      <Button size="big" type="submit" pending={pending}>Sign Up</Button>
      <ButtonLink to={AbsoluteAppRoutes.signIn}>Sign In</ButtonLink>
    </Form>
  )
}

export default SignUp
