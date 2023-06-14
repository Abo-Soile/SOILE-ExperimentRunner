import { type ComponentOptions, markRaw } from 'vue'
import { NodeInterface } from '@baklavajs/core'

export class ComponentInterface<NodeProperties> extends NodeInterface<NodeProperties> {
  data: NodeProperties

  constructor(name: string, value: NodeProperties, component: object) {
    super(name, value)
    this.data = value
    this.component = markRaw(component) as ComponentOptions
    this.setPort(false)
  }
}
