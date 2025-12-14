# Day 2

어제는 태그 하나와 텍스트 하나를 가진 간단한 UI 하나를 그리는데 성공했습니다.

"UI는 결국 데이터(State)의 결과물이다."

UI를 그릴 수 있는 구조화된 데이터를 `Render Schema`라 정의했고,  
그 schema를 DOM Element로 변환할 수 있는 render 함수를 만들었습니다.

오늘은 schema에 조금 더 집중해볼 생각입니다.

### [1] Schema가 똑똑해야 하나요

schema는 렌더러가 UI를 그리기 위한 일종의 **설계도이거나 설명서**로 본다면,  
UI를 디테일하게 표현하기 위한 속성(attribute)나 계층과 같은 정보가 필요해 보입니다.

그렇다면 더욱 파격적으로 schema 하나로 UI의 모든 것을 설명해보는 것은 어떨까요?

- 클릭 시 어떤 함수가 실행되는지
- 화면 크기에 따라 어떻게 변하는지
- 언제 생성되고 언제 파괴되는지
- 상태가 바뀌면 무엇을 다시 그릴지

제가 좋아하는 표현인데 이론상 충분히 가능합니다.  
실제로 이와 유사한 접근을 택한 UI 프레임워크도 존재하는 것으로 알고 있습니다.

하지만 이 지점에서 render schema는 UI의 묘사(description)를 넘어, UI의 실행 계획(plan)까지 포함하게 됩니다.  
당연히 아래와 같은 Trade-off를 포함하게 될 것이구요,

1. 렌더 함수나 스키마의 구조가 너무 복잡해지고 렌더러와 강하게 결합됩니다. 단순히 무엇을 그린다를 넘어 그리는 조건까지 알고 있기 때문입니다.
2. 데이터라기보단 실행 규칙을 담은 '코드'에 가까워집니다. (참고: DSL)
3. 가장 중요한 점은, 실행 계획에 해당하는 이전 상태와 변경 여부가 포함되면 더 이상 **'언제든 다시 만들 수 있는 데이터'**가 아니게 됩니다.

1일차에서 이야기했던 UI 렌더링 과정을 다음과 같은 흐름으로 바라본다면

```
state -> render schema -> UI
```

schema는 state의 결과물로서 **항상 새로 만들어질 수 있어야 합니다.**  
즉 동일한 state라면 항상 schema는 같아야 합니다. schema로 변환하는 함수 역시 순수해야 한다는 것입니다.  
하지만 schema가 실행 계획을 포함하는 순간, 맥락을 기억해야하고 판단해야 합니다.

schema는 단순한 데이터를 넘어 **규칙과 의미(semantics)를 포함한 "DSL(Domain Specific Language)"의 개념**으로 확장됩니다.

고로 schema는 "무엇을 그릴지"만 알고 "어떻게 동작할지"는 모르는 것으로 그 역할을 한정해보겠습니다.

실행의 **책임**은 renderer와 외부에 맡기고 **언제든 다시 만들 수 있는 순수한 UI description 데이터**로 정의합니다.

### [1-1] DSL은 무엇일까요?

앞선 챕터에서 'DSL' 이라는 표현을 사용했습니다.  
라이브러리라는 작고 작은 하나의 도메인을 **설계, 디자인**하는 입장에서 어떤 의미인지는 **아주 얕고 가볍게**만 짚고 넘어가면 좋을 것 같습니다.

C, Java, Python, XML과 같이 범용적으로 사용되는 GPL(General Purpose Language)와 대조되는 개념으로,  
특정 영역에 한정되어 사용되는 컴퓨터 언어라고 합니다.  
물론 그 경계가 항상 명확하지는 않은 스펙트럼과 같은 개념일 것입니다.

DSL에는 SQL, CSS, HTML, MATLAB 과 같이 말 그대로 특정 도메인에서만 사용되는, 특정 도메인의 문제를 표현하기 위한 언어입니다.

여러 자료들을 읽고 고민해본 결과,
제가 이 글에서 사용하는 DSL의 기준은 다음과 같습니다.

> DSL은 단순히 데이터(data)를 넘어 의미(semantics)를 가진 언어이고, 의미를 해석하는데는 규칙과 책임이 따릅니다.

그러면 JSX라는 조금 더 구체적인 예시를 들어보겠습니다.

"JSX도 UI를 설명하는 도메인 특화 언어가 아닐까요, JSX도 DSL이지 않나요?"

```jsx
// jsx
<h1>안녕하세요</h1>

// 컴파일 이후
React.createElement("h1", null, "안녕하세요")

// 런타임
{
  type: "h1",
  props: {},
  children: ["안녕하세요"]
}
```

제 관점에는 JSX는 자체는 의미를 정의하지는 않습니다.  
Preact, Solid와 같은 다른 런타임 환경에서도 재정의될 수 있기 때문입니다.

Babel이라는 transpiler가 단순히 구문 변환(syntactic desugaring)을 하는 것뿐입니다.  
어떠한 의미 판단이 들어가지도, 렌더링 제어도, 업데이트 전략도 포함하지 않습니다.  
컴파일러 레벨에서는 semantic phase가 없는 단순 macro expansion 입니다.

물론 그럼에도 JSX는 eDSL(embedded DSL)나 내부 DSL(internal DSL)로 분류된다고 하기도 합니다.

반대로 이런 예시가 schema가 DSL이 되는 케이스일겁니다,

```js
{
  type: "h1",
  children: ["안녕하세요"],
  when: "mounted",
  rerenderOn: ["user"],
  visibleIf: "windowOnRefetch"
}
```

이야기가 다소 길어지고 복잡해졌지만 한 번쯤 생각해봄직한 내용이었길 바랍니다.

[참고 자료]

- Martin Fowler의 DSL: https://www.martinfowler.com/dsl.html / https://www.martinfowler.com/articles/languageWorkbench.html#ExternalDsl
- Wikipedia: https://en.wikipedia.org/wiki/Domain-specific_language
- Compiler design: https://www.geeksforgeeks.org/compiler-design/introduction-of-compiler-design/

### [2] Schema를 트리구조로

나름대로 schema의 역할에 대한 기준은 세웠으니, 한 걸음씩 발전시켜 보겠습니다.

schema의 전체적인 형태는 어떻게 생겨야할까요?

조금은 작위적일 수 있지만 가장 먼저 트리(Tree)구조가 떠오릅니다.  
HTML 문서도, DOM도, 사람이 시각적으로 인식하는 UI도 전부 트리구조이기 때문이지 않을까요.

하지만 저는 리스트(List), 플랫한 배열(1-dimension Array), 심지어 그래프 구조(Graph)와 같은 대부분의 자료구조로 전부 표현할 수 있다고 생각합니다.

그럼에도 이미 트리구조가 많이 사용되는 이유는 트리구조가 가진 특성 때문일겁니다.

> A tree data structure is a hierarchical structure that is used to represent and organize data in a way that is easy to navigate and search. It is a collection of nodes that are connected by edges and has a hierarchical relationship between the nodes.

- 부분(Subtree)을 독립적인 의미 단위로 다룰 수 있고,
- 부모가 바뀌면 자식의 맥락도 함께 재해석되며,
- UI를 루트에서 리프까지, 위에서 아래로 해석할 수 있습니다.

<img src="../assets/day-2_1.png" alt="" width="600">

이러한 특징들의 장점이 명확하기에 Render Schema 역시 **트리구조로 표현할 수 있도록 합시다.**  
하지만 첫째 날 작성한 schema를 다시 살펴보면 content 필드는 너무 제한적입니다.

```js
{
  type: "h1",
  content: "..."
}
```

이 구조로는 “하나의 텍스트만 가진 노드” 밖에 표현할 수 없습니다. 그래서 schema를 트리로 확장합니다. UI 트리를 표현하는 가장 단순한 방법은 자식 노드를 배열로 가지는 것입니다.

```js
{
  type: "h1",
  children: ["콩나물"]
}
```

자연스럽게 children 배열에는 노드(새로운 하나의 schema)가 담길 수 있고, 이를 **재귀(recursive) 구조**라 표현합니다.

### [3] UI의 속성을 표현해봅시다

다음은 schema에 존재하는 UI 하나 하나를 조금 더 디테일하게 표현할 수 있는 description에 해당하는 정보가 필요합니다. 흔히 attributes, 혹은 props라고 부르는 "속성"을 추가할 차례입니다.

(뜬금없지만 네이밍 자체의 수려함은 중요하지 않다고 생각합니다. 그럼에도 대중적으로 사용하는 것, 다른 동료 혹은 누군가가 읽고 이해가 되는 직관적인 표현으로 작성하려고 노력하고 있습니다.)

```js
{
  type: 'h1',
  props: {
    id: 'title',
  },
  children: ['콩나물 좋아하세요?'],
}
```

이제는 `id`나 `class` 같은 표현을 위한 "속성" 정보도 schema에 추가되었습니다.

이것으로 schema는 1) 트리 구조를 그릴 수 있도록 재귀적인 구조로 진화했고, 2) UI를 구체적으로 표현할 수 있는 속성 필드가 추가되었습니다.

지금까지 schema를 확장하는데 공을 쏟았지만, 마지막으로 중요한 점을 짚고 넘어가려고 합니다.

**"schema는 사용자가 직접 조작하는 대상이 아닙니다."**

단순히 데이터(상태)로부터 만들어지며, 언제든 버려질 수 있는 중간 결과물에 불과합니다.  
renderer가 schema를 기억하거나 비교할 필요는 없습니다.

(이는 schema가 plan을 포함해서는 안된다는 관점과도 일치합니다)

### [4] 렌더 함수를 고쳐봅시다. 순수하게요

지금까지 schema를 확장하는데 공을 쏟았습니다.  
허나 schema는 의미만 담는 설계도에 불과하고, 그 의미를 실제 DOM으로 옮기는 책임은 renderer가 가집니다.

이렇게 중요한 "책임"을 가진 렌더 함수를 만들어볼 차례입니다.

```js
// (day1) packages/core/src/index.js

function render(schema, container) {
  const el = document.createElement(schema.type);
  const text = document.createTextNode(schema.content);
  el.appendChild(text);

  container.appendChild(el);
}
```

첫째 날의 함수는 재귀 구조와 속성을 처리해줄 수 없으니, 변환하는 로직을 조금 더 보완해줄 차례입니다.

<img src="../assets/day-2_2.png" alt="" width="600">

본 글에서 트리구조라는 자료 구조를 깊이 있게 설명하지는 않겠지만, 용어 몇 개는 정리해서 적어둡니다. (첨부 이미지 참고)

- Node: 데이터를 담고 다른 노드와 연결되는 기본 구성 단위, 각각의 네모를 지칭합니다.
- Root / Parent / Child Node: 각각 최상단, 자식이 있는 노드, 부모를 가지고 있는 노드
- Leaf Node: 자식 노드가 없는 노드 (= External Node)

```js
// packages/core/src/index.js

export function render(schema, container) {
  // 문자열이면 텍스트 노드 생성(schema가 leaf node인 경우)
  if (typeof schema === "string") {
    const textNode = document.createTextNode(schema);
    container.appendChild(textNode);
    return;
  }

  // Element 생성
  const el = document.createElement(schema.type);

  // Attributes 처리
  if (schema.props) {
    Object.entries(schema.props).forEach(([key, value]) => {
      el.setAttribute(key, value);
    });
  }

  // Children 처리
  if (schema.children) {
    schema.children.forEach((child) => {
      render(child, el);
    });
  }

  container.appendChild(el);
}
```

다음과 같이 작성하면 재귀적으로 실행되며 각 UI에 속성을 할당해줄 수 있을겁니다.

이렇게 구현한 렌더함수를 실제로 playground에서 실행을 해보면,

```js
// playground/src/main.js

import { render } from "@kongnamul/core";

const schema = {
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
      children: ["콩나물 좋아하세요?"],
    },
    {
      type: "p",
      props: {
        id: "description",
      },
      children: ["콩나물 국밥은 참 맛있습니다."],
    },
  ],
};

const container = document.getElementById("app");
render(schema, container);
```

<img src="../assets/day-2_3.png" alt="" width=600>

우리의 의도대로 자식 구조를 그리는데 성공했고, 속성 정보도 잘 들어가는 것을 볼 수 있습니다.

지금 renderer는 매우 단순하고 정직하고 또 "순수"합니다.
schema라는 설계도를 읽고, 그 구조 그대로 DOM을 생성할 뿐입니다.

- 이전 UI를 기억하지 않고
- 변화가 있었는지도 모르며
- 언제 다시 호출되는지도 알지 못합니다.

### [5] 마치며

내일부터는 상태가 변화하고 그에 따라 UI가 '최신화'에 되는 동작을 설명해보려고 합니다.

오늘은 schema의 책임, DSL, 트리 구조의 선택, 순수한 render 함수라는 결정들을 내려보았습니다.

오늘의 이야기 역시 자그마한 고민거리가 되었으면 좋겠습니다.

Day2의 전체 코드는 아래 링크에서 보실 수 있습니다.

> Day2: https://github.com/jaehuiui/kongnamul/tree/day-2
