import { reactive } from 'vue'
import SoileNode from './SoileNode'
import { SoileDataNode } from '@/helpers/projecteditor/SoileTypes'

export default abstract class SoileVersionedNode extends SoileNode implements SoileDataNode {
  public nodeOutputs = reactive(new Array<string>())

  public abstract objectType: string
  public objectData = reactive({ uuid: '', name: '', version: '', tag: '' })

  public nodePersistent = reactive(new Array<string>())

  public abstract setName(name: string): void
  public abstract setTag(tag: string): void

  public getPersistent() {
    return this.nodePersistent
  }
  public addPersistent(dataName: string) {
    this.graphStore.addPersistantData(this, dataName)
  }
  public removePersistent(dataName: string) {
    this.graphStore.removePersistantData(this, dataName)
  }

  public setElement(uuid: string, name: string) {
    if (this.objectData.uuid != uuid) {
      this.objectData.uuid = uuid
      this.objectData.name = name
      this.objectData.version = ''
      this.objectData.tag = ''
      this.setName(name)
      this.setTag('')
    }
  }
  public async setElementVersion(version: string, tag: string) {
    let currentTag = tag
    this.objectData.version = version
    const persistent = await this.elementStore.getPersistentDataForElement(
      this.objectData.uuid,
      this.objectData.version,
      this.objectType
    )
    for (const persistentValue of persistent) {
      this.addPersistent(persistentValue)
    }
    if (currentTag) {
      this.objectData.tag = currentTag
    } else {
      currentTag = await this.elementStore.getTagForVersion(
        this.objectType,
        this.objectData.uuid,
        this.objectData.version
      )
      this.objectData.tag = currentTag
    }
    this.setTag(currentTag)
  }
  public getOutputs() {
    return this.nodeOutputs
  }
  public addElementOutput(outputName: string) {
    this.graphStore.addOutput(this, outputName)
  }
  public removeElementOutput(outputName: string) {
    console.log()
    this.nodeOutputs.splice(this.nodeOutputs.indexOf(outputName), 1)
  }
}
