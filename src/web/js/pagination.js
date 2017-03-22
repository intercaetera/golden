import path from 'path'
import fs from 'fs'

import CORPS from './js/data/CORPS.json'
import RUNNERS from './js/data/RUNNERS.json'

/************************************************
 ***************** INITIAL EVENTS ***************
 ************************************************/
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

/************************************************
 ********************* BUTTONS ******************
 ************************************************/
$("#btn-add-player").addEventListener("click", () => {
  $("#add-player").classList.toggle("inactive")
})


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

$("#nav-matches").addEventListener("click", () => {
  show($("#matches"))
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
