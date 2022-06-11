import Chat from "app/containers/Chat/Chat"
import Button from "app/ui/Button/Button"
import Input from "app/ui/Input/Input"
import useAttach from "infrastructure/persistence/socket/useAttach"
import useClientSocket from "infrastructure/persistence/socket/useClient"
import { useState } from "react"
import { inputValue } from "utils/common"

function HomeView() {
  const [name, setName] = useState("")

  const [userId, setUserId] = useState<number | null>(null)
  const [authKey, setAuthKey] = useState<string | null>(null)

  useAttach<{ user_id: number, auth_key: string }>("SIGNUP_USER", payload => {
    setUserId(payload.user_id)
    setAuthKey(payload.auth_key)
  })
  useAttach("disconnect", () => {
    setUserId(null)
    setAuthKey(null)
  })

  const clientSocket = useClientSocket()
  async function onSubmit() {
    await clientSocket.open()
    clientSocket.transmit<{ name: string }>("USER_SIGNUP_ME", { name })
  }
  if (authKey == null || userId == null) {
    return (
      <>
        <Input name="name" placeholder="Enter the name of your own :>" onChange={inputValue(setName)} />
        <Button await onClick={onSubmit}>Sign In</Button>
      </>
    )
  }

  return (
    <>
      <Chat authKey={authKey} userId={userId} />
    </>
  )
}

export default HomeView
