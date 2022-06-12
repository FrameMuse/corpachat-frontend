declare global {
  namespace NodeJS {
    interface ProcessEnv {
      // React App
      readonly REACT_APP_API_HOST: string
      readonly REACT_APP_SOCKET_HOST: string
      readonly REACT_APP_API_CACHE: string
      readonly REACT_APP_API_CACHE_TIME: string
    }
  }
}

export { }
