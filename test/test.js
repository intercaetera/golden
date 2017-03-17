var assert = require("assert"); // node.js core module
var t = require("../src/web/scripts/tournament.js")
var circular = require('circular-json')

describe('tournament', function(){
  describe('Player', function(){
    it('Should set points and sos to 0 when unspecified.', function(){

      let player = new t.Player("zbyszek")
      assert.equal(0, player.points); // 4 is not present in this array so indexOf returns -1
      assert.equal(0, player.sos)
    })
  })

  describe('Round', () => {

    const PLAYERS = 9

    let players = []

    for(let i=0; i<PLAYERS; i++) {
      players[i] = new t.Player(i.toString())
    }

    let round = new t.Round(players)

    //==================

    it("Be empty when finished assigning", () => {
      assert.equal(Math.ceil(PLAYERS/2), round.matches.length)
    })

    it("Check proper opponents", () => {
      round.matches[0].outcome(3, 2)

      let player1 = round.matches[0].player1
      let player2 = round.matches[0].player2
      let opponent = player1.opponents[0]

      assert.equal(player2, opponent)
    })

    it("Bye the player if the number is odd", () => {
      if(PLAYERS % 2 !== 0) {
        let points = round.matches[round.matches.length-1].player1.points
        assert.equal(6, points)
      }
    })

    it("Generate a new round", () => {
      round.matches[0].outcome(0, 6)
      round.matches[1].outcome(0, 6)
      round.matches[2].outcome(0, 6)
      round.matches[3].outcome(3, 0)

      let round2 = new t.Round(players)

      assert.equal(Math.ceil(PLAYERS/2), round2.matches.length)
    })

    it("A player is not byed twice (12 points, no opponents)", () => {
      let flag = false
      for(let each of players) {
        if(each.opponents.length === 0 && each.points === 12) {
          flag = true
          console.log(players);
        }
      }

      assert.equal(false, flag)

    })
  })
});
