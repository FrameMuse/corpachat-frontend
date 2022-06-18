import useUser from "app/areas/user/hooks/useUser"
import Chat from "app/containers/Chat/Chat"
import { ReactError } from "app/containers/ErrorBoundary/ErrorBoundary.errors"
import QueryContainer from "app/containers/QueryContainer/QueryContainer"
import SocketContainer from "app/containers/SocketContainer/SocketContainer"
import Input from "app/ui/Input/Input"
import { getMessages } from "infrastructure/persistence/api/data/actions"
import { useState } from "react"
import { useParams } from "react-router"
import { inputValue } from "utils/common"

function ChatView() {
  const { chatHashSum } = useParams<"chatHashSum">()
  if (chatHashSum == null) {
    throw new ReactError(ChatView, "chatHashSum is null")
  }

  const [secret, setSecret] = useState("")

  const user = useUser()
  if (user == null) return null

  return (
    <>
      <Input required onChange={inputValue(setSecret)}>Dare you know a sign of the entity?</Input>
      <SocketContainer params={{ hash_summ: chatHashSum }}>
        <QueryContainer action={getMessages(chatHashSum)}>
          {payload => (
            <Chat hash={chatHashSum} userId={user.id} defaultMessages={payload.messages} secret={secret} />
          )}
        </QueryContainer>
      </SocketContainer>
    </>
  )
}

export default ChatView