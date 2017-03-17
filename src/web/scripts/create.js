import path from 'path'
import fs from 'fs'
import { remote } from 'electron'
import circular from 'circular-json'

$("#create-button").addEventListener("click", () => {

  let structure = {
    meta: {
      name: $("#name").value,
      host: $("#host").value,
      location: $("#location").value
    },
    tournamentData: {
      players: [],
      rounds: {}
    }
  }

  fs.writeFile(path.join(__dirname, "tournaments", structure.meta.name+".json"), circular.stringify(structure), "utf8", (err) => {
    if(err) throw err
    remote.getGlobal("config").current = structure.meta.name
    fadeStuff("tournament.jade")
  })


})

$("#return").addEventListener("click", () => {
  fadeStuff("index.jade")
})

function fadeStuff(destination) {
  $(".component").style.animation = "fadeComponent .7s ease-in-out forwards"

  setTimeout(() => {
    location.pathname = path.join(__dirname, destination)
  }, 1200)
}
