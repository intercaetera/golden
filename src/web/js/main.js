import { Player, Round, Match, Cut } from './js/tournament'

let structure = {
  "meta": {
    "name": "",
    "location": "",
    "host": ""
  },
  "players": [ ],
  "rounds": [ ],
  "cut": { }
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
function redrawPlayers() {

  structure.players = structure.players.sort((a, b) => {
    if(a.points === b.points) {
      return (a.sos < b.sos) ? 1 : (a.sos > b.sos) ? -1 : 0
    }
    else {
      return (a.points < b.points) ? 1 : -1
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

        if(faction == 'Haas-Bioroid') i.classList.add('icon-haas-bioroid')
        if(faction == 'Jinteki') i.classList.add('icon-jinteki-simple')
        if(faction == 'Weyland Consortium') i.classList.add('icon-weyland-consortium')
        if(faction == 'NBN') i.classList.add('icon-nbn')

        if(faction == 'Shaper') i.classList.add('icon-shaper-smooth')
        if(faction == 'Criminal') i.classList.add('icon-criminal')
        if(faction == 'Anarch') i.classList.add('icon-anarch')

        if(faction == 'Apex') i.classList.add('icon-apex')
        if(faction == 'Adam') i.classList.add('icon-adam')
        if(faction == 'Sunny') i.classList.add('icon-sunny')

        let span = document.createElement('span')
        td.appendChild(span)
        span.textContent = content
      }
      else td.textContent = content

      return td
    }
  }
}

// Generate a new round
$("#btn-new-round").addEventListener("click", () => {
  let round = new Round(structure.players)
  structure.rounds.push(round)

  redrawMatches()
})
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
      console.log(score);
      match.outcome(score[0].value, score[1].value)
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

// Redraw the players table on entering the page.
$("#nav-players").addEventListener("click", redrawPlayers)

// Redraw the matches on entering the page.
$("#nav-matches").addEventListener("click", redrawMatches)
