import React from "react";

const StudentFields = () => {

return (
<>

<label>Student ID</label>
<input
type="text"
placeholder="e.g. 2024001"
className="input-field"
/>

<label>Department</label>
<input
type="text"
placeholder="e.g. Computer Science"
className="input-field"
/>

</>
);

};

export default StudentFields;