import { render } from '@cilantro/core'

const schema = {
  type: 'h1',
  props: {
    id: 'hate-cilantro-title',
    class: 'title',
  },
  children: [
    '저는 고수가 싫어요',
    {
      type: 'p',
      props: {
        id: 'hate-cilantro-description',
        class: 'description',
        style: 'font-size: 20px; color: #666;',
      },
      children: ['고수를 싫어하는 이유는 말이죠'],
    },
  ],
}

const container = document.getElementById('app')
render(schema, container)
