import SignUp, { SignUpFormState } from "app/areas/auth/SignUp/SignUp"
import { isValidResponse } from "infrastructure/persistence/api/client"
import { postUserSignup } from "infrastructure/persistence/api/data/actions"
import { useMutation } from "react-fetching-library"
import { useNavigate } from "react-router"

function SignUpView() {
  const navigate = useNavigate()
  const { mutate: signUp } = useMutation(postUserSignup)
  async function onSubmit(state: SignUpFormState) {
    const response = await signUp(state.formData as never)
    if (!isValidResponse(response)) return

    localStorage.setItem("auth-key", response.payload.auth_key)
    localStorage.setItem("user-id", response.payload.user_id.toString())

    navigate("/")
  }
  return (
    <>
      <SignUp onSubmit={onSubmit} />
    </>
  )
}

export default SignUpView
