import fs from 'fs'
import qr from 'qr-image'
import path from 'path'

export function generateQr(s) {
  const matrix = qr.matrix(`http://monolith.ga/t/${s.meta.shortid}`, {type: 'svg'})

  let text = ""

  for(let each of matrix) {
    for(let more of each) {
      text += more ? "▄" : " "
    }
    text += "\n"
  }

  console.log(text);

  $("#qr").textContent = text

  $("#qr").classList.remove("inactive")
}
