import { Player, Round, Match, Cut } from '../tournament'
import clone from 'clone'

export function serialise(inputArray) {
  const input = clone(inputArray)

  let output = {}

  output.meta = input.meta

  output.players = []

  for(let i=0; i<input.players.length; i++) {
    output.players[i] = input.players[i]

    if(input.players[i].opponents) {
      for(let j=0; j<input.players[i].opponents.length; j++) {
        output.players[i].opponents[j] = input.players[i].opponents[j].id
      }
    }
    else {
      output.players[i].opponents = []
    }
  }

  output.rounds = []

  for(let i=0; i<input.rounds.length; i++) {
    if(input.rounds[i].matches) {
      output.rounds[i] = {
        matches: []
      }

      for(let j=0; j<input.rounds[i].matches.length; j++) {
        output.rounds[i].matches[j] = input.rounds[i].matches[j]

        output.rounds[i].matches[j].player1 = input.rounds[i].matches[j].player1.id
        output.rounds[i].matches[j].player2 = input.rounds[i].matches[j].player2.id
      }
    }
  }

  return JSON.stringify(output, null, 2)
}

export function deserialise(input) {
  input = JSON.parse(input)
  let output = {}

  output.meta = input.meta

  output.players = []

  for(let i=0; i<input.players.length; i++) {
    output.players[i] = new Player(input.players[i])
  }

  for(let i=0; i<input.players.length; i++) {
    for(let j=0; j<input.players[i].opponents.length; j++) {
      output.players[i].opponents[j] = findPlayer(output.players, input.players[i].opponents[j])
    }
  }

  output.rounds = []

  for(let i=0; i<input.rounds.length; i++) {

    let matches = []
    for(let j=0; j<input.rounds[i].matches.length; j++) {
      let p1id = input.rounds[i].matches[j].player1
      let p2id = input.rounds[i].matches[j].player2

      let current = input.rounds[i].matches[j]

      current.player1 = findPlayer(output.players, p1id)
      current.player2 = findPlayer(output.players, p2id)

      matches.push(new Match(current))
    }

    output.rounds[i] = new Round(undefined, matches)
  }

  return output
}

export function findPlayer(array, uuid) {
  for(let each of array) {
    if(each.id === uuid) {
      return each
    }
  }
}
