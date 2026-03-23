import React from 'react'
import { BiComment } from 'react-icons/bi'
import { IoArrowBack } from 'react-icons/io5'
import { LuThumbsDown, LuThumbsUp } from 'react-icons/lu'
import { VscThumbsupFilled } from 'react-icons/vsc'
import { useNavigate } from 'react-router-dom'
function ViewReports() {
  const navigate = useNavigate();
  return (
    <div className='bg-blue-50 min-h-screen  flex flex-col'>
      <div className="bg-white border-b border-gray-200 px-8 py-6 mx-auto">

  <button
    onClick={() => navigate("/academic-supervisor")}
    className="flex items-center gap-2 text-sm text-black hover:text-black mb-3"
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
<div className='max-w-6xl mt-8  border border-gray-200 p-8 rounded-xl bg-white m-8 mx-auto '>
<p className='text-black text-xl font-semibold'>Internship Reports</p>
<p className='text-gray-400 font-thin'>Review and provide feedback on students progress</p>
<div className='border border-gray-200 max-w-5xl rounded-xl shadow-sm items-center mt-8'>
   
  <div className="mt-6 rounded-lg p-4">

  <div className="flex items-center justify-between">

    <div className="flex items-center gap-3">

      <span className="font-medium text-gray-900">
        2/21/2026
      </span>

      <span className="bg-green-100 text-green-800 text-xs font-medium px-3 py-1 rounded-full">
        weekly
      </span>

      <span className="bg-green-100 text-green-800 text-xs font-medium px-3 py-1 rounded-full">
        reviewed
      </span>

    </div>

    <span className="text-green-600 text-xl">
        <VscThumbsupFilled className="text-green-400" />
    </span>

  
</div>
  <div className="mt-4 bg-gray-50 rounded-md p-4 text-gray-700 text-sm">
    This week I worked on the user authentication module. Implemented login and
    registration features using JWT tokens. Also started working on password
    reset functionality.
  </div>

  <div className="mt-4 border border-blue-200 bg-blue-50 rounded-md p-4">

    <p className="text-sm text-blue-700 font-medium">
      Your Feedback:
    </p>

    <p className="text-sm text-blue-800 mt-1">
      Good progress! Make sure to add proper validation and error handling.
    </p>
</div>



  </div>
</div>
<div className='border border-gray-200 max-w-5xl rounded-xl shadow-sm items-center mt-8'>
 <div className="mt-6 rounded-lg  p-4">

  <div className="flex items-center justify-between">

    <div className="flex items-center gap-3">

      <span className="font-medium text-gray-900">
        2/21/2026
      </span>

      <span className="bg-green-100 text-green-800 text-xs font-medium px-3 py-1 rounded-full">
        weekly
      </span>

      <span className="bg-green-100 text-green-800 text-xs font-medium px-3 py-1 rounded-full">
        reviewed
      </span>

    </div>

    <span className="text-green-600 text-xl">
        <VscThumbsupFilled className="text-green-400" />
    </span>

  
</div>
  <div className="mt-4 bg-gray-50 rounded-md p-4 text-gray-700 text-sm">
    This week I worked on the user authentication module. Implemented login and
    registration features using JWT tokens. Also started working on password
    reset functionality.
  </div>

  <div className="mt-4 border border-blue-200 bg-blue-50 rounded-md p-4">

    <p className="text-sm text-blue-700 font-medium">
      Your Feedback:
    </p>

    <p className="text-sm text-blue-800 mt-1">
     Great start! Keep up the good work.
    </p>
</div>
</div>
</div>
<div className='border border-gray-200 max-w-5xl rounded-xl shadow-sm items-center mt-8'>
   
  <div className="mt-6 rounded-lg p-4">

  <div className="flex items-center justify-between">

    <div className="flex items-center gap-3">

      <span className="font-medium text-gray-900">
        2/21/2026
      </span>

      <span className="bg-green-100 text-green-800 text-xs font-medium px-3 py-1 rounded-full">
        weekly
      </span>

      <span className="bg-green-100 text-green-800 text-xs font-medium px-3 py-1 rounded-full">
        pending
      </span>

    </div>


  
</div>
  <div className="mt-4 bg-gray-50 rounded-md p-4 text-gray-700 text-sm">
Working on database integration and API endpoints for user management. Created RESTful endpoints for CRUD operations. Implemented data validation middleware.
  </div>

 <div className="flex gap-4 mt-6">

  {/* Like */}
  <button className="flex-1 flex items-center justify-center gap-2 border border-gray-200 rounded-xl py-3 text-black hover:bg-green-900 hover:text-white">
    <LuThumbsUp />
    Like
  </button>

  {/* Dislike */}
  <button className="flex-1 flex items-center justify-center gap-2 border border-gray-200 rounded-xl py-3 text-black hover:bg-green-900 hover:text-white">
    <LuThumbsDown />
    Dislike
  </button>

  {/* Comment */}
  <button className="flex-1 flex items-center justify-center gap-2 border border-gray-200 rounded-xl py-3 text-black hover:bg-green-900 hover:text-white">
    <BiComment />
    Comment
  </button>

</div>

</div>
</div>
</div>
</div>

  )
}

export default ViewReports