import path from 'path'
import fs from 'fs'

import CORPS from './js/data/CORPS.json'
import RUNNERS from './js/data/RUNNERS.json'

/************************************************
 *************** KEYBOARD SHORTCUTS *************
 ************************************************/
 document.addEventListener('keyup', (e) => {
   if(e.ctrlKey && e.keyCode == 78) {
     newTournament()
   }
   else if(e.ctrlKey && e.keyCode == 80) {
     addPlayerDialog()
   }
   else if(e.ctrlKey && e.keyCode == 73) {
     openQuickscore()
   }
 })

/************************************************
 ***************** INITIAL EVENTS ***************
 ************************************************/

 //Populate add-player select fields.
for(let each in CORPS) {
 const optgroup = document.createElement("optgroup")
 $("#add-player-corp").appendChild(optgroup)
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
 $("#add-player-runner").appendChild(optgroup)
 optgroup.label = each

 for(let sub of RUNNERS[each]) {
   let option = document.createElement("option")
   optgroup.appendChild(option)
   option.textContent = `${sub.name}: ${sub.subtitle}`
   option.value = each
 }
}

//Prevent autosubmission of forms.
let forms = document.querySelectorAll("form")
for(let each of forms) {
  each.addEventListener("submit", (e) => {
    e.preventDefault()
  })
}


/************************************************
 ********************* BUTTONS ******************
 ************************************************/
$("#btn-add-player").addEventListener("click", addPlayerDialog)
function addPlayerDialog() {
  //Block if the tournament is not loaded.
  if(!structure.meta.id) {
    notCreated()
    return
  }

  $("#add-player").classList.toggle("inactive")
  $("#new-tournament").classList.add("inactive")
}

$("#add-player-cancel").addEventListener("click", () => {
  $("#add-player").classList.add("inactive")
})

$("#btn-new-tournament").addEventListener("click", newTournament)
function newTournament() {
  $("#new-tournament").classList.toggle("inactive")
  $("#add-player").classList.add("inactive")
}

$("#new-tournament-cancel").addEventListener("click", () => {
  $("#new-tournament").classList.add("inactive")
})

$("#btn-quickscore").addEventListener("click", openQuickscore)
$("#quickscore-close").addEventListener("click", (e) => {
  e.preventDefault()
  openQuickscore()
})
function openQuickscore() {
  if(!structure.meta.id) {
    notCreated()
    return
  }

  $("#quickscore").classList.toggle('inactive')
  $("#quickscore-table").focus()
}

/************************************************
 ********************* PAGES ********************
 ************************************************/
$("#nav-welcome").addEventListener("click", () => {
  console.log($("#welcome"));
  show($("#welcome"))
})

$("#nav-players").addEventListener("click", () => {
  show($("#players"))
})

$("#nav-rounds").addEventListener("click", () => {
  show($("#rounds"))
})

$("#nav-matches").addEventListener("click", () => {
  show($("#matches"))
})

$("#nav-cut").addEventListener("click", () => {
  show($("#cut"))
})

$("#nav-timer").addEventListener("click", () => {
  show($("#timer"))
})

$("#nav-web").addEventListener("click", () => {
  if(!structure.meta.id) {
    return
  }

  show($("#web"))
})

$("#nav-history").addEventListener("click", () => {
  show($("#history"))
})

function hideAllPages() {
  for(let each of $A(".page")) {
    each.classList.add("inactive")
  }
}

function show(page) {
  hideAllPages()
  page.classList.remove("inactive")
}
