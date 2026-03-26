import React from 'react'
import { IoArrowBack } from 'react-icons/io5'

function ViewReports() {
  return (
    <div className='bg-white'>
      <div className="bg-white border-b border-gray-200 px-8 py-6">

  <button
    onClick={() => navigate("/academic-supervisor")}
    className="flex items-center gap-2 text-sm text-gray-600 hover:text-black mb-3"
  >
    <IoArrowBack className="w-4 h-4"/>
    Back to Dashboard
  </button>

  <h1 className="text-2xl font-semibold text-gray-900">
    Student Reports
  </h1>

  <p className="text-gray-500 text-sm">
    John Doe (2024001) - Tech Solutions Ltd
  </p>

</div>
<div className='max-w-6xl mt-8  border border-gray-200 p-8 rounded-xl bg-white m-8'>
<p className='text-black text-xl font-semibold'>Internsip Reports</p>
<p className='text-gray-400 font-thin'>Review and provide feedback on students progress</p>
<div>
  <div className="flex gap-2">
  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs">
    weekly
  </span>

  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs">
    reviewed
  </span>
</div>
</div>
</div>
    </div>
  )
}

export default ViewReports