function $(q) {
  return document.querySelector(q)
}

function $A(q) {
  return document.querySelectorAll(q)
}

function convertFactionToIcon(faction) {
  if(faction == 'Haas-Bioroid') return 'icon-haas-bioroid'
  if(faction == 'Jinteki') return 'icon-jinteki-simple'
  if(faction == 'Weyland Consortium') return 'icon-weyland-consortium'
  if(faction == 'NBN') return 'icon-nbn'

  if(faction == 'Shaper') return 'icon-shaper-smooth'
  if(faction == 'Criminal') return 'icon-criminal'
  if(faction == 'Anarch') return 'icon-anarch'

  if(faction == 'Apex') return 'icon-apex'
  if(faction == 'Adam') return 'icon-adam'
  if(faction == 'Sunny') return 'icon-sunny'
}

function notCreated() {
  alert("You first need to either create or load a tournament.")
}
