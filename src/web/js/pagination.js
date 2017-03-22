/************************************************
 ***************** INITIAL EVENTS ***************
 ************************************************/


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
