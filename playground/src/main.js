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
      type: 'button',
      props: {
        onClick: () => {
          console.log('클릭 이벤트입니다.')
        },
      },
      children: ['콩나물 국밥 좋아하는 분들만 눌러주세요.'],
    },
  ],
}

const container = document.getElementById('app')
render(schema, container)
