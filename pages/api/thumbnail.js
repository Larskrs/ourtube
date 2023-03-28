import fs from 'fs'
import path from 'path'


export default function handler (req, res) {

    const id = req.query.id;
    const filePath = path.resolve('.', `./videos/${id}/thumbnails/tn_3.png`)
    const hasImage = fs.existsSync(filePath)
    if (!hasImage) { res.status(200).json({error: "Thumbnail not ready."}); return; }
    const imageBuffer = fs.readFileSync(filePath)


  res.setHeader('Content-Type', 'image/jpg')
  res.send(imageBuffer)
}