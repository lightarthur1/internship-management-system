import React from 'react'
import { FiUser } from "react-icons/fi";
import Navbar from '../Components/Navbar/Navbar'
import { FaRegFileLines } from "react-icons/fa6";
import { useNavigate } from 'react-router-dom';

const AcademicSupervisorDashboard = () => {
  const navigate = useNavigate();
  return (
    <>
      <Navbar />

     <main className="pt-20">
      <div className='max-w-6xl mx-auto mt-8'>
  <div className='bg-gray-100 rounded-2xl p-6 shadow-sm border border-gray-200'>

     <h2 className='text-lg  font-semibold mb-6 text-black '>Supervisor Information</h2>


    {/* grids  */}
    <div className='grid  grid-cols-1 md:grid-cols-3 gap-8'>
       <div>
        <p className="text-sm text-gray-500 mb-1">Name</p>
        <p className="font-normal text-gray-900">
          Dr. Sarah Williams
        </p>
      </div>
       <div>
        <p className="text-sm text-gray-500 mb-1">Department</p>
        <p className="font-normal text-gray-900">
          Computer Science
        </p>
      </div>
       <div>
        <p className="text-sm text-gray-500 mb-1">Email</p>
        <p className="font-normal text-gray-900">
          sarah.w@university.edu
        </p>
      </div>
      
    </div>
  </div>
 <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">

  {/* assigned students card*/}
  <div className="bg-gray-100 rounded-2xl p-8 shadow-sm border border-gray-200">
    <div className="flex justify-between items-center mb-4">
      <h3 className="text-gray-500">Assigned Students</h3>
      <FiUser className="text-gray-500 text-lg" />
    </div>
    <span className="text-black font-semibold text-2xl">3</span>
  </div>

  {/* total reports*/}
  <div className="bg-gray-100 rounded-2xl p-8 shadow-sm border border-gray-200">
    <div className="flex justify-between items-center mb-4">
      <h3 className="text-gray-500">Total Reports</h3>
      <FaRegFileLines className="text-gray-500 text-lg" />
    </div>
    <span className="text-black font-semibold text-2xl">9</span>
  </div>

  {/* pending*/}
  <div className="bg-gray-100 rounded-2xl p-8 shadow-sm border border-gray-200">
    <div className="flex justify-between items-center mb-4">
      <h3 className="text-gray-500">Pending Reviews</h3>
      <FaRegFileLines className="text-orange-600 text-lg" />
    </div>
    <span className="text-orange-600 font-semibold text-2xl">3</span>
  </div>

</div>
                   {/* Assigned students Card*/}

                   <div  className='max-w-6xl mx-auto mt-8'>
<div className='bg-gray-100 rounded-2xl p-6 shadow-sm border border-gray-200'>
   <h3 className='text-black text-lg font-semibold '>Assigned Students</h3>
   <h3 className='text-gray-500 text-normal'>Students under your supervision</h3>
   <div className="border rounded-lg p-4 ">
    <div className=''>
     <div className='  items-center gap-2 mb-1'>
      <div className='max-w-auto h-auto rounded-lg shadow-sm border border-gray-200 mt-6 pt-6 space-y-3 p-4'>
      <div>
      <div className='flex gap-6 mb-4 '>
          <h3 className='text-black'>John Doe</h3>
      <span className=' rounded-lg p-2 text-orange-700 border-orange-200 inline-flex items-center justify-center rounded-md border px-2  text-xs font-medium rounded-lg'>1 pending</span>
      </div>
      
    

      <div className='text-gray-500 text-normal space-y-3 '>
    
         <p>200455544  <span className='font-bold text-gray-500'>.</span> Computer Science</p>
    <div className='flex gap-8 justify-between'>
      <p>Company: <span className='text-black'>Tech Solutions Ltd</span></p>
      <p>Location: Accra,Ghana</p>
       <div className='flex justify-between'>
      {/* View Reports button */}
      <div className='bg-green-900 rounded-lg p-2 flex gap-3 text-white'
      onClick={()=> navigate("/view-reports")}>
         <FaRegFileLines  className='text-white'/>
        <button  >View Reports</button>
      </div>
      
      </div>  
      </div>
        </div> 

      
      </div>  
       <p className='text-black'>Reports Submitted : <span className='text-black'>3</span></p>
     
 
</div>
      <div className='  items-center gap-2 mb-1'>
      <div className='max-w-auto h-auto rounded-lg shadow-sm border border-gray-200 mt-6 pt-6 space-y-3 p-4'>
      <div>
      <div className='flex gap-6 mb-4 '>
          <h3 className='text-black'>Emily Brown</h3>
      <span className=' rounded-lg p-2 text-orange-700 border-orange-200 inline-flex items-center justify-center rounded-md border px-2  text-xs font-medium rounded-lg'>2 pending</span>
      </div>
      
    

      <div className='text-gray-500 text-normal space-y-3 '>
    
         <p>200455544  <span className='font-bold text-gray-500'>.</span> Computer Science</p>
    <div className='flex gap-8 justify-between'>
      <p>Company: <span className='text-black'>Digital Marketing PRO</span></p>
      <p>Location: Accra,Ghana</p>
       <div className='flex justify-between'>
      {/* View Reports button */}
    <div className='bg-green-900 rounded-lg p-2 flex gap-3 text-white'
      onClick={()=> navigate("/view-reports")}>
         <FaRegFileLines  className='text-white'/>
        <button  >View Reports</button>
      </div>
      
      </div>  
      </div>
        </div> 

      
      </div>  
       <p className='text-black'>Reports Submitted : <span className='text-black'>2</span></p>
     
 
</div>
     
      <div className='  items-center gap-2 mb-1'>
      <div className='max-w-auto h-auto rounded-lg shadow-sm border border-gray-200 mt-6 pt-6 space-y-3 p-4'>
      <div>
      <div className='flex gap-6 mb-4 '>
          <h3 className='text-black'>David Wilson</h3>
      <span className=' rounded-lg p-2 text-orange-700 border-orange-200 inline-flex items-center justify-center rounded-md border px-2  text-xs font-medium rounded-lg'>3 pending</span>
      </div>
      
    

      <div className='text-gray-500 text-normal space-y-3 '>
    
         <p>200455544  <span className='font-bold text-gray-500'>.</span> Computer Science</p>
    <div className='flex gap-8 justify-between'>
      <p>Company: <span className='text-black'>Software Incorporated</span></p>
      <p>Location: Accra,Ghana</p>
       <div className='flex justify-between'>
      {/* View Reports button */}
      <div className='bg-green-900 rounded-lg p-2 flex gap-3 text-white'
      onClick={()=> navigate("/view-reports")}>
         <FaRegFileLines  className='text-white'/>
        <button  >View Reports</button>
      </div>
      
      </div>  
      </div>
        </div> 

      
      </div>  
       <p className='text-black'>Reports Submitted : <span className='text-black'>2</span></p>
     
 
</div>
     </div>
 </div>
    <div>
    
 </div>
     </div>
    
     </div>
   </div>
</div>
                     
                   </div>
                 
 </div>
</main>

    </>
  )
}

export default AcademicSupervisorDashboard


