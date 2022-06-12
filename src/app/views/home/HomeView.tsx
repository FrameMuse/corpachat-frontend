import Chat from "app/containers/Chat/Chat"
import QueryContainer from "app/containers/QueryContainer/QueryContainer"
import { getMessages } from "infrastructure/persistence/api/data/actions"
import useClientSocket from "infrastructure/persistence/socket/useClientSocket"
import { useEffect } from "react"
import { useNavigate } from "react-router"
import useLocalStorage from "utils/hooks/useLocalStorage"

function HomeView() {
  const clientSocket = useClientSocket()

  const navigate = useNavigate()

  const [getUserId] = useLocalStorage("user-id")
  const userId = Number(getUserId())

  useEffect(() => {
    if (isNaN(userId)) {
      navigate("/sign-in")
    }

    clientSocket.tryOpen()
  }, [])

  if (typeof userId !== "number" || isNaN(userId)) {
    return null
  }

  return (
    <QueryContainer action={getMessages()}>
      {payload => (
        <Chat userId={userId} defaultMessages={payload.messages} />
      )}
    </QueryContainer>
  )
}

export default HomeView
