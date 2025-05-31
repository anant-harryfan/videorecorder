import { hidePluginWindow } from "./utils";
import { v4 as uuid } from "uuid";
import io from "socket.io-client"

let videoTransferFileName: string | undefined;
// var mediaRecorder: MediaRecorder;
let mediaRecorder: MediaRecorder
let userId: string

const socket = io(import.meta.env.VITE_SOCKET_URL as string)

export const startRecording = (onSources: {
  screen: string;
  audio: string;
  id: string;
}) => {
  hidePluginWindow(true);
  videoTransferFileName = `${uuid()}-${onSources?.id.slice(0, 8)}.webm`;
  mediaRecorder.start(1000);
};
export const onStopRecording = () => {
  mediaRecorder.stop();
};
const StopRecording =( ) =>{
    hidePluginWindow(false)
    socket.emit("process-video", {
        filename: videoTransferFileName,
        userId
    })
}

const onDataAvailable = (e: BlobEvent) => {
    // alert('running')
socket.emit(`video-chunks`, {
    chunks: e.data,
    filename: videoTransferFileName,
})
}

export const selectSources = async (
  onSources: {
    screen: string;
    audio: string;
    id: string;
    preset: "HD" | "SD";
  },
  videoElement: React.RefObject<HTMLVideoElement>
) => {
  if (onSources && onSources.screen && onSources.audio && onSources.id) {
    const constraints: any = {
      audio: false,
      video: {
        mandatory: {
          chromeMediaSource: "desktop",
          chromeMediaSourceId: onSources?.screen,
          minWidth: 1920,
          maxWidth: 1920,
          minHeight: 1080,
          maxHeight: 1080,
          frameRate: 30,
        },
      },
    }
    userId = onSources.id

    const stream   = await navigator.mediaDevices.getUserMedia(
        constraints
    )
    const audioStream = await navigator.mediaDevices.getUserMedia({
        video: false,
        audio: {deviceId: {exact: onSources.audio}}
    })

  
    if(videoElement&&videoElement.current){
        videoElement.current.srcObject = stream;
        await videoElement.current.play();
    }
    const combinedStream = new MediaStream([
        ...stream.getTracks(),...audioStream.getTracks()
    ])

    mediaRecorder = new MediaRecorder(combinedStream, {
        mimeType: 'video/webm; codecs=vp9'
    })

    mediaRecorder.ondataavailable = onDataAvailable
    mediaRecorder.onstop = StopRecording
    // mediaRecorder.onstop = StopRecording
  }
};
