import { remote } from 'electron'
import path from 'path'
import fs from 'fs'

$("#start").addEventListener("click", () => {
  fadeStuff('tournament.jade')
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
  $("#main-logo").style.animation = "fadeComponent 1.2s ease-in-out forwards"
  $("#main-menu").style.animation = "fadeComponent .7s ease-in-out .5s forwards"

  setTimeout(() => {
    location.pathname = path.join(__dirname, destination)
  }, 1200)
}
