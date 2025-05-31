const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

const express = require("express");
const fs = require("fs");
const app = express();
const server = http.createServer(app);

const dotenv = require("dotenv");
const { Readable } = require("stream");
const { default: axios } = require("axios"); //axios
const { S3Client, PutObjectCommand, S3 } = require("@aws-sdk/client-s3");

dotenv.config();

const s3 = new S3Client({
    credentials: {
        accessKeyId: process.env.ACCESS_KEY,
        secretAccessKey: process.env.SECRET_KEY,
    },
    region: process.env.BUCKET_REGION,
});

app.use(cors());

const io = new Server(server, {
    cors: {
        origin: process.env.ELECTRON_HOST,
        methods: ["GET", "POST"],
    },
});

let recordedChunka = [];

io.on("connection", (socket) => {
    console.log("HOGAYYAYAYA DF A CVJCJ XCV V CVJCLJV CONNECT");
    socket.on("video-chunks", async (data) => {
        console.log("CHUNKA LDFLFDJKLKLJSDF DFSLKJCLIVLSDLFKDOS", data);
        const writestream = fs.createWriteStream("live_upload/" + data.filename);
        recordedChunka.push(data.chunks);
        const videoBlob = new Blob(recordedChunka, {
            type: "video/webm; codecs=vp9",
        });
        const buffer = Buffer.from(await videoBlob.arrayBuffer());
        const readStream = Readable.from(buffer);
        readStream.pipe(writestream).on("finish", () => {
            console.log("CHANKU BHAI HO GAE");
        });
    });
    socket.on("process-video", async (data) => {
        console.log("rocessjdfsljgflsjflsldkfjdlsfk ", data);
        recordedChunka = [];
        fs.readFile("live_upload/" + data.filename, async (err, file) => {
            const processing = await axios.post(
                `${process.env.NEXT_API_HOST}/recording/${data.userId}/processsing`,
                {filename: data}
            );
            if (processing.data.status !== 200)
                return console.log(
                    "errror Error ERror ERRor ERROr ERROR ABELJLDFJLASDFJKLASDFJ ERROR FILELELDFLDSLFSL"
                );
            const Key = data.filename;
            const Bucket = process.env.BUCKET_NAME;
            const ContentType = "video/webm";
            const command = new PutObjectCommand({
                Key,
                Bucket,
                ContentType,
                Body: file,
            });

            const fileStatus = await s3.send(command);
            if (fileStatus["$metadata"].httpStatusCode == 200) {
                console.log(
                    "DKLSFLSDFJLFDAS AWS DSFLASDFJASDLFLKASFLJ AWLJLKSLDSJFLSJDFLSDFJLS SSS S S S S  A A  DS FS F W W W W S  S S "
                );
                fs.stat("live_upload/" + data.filename, async (err, stat) => {
                    if (!err) {
                    }
                });
                //`${process.env.NEXT_API_HOST}/recording/${data.userId}/complete`
                const stopProcessing = await axios.post(
                    `${process.env.NEXT_API_HOST}recording/${data.userId}/complete`, { filename: data.filename, }
                );
                if (stopProcessing.data.status !== 200) console.log('PROCESSING STAGE MAR GAE')
                if (stopProcessing.data.status == 200) {
                    console.log('OHDFLDFKLJDFLKJDFLK BHIA LJFLKJDFKLJASFHO GAE L DFLASFPROCESS ')
                    // fs.unlink('live_upload/'+ data.filename, (err)=>{
                    //     if(!err) console.log(data.filename+ " " +'abe delete mat karna')
                    // })
                }

            }else{
                console.log("MAIN WALA IF NAHI CHALA TO UPOLUDO NAHI HUA")
            }

        });
    });
    socket.on("disconnect", async (data) => {
        console.log("hodfjladfjlkdasjfl conecdiscount socketid ", socket.id, data);
    });
});

server.listen(5000, () => {
    console.log("jabh 5000");
});
