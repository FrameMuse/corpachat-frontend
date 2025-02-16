import { updateUser } from "infrastructure/persistence/redux/reducers/user"
import store from "infrastructure/persistence/redux/store"
import { QueryResponse } from "react-fetching-library"
import { toast } from "react-toastify"
import { createQuery } from "utils/common"

import Localization from "../localization/controller"
import { Action, APIResponseError } from "./client.types"


type Response<T = unknown> = QueryResponse<T & APIResponseError>

export function endpointTransform(action: Action) {
  const endpoint = process.env.REACT_APP_API_HOST + action.endpoint
  const query = createQuery(action.params)

  return endpoint + (query && "?" + query)
}

export function requestInterceptor() {
  return async (action: Action) => {
    return {
      ...action,
      endpoint: endpointTransform(action),
      headers: {
        auth_key: !action.config?.skipAuth && localStorage.getItem("auth-key") || "",
        "Accept-Language": Localization.lang,
        // "Content-Type": "application/json",
        ...action.headers,
      }
    }
  }
}
export function responseInterceptor() {
  return async (_action: Action, response: Response) => {
    if (hasResponseError(response)) {
      responseErrorHandling(response)
      return { ...response, error: true }
    }

    return response
  }
}

function hasResponseError(response: Response): boolean {
  if ((response.status || 0) >= 400) {
    return true
  }

  if (response.payload == null && response.status === 200) {
    return true
  }

  if (response.payload?.error) {
    return true
  }

  return false
}

function responseErrorHandling(response: Response) {
  if (response.status === 401) {
    localStorage.removeItem("token")
    toast.error("Что-то не так с авторизацией")
    toast.info("Токен был сброшен, авторизуйтесь ещё раз")
    store.dispatch(updateUser({ auth: false }))
  }
  toast.error(response.payload?.error.codes)
  return { ...response, error: true }
}
