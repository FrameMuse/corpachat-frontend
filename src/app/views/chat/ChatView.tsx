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
  const params = useParams<"chatHashSum">()
  if (params.chatHashSum == null) {
    throw new ReactError(ChatView, "chatHashSum is null")
  }

  const [secret, setSecret] = useState("")

  const user = useUser()
  if (user == null) return null

  return (
    <>
      <Input required onChange={inputValue(setSecret)}>Dare you know a sign of the entity?</Input>
      <SocketContainer params={{ hash_summ: params.chatHashSum }}>
        <QueryContainer action={getMessages(params.chatHashSum)}>
          {payload => secret.length === 0 ? (
            <>
              <h2>
                Emmm? You just ignore the fact that you need a key to know the truth. <br /> <br />
                I guess you're just no care about the real truthiness, you have no idea what you're trying to observe. <br /> <br />
                You might need to check your psychotherapist, call they right the moment you leave this page. <br /> <br />
                WAIT, YOU KEEP READING THIS, I'M SURE OUT OF SANE.
              </h2>
            </>
          ) : (
            <Chat userId={user.id} defaultMessages={payload.messages} secret={secret} />
          )}
        </QueryContainer>
      </SocketContainer>
    </>
  )
}

export default ChatView