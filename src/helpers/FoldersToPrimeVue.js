export function foldersToPrimeVueTree(files, root, baseFolder, showFileCallback) {
  var i = 0
  for (const file of files) {
    const currentElement = {
      key: baseFolder + i,
      name: file.label
    }
    if (file.children) {
      currentElement.children = foldersToPrimeVueTree(
        file.children,
        [],
        baseFolder + file.label + '/'
      )
    }
    root.push(currentElement)
  }
  return root
}

export async function addFile(position, fileName) {}
