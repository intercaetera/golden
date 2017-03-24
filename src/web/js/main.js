import t from '../src/web/js/tournament'

let structure = {
  "meta": {
    "name": "",
    "location": "",
    "host": ""
  },
  "players": [

  ],
  "rounds": [

  ]
}

console.log(t);

// Handle new player button.
$("#add-player form").addEventListener("submit", () => {
  console.log(t);
})
