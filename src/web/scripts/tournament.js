import circular from 'circular-json'
import fs from 'fs'
import path from 'path'
import { remote } from 'electron'
import utils from './utils'

export class Player {
  constructor(nick, name, surname, points=0, sos=0, opponents=[]) {
    this.nick = nick
    this.name = name
    this.surname = surname
    this.points = points
    this.sos = sos
    this.opponents = opponents
    this.bye = false
  }

  addPoints(points) {
    this.points += points
  }

  calculateSos() {
    if(this.opponents.length === 0) {
      this.sos = 0
      return
    }

    let sos = 0
    for(let each of this.opponents) {
      let acc = each.points / each.opponents.length
      sos += acc
    }
    sos = sos / this.opponents.length
    this.sos = sos
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

  bye() {
    this.player1.addPoints(6)
    this.player1.bye = true
    this.player1.calculateSos()
  }
}

export class Round {
  constructor(playerArray) {
    //Copy the array cause reasons.
    let players = playerArray.slice()

    this.matches = []

    //Shuffle the array. Only really relevant in the first round.
    shuffle(players)

    //Sort the array by points and then by sos.
    const sorted = players.sort((a, b) => {
      if(a.points === b.points) {
        return (a.sos < b.sos) ? -1 : (a.sos > b.sos) ? 1 : 0
      }
      else {
        return (a.points < b.points) ? -1 : 1
      }
    })

    while(sorted.length > 0) {
      //Set the first player.
      let player1 = sorted.shift()
      let player2

      //Set the second player, make sure he was not played before.
      let i=0
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

      //Give the bye to the last player.
      if(!this.matches[this.matches.length-1].player2)
        this.matches[this.matches.length-1].bye()
    }
  }
}

function shuffle(a) {
    for (let i = a.length; i; i--) {
        let j = Math.floor(Math.random() * i);
        [a[i - 1], a[j]] = [a[j], a[i - 1]];
    }
}
