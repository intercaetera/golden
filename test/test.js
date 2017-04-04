var assert = require("assert");
var t = require("../src/web/js/tournament.js")

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
      players[i] = new t.Player({name: i.toString()})
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
      players[i] = new t.Player({name: i.toString()})
    }

    const cut = new t.Cut(players)

    //Score an entire tournament.
    cut.declareWinner(cut.match(players[0]), players[0])
    cut.declareWinner(cut.match(players[1]), players[1])
    cut.declareWinner(cut.match(players[2]), players[2])
    cut.declareWinner(cut.match(players[3]), players[3])

  })

  describe("Pairings", () => {
    const TOURNAMENTS = 1
    for(let i=0; i<TOURNAMENTS; i++) {
      let PLAYERS = 8
      let players = []
      for(let j=0; j<PLAYERS; j++) {
        players[j] = new t.Player(j.toString())
      }

      let ROUNDS = Math.floor(Math.log2(PLAYERS)) + 1
      console.log(PLAYERS + " players, " + ROUNDS + " rounds")
      let rounds = []
      for(let j=0; j<ROUNDS; j++) {
        let current = rounds[j]
        current = new t.Round(players)

        for(let each of current.matches) {
          randomOutcome(each)
        }
      }

      it("No player should have played another player twice", () => {
        var noDuplicates = true
        for(let each of players) {
          let opponents = each.opponents.map(item => item.id)
          let uniqueOpp = Array.from(new Set(opponents))
          if (uniqueOpp.length != opponents.length) {
            noDuplicates = false
          }
        }
        assert.equal(true, noDuplicates)
      })
    }
  })
})

function randomOutcome(match) {
  let rand = Math.floor(Math.random() * 43)
  if(rand < 10) { //Win p1
    return match.outcome(6, 0)
  }
  else if(rand < 20) { //Win p2
    return match.outcome(0, 6)
  }
  else if(rand < 30) { //Split
    return match.outcome(3, 3)
  }
  else if(rand < 32) { //Win + timed win p1
    return match.outcome(5, 0)
  }
  else if(rand < 34) { //Win + timed win p2
    return match.outcome(0, 5)
  }
  else if(rand < 36) { //Win p1 + timed win p2
    return match.outcome(3, 2)
  }
  else if(rand < 38) { //Win p2 + timed win p1
    return match.outcome(2, 3)
  }
  else if(rand === 38) { //Timed win one game, p1
    return match.outcome(2, 0)
  }
  else if(rand === 39) { //Timed win one game, p2
    return match.outcome(0, 2)
  }
  else if(rand === 40) { //Win p1, timed tie
    return match.outcome(4, 1)
  }
  else if(rand === 41) { //Win p2, timed tie
    return match.outcome(1, 4)
  }
  else if(rand === 42) { //Timed one game tie
    return match.outcome(1, 1)
  }
}
