# Day 1: UI 라이브러리를 만들어봅시다

<img src="../../assets/kong-1.png" width="256">

React, Vue, Angular, Svelte, Astro, Solid, Qwik 과 같이 웹 어플리케이션을 구현하기 위한 선택지는 참 많습니다.

이번에 만들어볼 **콩나물**도 여기에 어깨를 나란히했으면 좋겠지만, 현실적으로 어려워도 비스무리한 그 무언가가 되기 위한 여정을 시작해보겠습니다.

처음은 청사진을 그리기 위한 아이디에이션을 할 차례입니다.  
소프트웨어 설계 관점에서 '**왜 필요하고**', '**무엇을 만든다**' 를 먼저 정리해보겠습니다.

### [1] 왜 필요할까요

> 왜 UI 라이브러리나 프레임워크가 필요했을까요?

웹의 근본을 간단하게 생각해보면 문서(Document)를 전달하기 위한 플랫폼이었습니다.

- `HTML`은 Markup Language로 구조를 정의하고,
- `CSS`는 모양/표현을 담당하고,
- `JavaScript`는 기능/동작을 설명합니다.

하지만 기술의 발전과 이런저런 이유로 웹이 점차 Document에서 Application 레벨로 복잡해지면서 상황은 달라졌습니다.

유저와의 상호작용으로 인해 화면은 쉴새없이 바뀌고, 입력은 복잡해지며, 서버와의 비동기 통신도 늘어났습니다.  
이처럼 복잡한 UI(User Interface)를 동적으로 제어하고 표현하기 위해서는 JavaScript를 통해 DOM(Document Object Model)을 직접 조작해주어야 하겠죠.

하지만 이 과정이 여간 복잡한 것이 아닙니다.  
상태 정보를 어딘가에 저장해두었다가, 상태가 바뀌면 DOM을 조작해서 업데이트 하고, 클릭과 같은 다양한 이벤트를 연결/해제하며, 이러한 이벤트의 동작에 맞게 상태를 수정하는 코드를 작성해야합니다.

이 동작을 추상화된 도구 없이 한땀한땀 기술하기에는 DOM API는 장황하고, 최적화와 코드 규모까지 함께 책임져야 한다는 문제가 있습니다.

고로 프레임워크 레벨로 규칙을 정의하든, 라이브러리 정도로 추상화된 패턴을 제공해주어야 훨씬 생산적이고 안정적으로 구현할 수 있겠죠.  
도구의 존재 이유를 보다 정제된 표현으로 다듬어보면 아래와 같습니다.

> **JavaScript로 DOM을 조작하고 상태와 UI를 관리하는 반복적인 코드를 추상화하기 위해 존재합니다.**

### [2] 무엇을 만들까요

이제는 '**도구**'라는 피상적인 표현에서 벗어나 조금 더 소프트웨어에 어울리는 표현으로 콩나물이 '**무엇**'인지 정의해보겠습니다.

'프레임워크(Framework)를 만들까요, 라이브러리(Library)를 만들까요?'

제게 익숙한 [React](https://react.dev/)는 공식 문서 상으로 라이브러리라는 표현을 사용하고 있습니다.  
단순히 소프트웨어의 볼륨과 복잡도를 기준으로 구분하는 것은 아닌 것 같습니다.  
정확한 의미를 알아보겠습니다.

StackOverflow에는 무려 17년 전에 저와 동일한 [질문](https://stackoverflow.com/questions/148747/what-is-the-difference-between-a-framework-and-a-library)을 남긴 사람이 있습니다.

질문에는 본 글 작성 시점 기준으로 624개의 upvote를 받은 답변이 있습니다.

```
A library performs specific, well-defined operations.

A framework is a skeleton where the application defines the "meat" of the operation by filling out the skeleton. The skeleton still has code to link up the parts but the most important work is done by the application.

Examples of libraries: Network protocols, compression, image manipulation, string utilities, regular expression evaluation, math. Operations are self-contained.

Examples of frameworks: Web application system, Plug-in manager, GUI system. The framework defines the concept but the application defines the fundamental functionality that end-users care about.
```

해석해보면 다음과 같습니다.

- "라이브러리는 **특정 작업들을 수행**하는 도구이며 사용자가 필요할 때 **호출**해서 사용합니다"
- "프레임워크는 **어플리케이션의 뼈대 역할**을 제공하고, 그 안을 사용자의 코드로 채워넣어 실제 기능을 수행합니다"

**둘을 명확하게 구분하는 기준은 누가 누구를 호출하는지** 였습니다.

라이브러리는 작성자가 라이브러리 코드를 호출하는 반면, 프레임워크는 프레임워크가 작성자의 코드를 호출하는 구조입니다.  
이 케이스를 소프트웨어 설계 관점에서 표현하면 **IoC(Inversion of Control)**, 제어의 역전이라고 합니다.

<img src="../assets/day-1_1.png" width="600">

Trade-off를 정리해보면 다음과 같습니다,

**[라이브러리]**

- 라이브러리는 시행착오와 변경에 드는 비용이 낮으며, 추상화되지 않은 내부 구조를 관찰하기 쉽습니다.
- 다만 라이브러리는 사용의 자유도가 높기 때문에 최적화 지점을 중앙 통제하거나 생명주기와 같은 암묵적 규칙을 강제할 수 없습니다.

**[프레임워크]**

- 프레임워크는 안정적으로 의도한 규칙을 사용자에게 강제할 수 있습니다.
- 완전히 방향성이 정돈되지 않은 상태에서 규칙을 강제하는 프레임워크를 선택하기에는 리스크가 있습니다. 또한 프레임워크는 규칙을 변경하면 프레임워크 전체 구조에 전파되기 때문에 실험 비용이 크다고 생각합니다.

이제 결정을 내릴 시간입니다.

현재 단계에서는 앞으로 풀어야 할 질문이 많습니다.  
이를테면 생명주기든, UI의 모델링이든, 상태 관리든 확정되지 않은 것들이 많습니다.  
규칙을 발견해보고 개념의 타당성을 검증해보아야 합니다.

그리하여 지금 단계에서는 `콩나물`은 '라이브러리'로 결정하고 진행해보겠습니다.

### [2-1] React는 정말 라이브러리인가요

이쯤에서 저와 비슷한 의문이 생기는 분들이 있으리라 생각합니다. (제가 React 생태계에서 개발을 해서 더욱 그럴 수도 있습니다)

> React는 hook과 같은 사용 규칙도 있고, JSX(JavaScript XML)라는 DSL(Domain Specific Language)도 강제하는데 프레임워크가 아닌가요?

이 의문에 대한 답을 나름대로 해소하고 넘어가보겠습니다.

React 공식 문서를 보면 강조하는 문장이 있습니다.

> 'React: The library for web and native user interfaces'

문장을 곰곰히 곱씹어보면 의도적인 선 긋기로 느껴집니다.  
React는 UI를 '선언적'으로 표현하는 문제만 집중하고, 라우팅, http request, 빌드, 배포는 관여하지 않습니다. 즉 어플리케이션의 생명주기 전체를 소유하고 제어하지 않습니다.

'Hooks'도 마찬가지입니다. 이는 제어를 가져오기 위한 규칙이 아닙니다.  
React가 '최소한의 정보로 상태를 추론하고 연결'하기 위해 존재하는 것입니다.

그럼에도 React 내부에서 제어권의 역전(IoC)이 사용된 곳은 있다고 생각합니다.  
컴포넌트는 React가 호출하고 렌더링 사이클은 React가 관리합니다. UI 렌더링 영역으로 한정된 IoC가 아닐까 합니다.

프레임워크라 정의할 수 있는 Vercel의 [Next.js](https://vercel.com/frameworks/nextjs)나 구글의 [Angular.js](https://angularjs.org/)와 비교해보면, React는 라이브러리라고 인정해줘야하지 않을까 싶습니다.

다른 의견과 설명이 있다면 언제든 남겨주세요.

### [3] 안녕하세요 돔을 아시나요

다시 돌아와서 JS로 DOM을 조작하는 라이브러리를 만든다고 생각해보겠습니다.

먼저 DOM은 무엇일까요?

영어로는 Document Object Model, 한글로는 문서 객체 모델로 말 그대로 HTML 문서 구조를 객체로 표현한 것입니다.  
우리가 다들 알다시피 HTML 문서에는 `<div>`, `<p>` 등의 HTML 요소가 계층 구조를 이루면서 작성되어 있습니다.  
DOM은 웹 브라우저의 Critical Rendering Path 과정에서 문서 구조를 파싱한 트리(Tree) 구조 객체를 의미합니다.

```html
<html>
  <head>
    <title>안녕하세요</title>
  </head>
  <body>
    <div>
      <p>콩나물을 아십니까</p>
    </div>
  </body>
</html>
```

HTML 문서를 파싱하면 다음과 같은 트리 구조로 만들어집니다.

<img src="../assets/day-1_2.png" width="400">

우선 DOM이 만들어지면 비로소 JavaScript나 스크립트가 접근하여 DOM 메소드를 사용할 수 있게 됩니다.  
그러니 쉽게 생각해보면 DOM을 JS로 조작한다는 것은 당연한 말입니다.

JS 라이브러리는 DOM을 동적으로 생성하고 조작하는 처리를 **보다 쉽고 빠르고 안전한 추상화**를 제공해줄 뿐입니다.

### [4] 트리 구조말고 다른 구조도 있어요

앞선 문단에서 트리 구조라는 표현이 몇 번 나왔습니다.

HTML 문서 계층을 파싱하여 데이터 구조로 변환하는 과정에서 트리 구조만이 유일한 형태일까요?  
리스트(List), 플랫한 배열(1-dimension Array), 심지어 그래프 구조(Graph)와 같은 대부분의 자료구조로 전부 표현할 수 있지 않을까요?

그럼에도 이미 트리구조가 많이 사용되는 이유는 트리구조가 가진 특성 때문일겁니다.

<img src="../assets/day-1_3.png" alt="" width="600">

> A tree data structure is a hierarchical structure that is used to represent and organize data in a way that is easy to navigate and search. It is a collection of nodes that are connected by edges and has a hierarchical relationship between the nodes.

- 부분(Subtree)을 독립적인 의미 단위로 다룰 수 있고,
- 부모가 바뀌면 자식의 맥락(Context)도 함께 재해석되며,
- UI를 루트에서 리프까지, 위에서 아래로 해석할 수 있습니다.

HTML의 구조는 기본적으로 **포함 관계**이며 단방향이고 계층적입니다.  
따라서 하나의 노드는 반드시 하나의 부모를 가지는 구조입니다.

허나 그래프(Graph)는 다중 부모를 가질 수 있고 순환 구조이기에 부적합합니다.

또한 HTML의 구조는 부분(Subtree)의 구조가 전체에 종속되고 부모에서 자식으로 맥락(Context)이 전달됩니다.

하지만 리스트나 플랫한 배열에서는 부분을 분리한다는 개념이 없고, 부모 자식 관계를 표현은 가능하지만 `lookup` 비용이 `O(n)`으로 큰 편입니다.

따라서 트리 구조가 가장 합리적인 선택입니다.
**트리는 UI를 표현하기 위한 데이터 구조이자, 변경을 계산하기 위한 실행 모델**이기 때문입니다.

우리가 구현할 콩나물 라이브러리에서도 **DOM을 동적으로 생성하고 관리하는 규칙으로 트리 구조**를 택해야 하겠습니다.

### [5] 마치며

오늘은 여기까지 이야기를 적어보려 합니다.

본격적으로 콩나물을 구현하기에 앞서 설계 방향을 정리해보았습니다.

우선은 프레임워크보다는 라이브러리 레벨에서 시작한다는 결정을 내렸고,  
DOM에 대해 살펴보고 트리 구조의 타당성에 대해 검토해보았습니다.

내일부터는 본격적으로 JS로 DOM을 표현하기 위한 일종의 규칙, 형식, 프로토콜을 만들어보고,  
그렇게 만든 표현을 실제로 DOM으로 그릴 수 있는 렌더링 함수를 구현해볼 예정입니다.

감사합니다.
