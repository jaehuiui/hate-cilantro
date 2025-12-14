import { render } from '@kongnamul/core'

const schema = {
  type: 'div',
  props: {
    id: 'container',
  },
  children: [
    {
      type: 'h1',
      props: {
        id: 'title',
      },
      children: ['콩나물 좋아하세요?'],
    },
    {
      type: 'p',
      props: {
        id: 'description',
      },
      children: ['콩나물 국밥은 참 맛있습니다.'],
    },
  ],
}

const container = document.getElementById('app')
render(schema, container)
