# Day 1

비어있는 폴더를 멍하니 바라보며 하나씩 생각을 정리해봅니다.

태초로 돌아가 **UI를 만들 수 있는 그 무언가가 왜 필요했고, 무엇을 해결하려 했는지**만을 기준으로 하나씩 의사결정을 해보려 합니다.

### [1] 시작하며

> '왜' 이런 도구가 필요해졌을까요?

웹은 간단하게 생각해보면 Document를 전달하기 위한 플랫폼이었습니다.
HTML은 Markup Language로 구조를 정의하고, CSS는 모양/표현을 담당하고, JavaScript는 기능/동작을 설명합니다.  
DOM(Document Object Model)을 직접 조작하는 것도 낮은 복잡도에서는 충분히 감당 가능하지 않았을까요?

하지만 웹이 점차 Document에서 Application으로 확장되면서 상황은 변했습니다.

화면이 쉴새없이 바뀌고, 입력은 복잡해지며, 서버와의 비동기 통신도 늘어나고, 여러 상태를 오고갑니다.

이를 코드로 구현해야하는 개발자들은,  
상태를 어딘가에 저장하고, 상태가 바뀌면 DOM을 조작해서 업데이트 하고, 이벤트를 연결하며, 다시 상태를 수정하는 코드를 작성합니다.  
DOM API는 장황하고, UI가 복잡하면 복잡할수록 코드의 길이는 기하급수적으로 늘어납니다.

이 문제를 해결하기 위해 등장한 것이 React, Vue, Svelte와 같은 UI 라이브러리, 프레임워크입니다.  
물론 저마다 다른 구현과 철학을 가지고 있지만, 저는 공통적으로 하나의 질문에서 출발했다고 생각합니다.

> 상태와 UI를 연결하는 반복적인 일을 도구로 해결할 수 없을까요

### [2] Framework vs Library (feat. IoC)

이제 '도구' 라는 피상적인 표현에서 조금 더 소프트웨어스러운 표현으로 '무엇'을 만들지 정리해보겠습니다.

"프레임워크라고 불러야할까요, 라이브러리라고 해야할까요?"

단순히 상태와 UI를 연결하고자 하는데 프레임워크라는 표현은 뭔가 거창한 느낌입니다. 물론 멋지긴 하지만요.  
하물며 [React](https://react.dev/)조차 프레임워크가 아닌 라이브러리라고 공식 문서에 적혀있습니다. 정확한 정의를 알아볼 차례입니다.

StackOverflow에는 무려 17년 전에 저와 동일한 [질문](https://stackoverflow.com/questions/148747/what-is-the-difference-between-a-framework-and-a-library)을 남긴 사람이 있습니다.

그리고 작성 시점 기준으로 624개의 upvote를 받은 답변이 있습니다.

```
A library performs specific, well-defined operations.

A framework is a skeleton where the application defines the "meat" of the operation by filling out the skeleton. The skeleton still has code to link up the parts but the most important work is done by the application.

Examples of libraries: Network protocols, compression, image manipulation, string utilities, regular expression evaluation, math. Operations are self-contained.

Examples of frameworks: Web application system, Plug-in manager, GUI system. The framework defines the concept but the application defines the fundamental functionality that end-users care about.
```

해석해보면 다음과 같습니다.

- "라이브러리는 **특정 작업들을 수행**하는 도구이며 사용자가 필요할 때 **호출**해서 사용합니다"
- "프레임워크는 **어플리케이션의 뼈대 역할**을 제공하고, 그 안을 사용자의 코드로 채워넣어 실제 기능을 수행합니다"

대략 느낌은 오지만 명확하게 구분하는 기준은 **누가 누구를 호출하는지** 입니다.

라이브러리는 작성자가 라이브러리 코드를 호출하는 반면, 프레임워크는 프레임워크가 작성자의 코드를 호출하는 구조입니다.  
이 케이스를 소프트웨어 설계 관점에서 표현하면 **IoC(Inversion of Control)**, 제어의 역전이라고 합니다.

<img src="../assets/day-1_1.png" width="600">

이제 결정을 내릴 시간입니다.

1. 아직 완전히 질문이 정리되지 않은 상태에서 정답을 강제하는 프레임워크를 선택하는 것은 위험하다고 생각합니다.
2. 프레임워크는 규칙 변경 비용이 전체 구조에 전파되기 때문에 실험 비용이 크다고 생각합니다.

Trade-off는 다음과 같습니다,

- 라이브러리는 시행착오와 변경에 드는 비용이 낮으며, 추상화되지 않은 내부 구조를 관찰하기 쉽습니다.
- 다만 라이브러리는 사용의 자유도가 높기 때문에 최적화 지점을 중앙 통제하거나 생명주기와 같은 암묵적 규칙을 강제할 수 없습니다.

그리하여 지금 단계에서는 `kongnamul` 라는 '라이브러리'를 만든다는 접근이 맞아보입니다.

### [2-1] React는 진짜 라이브러리인가요?

이쯤에서 비슷한 의문이 드는 분들이 많지 않을까 생각합니다. (제가 React 생태계에서 개발을 해서 더욱 그럴 수도 있습니다)

> React는 hook과 같은 사용 규칙도 있고, JSX(JavaScript XML)라는 DSL(Domain Specific Language)도 강제하는데 왜 프레임워크가 아닌가요?

이 의문을 나름대로 해소하고 이해하고 넘어가보겠습니다.

React 공식 문서를 보면 강조하는 문장이 있습니다.

> "React: The library for web and native user interfaces"

처음에는 왠지 모르게 겸손하다고 생각했는데, 곰곰히 생각해보면 의도적인 선 긋기가 아닐까 합니다.  
React는 UI를 '선언적'으로 표현하는 문제만 해결하고, 라우팅, http request, 빌드, 배포는 관여하지 않습니다. 즉 어플리케이션의 생명주기 전체를 소유하지 않습니다.

'Hooks'도 마찬가지입니다. 이는 제어를 가져오기 위한 규칙이 아닙니다.  
React가 '최소한의 정보로 상태를 추론하고 연결'하기 위해 존재하는 것입니다.

그럼에도 React 내부에서 제어권의 역전(IoC)이 사용된 곳은 있다고 생각합니다.  
컴포넌트는 React가 호출하고 렌더링 사이클은 React가 관리합니다. UI 렌더링 영역으로 한정된 IoC가 아닐까 합니다.

프레임워크라 정의할 수 있는 Vercel의 [Next.js](https://vercel.com/frameworks/nextjs)나 구글의 [Angular.js](https://angularjs.org/)와 비교했을 때, React 정도면 라이브러리라고 인정해줘야하지 않을까 싶습니다.

좋은 의견과 설명이 있다면 언제든 남겨주세요.

### [3] 무엇을 해결해야할까요

다시 돌아와서 라이브러리로 해결하고자 하는 문제를 하나씩 정의해보겠습니다.

#### 상태(state)와 UI(view)를 연결해야합니다

> `UI = f(state)`.

UI는 State의 표현입니다.  
상태(state)의 형태를 정의하고, 상태는 UI를 만들 뿐입니다.

#### DOM 조작을 간편하게 해주어야합니다

> 라이브러리는 편해야합니다. DOM 조작을 추상화해주어야 합니다.

개발자는 "무엇"을 만들지 고민하고, 라이브러리는 "어떻게" 만들지를 책임집니다.

#### 지속 가능한 구조로 설계해야합니다

> 가급적이면 좋은 코드를 작성할 수 있어야 개발자가 지속적으로 유지할 수 있는 구조가 됩니다.

자연스럽게 관심사를 분리할 수 있게 해서 안정적인 구조로 작성할 수 있어야 합니다.

위 3개의 아이디어를 라이브러리의 철학(philosophy)으로 정해보도록 하겠습니다.  
구체적이지 않고 단순하지만 나름 단단한 것 같습니다. 대단히 특별할 것도 없는, 프론트엔드 개발자라면 다들 쉽게 고개를 끄덕일 수 있을 내용이지 않을까요.

### [4] UI를 그려봅시다

UI는 결국 어떤 시점의 데이터를 화면에 투영한 결과라고 생각합니다.  
이 생각을 하나의 식(式)으로 표현해보면 다음과 같습니다.

`UI = f(state)`

여기서 `state`는 어플리케이션이 가지고 있는 실질적인 데이터입니다.  
하지만 UI를 그리기 위해서는 DOM으로 그릴 수 있는, **렌더링 가능한 형태로 구조화된 데이터**가 필요합니다.  
이 글에서는 구조화된 UI의 표현을 `Render Schema(약칭 Schema)`라고 부르겠습니다.

- state: 애플리케이션의 실제 데이터
- render schema: state를 기반으로 만들어진 UI를 그릴 수 있는 중간 형태
- UI: schema를 DOM으로 변환한 실제 화면

즉 흐름을 정리하면 다음과 같습니다.

```
state -> render schema -> UI
```

예를 들어 아래처럼 간단한 UI가 있다고 해봅시다.

```html
<h1>콩나물</h1>
```

이 HTML 구조를 프로그래밍적으로 표현한 schema는 다음처럼 만들 수 있습니다.

```js
const schema = {
  type: "h1",
  content: "콩나물",
};
```

아직 props도 없고, children도 없고, nested 구조도 고려하지 않았습니다.  
하지만 일단 “태그(type)”와 “내용(content)”만으로 충분히 하나의 UI를 표현할 수 있으니 여기서 출발합니다.

이제는 schema를 실제 DOM Element로 만들어주는 렌더러(renderer)를 만들어야겠죠.

딱 "한 개의 태그와 한 개의 텍스트"만을 처리(변환)하는 렌더러 함수를 상상해봅시다.

```js
// packages/core/src/index.js

function render(schema, container) {
  const el = document.createElement(schema.type);
  const text = document.createTextNode(schema.content);
  el.appendChild(text);

  container.appendChild(el);
}
```

매우 단순하지만 1) schema 객체를 받아서, 2) DOM Element를 만들고, 3) 지정한 컨테이너에 붙이는 기능을 수행합니다.

그리고 이 렌더링 함수는 다음과 같이 사용합니다.

```js
// playground/src/main.js

import { render } from "@kongnamul/core";

const schema = {
  type: "h1",
  content: "콩나물",
};

const container = document.getElementById("app");
render(schema, container);
```

```html
<!-- playground/index.html -->

<html>
  ...
  <body>
    <div id="app"></div>
    <script type="module" src="/src/main.js"></script>
  </body>
</html>
```

그러면 우리가 기대한 UI가 나오게됩니다.

<div style="text-align: center; color:#aaaaaa;">
  <img src="../assets/day-1_2.png" width="600" />
  <p>실행결과</p>
</div>

- UI는 state의 결과다
- schema은 DOM을 그리기 위한 중간 표현이다
- render는 schema를 실제 UI로 바꿔주는 함수다

이 세 가지가 명확해지면 앞으로 attributes, children, nested 구조, 이벤트, 업데이트 등 더 복잡한 기능을 자연스럽게 확장할 수 있습니다.

### [5] 마치며

오늘은 여기까지 이야기를 적어보려 합니다.

`kongnamul`은 프레임워크가 아닌 **라이브러리**로 시작합니다.  
아직 UI를 다루는 '정답과 규칙'을 정하고 싶지 않았습니다.  
이 선택이 언제까지 유효할지는 모르겠습니다. 프로젝트가 진행됨에 따라 이 결정은 번복될 수도 있을겁니다.

상태를 UI로 표현하기로 했고, 표현하는 규칙을 schema라 정의했으며, 변환은 render 라는 함수로 수행합니다.

오늘 작성한 내용의 전체 코드는 아래에서 보실 수 있습니다.

> Day1: https://github.com/jaehuiui/kongnamul/tree/day-1
