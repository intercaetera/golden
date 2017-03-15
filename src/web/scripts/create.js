import path from 'path'
import fs from 'fs'
import { remote } from 'electron'

$("#create-button").addEventListener("click", () => {

  let structure = {
    meta: {
      name: $("#name").value,
      host: $("#host").value,
      location: $("#location").value
    }
  }

  fs.writeFile(path.join(__dirname, "tournaments", structure.meta.name+".json"), JSON.stringify(structure), "utf8", (err) => {
    if(err) throw err
    remote.getGlobal("config").current = structure.meta.name
    fadeStuff("tournament.jade")
  })


})

$("#return").addEventListener("click", () => {
  fadeStuff("index.jade")
})

function fadeStuff(destination) {
  $(".component").style.animation = "fadeComponent 1.2s ease-in-out forwards"

  setTimeout(() => {
    location.pathname = path.join(__dirname, destination)
  }, 1200)
}
