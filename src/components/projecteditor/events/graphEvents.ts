import { NodeInterface } from '@baklavajs/core'

export const checkConnection = (from: NodeInterface, to: NodeInterface) => {
  console.log(from)
  console.log(to)
  if (from.value === 'OutputConnection') {
    if (from.connectionCount > 0) {
      console.log('Connection not allowed')
      return { connectionAllowed: false, connectionsInDanger: [] }
    }
    // this is a hack and should optimally be checked in a different way else...
    if (to.name === 'Previous') {
      console.log('Connection allowed')
      return { connectionAllowed: true, connectionsInDanger: [] }
    } else {
      console.log('Connection not allowed')
      return { connectionAllowed: false, connectionsInDanger: [] }
    }
  } else {
    // this is for potential Output-Links for future use.
    // we need to use the same hack again...
    if (to.name === 'Previous') {
      console.log('Connection not allowed')
      return { connectionAllowed: false, connectionsInDanger: [] }
    } else {
      console.log('Connection allowed')
      return { connectionAllowed: true, connectionsInDanger: [] }
    }
  }
}
