import { Cut } from './js/tournament.js'

$("#nav-cut").addEventListener("click", redrawCut)

function redrawCut() {
  if(!structure.cut) {
    $("#no-cut").style.display = "block"
    $("#cut-table").style.display = "none"
  }
  else {
    $("#no-cut").style.display = "none"
    $("#cut-table").style.display = "block"
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

})
