import { remote } from 'electron'
import fs from 'fs'

$("#load").addEventListener("click", () => {
  let window = remote.getCurrentWindow()
  remote.dialog.showOpenDialog(window, {
    properties: ['openFile']
  }, (file) => {
    file = file[0]

    let content = fs.readFileSync(file, "UTF-8")

    console.log(content);
  })
})

$("#exit").addEventListener("click", () => {
  let window = remote.getCurrentWindow()
  window.close()
})
