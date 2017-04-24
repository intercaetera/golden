import fs from 'fs'
import qr from 'qr-image'
import path from 'path'

export function generateQr(s) {
  const svgpath = path.join(__dirname, '..', 'qr', s.meta.name+".svg")
  fs.access(svgpath, (err) => {
    if(!err) {
      $("#qr").src = svgpath
      $("#qr").classList.remove("inactive")
    }
    else {
      let svg = qr.image(`http://monolith.ga/t/${s.meta.shortid}`, {type: 'svg'})
      svg.pipe(fs.createWriteStream(svgpath)).on('finish', () => {
        $("#qr").src = svgpath
        $("#qr").classList.remove("inactive")
      })
    }
  })
}
