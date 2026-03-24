import React from 'react'
import { IoArrowBack } from 'react-icons/io5'

function ViewReports() {
  const today = new Date();

const formattedDate = today.toLocaleDateString("en-US", {
  month: "numeric",
  day: "numeric",
  year: "numeric",
});
}

export default ViewReports