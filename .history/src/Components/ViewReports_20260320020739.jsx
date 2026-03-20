import React from 'react'
import { IoArrowBack } from 'react-icons/io5'

function ViewReports() {
  const ReportCard = ({ report }) => {
  const formattedDate = new Date(report.date).toLocaleDateString("en-US");

  return (
    <div>
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

    <div className="mt-6 border border-gray-200 rounded-lg p-4">

      <div className="flex justify-between items-center">

        <div className="flex gap-3 items-center">
          <span className="font-medium text-gray-900">
            {formattedDate}
          </span>

          <span className="bg-green-100 text-green-800 text-xs px-3 py-1 rounded-full">
            {report.type}
          </span>
        </div>

      </div>

      <div className="mt-4 bg-gray-50 p-4 rounded-md">
        {report.content}
      </div>

    </div>
  
    </div>
  )
}
}
export default ViewReports