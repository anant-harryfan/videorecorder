import React, { useEffect, useRef } from 'react'



const WebCam = () => {
    const cam = useRef<HTMLVideoElement | null>(null)
    const streamWebCam = async()=>{
        const stream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true,
        })
        if(cam.current){
            cam.current.srcObject = stream
            await cam.current.play()
        }
    }
    useEffect(()=>{
        streamWebCam()
     }, [])
  return (
    <video ref={cam} className='h-screen draggable object-cover rounded-lg aspect-video border-2 relative border-white'>dsafdsadf</video>
  )
}