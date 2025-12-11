export function render(schema, container) {
  const el = document.createElement(schema.type)
  const text = document.createTextNode(schema.content)
  el.appendChild(text)

  container.appendChild(el)
}
