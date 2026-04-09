import React from 'react'

function LoadingSpinner() {
  return (
    <div className='flex items-center justify-center p-12'>
        <div className="animate-spin rounded-full h-12 w-12 border-t-5 border-b-5 border-blue-400/40"></div>
    </div>
  )
}

export default LoadingSpinner