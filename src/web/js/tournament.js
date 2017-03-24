import Duel from 'duel'

export class Player {
  constructor(nick, name, surname, superbye, points=0, sos=0, corpfaction, corpid, runnerfaction, runnerid, opponents=[]) {
    this.nick = nick
    this.name = name
    this.surname = surname
    this.points = points
    this.sos = sos
    this.corpfaction = corpfaction
    this.corpid = corpid
    this.runnerfaction = runnerfaction
    this.runnerid = runnerid
    this.opponents = opponents
    this.bye = false
    this.superbye = superbye || false
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
      let acc = each.points / each.opponents.length
      sos += acc
    }
    sos = sos / this.opponents.length
    this.sos = sos
  }

  awardBye() {
    if(this.bye) {
      throw new Error("The player already has a bye!")
    } else {
      this.addPoints(6)
      this.bye = true
      this.calculateSos()
    }
  }
}

export class Match {
  constructor(player1, player2) {
    this.player1 = player1
    this.player2 = player2
  }

  outcome(pointsForFirst, pointsForSecond) {
    this.player1.addPoints(pointsForFirst)
    this.player2.addPoints(pointsForSecond)

    this.player1.opponents.push(this.player2)
    this.player2.opponents.push(this.player1)

    this.player1.calculateSos()
    this.player2.calculateSos()
  }
}

export class Round {
  constructor(playerArray) {
    //Copy the array cause we will mutate it later.
    let players = playerArray.slice()

    this.matches = []

    //Shuffle the array. Only really relevant in the first round.
    shuffle(players)

    //Sort the array by points and then by sos.
    let sorted = players.sort((a, b) => {
      if(a.points === b.points) {
        return (a.sos < b.sos) ? -1 : (a.sos > b.sos) ? 1 : 0
      }
      else {
        return (a.points < b.points) ? -1 : 1
      }
    })

    //Award superbyes
    let i = 1
    while(i>1) {
      let each = sorted[sorted.length-i]

      if(each.superbye) {
        each.awardBye()
        each.superbye = false
        sorted.splice(sorted.length-i, 1)
      }
      else {
        i++
      }
    }

    //If there's an odd number of players, give the lowest ranked one a bye.
    if(sorted.length % 2 !== 0) {
      i = 1
      do {
        let each = sorted[sorted.length-i]
        if(each.bye) {
          i++
        }
        else {
          each.awardBye()
          sorted.splice(sorted.length-i, 1)
          break
        }
      }while(i>0)
    }

    //Handle the matches.
    while(sorted.length > 0) {
      //Set the first player.
      let player1 = sorted.shift()

      //Set the second player, make sure he was not played before.
      let player2
      i=0
      while(true) {
        if(player1.opponents.includes(sorted[i])) {
          i++
        }
        else {
          player2 = sorted.shift()
          break
        }
      }

      //Create a match.
      this.matches.push(new Match(player1, player2))
    }
  }
}

export class Cut {
  constructor(players) {
    let sorted = players.sort((a, b) => {
      if(a.points === b.points) {
        return (a.sos < b.sos) ? -1 : (a.sos > b.sos) ? 1 : 0
      }
      else {
        return (a.points < b.points) ? -1 : 1
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

  roundWinner() {
    return this.bracket.currentRound(1)
  }

  roundLoser() {
    return this.bracket.currentRound(2)
  }

  //Determine the score of a match and then score it.
  declareWinner(match, player) {
    let ids = match.p

    if(ids[0] == player.seed) {
      this.bracket.score(match.id, [1, 0])
    }
    else if(ids[1] == player.seed) {
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
