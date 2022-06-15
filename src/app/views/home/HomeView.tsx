import useUser from "app/areas/user/hooks/useUser"
import Chat from "app/containers/Chat/Chat"
import QueryContainer from "app/containers/QueryContainer/QueryContainer"
import SocketContainer from "app/containers/SocketContainer/SocketContainer"
import { getMessages } from "infrastructure/persistence/api/data/actions"

function HomeView() {
  const user = useUser()
  if (user == null) return null

  return (
    <SocketContainer params={{ hash_summ: 0 }}>
      <QueryContainer action={getMessages()}>
        {payload => (
          <Chat userId={user.id} defaultMessages={payload.messages} />
        )}
      </QueryContainer>
    </SocketContainer>
  )
}

export default HomeView
