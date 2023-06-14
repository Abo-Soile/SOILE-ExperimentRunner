import { NodeInterface } from '@baklavajs/core'
import { allowMultipleConnections } from '@baklavajs/engine'

export class InputInterface extends NodeInterface {
  constructor(name: string, value: string) {
    super(name, value)
    this.use(allowMultipleConnections)
  }
}
