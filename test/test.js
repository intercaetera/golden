var assert = require("assert");
var t = require("../src/web/js/tournament.js")
var circular = require('circular-json')

describe('tournament', function(){
  describe('Player', function(){
    it('Should set points and sos to 0 when unspecified.', function(){

      let player = new t.Player("zbyszek")
      assert.equal(0, player.points);
      assert.equal(0, player.sos)
    })

    it("Dropped players are not taken into account when generating rounds.", () => {

      const PLAYERS = 5

      let players = []

      for(let i=0; i<PLAYERS; i++) {
        players[i] = new t.Player(i.toString())
      }

      players[4].drop = true

      let round = new t.Round(players)

      assert.equal(2, round.matches.length)

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
      assert.equal(Math.floor(PLAYERS/2), round.matches.length)
    })

    it("Check proper opponents", () => {
      round.matches[0].outcome(3, 2)

      let player1 = round.matches[0].player1
      let player2 = round.matches[0].player2
      let opponent = player1.opponents[0]

      assert.equal(player2, opponent)
    })

    if(PLAYERS % 2 !== 0) {
      it("Bye the player if the number is odd", () => {
          for(let each of players) {
            if(each.bye) assert.equal(6, each.points)
          }
      })
    }

    it("Generate a new round", () => {
      round.matches[0].outcome(0, 6)
      round.matches[1].outcome(0, 6)
      round.matches[2].outcome(0, 6)
      round.matches[3].outcome(3, 0)

      let round2 = new t.Round(players)

      assert.equal(Math.floor(PLAYERS/2), round2.matches.length)
    })

    it("A player is not byed twice (12 points, no opponents)", () => {
      let flag = false
      for(let each of players) {
        if(each.opponents.length === 0 && each.points === 12) {
          flag = true

        }
      }

      assert.equal(false, flag)

    })


  })

  describe('Tournament', () => {
    const PLAYERS = 9
    const ROUNDS = 4

    let players = [], rounds = []

    for(let i=0; i<PLAYERS; i++) {
      players[i] = new t.Player(i.toString())
    }

    //* Give selected players superbyes
    players[0].superbye = true
    players[2].superbye = true
    players[players.length-1].superbye = true
    //*/

    for(let i=0; i<ROUNDS; i++) {
      let current = rounds[i]
      current = new t.Round(players)

      for(let each of current.matches) {
        randomOutcome(each)
      }
    }

    if(players.length % 2 === 0) {
      it("If there is an even number of players, each should have opponents equal to the number of rounds", () => {
        for(let each of players) {
          assert.equal(ROUNDS, each.opponents.length, each)
        }
      })
    }
    else {
      it("If there's an odd number of players, each should have proper number of opponents (ROUNDS)", () => {
        for(let each of players) {
          if(each.bye) {
            assert.equal(ROUNDS-1, each.opponents.length)
          }
          else {
            assert.equal(ROUNDS, each.opponents.length)
          }
        }
      })
    }
  })

  describe("Cut", () => {

    const PLAYERS = 8

    let players = []

    for(let i=0; i<PLAYERS; i++) {
      players[i] = new t.Player(i.toString())
    }

    const cut = new t.Cut(players)

    //Score an entire tournament.
    cut.declareWinner(cut.match(players[0]), players[0])
    cut.declareWinner(cut.match(players[1]), players[1])
    cut.declareWinner(cut.match(players[2]), players[2])
    cut.declareWinner(cut.match(players[3]), players[3])

  })
})



function randomOutcome(match) {
  let rand = Math.floor(Math.random() * 5)

  if(rand === 0) { //Win
    return match.outcome(6, 0)
  }
  else if(rand === 1) { //Timed win
    return match.outcome(5, 0)
  }
  else if(rand === 2) { //Split
    return match.outcome(3, 3)
  }
  else if(rand === 3) { //Timed split
    return match.outcome(3, 2)
  }
  else if(rand === 4) { //Timed one round
    return match.outcome(2, 0)
  }

}
