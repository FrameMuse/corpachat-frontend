type Item = string
type GetItem = () => Item | null
type SetItem = (value: Item) => void

function useLocalStorage(key: string, initValue?: Item): [GetItem, SetItem] {
  function getItem() {
    return localStorage.getItem(key) || initValue || null
  }
  function setItem(value: Item) {
    localStorage.setItem(key, value)
  }
  return [getItem, setItem]
}

export default useLocalStorage