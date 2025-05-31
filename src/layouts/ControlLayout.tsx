import { cn, onCloseApp } from '@/lib/utils'
import { UserButton } from '@clerk/clerk-react'
import { X } from 'lucide-react'
import React, { useState } from 'react'

type Props = {
    children: React.ReactNode
    className?: string
}

const ControlLayout = ({children, className}: Props) => {
    const [isVisible, setIsVisible] = useState<boolean>(false)
    window.ipcRenderer.on('hide-plugin', (event, payload)=>{
        console.log(event)
        setIsVisible(payload.state)
    })
  return (
    <div
    className={cn(className, isVisible && "invisible", 
        'bg-[#171717] flex-col rounded-3xl overflow-hidden draggable h-[100%]'
    )}
    >
          <div className="flex justify-between items-start p-5 draggable">
            <span className='draggable'>
                <UserButton/>
            </span>
              <div className='flex  gap-x-2'>   <img
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTwoBjBICmGFEe59eu_fAaQCZtC66RpQQPJog&s"
                  height={40}
                  width={40}
                  alt="logo"
              />
                  <p className="text-white text-2xl">Opal</p></div>
        </div>
        <div className="flex  ">
         {children}
        </div>
          <div className="p-5 flex w-full mb-0 bottom-0">
       
          </div>
    </div>
  )
}

export default ControlLayout