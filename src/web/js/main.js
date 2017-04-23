import { Player, Round, Match, Cut } from './js/tournament'
import { remote } from 'electron'
import fs from 'fs'
import path from 'path'
import uuid from 'uuid'
import shortid from 'shortid'
import {generateQr} from './js/qr'

import clone from 'clone'

let structure = {
  "meta": {
    "name": "",
    "location": "",
    "host": "",
    "rank": ""
  },
  "players": [ ],
  "rounds": [ ]
}


let interval
const DEFAULT_PATH = path.join(__dirname, 'tournaments')
let filePath = DEFAULT_PATH
const API = "http://85.255.12.57/"
let time = 0

function redrawPlayers() {

  for(let each of structure.players) {
    each.calculateSos()
    each.calculateExtendedSos()
  }

  structure.players = structure.players.sort((a, b) => {
    if(a.points == b.points && a.sos == b.sos) {
      if(a.esos > b.esos) return -1
      else if(a.esos == b.esos) return 0
      else return 1
    }
    else if(a.points == b.points) {
      if(a.sos > b.sos) return -1
      else if(a.sos == b.sos) return 0
      else return 1
    }
    else {
      if(a.points > b.points) return -1
      else return 1
    }
  })

  let tbody = $("#players").querySelector("tbody")
  while(tbody.firstChild) {
    tbody.removeChild(tbody.firstChild)
  }

  //Rewrite the players table on entry.
  for(let each of structure.players) {
    createTableElement(each)
  }

  function createTableElement(player) {

    let tr = document.createElement("tr")
    tbody.appendChild(tr)
    if(player.drop) tr.classList.add("dropped")

    createTableCell(player.name)

    createTableCell(player.corpid, player.corpfaction)
    createTableCell(player.runnerid, player.runnerfaction)

    if(player.superbye) createTableCell("S")
    else if(player.bye) createTableCell("✔")
    else createTableCell("")

    createTableCell(player.points)
    createTableCell(player.sos)
    createTableCell(player.esos)

    let average
    if(player.opponents.length === 0) {
      average = 0
    }
    else {
      if(!player.bye) {
        average = player.points/player.opponents.length
      }
      else {
        average = (player.points - 6)/player.opponents.length
      }
    }

    createTableCell(average)

    let drop = document.createElement("button")
    createTableCell().appendChild(drop)
    drop.textContent = "Drop"
    drop.classList.add("btn", "btn-negative", "btn-mini")

    drop.addEventListener("click", () => {
      let i = structure.players.indexOf(player)
      structure.players[i].drop = true
      redrawPlayers()
    })


    function createTableCell(content, faction) {
      let td = document.createElement("td")
      tr.appendChild(td)

      if(faction) {
        let i = document.createElement("i")
        td.appendChild(i)

        i.classList.add("padded-horizontally")

        i.classList.add(convertFactionToIcon(faction))

        let span = document.createElement('span')
        td.appendChild(span)
        span.textContent = content
      }
      else td.textContent = content

      return td
    }
  }
}
function redrawMatches() {

  //Clear the table.
  let tbody = $("#matches").querySelector("tbody")
  while(tbody.firstChild) {
    tbody.removeChild(tbody.firstChild)
  }

  //Avoid an exception when there are no rounds yet.
  if(structure.rounds.length === 0) return

  // Generate a table row for each match.
  let lastRound = structure.rounds[structure.rounds.length-1].matches.sort((a, b) => {
    return (a.table > b.table) ? 1 : -1
  })

  for(let each of lastRound) {
    createTableElement(each)
  }

  function createTableElement(match) {
    let tr = document.createElement("tr")
    $("#matches").querySelector('tbody').appendChild(tr)

    createTableCell(match.table)

    createTableCell(match.player1.name)
    createTableCell(match.player2.name)

    //WRITE EVERYTHING TWICE!!!!1
    createScoringCell(match.score1)
    createScoringCell(match.score2)

    let button = document.createElement('button')
    createTableCell().appendChild(button)
    button.textContent = "Score"
    button.classList.add("btn", "btn-default", "btn-mini")
    button.addEventListener("click", () => {
      let score = tr.querySelectorAll(".scoring")
      match.outcome(parseInt(score[0].value), parseInt(score[1].value))
      button.classList.add('inactive')
    })

    if(match.scored) button.classList.add('inactive')

    function createScoringCell(src) {
      let td = document.createElement('td')
      tr.appendChild(td)

      let select = document.createElement('select')
      td.appendChild(select)
      select.classList.add("scoring")

      for(let i=0; i<=6; i++) {
        let option = document.createElement('option')
        select.appendChild(option)
        option.value = i
        option.textContent = i
      }

      select.selectedIndex = src
    }

    function createTableCell(content) {
      let td = document.createElement('td')
      tr.appendChild(td)
      td.textContent = content

      return td
    }
  }
}
function redrawRounds() {

  //Clear the view.
  let rounds = $("#rounds")
  while(rounds.firstChild) {
    rounds.removeChild(rounds.firstChild)
  }

  let i=0
  for(let each of structure.rounds) {
    i++

    let h3 = document.createElement("h3")
    $("#rounds").appendChild(h3)
    h3.textContent = `Round ${i}`
    h3.classList.add("padded-horizontally-more")

    let table = document.createElement("table")
    $("#rounds").appendChild(table)

    let thead = document.createElement("thead")
    table.appendChild(thead)

    let tr = document.createElement("tr")
    thead.appendChild(tr)

    tr.appendChild(createTableCell("Table"))
    tr.appendChild(createTableCell("Player 1"))
    tr.appendChild(createTableCell("Player 2"))
    tr.appendChild(createTableCell("Score"))

    let tbody = document.createElement("tbody")
    table.appendChild(tbody)

    for(let match of each.matches) {
      let tr = document.createElement("tr")
      tbody.appendChild(tr)

      tr.appendChild(createTableCell(match.table))
      tr.appendChild(createTableCell(match.player1.name))
      tr.appendChild(createTableCell(match.player2.name))

      let result = `${match.score1} : ${match.score2}`

      tr.appendChild(createTableCell(result))
    }

  }

  function createTableCell(content) {
    let td = document.createElement('td')
    td.textContent = content

    return td
  }
}

const audio = new Audio('assets/wav/honk.wav')

// Handle new player button.
$("#add-player form").addEventListener("submit", () => {

  //Pull data from the #add-player form.
  const name = $("#add-player-name").value.trim()

  if(!name) {
    alert("Player name cannot be empty!")
    return
  }

  const superbye = $("#add-player-superbye").checked

  const corpfaction = $("#add-player-corp").value
  const corpid = $("#add-player-corp").options[$("#add-player-corp").selectedIndex].text

  const runnerfaction = $("#add-player-runner").value
  const runnerid = $("#add-player-runner").options[$("#add-player-runner").selectedIndex].text

  //Create an object to pass to the class constructor.
  const playerObject = {
    name: name,
    superbye: superbye,
    corpfaction: corpfaction,
    corpid: corpid,
    runnerfaction: runnerfaction,
    runnerid: runnerid
  }

  //Construct a class and push it to the structure.
  structure.players.push(new Player(playerObject))

  alert("Player created!")

  redrawPlayers()
})

// Generate a new round
$("#btn-new-round").addEventListener("click", () => {

  //Check if all the matches are scored.
  if(structure.rounds.length > 0) {
    let flag = false
    for(let each of structure.rounds[structure.rounds.length-1].matches) {
      if(!each.scored) {
        flag = true
      }
    }

    if(flag && !confirm("Some matches are not yet scored. Creating a new round now could result in errors. Are you sure you want to continue?")) {
      return
    }
  }

  //Check if the round count doesn't exceed the maximum possible.
  if(structure.rounds.length >= structure.players.length-1) {
    if(!confirm("It's likely no good pairings can be found. Clicking OK now might result in crashing the program, so tread carefully.\n\nAre you sure you want to continue?")) {
      return
    }
  }

  let round = new Round(structure.players)
  structure.rounds.push(round)

  redrawMatches()
  redrawRounds()
  time = 65 * 60 * 1000
})

// Generate the rounds view.
$("#nav-rounds").addEventListener("click", redrawRounds)

// Redraw the players table on entering the page.
$("#nav-players").addEventListener("click", redrawPlayers)

// Redraw the matches on entering the page.
$("#nav-matches").addEventListener("click", redrawMatches)

//Web services
$("#nav-web").addEventListener("click", () => {
  generateQr(structure)

  $("#monolith-link").value = "http://monolith.ga/t/"+structure.meta.shortid
})


//Create a new tournament
$("#new-tournament-confirm").addEventListener("click", () => {
  structure.meta = {
    "name": $("#new-tournament-name").value.trim(),
    "host": $("#new-tournament-host").value.trim(),
    "location": $("#new-tournament-location").value.trim(),
    "id": uuid.v4(),
    "shortid": shortid.generate(),
    "rank": $("#new-tournament-rank").value
  }

  $("#new-tournament").classList.add("inactive")

  remote.dialog.showSaveDialog(remote.getCurrentWindow(), {
    title: "Save tournament",
    filters: [
      { name: "Circular JSON (cjson)", extensions: [ 'cjson' ] },
      { name: "JSON (json)", extensions: ['json'] },
      { name: "All files (*)", extensions: ['*'] }
    ],
    defaultPath: path.join(DEFAULT_PATH, `${structure.meta.name}.cjson`)
  }, (source) => {
    if(!source) {
      alert("Error: Tournament was not saved.")
      return
    }
    else {
      filePath = source
      fs.writeFile(filePath, serialise(structure), (err) => {
        if(err) throw err
      })

    }
  })
})

// Save a tournament.
$("#btn-save-tournament").addEventListener("click", () => {
  const serialised = serialise(structure)
  if(filePath) {
    fs.writeFile(filePath, serialised, (err) => {
      if(err) throw err
      // structure = deserialise(JSON.stringify(structure))
    })
  }
  else {
    fs.writeFile(path.join(DEFAULT_PATH, "Untitled.cjson"), serialised, (err) => {
      if(err) throw err
      // structure = deserialise(JSON.stringify(structure))
    })
  }

  fetch(API+"api/"+structure.meta.id, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      data: serialised
    })
  })
  .then((res) => {
    console.log("Sent tournament data to Monolith");
    console.log("Request returned with status: " + res.status);
  })
})

// Load a tournament
$("#btn-load-tournament").addEventListener("click", () => {
  remote.dialog.showOpenDialog(remote.getCurrentWindow(), {
    title: "Load a tournament",
    filters: [
      { name: "Circular JSON (cjson)", extensions: [ 'cjson' ] },
      { name: "JSON (json)", extensions: ['json'] },
      { name: "All files (*)", extensions: ['*'] }
    ],
    defaultPath: DEFAULT_PATH,
    properties: ["openFile"]
   }, (source) => {

    if(!source) return

    filePath = source[0]

    fs.readFile(filePath, "utf-8", (err, data) => {
      if(err) throw err
      structure = deserialise(data)
    })
  })
})

// Easter egg
let accumulator = 0
$("#welcome-logo").addEventListener("click", () => {
  if(accumulator>=5) {
    $("#welcome-logo").src = "assets/img/logo-rearranged.svg"
    accumulator=0
  }
  else {
    $("#welcome-logo").src = "assets/img/logo.svg"

  }
  accumulator++
})

/*
meta: {}
players: [
  {
    uuid: uuid
    ...
    opponents: [
      uuid,
      uuid,
      ...
    ]
  }
]

rounds: [
  {
    matches: [
      {
        player1: uuid,
        player2: uuid,
        score1: Number,
        score2: Number,
        scored: Boolean
      }
    ]
  },
]
*/

function serialise(inputArray) {
  const input = clone(inputArray)
  let output = {}

  output.meta = input.meta

  output.players = []

  for(let i=0; i<input.players.length; i++) {
    output.players[i] = input.players[i]

    if(input.players[i].opponents) {
      for(let j=0; j<input.players[i].opponents.length; j++) {
        output.players[i].opponents[j] = input.players[i].opponents[j].id
      }
    }
    else {
      output.players[i].opponents = []
    }
  }

  output.rounds = []

  for(let i=0; i<input.rounds.length; i++) {
    if(input.rounds[i].matches) {
      output.rounds[i] = {
        matches: []
      }

      for(let j=0; j<input.rounds[i].matches.length; j++) {
        output.rounds[i].matches[j] = input.rounds[i].matches[j]

        output.rounds[i].matches[j].player1 = input.rounds[i].matches[j].player1.id
        output.rounds[i].matches[j].player2 = input.rounds[i].matches[j].player2.id
      }
    }
  }

  return JSON.stringify(output, null, 2)
}

function deserialise(input) {
  input = JSON.parse(input)
  let output = {}

  output.meta = input.meta

  output.players = []

  for(let i=0; i<input.players.length; i++) {
    output.players[i] = new Player(input.players[i])
  }

  for(let i=0; i<input.players.length; i++) {
    for(let j=0; j<input.players[i].opponents.length; j++) {
      output.players[i].opponents[j] = findPlayer(output.players, input.players[i].opponents[j])
    }
  }

  output.rounds = []

  for(let i=0; i<input.rounds.length; i++) {

    let matches = []
    for(let j=0; j<input.rounds[i].matches.length; j++) {
      let p1id = input.rounds[i].matches[j].player1
      let p2id = input.rounds[i].matches[j].player2

      let current = input.rounds[i].matches[j]

      current.player1 = findPlayer(output.players, p1id)
      current.player2 = findPlayer(output.players, p2id)

      matches.push(new Match(current))
    }

    output.rounds[i] = new Round(undefined, matches)
  }

  function findPlayer(array, uuid) {
    for(let each of array) {
      if(each.id === uuid) {
        return each
      }
    }
  }

  return output
}
