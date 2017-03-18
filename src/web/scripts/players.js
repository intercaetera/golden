import path from 'path'
import fs from 'fs'
import tournament from '../web/scripts/tournament.js'

import CORPS from '../web/scripts/data/CORPS.json'
import RUNNERS from '../web/scripts/data/RUNNERS.json'

//Populate the corp and runner selects.
for(let each in CORPS) {
  const optgroup = document.createElement("optgroup")
  $("#corp").appendChild(optgroup)
  optgroup.label = each

  for(let sub of CORPS[each]) {
    let option = document.createElement("option")
    optgroup.appendChild(option)
    option.textContent = `${sub.name}: ${sub.subtitle}`
    option.value = sub.name
  }
}

for(let each in RUNNERS) {
  const optgroup = document.createElement("optgroup")
  $("#runner").appendChild(optgroup)
  optgroup.label = each

  for(let sub of RUNNERS[each]) {
    let option = document.createElement("option")
    optgroup.appendChild(option)
    option.textContent = `${sub.name}: ${sub.subtitle}`
    option.value = `${sub.name}: ${sub.subtitle}`
  }
}

$("#add-btn").addEventListener("click", () => {
  $("#add-player").classList.add("active")
})

$("#exit-btn").addEventListener("click", () => {
  fadeStuff("index.jade")
})




function fadeStuff(destination) {
  $(".wrapper").style.animation = "fadeComponent .7s ease-in-out forwards"

  setTimeout(() => {
    location.pathname = path.join(__dirname, destination)
  }, 1200)
}
