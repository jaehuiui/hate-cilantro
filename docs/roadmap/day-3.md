# Day3: 변화에는 동기가 필요합니다

<img src="../../assets/kong-3.png" width="256">

2일 차까지의 만든 라이브러리의 구조를 다시 살펴보면,  
UI의 설계도 역할을 하는 schema가 만들었고 render 함수로 schema를 DOM에 연결하는 동작을 수행합니다.

<img src="../assets/day-3_1.png" width="600">

이벤트 핸들러를 연결해서 클릭, 터치, 입력과 같은 동작을 표현하는 기반은 다져두었지만 아직은 **정적인 문서**에 불과합니다.  
유저가 뭔가를 입력하고 화면을 조작했을 때 실제 문서 내의 정보 변화는 어떻게 구현할 수 있을까요?

보다 정돈된 질문은 다음과 같을겁니다.

> 'schema는 언제, 왜, 어떻게 다시 만들어질까'

### [1] 변화에는 동기가 필요합니다

사람도 그렇지만 무언가 변화가 생기기 위해서는 **동기(motivation)**가 필요합니다.  
동기는 문득 떠오른 생각이나 자그마한 말 한마디가 될 수도 있고, 지내는 환경의 변화와 같은 큰 이벤트일 수도 있을겁니다.

콩나물 라이브러리에서는 **상태(state)**라는 개념이 schema의 변화의 동기가 되어줄겁니다.

상태라는 표현은 `useState`로 이미 익숙한 용어지만,  
[State Machine, 오토마타](https://developer.mozilla.org/ko/docs/Glossary/State_machine)와 같은 예시처럼 컴퓨터 공학에서 state는 그 자체로 많이 사용되는 표현이기도 합니다.  
앞으로는 **외부 입력이 상태 변화를 만들고 출력으로 새로운 schema를 생성**하는 동작 흐름을 수행하게 될 것입니다.

<img src="../assets/day-3_2.png" width="700" />

상태를 변하게 할 수 있는 외부의 입력으로는 여러 케이스가 있습니다.

- 유저가 좋아요 버튼을 눌러서 좋아요 개수가 +1 이 된다던지,
- 유저가 새로운 글을 게시해서 서버 -> DB -> 클라이언트 순으로 업데이트가 된다던지,
- 모종의 사유로 서버가 먹통이 되어 네트워크 요청이 단절이 될 수도 있겠죠

정리해보면,  
**state는 schema를 변화시키는 동기가 되는 데이터**로 정의할 수 있습니다.

### [2] 연결고리가 필요합니다

state를 가장 단순하게 표현해보면 다음과 같습니다.

```js
let state = {
  like: 0,
};
```

state는 DOM도, 이벤트도, renderer도 모르는 작은 객체일 뿐입니다.

그럼에도 우리가 정의한 state는 schema의 변화를 만드는 역할을 해야하는데,  
**누가 state 변화를 감지하고, 언제 schema를 다시 만들고, render는 언제 다시 호출할까요?**

```js
state.count += 1;
render(createSchema(state), container);
```

가장 원시적인 방법으로 연결고리를 만들어보자면,  
state 업데이트 동작이 render까지 직접 호출하는 것입니다.
허나 이 방식에는 문제가 있습니다.

state가 renderer와 서로 접점이 생기고, DOM 생명주기에도 관여할 여지가 생깁니다.  
이는 state의 설계 의도와 전혀 맞지 않습니다.

완충 영역이 필요합니다.

1. state의 업데이트 동작을 별도의 추상화된 레이어로 제공하고,
2. schema는 state로 파라미터로 하는 순수 함수의 결과물로 수정해보면 어떨까요?

```js
// playground/src/main.js

// state -> schema 생성
function createSchema(state) {
  return {
    type: "div",
    props: {
      id: "container",
    },
    children: [
      {
        type: "h1",
        props: {
          id: "title",
        },
        children: [`콩나물 좋아하는 사람: ${state.like}명`],
      },
      {
        type: "button",
        props: {
          onClick: () => {
            updateState((state) => {
              state.like += 1;
            });
          },
        },
        children: ["콩나물 국밥 좋아하는 분들만 눌러주세요."],
      },
    ],
  };
}

// state 업데이트 함수
function updateState(callback) {
  callback(state);
  updateDOM();
}

// DOM 업데이트 동작
function updateDOM() {
  // 기존 DOM 제거
  container.innerHTML = "";

  const nextSchema = createSchema(state);
  render(nextSchema, container);
}
```

별반 다르지 않은 것 같나요?  
단순히 함수 하나를 추가하고 render 호출을 감췄다고 볼 수도 있습니다.

요리에도 의도가 중요하듯,  
**상태 변경이 일어났다는 사실을 관찰할 수 있는 엔트리 포인트를 하나로 제공했다** 정도로 지금은 이해해주시면 좋을 것 같습니다.  
이를테면 logging을 제공하거나 diff trigger가 필요할 때도, 이곳저곳에서 호출하는 것이 아니라 `updateState` 함수만 신경쓰면 되는 것이죠.

여기까지 해서 state의 변경이 schema를 변화하게 만들고 새로운 UI를 그리는 흐름을 구현해보았습니다.

### [3] 매번 DOM을 지워야할까요

<img src="../assets/day-3_3.gif" width="600">

```js
function updateDOM() {
  container.innerHTML = "";

  const nextSchema = createSchema(state);
  render(nextSchema, container);
}
```

화면 상으로는 티가 나지 않지만, 코드를 살펴보면 매번 DOM을 깨끗하게 비우고 다시 그리는 동작을 반복하고 있습니다.

물론 이 과정은 어떠한 맥락이나 정보를 기억하지 않아도 된다는 점에서,  
단순하고 깔끔하고 직관적입니다.

그렇지만 설계 관점에서는 **비용**을 포기한 선택입니다.  
**DOM을 파괴하고 다시 그리는 비용은 꽤 비싸기 때문입니다.**

기분 전환이 필요해서 집 안의 가구 배치를 바꾸려고 하는데,  
집을 아예 때려부수고 집을 새로 지어버리는 것과 똑같습니다. 아무래도 조금 과격한 예시일려나요.

DOM은 단순한 객체를 넘어, 브라우저 내부의 아주 복잡한 C++ 객체이며 우리가 최적화를 할 때면 골머리를 앓는 layout, paint, composition도 강하게 결합되어 있습니다.  
고로 DOM을 전부 다시 그린다는 선택은 웹 어플리케이션 라이브러리에는 매우 적합하지 않습니다.

그렇다면 **필요한 부분만 DOM을 업데이트**하는 선택지가 있을겁니다.  
물론 필요한 부분을 알기 위해서는 **누군가는 변경 사항을 기억**하고 있어야 하구요.

참고로 여기서 말하는 ‘기억’이란,
이전 UI의 결과(DOM)가 아니라 **이전 UI를 만들었던 설계도(schema)**를 의미합니다.

두 가지 방법 정도가 떠오릅니다.

1. schema가 자기 자신의 변화를 기억한다
2. renderer가 이전 schema를 기억한다

아쉽지만 1번은 불합격입니다.  
앞선 2일차의 논의에서 schema는 DSL이 아닌 UI description 정보로 역할을 국한하기로 했기 때문입니다.  
schema는 언제든 새로 만들어질 수 있고 쉽게 폐기되어야 합니다.

그렇다면 남은 선택지는 2번입니다.

renderer는 바로 이전 상태와 다음 상태를 비교해서 수정이 생긴 부분만 업데이트해주면 됩니다.  
이 선택으로 얻는 장점 역시 명확합니다.

- schema를 순수하게 유지할 수 있으며,
- state와 renderer를 여전히 분리할 수 있으며,
- 변화(diff) 판단부터 DOM 수정(patch)까지 renderer 내부에서 처리할 수 있습니다.

### [3-1] 그런데 꼭 기억을 해야하나요?

방금 전 챕터에서 필요한 부분을 업데이트한다는 선택은 내렸는데,  
변경 사항을 기억한다는 것이 진짜 유일한 방법일까요?

기억을 한다는 건 곧 **상태를 가진다(stateful)**는 뜻이고,
이는 renderer를 단순한 함수 이상의 존재로 끌어올립니다.

직관적이고 익숙한 방식일지라도 구렁이가 담 넘어가듯 정하기엔 라이브러리의 설계에 있어 중대한 결정입니다.  
이런저런 방법들을 몇 개 떠올려보겠습니다.

#### 선택지 1: 컴파일 단계에서 DOM 업데이트 코드를 포함합니다

꼭 런타임에 처리하지 않아도 괜찮지 않을까요?
**컴파일 단계부터 변경될 수 있는 케이스를 전부 포함해서 빌드를 해버리는, 일종의 state machine을 만드는 것**입니다.

즉 schema를 직접 실행하지 않고,
빌드 단계에서 다음과 같은 코드를 생성하는 방식입니다.

```js
if (prev.like !== next.like) {
  likeTextNode.nodeValue = `콩나물 좋아하는 사람: ${next.like}명`;
}
```

조금 더 설명해보자면,

- diff 로직은 컴파일 단계로 넘어가며,
- DOM 업데이트 로직 역시 미리 결정되며,
- 런타임 renderer의 역할이 매우 축소될겁니다

익숙하지는 않지만 뭔가 매력적입니다. 다음과 같은 이점도 있을 것 같습니다.

- 런타임 비용이 거의 없는 수준일테고,
- DOM 업데이트도 엄청 빠를겁니다.
- 사실 '기억'하는 것도 아닙니다.

쉽게 넘어갈 뻔 했지만 곰곰히 생각해보면 보통 일이 아닙니다.  
콩나물은 아예 프레임워크 레벨로 격상되어야합니다.  
빌드 파이프라인 수행을 위한 별도의 컴파일러도 필요하구요. 더 이상 schema도 JS 객체가 아닙니다.

고로 컴파일 단계에 의존적인 UI 프레임워크를 구현한다는 선택지는 이번에는 미뤄둡니다.

(정확하지는 않지만 Svelte가 이런 식으로 구현된 것으로 아는데요, 사용해본 적은 없지만 후기가 궁금합니다)

#### 선택지 2: DOM이 state를 직접 구독합니다 (Pub/Sub, Observer)

아니면 이런 방법은 어떨까요.  
아예 DOM 노드 레벨에서 state를 관찰(subscribe or observe)하는 것입니다.

[Observer Pattern](https://refactoring.guru/design-patterns/observer)이라는 주요한 디자인 패턴과 동일한 느낌입니다.  
패턴 관점에서는 state는 publisher고, DOM Node는 subscriber가 되는 것입니다.

코드로 예시를 들어보면 이런 느낌입니다.

```js
const like = observable(0);

bind(textNode, () => `콩나물 좋아하는 사람: ${like.value}명`);
```

이 패턴도 매력적이지만 trade-off도 명확합니다.

- state 시스템이 pub/sub 패턴으로 인해 매우 복잡해지며,
- UI 구조 역시 binding으로 인해 파악이 어렵고,
- schema -> UI 라는 기존 설계 구조가 깨진다는 문제도 있습니다. state + schema -> UI에 가깝습니다.

무엇보다 이 방식에서는,  
UI가 '한 번에 계산되는 결과물'이 아니라 여러 구독 지점에 흩어진 반응들의 집합이 됩니다.

eventListener를 add/remove 하다보면 중앙 제어가 어렵다는 것과 같은 맥락입니다.

#### 선택지 3: state 변경 사항을 명령으로 전파합니다 (Command)

군인 정신이 드러나는 선택지도 있습니다.  
[Command Pattern](https://refactoring.guru/design-patterns/command)으로 변경 사항을 전파해주는 패턴입니다.

```js
update([setText("like-count", state.like), updateClass("container", "active")]);
```

- diff가 불필요합니다.
- renderer는 전파받은 명령을 그대로 수행할 뿐이며, DOM 업데이트가 명시적입니다.

선언적 프로그래밍(declarative programming)과는 정반대인 명령형 프로그래밍(imperative programming) 방식입니다.  
뭐라고 표현해야하려나요. clear한 느낌이긴 합니다.

그러나 다음과 같은 단점이 있겠죠,

- 전체 UI를 한 번에 집약적으로 설명하기 어렵고,
- 변경 이력이 모두 코드가 되며,
- UI의 현재 상태라는 개념을 추출하고 복원하는 것이 어렵습니다.

조금은 저수준 UI 시스템이나 게임 UI에 조금 더 어울리는 느낌입니다.

#### 선택지 4: 다시 돌아와서 renderer가 schema를 기억합니다

다시 처음으로 돌아와서, renderer가 schema를 기억하는 것은 정말 옳은 선택일까요?

이 선택에도 trade-off는 분명 존재합니다.

- render 함수는 더 이상 순수 함수가 아닙니다. 되려 내부 상태를 가지는 객체이자, 이전 호출 이력에 따라 다른 출력을 만들게 됩니다.
- schema가 거대한 tree라면 메모리 이슈가 발생합니다.
- 무조건 schema 객체를 재귀적으로 순회를 해야합니다.

이러한 비용을 감수하더라도 **명확한 이점이 있기 때문에 결정을 내렸습니다.**

선언적인 UI 모델을 유지할 수 있고,  
별도의 컴파일러나 복잡한 시스템 없이도 동작하는 단순한 해법이자,  
나중에 다른 결정을 내린다고 해도 이 구조 위에서 점진적인 전환이 가능한 범용적인 모델입니다.

### [4] 간단한 diff & patch를 만들어봅시다

이제 방향성은 충분히 정리된 것 같습니다.

완벽하지는 않아도 가장 단순한 형태의 diff & patch를 만들어보겠습니다.
(글 마지막에 day3 코드를 볼 수 있는 링크가 있습니다.)

다음과 같은 순서로 진행해보겠습니다.

1. `createElement()`: schema -> DOM 신규 생성
2. `diff()`: prev/next 비교하여 교체된 DOM 반환 (`createElement()`를 활용)
3. `updateProps()`: prev/next 비교하여 Element의 Props 교체
4. `updateChildren()`: prev/next 비교하여 Children 교체
5. `render()`: 위 로직을 전부 활용하여 렌더링 동작 재정의

조금 길어지겠지만 간단한 내용입니다.

먼저 기존의 render 함수를 수정해서 새로 생성한 DOM을 **반환**하는 `createElement` 함수를 만듭니다.

```js
function createElement(schema) {
  // Leaf Node: 문자열이면 텍스트 노드 생성
  if (typeof schema === "string") {
    const textNode = document.createTextNode(schema);
    return textNode;
  }

  // Parent Node: Element 생성
  const el = document.createElement(schema.type);

  // Element: 속성 매핑
  if (schema.props) {
    Object.entries(schema.props).forEach(([key, value]) => {
      // Props: Event Handler 등록
      if (key.startsWith("on") && typeof value === "function") {
        const eventName = key.slice(2).toLowerCase();
        // TODO: Event Validation 추가
        el.addEventListener(eventName, value);
      }
      // Props: 나머지 Props 등록
      else {
        el.setAttribute(key, value);
      }
    });
  }

  // Element: 재귀적으로 children 생성
  if (schema.children) {
    schema.children.forEach((child) => {
      el.appendChild(createElement(child));
    });
  }

  return el;
}
```

그 다음으로는 diff이자 patch를 수행해주는 `diff` 함수를 구현합니다.  
추후 diff 알고리즘이 고도화되면 자연스럽게 diff, patch 등 세부 단계로 분리될겁니다.

```js
function diff(prevSchema, nextSchema, dom) {
  // case 1: next schema가 없으면 제거
  if (!nextSchema) {
    dom.remove();
    return null;
  }

  // case 2: prev schema가 없으면 신규 생성
  if (!prevSchema) {
    const newDom = createElement(nextSchema);
    dom.appendChild(newDom);
    return newDom;
  }

  // case 3: node type이 다르면 교체
  if (
    typeof prevSchema !== typeof nextSchema ||
    (typeof nextSchema !== "string" && prevSchema.type !== nextSchema.type)
  ) {
    const newDom = createElement(nextSchema);
    dom.replaceWith(newDom);
    return newDom;
  }

  // case 4: leaf node (텍스트 노드)
  if (typeof nextSchema === "string") {
    if (prevSchema !== nextSchema) {
      dom.textContent = nextSchema;
    }
    return dom;
  }

  // case 5: 같은 타입 element → props / children 업데이트
  updateProps(dom, prevSchema.props, nextSchema.props);
  updateChildren(dom, prevSchema.children, nextSchema.children);

  return dom;
}
```

그 다음으로는 비교적 간단한 Props와 Children 업데이트 동작입니다.

```js
function updateProps(dom, prevProps = {}, nextProps = {}) {
  // 존재하지 않는 props 제거
  Object.keys(prevProps).forEach((key) => {
    if (!(key in nextProps)) {
      dom.removeAttribute(key);
      updated = true;
    }
  });

  // 신규 props 추가 / 기존 props 변경
  Object.entries(nextProps).forEach(([key, value]) => {
    if (prevProps[key] !== value) {
      if (key.startsWith("on") && typeof value === "function") {
        const eventName = key.slice(2).toLowerCase();
        dom[eventName] = value;
      } else {
        dom.setAttribute(key, value);
      }
    }
  });
}

function updateChildren(dom, prevChildren = [], nextChildren = []) {
  const maxLength = Math.max(prevChildren.length, nextChildren.length);

  for (let i = 0; i < maxLength; i++) {
    const childDom = dom.childNodes[i];
    diff(prevChildren[i], nextChildren[i], childDom);
  }
}
```

정리해보면,

- 최초 mount 시에는 `createElement`로 DOM을 만들고 container에 추가해주고,
- 이후 상태 변경에 따른 리렌더링 시에는 `diff`로 변경이 발생한 DOM만 patch 해주고,
- 이전 schema를 새로운 schema로 업데이트해주면 됩니다.

```js
let prevSchema = null;
let rootNode = null;

function render(schema, container) {
  // 최초 mount 동작
  if (!prevSchema) {
    rootNode = createElement(schema);
    container.appendChild(rootNode);
  }
  // 이후 리렌더링 동작
  else {
    rootNode = diff(prevSchema, schema, rootNode);
  }

  // 이전 schema 업데이트
  prevSchema = schema;
}
```

시각적으로 업데이트 여부를 나타내기 위해 debugger를 추가했습니다.

```css
[data-diff="replace"] {
  outline: 2px solid #ff4d4f;
}

[data-diff="text"] {
  background: rgba(255, 196, 0, 0.2);
}

[data-diff="props"] {
  outline: 2px dashed #1890ff;
}

[data-diff="child"] {
  outline: 2px dotted #52c41a;
}
```

<img src="../assets/day-3_4.gif" width="600" />

전체 컨테이너가 아닌 텍스트와 버튼에만 각각 'text update'와 'props update'가 발생함을 관찰할 수 있습니다.

text는 그럴 수 있는데 props도 업데이트가 되는걸까요?

```js
props: {
  onClick: () => {
    updateState((state) => {
      state.like += 1;
    });
  },
},
```

코드만 보면 똑같지만 state가 업데이트 되면서 매번 schema라는 객체가 새로 만들어집니다.  
즉, `onClick` 핸들러는 새로 생성되는 함수입니다.  
JS에서 함수는 값이 아니라 객체이며 매번 다른 참조를 가집니다.

### [5] 마치며

글을 작성하다보면 은연중에 익숙한 패턴을 좇고 있는 것은 아닐까라는 걱정이 될 때가 있곤 합니다.

매 순간순간이 중요한 의사결정이기도 하고, 다른 선택지가 있음에도 은근슬쩍 넘어가진 않았을까 싶기도 합니다.  
그럼에도 글을 읽어주는 분들에게는 작은 인사이트가 되었으면 하는 바람으로 적어봅니다.  
혹여 제가 놓쳤거나 더 좋은 의견이 있다면 언제든 말씀해주세요.

이제 조금씩 라이브러리가 되어가고 있습니다.

- state로 schema의 변화를 만드는 구조를 정의했고,
- state가 업데이트되는 동작을 정의했으며,
- DOM이 state에 따라 업데이트되는 방향성을 다양하게 검토하고 정했습니다.
- 마지막으로 diff & patch 동작도 간단하지만 적용하여 DOM 업데이트 비용을 줄이기 위해 노력했습니다.

내일은 diff 알고리즘에 집중해보려고 합니다.

오늘도 긴 글 읽어주셔서 감사합니다.

Day3의 전체 코드는 아래 링크에서 보실 수 있습니다.

> Day3: https://github.com/jaehuiui/kongnamul/tree/day-3
