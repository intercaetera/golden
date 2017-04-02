import { Cut } from './js/tournament.js'

$("#nav-cut").addEventListener("click", redrawCut)

function redrawCut() {
  //Check if the cut started
  if(!structure.cut) {
    $("#no-cut").style.display = "block"
    $("#cut-table").style.display = "none"
    return
  }
  else {
    $("#no-cut").style.display = "none"
    $("#cut-table").style.display = "block"
  }

  //Clear the tables
  let tbody = $("#cut-upper").querySelector("tbody")
  while(tbody.firstChild) {
    tbody.removeChild(tbody.firstChild)
  }

  tbody = $("#cut-lower").querySelector("tbody")
  while(tbody.firstChild) {
    tbody.removeChild(tbody.firstChild)
  }

  if(structure.cut.roundUpper()) {
    for(let each of structure.cut.roundUpper()) {
      createTableElement("upper", each)
    }
  }

  if(structure.cut.roundLower()) {
    for(let each of structure.cut.roundLower()) {
      createTableElement("lower", each)
    }
  }

  function createTableElement(bracket, match) {
    let player1 = findBySeed(match.p[0])
    let player2 = findBySeed(match.p[1])

    if(!player1 || !player2) return

    let tr = document.createElement('tr')
    $("#cut-"+bracket).querySelector('tbody').appendChild(tr)

    createTableCell(player1.name)
    createTableCell(player2.name)

    let score = createTableCell()
    let select = document.createElement('select')
    score.appendChild(select)

    let p1option = document.createElement('option')
    select.appendChild(p1option)
    p1option.value = player1.seed
    p1option.textContent = player1.name

    let p2option = document.createElement('option')
    select.appendChild(p2option)
    p2option.value = player2.seed
    p2option.textContent = player2.name

    let scoreButton = createTableCell()
    let button = document.createElement('button')
    scoreButton.appendChild(button)
    button.textContent = "Score"
    button.classList.add("btn", "btn-mini", "btn-default")
    button.addEventListener("click", () => {
      structure.cut.declareWinner(match, select.value)
      redrawCut()
    })

    function createTableCell(content) {
      let td = document.createElement('td')
      tr.appendChild(td)
      td.textContent = content
      return td
    }
  }

  if($("#cut-upper tbody").childNodes.length == 0 && $("#cut-lower tbody").childNodes.length == 0) {
    $("#cut-no-matches").classList.remove('inactive')
  }
}

$("#cut-start").addEventListener("click", () => {
  //Check if the cut already exists.
  if(structure.cut) throw new Error("The cut already exists!")

  //Create the cut table.
  let power = $("#cut-size").value
  let cutPlayers = []
  for(let i=0; i<power; i++) {
    cutPlayers[i] = structure.players[i]
  }

  structure.cut = new Cut(cutPlayers)
  structure.cut.players = cutPlayers

  redrawCut()

})

function findBySeed(seed) {
  for(let each of structure.cut.players) {
    if(each.seed === seed) return each
  }
}
