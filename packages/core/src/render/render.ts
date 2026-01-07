import type { Schema, DOMNode } from '../types'
import type { DiffAlgorithm } from '../diff'
import { indexedDiff } from '../diff'
import { patch } from '../patch'
import { createElement } from '../dom'

let prevSchema: Schema | null = null
let rootNode: DOMNode | null = null

let diffAlgorithm: DiffAlgorithm = indexedDiff

export function render(schema: Schema, container: HTMLElement): void {
  // 최초 mount 동작
  if (!prevSchema) {
    rootNode = createElement(schema)
    container.appendChild(rootNode)
  }
  // 이후 리렌더링 동작
  else if (rootNode) {
    const patchResult = diffAlgorithm(prevSchema, schema)
    rootNode = patch(rootNode, patchResult)
  }

  // 이전 schema 업데이트
  prevSchema = schema
}

/**
 * diff 알고리즘 교체 (plugin 패턴)
 */
export function setDiffAlgorithm(algorithm: DiffAlgorithm): void {
  diffAlgorithm = algorithm
}
