import Duel from 'duel'
import uuid from 'uuid'

export class Player {
  constructor(obj) {
    this.name = obj.name
    this.id = obj.id || uuid.v4()
    this.points = obj.points || 0
    this.sos = obj.sos || 0
    this.esos = obj.esos || 0
    this.corpfaction = obj.corpfaction
    this.corpid = obj.corpid
    this.runnerfaction = obj.runnerfaction
    this.runnerid = obj.runnerid
    this.opponents = obj.opponents || []
    this.bye = false
    this.superbye = obj.superbye || false
    this.drop = obj.drop || false
    this.gamesCount = 0
  }

  addPoints(points) {
    this.points += points
  }

  calculateSos() {
    //If the player hasn't played anyone (i. e. has a bye), avoid division by 0.
    if(this.opponents.length === 0) {
      this.sos = 0
      return
    }

    //Get strength of schedule according to the FFG algorithm.
    let sos = 0
    for(let each of this.opponents) {
      let acc = each.points / each.gamesCount
      sos += acc
    }

    sos = sos / this.opponents.length
    this.sos = sos
  }

  calculateExtendedSos() {
    // Avoid division by 0
    if(this.opponents.length === 0) {
      this.esos = 0
      return
    }

    let esos = 0
    for(let each of this.opponents) {
      esos += each.sos
    }
    esos = esos / this.opponents.length
    this.esos = esos
  }



  awardBye() {
    if(this.bye) {
      throw new Error("The player already has a bye!")
    } else {
      this.addPoints(6)
      this.bye = true
      this.calculateSos()
      this.superbye = false
    }
  }

  drop() {
    this.drop = true
  }
}

export class Match {
  constructor(obj) {
    this.player1 = obj.player1
    this.player2 = obj.player2 || null

    this.table = obj.table || null

    this.score1 = obj.score1 || 0
    this.score2 = obj.score2 || 0

    this.scored = obj.scored || false

    this.isBye = obj.isBye || false
  }

  outcome(pointsForFirst, pointsForSecond) {
    if(!this.scored) {
      this.player1.addPoints(pointsForFirst)
      this.player2.addPoints(pointsForSecond)
      
      if(!this.isBye){
      this.player1.opponents.push(this.player2)
      this.player2.opponents.push(this.player1)
      }

      this.player1.gamesCount = this.player1.gamesCount + 1
      this.player2.gamesCount = this.player2.gamesCount + 1
      
      this.score1 = pointsForFirst
      this.score2 = pointsForSecond

      this.scored = true
    }
  }
}

export class Round {
  constructor(playerArray, matchesArray) {
    if(playerArray) {
      //Copy the array cause we will mutate it later.
      let players = playerArray.slice()


      this.matches = []

      //Shuffle the array. Only really relevant in the first round.
      //Also before every round provides random pairing order for players with the same number of points
      players = removeDropped(players)
      shuffle(players)

      //Sort the array by points and then by sos.
      let sorted = players.sort((a, b) => {
          return (a.points < b.points) ? -1 : (a.points > b.points) ? -1 : 0
      })

      this.players = sorted

      //Award superbyes
      let i = 1
      let j = 3
      while(i<sorted.length) {
        let each = sorted[sorted.length-i]

        if(each.superbye) {
          each.awardBye()
          sorted.splice(sorted.length-i, 1)
        }
        else {
          i++
        }
      }
    }
  }

  IsPlayerInMatch(player) {
      for(let each of this.matches){
        if(each.player1.id == player.id || each.player2.id == player.id ){
          return true
        }
      }
     return false
  }
}

export class Cut {
  constructor(players) {
    let sorted = players.sort((a, b) => {
      if(a.points == b.points && a.sos == b.sos) {
        if(a.esos > b.esos) return -1
        else if(a.esos == b.esos) return 0
        else return 1
      }
      else if(a.points == b.points) {
        if(a.sos > b.sos) return -1
        else if(a.sos == b.sos) return 0
        else return 1
      }
      else {
        if(a.points > b.points) return -1
        else return 1
      }
    })

    for(let i=1; i<=sorted.length; i++) {
      sorted[i-1].seed = i
    }

    this.bracket = new Duel(sorted.length, {last: 2})
  }

  //Gets the upcoming/current match of a player for scoring.
  match(player) {
    return this.bracket.upcoming(player.seed)[0]
  }

  roundUpper() {
    return this.bracket.currentRound(1)
  }

  roundLower() {
    return this.bracket.currentRound(2)
  }

  //Determine the score of a match and then score it.
  declareWinner(match, player) {
    let ids = match.p

    if(ids[0] == player) {
      this.bracket.score(match.id, [1, 0])
    }
    else if(ids[1] == player) {
      this.bracket.score(match.id, [0, 1])
    }
  }
}

function shuffle(a) {
    for (let i = a.length; i; i--) {
        let j = Math.floor(Math.random() * i);
        [a[i - 1], a[j]] = [a[j], a[i - 1]];
    }
}

function removeDropped(a) {
  a = a.filter((each) => {
    if(!each.drop) return each
  })

  return a
}
