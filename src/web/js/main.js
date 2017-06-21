import { remote } from 'electron'
import fs from 'fs'
import path from 'path'
import uuid from 'uuid'
import shortid from 'shortid'

import { Player, Round, Match, Cut } from './js/tournament'
import { serialise, deserialise, findPlayer as findPlayerById } from './js/lib/cjson'
import { redrawPlayers, redrawRounds, redrawMatches, redrawWebServices, redrawHistory, toast } from './js/lib/ui'

let structure = {}

// Monolith globals.
const API = "http://85.255.12.57/"

// Save globals.
const DEFAULT_PATH = path.join(__dirname, 'tournaments')
let filePath = DEFAULT_PATH

// Timer globals.
let interval
let time = 0
const audio = new Audio('assets/wav/honk.wav')

// Register keyboard shortcuts
document.addEventListener('keyup', (e) => {
  if(e.ctrlKey && e.keyCode == 83) {
    saveTournament()
  }
  else if(e.ctrlKey && e.keyCode == 79) {
    loadTournament()
  }
  else if(e.ctrlKey && e.keyCode == 85) {
    newRound()
  }
})

// Redraw the rounds on entering the page.
$("#nav-rounds").addEventListener("click", redrawRounds)

// Redraw the players table on entering the page.
$("#nav-players").addEventListener("click", redrawPlayers)

// Redraw the matches on entering the page.
$("#nav-matches").addEventListener("click", redrawMatches)

// Redraw the web services on entering the page
$("#nav-web").addEventListener("click", redrawWebServices)

// Redraw the history on entering the page
$("#nav-history").addEventListener("click", redrawHistory)

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

  const points = parseInt($("#add-player-points").value)

  //Create an object to pass to the class constructor.
  const playerObject = {
    name: name,
    superbye: superbye,
    corpfaction: corpfaction,
    corpid: corpid,
    runnerfaction: runnerfaction,
    runnerid: runnerid,
    points: points
  }

  //Construct a class and push it to the structure.
  structure.players.push(new Player(playerObject))

  toast("Player created!", "positive", 2000)

  redrawPlayers()
})

// Generate a new round
$("#btn-new-round").addEventListener("click", newRound)
function newRound() {
  //Block if the tournament is not loaded.
  if(!structure.meta.id) {
    notCreated()
    return
  }

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
  let noDrops = structure.players.filter(el => el.dropped ? false : true)
  if(structure.rounds.length >= noDrops.length-1) {
    if(!confirm("It's likely no good pairings can be found. Clicking OK now might result in crashing the program, so tread carefully.\n\nAre you sure you want to continue?")) {
      return
    }
  }

  let round = new Round(structure.players)
  structure.rounds.push(round)

  redrawMatches()
  redrawRounds()
  time = 65 * 60 * 1000
}

$("#toggle-web-services").addEventListener("click", () => {
  if(structure.meta.monolith === true) structure.meta.monolith = false
  else structure.meta.monolith = true

  redrawWebServices()
})

//Create a new tournament
$("#new-tournament-confirm").addEventListener("click", () => {
  structure = {}

  structure= {
    meta: {
      "name": $("#new-tournament-name").value.trim(),
      "host": $("#new-tournament-host").value.trim(),
      "location": $("#new-tournament-location").value.trim(),
      "id": uuid.v4(),
      "shortid": shortid.generate(),
      "rank": $("#new-tournament-rank").value,
      "monolith": $("#new-tournament-web-services").checked
    },
    players: [],
    rounds: [],
    gameHistory: []
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
      toast("Error: Tournament was not created.", "negative")
      structure = {}
      return
    }
    else {
      filePath = source
      fs.writeFile(filePath, serialise(structure), (err) => {
        if(err) throw err
        else {
          toast("Tournament created", "positive")
          document.title = `Golden - ${structure.meta.name}`
        }
      })

    }
  })
})

// Save a tournament.
$("#btn-save-tournament").addEventListener("click", saveTournament)
function saveTournament() {
  if(!structure.meta.id) {
    notCreated()
    return
  }

  const serialised = serialise(structure)

  //Add an element to the save history.
  let infoString = new Date().toString()
  infoString = `${infoString} (${structure.players.length} players, ${structure.rounds.length} rounds)`

  const gameHistoryElement = {
    "date": infoString,
    "structure": serialised
  }

  if(!structure.gameHistory) {
    structure.gameHistory = []
  }

  structure.gameHistory.push(gameHistoryElement)    //Add the tournament to the undo history.
  if(structure.gameHistory.length > 30) {   //Truncate the gameHistory so it's not too long.
    structure.gameHistory.length = 30
  }

  redrawHistory()

  if(filePath) {
    fs.writeFile(filePath, serialised, (err) => {
      if(err) throw err
      else {
        toast("Tournament saved!", "positive")
      }
    })
  }

  if(structure.meta.monolith === true) {
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
  }
}

// Load a tournament
$("#btn-load-tournament").addEventListener("click", loadTournament)
function loadTournament() {
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
      toast("Tournament loaded!", "positive")

      if(!structure.gameHistory) {
        structure.gameHistory = []
      }

      document.title = `Golden - ${structure.meta.name}`
    })
  })
}

// Save history.
$("#history-form").addEventListener("submit", () => {
  let historyCache = structure.gameHistory

  let select = $("#history-select")
  let selected = select.options[select.selectedIndex]
  if(selected.value) {
    structure = deserialise(selected.value)

    structure.gameHistory = historyCache

    toast("Old tournament status restored.")
  }
})

// Quickscore
$("#form-quickscore").addEventListener('submit', () => {
  const table = parseInt($("#quickscore-table").value)
  const match = findMatch(table)

  const p1 = parseInt($("#quickscore-p1").value)
  const p2 = parseInt($("#quickscore-p2").value)

  if(match) {
    match.outcome(p1, p2)
    redrawMatches()
    redrawRounds()
    redrawPlayers()

    $("#quickscore").classList.add('inactive')
  }
  else
    toast("Error: Match not found.", "negative")
})

$("#quickscore-table").addEventListener('input', () => {
  const table = parseInt($("#quickscore-table").value)
  const match = findMatch(table)

  if(match) {
    $("#quickscore-p1name").textContent = match.player1.name
    $("#quickscore-p2name").textContent = match.player2.name
  }
  else {
    $("#quickscore-p1name").textContent = "Player 1"
    $("#quickscore-p2name").textContent = "Player 2"
  }
})

//Edit player
$("#manage-player-delete").addEventListener("click", (e) => {
  e.preventDefault()

  if(confirm("Are you sure?")) {
    for(let i=0; i<structure.players.length; i++) {
      if($("#manage-player-id").value === structure.players[i].id) {
        structure.players.splice(i, 1)
        break
      }
    }
  }

  redrawPlayers()
})

$("#form-manage-player").addEventListener('submit', () => {
  let player = findPlayerById(structure.players, $("#manage-player-id").value)

  if(!$("#manage-player-name").value.trim()) {
    alert("Player name cannot be empty!")
    return
  }

  player.name = $("#manage-player-name").value.trim()

  player.superbye = $("#manage-player-superbye").checked
  player.dropped = $("#manage-player-dropped").checked

  player.corpfaction = $("#manage-player-corp").value
  player.corpid = $("#manage-player-corp").options[$("#manage-player-corp").selectedIndex].text

  player.runnerfaction = $("#manage-player-runner").value
  player.runnerid = $("#manage-player-runner").options[$("#manage-player-runner").selectedIndex].text

  player.points = parseInt($("#manage-player-points").value)

  redrawPlayers()
})

function findMatch(table) {
  for(let each of structure.rounds[structure.rounds.length-1].matches) {
    if(each.table === table) return each
  }

  return undefined
}

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
