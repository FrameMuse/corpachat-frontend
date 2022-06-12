export function humanizeDate(date: Date) {
  return date.toLocaleString("ru", { hour: "2-digit", minute: "2-digit" })
}
