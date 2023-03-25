// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import busboy from "busboy";
import fs from "fs";
import path from "path";
import logUpdate from 'log-update';


export const config = {
  api: {
    bodyParser: false,
  },
};

function uploadVideoStream(req, res) {

  


  const bb = busboy({ headers: req.headers });

  let fileName;

  bb.on("file", (_, file, info) => {
    // auth-api.mp4
    fileName = info.filename;
    const filePath = `./videos/${fileName}`;

    const stream = fs.createWriteStream(filePath);


    file.pipe(stream);
  });

  bb.on("close", () => {
    res.writeHead(200, { Connection: "close" });
    res.end(`That's the end`);

    optimizeVideo(fileName, null);
  });

  req.pipe(bb);

  return;
}


import Ffmpeg from "fluent-ffmpeg";



function optimizeVideo (fileName, stream) {

  const startTime = new Date().getTime()

  const dir = "./videos/"
  const basePath = path.join(__dirname, "../../../../" ,dir, fileName)
  const baseName = fileName.substr(fileName.lastIndexOf(".") + 1)
  const id = fileName.split('.').slice(0, -1).join('.')


  console.log("Attempting to optimize video...")
  console.log("[PARAMS]")
  console.log({fileName, basePath, dir, baseName, id})

  console.log(`./videos/${id}/`)
  fs.mkdirSync(`./videos/${id}/`)
  


  



  // --------------------------------
  //    1080
  // --------------------------------


  const _1080 =  Ffmpeg(basePath)

  // generate full HD video
  .output("./videos/" + id + "/1080.mp4")
  .format('mp4')
  // .videoBitrate('2048k')
  .videoCodec('libx264')
  .size('?x1920')
  .audioBitrate('128k')
  .audioChannels(1)

  .on('start', () => {
    console.log('Starting optimization for 1080p')
  })
  .on('error', (err) => {
    console.error(err);
  })
  .on('progress', (progress) => {

    if (Math.round(progress.percent) % 25) {
      console.log('... Video: ' + id + " - " + Math.round(progress.percent))
    }
    

  })
  .on('end', () => {
    console.log('... finished processing 1080p for - ' + id)
      fs.unlinkSync(basePath)
      
      const timeTaken = (new Date().getTime() - startTime)
      console.log('... deleting original video file')
      console.log('|-------------------------------------')
      console.log('                                      ')
      console.log('      Finished Optimization           ')
      console.log('      Time: '+timeTaken+ 'ms          ')
      console.log('      Time: '+timeTaken  / 1000 + 's  ')
      console.log('                                      ')
      console.log(`      Video: ${id}                    `)
      console.log('                                      ')
      console.log('|------------------------------------|')



      
      
    })
    .setFfmpegPath(process.env.FFMPEG_PATH)




    // ----------------------------------------------------------------
  // THumbnails
  // ----------------------------------------------------------------

  const _thumbnails = Ffmpeg(basePath)
  .takeScreenshots({
    count: 4,
    folder: './videos/'+id+'/thumbnails/',
  })
  .on('start', () => {
    console.log("Starting");
  } )
  .on('error', (err) => {
    console.error(err);
  })
  .on('end', () => {
      console.log('... finished taking screenshot of video')

  })
  .setFfmpegPath(process.env.FFMPEG_PATH)






  // --------------------------------
  //    135
  // --------------------------------
  
  const _135 = Ffmpeg(basePath)
  
  
  .output("./videos/" + id + "/135.mp4")
  .format('mp4')
  .videoBitrate('512k')
  .videoCodec('libx264')
  .size('?x135')
  .audioBitrate('128k')
  .audioChannels(1)
  
  .on('start', () => {
    console.log('Starting optimization for 135p')
  })
  .on('error', (err) => {
    console.log(err);
  })
  .on('progress', (progress) => {
    if (Math.round(progress.percent) % 25) {
      console.log('... Video: ' + id + " - " + Math.round(progress.percent))
    }
  })
  .on('end', () => {
    console.log('... finished processing 135p for - ' + id)

    _thumbnails.run()
    _720.run()

  })
  .setFfmpegPath(process.env.FFMPEG_PATH)
  


  _135.run()
  
  


  // --------------------------------
  //    720
  // --------------------------------


  const _720 = Ffmpeg(basePath)
  // generate 720p video
  .output("./videos/" + id + "/720.mp4")
  .format('mp4')
  .videoBitrate('1024k')
  .videoCodec('libx264')
  .size('?x720')
  .audioBitrate('128k')
  .audioChannels(1)
  

  .on('start', () => {
    console.log('Starting optimization for 720p')
  })
  .on('error', (err) => {
    console.error(err);
  })
  .on('progress', (progress) => {
    if (progress.percent % 25) {
      console.log('... Video: ' + id + " - " + Math.round(progress.percent))
    }
  })
  .on('end', (result) => {
      console.log('... finished processing 720p for - ' + id)

      _1080.run()
  })
  .setFfmpegPath(process.env.FFMPEG_PATH)





  }
  
  








const CHUNK_SIZE_IN_BYTES = 1000000; // 1 mb

function getVideoStream(req, res) {


  const videoId = req.query.videoId;
  let quality = req.query.quality;
  if (!quality) { quality = "135"}
  console.log({quality})

  let filePath = `./videos/${videoId}/${quality}.mp4`;


  console.log({filePath})
  


  const options = {};

    let start;
    let end;

    const range = req.headers.range;
    if (range) {
        const bytesPrefix = "bytes=";
        if (range.startsWith(bytesPrefix)) {
            const bytesRange = range.substring(bytesPrefix.length);
            const parts = bytesRange.split("-");
            if (parts.length === 2) {
                const rangeStart = parts[0] && parts[0].trim();
                if (rangeStart && rangeStart.length > 0) {
                    options.start = start = parseInt(rangeStart);
                }
                const rangeEnd = parts[1] && parts[1].trim();
                if (rangeEnd && rangeEnd.length > 0) {
                    options.end = end = parseInt(rangeEnd);
                }
            }
        }
    }

    res.setHeader("content-type", "video/mp4");

    fs.stat(filePath, (err, stat) => {
        if (err) {
            console.error(`File stat error for ${filePath}.`);
            console.error(err);
            res.status(500);
            return;
        }

        let contentLength = stat.size;

        if (req.method === "HEAD") {
            res.statusCode = 200;
            res.setHeader("accept-ranges", "bytes");
            res.setHeader("content-length", contentLength);
            res.end();
        }
        else {        
            let retrievedLength;
            if (start !== undefined && end !== undefined) {
                retrievedLength = (end+1) - start;
            }
            else if (start !== undefined) {
                retrievedLength = contentLength - start;
            }
            else if (end !== undefined) {
                retrievedLength = (end+1);
            }
            else {
                retrievedLength = contentLength;
            }

            res.statusCode = start !== undefined || end !== undefined ? 206 : 200;

            res.setHeader("content-length", retrievedLength);

            if (range !== undefined) {  
                res.setHeader("content-range", `bytes ${start || 0}-${end || (contentLength-1)}/${contentLength}`);
                res.setHeader("accept-ranges", "bytes");
            }

            const fileStream = fs.createReadStream(filePath, options);
            fileStream.on("error", error => {
                console.log(`Error reading file ${filePath}.`);
                console.log(error);
                res.sendStatus(500);
            });
            
            fileStream.pipe(res);
        }
    });
}

export default async function handler(req, res) {
  const method = req.method;

  if (method === "GET") {
    return getVideoStream(req, res);
  }

  if (method === "POST") {
    return uploadVideoStream(req, res);
  }

  return res.status(405).json({ error: `Method ${method} is not allowed` });
}