import "./ViewLayout.scss"

import Footer from "app/areas/footer/Footer/Footer"
import Header from "app/areas/header/Header/Header"
import { ReactNode } from "react"
import { Outlet } from "react-router"

interface ViewLayoutProps {
  children?: ReactNode
}

function ViewLayout(props: ViewLayoutProps) {
  return (
    <>
      <Header />
      <main>
        <div className="view-layout">
          {props.children || <Outlet />}
        </div>
      </main>
      <Footer />
    </>
  )
}

export default ViewLayout
