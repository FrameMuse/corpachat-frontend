import { Route, Routes } from "react-router"

import ViewLayout from "./layouts/ViewLayout/ViewLayout"
import ChatView from "./views/chat/ChatView"
import HomeView from "./views/home/HomeView"
import SignInView from "./views/sign-in/SignInView"
import SignUpView from "./views/sign-up/SignUpView"

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<ViewLayout />}>
        <Route index element={<HomeView />} />
        <Route path={AbsoluteAppRoutes.signUp} element={<SignUpView />} />
        <Route path={AbsoluteAppRoutes.signIn} element={<SignInView />} />
        <Route path={AbsoluteAppRoutes.chat} element={<ChatView />} />
      </Route>
    </Routes>
  )
}

export enum AbsoluteAppRoutes {
  signUp = "/sign-up",
  signIn = "/sign-in",
  chat = "/chat/:chatHashSum",
}

export default AppRoutes
