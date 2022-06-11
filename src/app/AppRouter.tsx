import { Route, Routes } from "react-router"

import HomeView from "../views/home/HomeView"

function AppRoutes() {
  return (
    <Routes>
      <Route path="/">
        <Route index element={<HomeView />} />
      </Route>
    </Routes>
  )
}

export default AppRoutes
