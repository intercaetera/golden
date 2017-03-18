import { remote } from 'electron'
import path from 'path'
import fs from 'fs'

$("#start").addEventListener("click", () => {
  fadeStuff('create.jade')
})

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

function fadeStuff(destination) {
  $("#index").style.animation = "fadeComponent .7s ease-in-out forwards"

  setTimeout(() => {
    location.pathname = path.join(__dirname, destination)
  }, 1200)
}
