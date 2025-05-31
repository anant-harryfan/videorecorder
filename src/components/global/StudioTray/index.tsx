import { onStopRecording, selectSources, startRecording } from "@/lib/recorder";
import { cn } from "@/lib/utils";
import { Cast, Pause, Square } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

const StudioTray = () => {
    const [preview, setPreview] = useState(false);
    const [recording, setRecording] = useState(false);
    const [onSources, setOnSources] = useState<
    | {
        screen: string
        id: string
        audio: string
        preset: 'HD' | 'SD'
    }
    | undefined
    >(undefined);

window.ipcRenderer.on("profile-received", (event,payload)=>{
    console.log(event)
    setOnSources(payload)
})

    // let initialTime = new Date()
    const videoElement = useRef<HTMLVideoElement | null>(null);

useEffect(()=>{
if(onSources &&  onSources.screen) selectSources(onSources, videoElement)
    return ()=>{
selectSources(onSources!, videoElement)
    }
},[onSources])


    return !onSources? "no sources":(  

        <div className="flex  flexol justify-end gap-y-5 h-screen" >
            {preview && (
                <video
                    autoPlay
                    ref={videoElement}
                    className={cn("w-6/12 bg-black self-end")}
                />
            )}
            
            <div className="rounded-full flex justify-around draggable items-center h-20 w-full border-2 bg-[#171717] border-white/40">
                <div {...(onSources &&{onClick: ()=>{
                    setRecording(true)
                    startRecording(onSources)
                }})}
                className={cn('rounded-full cursor-pointer relative hover:opacity-80', recording?'bg-red-500 w-6 h-6': 'bg-red-400 w-8 h-8')}
                >
                    {recording && (
                        <span className="absolute -right-16 top-1/2 transform -translate-1/2 text-white">
                            {/* {onTime} */}
                        </span>
                    )}
                </div>
                {!recording?<Pause
                className="draggable opacity-50"
                size={32}
                fill="white"
                stroke="black"
                />:(
                    <Square
                    size={32}
                    className="draggable cursor-pointer hover:scale-110 transform transition duration-150"
                    fill="white"
                    onClick={()=>{
                        setRecording(false)
                        onStopRecording()
                    }}
                    stroke="black"
                    />
                )}
                <Cast
                onClick={()=>setPreview((prev)=>!prev)}
                size={32}
                fill="white"
                    className="draggable cursor-pointer hover:opacity-60"
                    stroke="black"
                    />
            </div>
        </div>
)
};

export default StudioTray;
