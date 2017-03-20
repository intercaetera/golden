import path from 'path'
import fs from 'fs'
import circular from 'circular-json'
import { remote } from 'electron'

import { Player, Match, Round } from '../web/scripts/tournament'

import CORPS from '../web/scripts/data/CORPS.json'
import RUNNERS from '../web/scripts/data/RUNNERS.json'

let structure = {}

//Populate the corp and runner selects.
for(let each in CORPS) {
  const optgroup = document.createElement("optgroup")
  $("#corp").appendChild(optgroup)
  optgroup.label = each

  for(let sub of CORPS[each]) {
    let option = document.createElement("option")
    optgroup.appendChild(option)
    option.textContent = `${sub.name}: ${sub.subtitle}`
    option.value = each
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
    option.value = each
  }
}

//Read the tournament file.
let current = remote.getGlobal("config").current
fs.readFile(path.join(__dirname, "tournaments", current+".json"), "utf8", (err, data) => {
  if(err) throw err
  structure = circular.parse(data)
})

$("#cancel-btn").addEventListener("click", () => {
  $("#add-player").classList.remove('active')
})

$("#add-btn-finish").addEventListener("click", () => {

  //Handle the add player form.
  if($("#nick").value.trim() === "") {
    alert("Nickname cannot be empty.")
    return
  }

  let player = {
    nick: $("#nick").value.trim(),
    name: $("#name").value.trim(),
    surname: $("#surname").value.trim(),
    points: parseInt($("#points").value.trim()),
    sos: parseInt($("#sos").value.trim()),
    superbye: false,
    corpfaction: $("#corp").value,
    corpid: $("#corp").options[$("#corp").selectedIndex].text,
    runnerfaction: $("#runner").value,
    runnerid: $("#runner").options[$("#runner").selectedIndex].text
  }

  if($("#superbye").checked) player.superbye = true

  if(!player.points) player.points = 0
  if(!player.sos) player.sos = 0

  structure.tournamentData.players.push(new Player(
    player.nick,
    player.name,
    player.surname,
    player.superbye,
    player.points,
    player.sos,
    player.corpfaction,
    player.corpid,
    player.runnerfaction,
    player.runnerid
  ))

  fs.writeFile(path.join(__dirname, "tournaments", structure.meta.name+".json"), circular.stringify(structure), "utf8", (err) => {
    if(err) throw err

    //Clear the form after submitting.
    $("#nick").value = ""
    $("#name").value = ""
    $("#surname").value = ""
    $("#points").value = ""
    $("#sos").value = ""
    $("#superbye").checked = false
  })



})

$("#add-btn").addEventListener("click", () => {
  $("#add-player").classList.toggle("active")
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
