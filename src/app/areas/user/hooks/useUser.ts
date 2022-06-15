import { useEffect } from "react"
import { useNavigate } from "react-router"
import useLocalStorage from "utils/hooks/useLocalStorage"

function useUser() {
  const navigate = useNavigate()

  const [getAuthKey] = useLocalStorage("auth-key")
  const authKey = getAuthKey()

  const [getUserId] = useLocalStorage("user-id")
  const userId = getUserId()
  const userIdNumber = Number(userId)

  useEffect(() => {
    if (authKey == null) {
      navigate("/sign-in")
    }
  }, [])

  if (userId == null || isNaN(userIdNumber)) return null
  if (authKey == null) return null

  return {
    id: userIdNumber, authKey
  }
}

export default useUser