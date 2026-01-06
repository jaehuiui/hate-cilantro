import { render, debug } from '@kongnamul/core'

debug()

let state = {
  like: 0,
}

// state -> schema 생성
function createSchema(state) {
  return {
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
        children: [`콩나물 좋아하는 사람: ${state.like}명`],
      },
      {
        type: 'button',
        props: {
          onClick: () => {
            updateState(state => {
              state.like += 1
            })
          },
        },
        children: ['콩나물 국밥 좋아하는 분들만 눌러주세요.'],
      },
    ],
  }
}

const container = document.getElementById('app')

// state 업데이트 함수
function updateState(callback) {
  callback(state)
  updateDOM()
}

// DOM 업데이트 동작
function updateDOM() {
  const nextSchema = createSchema(state)
  render(nextSchema, container)
}

updateDOM()
