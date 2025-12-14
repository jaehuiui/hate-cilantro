export function render(schema, container) {
  // Leaf Node: 문자열이면 텍스트 노드 생성
  if (typeof schema === 'string') {
    const textNode = document.createTextNode(schema)
    container.appendChild(textNode)
    return
  }

  // Parent Node: Element 생성
  const el = document.createElement(schema.type)

  // Element: 속성 매핑
  if (schema.props) {
    Object.entries(schema.props).forEach(([key, value]) => {
      // Props: Event Handler 등록
      if (key.startsWith('on') && typeof value === 'function') {
        const eventName = key.slice(2).toLowerCase()
        // TODO: Event Validation 추가
        el.addEventListener(eventName, value)
      }
      // Props: 나머지 Props 등록
      else {
        el.setAttribute(key, value)
      }
    })
  }

  // Element: 재귀적으로 children 렌더링
  if (schema.children) {
    schema.children.forEach(child => {
      render(child, el)
    })
  }

  // Element: 동적으로 DOM에 연결
  container.appendChild(el)
}
