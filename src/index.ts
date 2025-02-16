import App from "app/App"
import reportWebVitals from "infrastructure/services/reportWebVitals"
import * as serviceWorkerRegistration from "infrastructure/services/serviceWorkerRegistration"
import { createElement } from "react"
import { createRoot } from "react-dom/client"

require("polyfills")
require("preload")

const rootElement = document.getElementById("root")
if (rootElement) {
  const root = createRoot(rootElement)
  root.render(createElement(App))
}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.register({
  onUpdate(registration) {
    // Immediately skip waiting if should
    registration.waiting?.postMessage({ type: "SKIP_WAITING" })
  }
})

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()