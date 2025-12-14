export function render(schema, container) {
  // 문자열이면 텍스트 노드 생성(schema가 leaf node인 경우)
  if (typeof schema === 'string') {
    const textNode = document.createTextNode(schema)
    container.appendChild(textNode)
    return
  }

  //
  const el = document.createElement(schema.type)

  // props 처리
  if (schema.props) {
    Object.entries(schema.props).forEach(([key, value]) => {
      el.setAttribute(key, value)
    })
  }

  // children 처리
  if (schema.children) {
    schema.children.forEach(child => {
      render(child, el)
    })
  }

  container.appendChild(el)
}
