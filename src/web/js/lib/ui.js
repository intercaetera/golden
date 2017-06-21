// UI module.
// This is used to generate dynamic content for views.

import { generateQr } from './qr'

// Redraw the players view.
export function redrawPlayers() {
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
    if(player.dropped) tr.classList.add("dropped")

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

    let edit = document.createElement("button")
    createTableCell().appendChild(edit)
    edit.textContent = "Edit"
    edit.classList.add("btn", "btn-mini", "btn-default")

    edit.addEventListener("click", () => {
      $("#manage-player").classList.remove("inactive")

      $("#manage-player-id").value = player.id
      $("#manage-player-name").value = player.name

      const corpDropdown = $("#manage-player-corp")
      for(let i=0; i<corpDropdown.options.length; i++) {
        if(corpDropdown.options[i].text == player.corpid) {
          corpDropdown.selectedIndex = i
          break
        }
      }

      const runnerDropdown = $("#manage-player-runner")
      for(let i=0; i<runnerDropdown.options.length; i++) {
        if(runnerDropdown.options[i].text == player.runnerid) {
          runnerDropdown.selectedIndex = i
          break
        }
      }

      $("#manage-player-points").value = player.points

      $("#manage-player-dropped").checked = player.dropped ? true : false

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

// Redraw the matches view.
export function redrawMatches() {
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

// Redraw the rounds view.
export function redrawRounds() {
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

// Redraw the web services view.
export function redrawWebServices() {
  if(!structure.meta.id) {
    notCreated()
    return
  }

  if(structure.meta.monolith === undefined) {
    structure.meta.monolith = confirm("Using web services means your tournament data will be uploaded to an external database. \n\nDo you want to proceed?")
  }

  if(!structure.meta.monolith) {
    $("#qr").classList.add("inactive")
    $("#monolith-link").classList.add("inactive")

    $("#web-services-disabled").classList.remove("inactive")

    $("#toggle-web-services").textContent = "Enable web services."
  }
  else {
    generateQr(structure)
    $("#monolith-link").value = "http://monolith.ga/t/"+structure.meta.shortid
    $("#monolith-link").classList.remove("inactive")

    $("#web-services-disabled").classList.add("inactive")

    $("#toggle-web-services").textContent = "Disable web services."
  }
}

// Redraw the save history view.
export function redrawHistory() {
  let select = $("#history-select")

  while(select.firstChild) {
    select.removeChild(select.firstChild)
  }

  for(let each of structure.gameHistory) {
    let option = document.createElement("option")
    select.appendChild(option)
    option.textContent = each.date
    option.value = each.structure
  }
}

// Generate a toast.
export function toast(content, type, timeout = 2000, buttonText, buttonFunction) {
  const container = $("#toasts")

  let toast = document.createElement('div')
  container.appendChild(toast)
  toast.classList.add("toast")
  if(type) toast.classList.add(type)

  let span = document.createElement('span')
  toast.appendChild(span)
  span.textContent = content

  if(buttonText) {
    let button = document.createElement('button')
    toast.appendChild(button)
    button.textContent = buttonText
    button.classList.add('btn', 'btn-default')
    button.addEventListener("click", buttonFunction)
  }

  toast.addEventListener("click", close)

  setTimeout(close, timeout)

  function close() {
    toast.classList.add("fading")
    toast.addEventListener('animationend', () => {
      toast.remove()
    })
  }
}
