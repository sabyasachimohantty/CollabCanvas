import React from 'react'
import { nanoid } from 'nanoid'
import { useNavigate } from 'react-router'

const HomePage = () => {

    const navigate = useNavigate()

    function createBoard() {
        const canvasId = nanoid(10)
        navigate(`/canvas/${canvasId}`)
    }

    return (
        <div className='h-screen w-screen bg-stone-800 text-white flex flex-col'>
            <div className='bg-green-400 flex-1 flex justify-center'>
                <div className='h-full flex flex-col justify-end'>
                    <div className='pb-16 font-mono font-bold'>
                        <div className='text-8xl'>Collab</div>
                        <div className='text-9xl text-stone-800'>Canvas</div>
                    </div>
                </div>
            </div>
            <div className='flex-1 flex justify-center'>
                <div className='h-full pt-12'>
                    <button 
                    className='border-green-400 px-8 py-3 text-lg font-bold border-4 hover:bg-green-400'
                    onClick={createBoard}
                    >
                        Create a Canvas
                    </button>
                </div>
            </div>
        </div>
    )
}

export default HomePage