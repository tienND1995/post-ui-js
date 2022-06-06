export function setTextContent(parent, selector, text) {
  if (!parent) return
  const result = parent.querySelector(selector)
  result.textContent = text
}

export function setBackGround(parent, selector, imageUrl) {
  if (!parent) return
  const result = parent.querySelector(selector)
  result.style.backgroundImage = `url(${imageUrl})`
}

export function setTextCapitalize(text) {
  if (!text) return

  const result = text[0].toUpperCase().concat(text.slice(1))
  return result
}

export function setFieldValues(parent, selector, value) {
  if (!selector) return
  const result = parent.querySelector(selector)
  return (result.value = value)
}

export function randomNumber(n) {
  const number = Math.trunc(Math.random() * n)
  return number
}