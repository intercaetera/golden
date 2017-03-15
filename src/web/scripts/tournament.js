class Player {
  constructor(nick, name, surname, points=0, sos=0, opponents=[]) {
    this.nick = nick
    this.name = name
    this.surname = surname
    this.points = points
    this.sos = sos
    this.opponents = opponents
  }

  addPoints(points) {
    this.points += points
  }

  calculateSos() {
    let sos = 0
    for(let each of this.opponents) {
      let acc = each.points / each.opponents.length
      sos += acc
    }
    sos = sos / this.opponents.length
    this.sos = sos
  }
}

class Match {
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

class Round {
  constructor(players) {
    const sorted = players.sort((a, b) => {
      if(a.points === b.points) {
        return (a.sos < b.sos) ? -1 : (a.sos > b.sos) ? 1 : 0
      }
      else {
        return (a.points < b.points) ? -1 : 1
      }
    })

    let matches = []
    for(let i=0; i<sorted.length; i+=2) {
      matches[i/2] = new Match(sorted[i], sorted[i+1])
    }

    this.matches = matches
  }
}
