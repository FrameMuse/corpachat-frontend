import SignIn, { SignInFormState } from "app/areas/auth/SignIn/SignIn"
import { isValidResponse } from "infrastructure/persistence/api/client"
import { postUserSignin } from "infrastructure/persistence/api/data/actions"
import { useMutation } from "react-fetching-library"
import { useNavigate } from "react-router"

function SignInView() {
  const navigate = useNavigate()
  const { mutate: signIn } = useMutation(postUserSignin)
  async function onSubmit(state: SignInFormState) {
    const response = await signIn(state.formData as never)
    if (!isValidResponse(response)) return

    localStorage.setItem("auth-key", response.payload.auth_key)
    localStorage.setItem("user-id", response.payload.user_id.toString())

    navigate("/")
  }
  return (
    <>
      <SignIn onSubmit={onSubmit} />
    </>
  )
}

export default SignInView
