import "./SignIn.scss"

import { AbsoluteAppRoutes } from "app/AppRoutes"
import Button from "app/ui/Button/Button"
import ButtonLink from "app/ui/Button/ButtonLink"
import Form, { FormState } from "app/ui/Form/Form"
import Input from "app/ui/Input/Input"
import InputUsername from "app/ui/Input/InputUsername"
import { useState } from "react"

enum SignInFields {
  username = "username",
  password = "password",
}

export type SignInFormState = FormState<SignInFields, string>

interface SignInProps {
  onSubmit: (state: SignInFormState) => PromiseLike<void>
}

function SignIn(props: SignInProps) {
  const [pending, setPending] = useState(false)

  async function onSubmit(state: SignInFormState) {
    setPending(true)
    await props.onSubmit(state)
    setPending(false)
  }

  return (
    <Form className="sign-in" onSubmit={onSubmit}>
      <h2 className="sign-in__title">Sign In</h2>
      <div className="sign-in__inputs">
        <InputUsername className="sign-in__input" name={SignInFields.username} required autoComplete="username">Username</InputUsername>
        <Input className="sign-in__input" name={SignInFields.password} type="password" required autoComplete="current-password" tooltip="Enter your lovely password :>">Password</Input>
      </div>
      <Button size="big" type="submit" pending={pending}>Sign In</Button>
      <ButtonLink to={AbsoluteAppRoutes.signUp}>Sign Up</ButtonLink>
    </Form>
  )
}

export default SignIn
