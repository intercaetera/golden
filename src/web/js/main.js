import { Player, Round, Match, Cut } from './js/tournament'

let structure = {
  "meta": {
    "name": "",
    "location": "",
    "host": ""
  },
  "players": [

  ],
  "rounds": [

  ],
  "cut": {

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
})

$("#nav-players").addEventListener("click", () => {

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
    }
  }
})
