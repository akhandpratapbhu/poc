// import React, { useState, useEffect } from "react";
// import axios from "axios";

// const AddFormData = ({ entity }) => {
//   const [formData, setFormData] = useState({});

//   useEffect(() => {
//     entity.formSections.forEach((section) => {
//       section.attributes.forEach((attr) => {
//         if (attr.dataType.toLowerCase() === "dropdown") {
//           fetchDropdownOptions(attr);
//         }
//       });
//     });
//   }, [entity]);

//   const fetchDropdownOptions = async (attr) => {
//     try {
//       const response = await axios.post("/Employee/getDropdown", {
//         screenId: entity.id,
//         controlId: attr.id,
//         sourceField: attr.masterSource,
//         valueField: attr.valueField,
//       });
//       setFormData((prev) => ({
//         ...prev,
//         [attr.id]: { value: "", options: response.data.options },
//       }));
//     } catch (error) {
//       console.error("Error fetching dropdown options", error);
//     }
//   };

//   const handleChange = (e, attr) => {
//     const { value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [attr.id]: { ...prev[attr.id], value },
//     }));

//     if (attr.parentOf) {
//       attr.parentOf.split(",").forEach((depId) => {
//         const dependentField = entity.attributes.find((a) => a.id === depId);
//         if (dependentField?.dataType.toLowerCase() === "dropdown") {
//           fetchDropdownOptions(dependentField);
//         }
//       });
//     }
//   };

//   const handleSubmit = async () => {
//     const formattedData = Object.keys(formData).map((id) => ({
//       name: entity.attributes.find((attr) => attr.id === id)?.name,
//       value: formData[id]?.value || "",
//     }));

//     try {
//       await axios.post("/Employee/InsertFormData", {
//         id: entity.id,
//         formName: entity.name,
//         fieldsDataModel: formattedData,
//       });
//       alert("Form submitted successfully!");
//       window.location.href = "/";
//     } catch (error) {
//       console.error("Error submitting form", error);
//       alert("Error submitting form. Please try again.");
//     }
//   };

//   return (
//     <div>
//       <h1>{entity.label}</h1>
//       <div className="row">
//         <div className="col-md-2">
//           <h4>Form Sections</h4>
//           <ul className="nav nav-tabs">
//             {entity.formSections.map((section, index) => (
//               <li key={section.id} className="nav-item">
//                 <a
//                   className={`nav-link ${index === 0 ? "active" : ""}`}
//                   data-toggle="tab"
//                   href={`#${section.sectionName}`}
//                 >
//                   {section.sectionName}
//                 </a>
//               </li>
//             ))}
//           </ul>
//         </div>
//         <div className="col-md-10">
//           <div className="tab-content">
//             {entity.formSections.map((section, index) => (
//               <div
//                 key={section.id}
//                 id={section.sectionName}
//                 className={`tab-pane fade ${index === 0 ? "show active" : ""}`}
//               >
//                 {section.attributes.map((attr) => (
//                   <div key={attr.id} className="form-group">
//                     <label>{attr.label}</label>
//                     {attr.dataType.toLowerCase() === "dropdown" ? (
//                       <select
//                         className="form-control"
//                         value={formData[attr.id]?.value || ""}
//                         onChange={(e) => handleChange(e, attr)}
//                       >
//                         <option value="">-- Please Select --</option>
//                         {formData[attr.id]?.options?.map((option) => (
//                           <option key={option.keyField} value={option.keyField}>
//                             {option.valueField}
//                           </option>
//                         ))}
//                       </select>
//                     ) : (
//                       <input
//                         type={attr.dataType.toLowerCase() === "int" ? "number" : "text"}
//                         className="form-control"
//                         value={formData[attr.id]?.value || ""}
//                         onChange={(e) => handleChange(e, attr)}
//                       />
//                     )}
//                   </div>
//                 ))}
//               </div>
//             ))}
//           </div>
//           <div className="form-actions">
//             <button className="btn btn-secondary" onClick={() => (window.location.href = "/")}>Close</button>
//             <button className="btn btn-success" onClick={handleSubmit}>Save</button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AddFormData;


import React from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from "@mui/material";

const users = [
  { id: 1, name: "DealerMaster", IsActive: "Active" },
  { id: 2, name: "VehicleMaster", IsActive: "Inactive" },
  { id: 3, name: "VendorMaster", IsActive: "Active" },
  { id: 4, name: "EmployeeMaster", IsActive: "Inactive" },
  { id: 5, name: "ChassisMaster", IsActive: "Active" },
  { id: 6, name: "CustomerMaster", IsActive: "Inactive" },
];

const MaterialTableADDFormData = () => {
  return (
    <TableContainer component={Paper} sx={{ maxWidth: 900, margin: "auto",marginTop:4 }}>
      <Table>
        <TableHead>
          <TableRow sx={{ backgroundColor: "#333", color: "white" }}>
            <TableCell sx={{ color: "white" }}>ID</TableCell>
            <TableCell sx={{ color: "white" }}>Name</TableCell>
            <TableCell sx={{ color: "white" }}>Status</TableCell>
            <TableCell sx={{ color: "white" }}>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.id}</TableCell>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.IsActive}</TableCell>
              <TableCell>
                <Button
                  variant="contained"
                  sx={{ backgroundColor: "green", color: "white", marginRight: 1 }}
                >
                  ADD DATA
                </Button>
               
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default MaterialTableADDFormData;





