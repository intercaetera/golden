import { Player, Round, Match, Cut } from './js/tournament'
import { remote } from 'electron'
import circular from 'serializr'
import fs from 'fs'
import path from 'path'

let structure = {
  "meta": {
    "name": "",
    "location": "",
    "host": "",
    "rank": ""
  },
  "players": [ ],
  "rounds": [ ],
  "cut": { }
}

let filePath
const DEFAULT_PATH = path.join(__dirname, 'tournaments')

function redrawPlayers() {

  structure.players = structure.players.sort((a, b) => {
    if(a.points === b.points && a.sos === b.sos) {
      return (a.esos < b.esos) ? -1 : (a.esos > b.esos) ? 1 : 0
    }
    else if(a.points === b.points) {
      return (a.sos < b.sos) ? -1 : (a.sos > b.sos) ? 1 : 0
    }
    else {
      return (a.points < b.points) ? -1 : 1
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
  let lastRound = structure.rounds[structure.rounds.length-1].matches
  for(let each of lastRound) {
    createTableElement(each)
  }

  function createTableElement(match) {
    let tr = document.createElement("tr")
    $("#matches").querySelector('tbody').appendChild(tr)

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
      console.log(match);
      console.log(parseInt(score[0].value), parseInt(score[1].value));
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

  for(let each of structure.rounds) {
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

    let i = 0
    for(let match of each.matches) {
      i++

      let tr = document.createElement("tr")
      tbody.appendChild(tr)

      tr.appendChild(createTableCell(i))
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

  redrawPlayers()
})

// Generate a new round
$("#btn-new-round").addEventListener("click", () => {
  let round = new Round(structure.players)
  structure.rounds.push(round)

  redrawMatches()
})

// Generate the rounds view.
$("#nav-rounds").addEventListener("click", redrawRounds)

// Redraw the players table on entering the page.
$("#nav-players").addEventListener("click", redrawPlayers)

// Redraw the matches on entering the page.
$("#nav-matches").addEventListener("click", redrawMatches)


//Create a new tournament
$("#new-tournament-confirm").addEventListener("click", () => {
  structure.meta = {
    "name": $("#new-tournament-name").value.trim(),
    "host": $("#new-tournament-host").value.trim(),
    "location": $("#new-tournament-location").value.trim(),
    "rank": $("#new-tournament-rank").value
  }

  remote.dialog.showSaveDialog(remote.getCurrentWindow(), {
    title: "Save tournament",
    filters: [
      { name: "Circular JSON (cjson)", extensions: [ 'cjson' ] },
      { name: "JSON (json)", extensions: ['json'] },
      { name: "All files (*)", extensions: ['*'] }
    ],
    defaultPath: path.join(DEFAULT_PATH, `${structure.meta.name}.cjson`)
  }, (source) => {
    console.log(source);
    if(!source) {
      alert("Error: Tournament was not saved.")
      return
    }
    else {
      filePath = source
      fs.writeFile(filePath, circular.stringify(structure), (err) => {
        if(err) throw err
      })
    }
  })
})

// Save a tournament.
$("#btn-save-tournament").addEventListener("click", () => {
  if(filePath) {
    fs.writeFile(filePath, circular.stringify(structure), (err) => {
      if(err) throw err
    })
  }
  else {
    fs.writeFile(path.join(DEFAULT_PATH, "Untitled.cjson"), circular.stringify(structure), (err) => {
      if(err) throw err
    })
  }
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
      structure = circular.parse(data)

      // // Handle JSON being fucking retarded (preserve classes and their methods).
      // for(let each of structure.players) {
      //   each = new Player(each)
      // }
      //
      // for(let each of structure.rounds.matches) {
      //   for(let more of each) {
      //     more = new Match(more)
      //
      //     more.player1 = new Player(more.player1)
      //     more.player2 = new Player(more.player2)
      //
      //   }
      // }
    })
  })
})
