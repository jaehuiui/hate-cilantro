import { render } from '@cilantro/core'

const schema = {
  type: 'h1',
  content: '저는 고수가 싫어요',
}

const container = document.getElementById('app')
render(schema, container)
