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


import React, { useState } from 'react';
import './AddFormData.css';
 
const AddFormData= () => {
  const [formData, setFormData] = useState({
    childField: '-- Please Select --',
    parentField: '',
    district: '',
    state: '-- Please Select --',
    plotNo: ''
  });
 
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };
 
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

  };
 const onClose=()=>{
  
 }
  return (
    <div className="dealer-master-container">
      <h1>Dealer Master</h1>
     
      <div className="form-container">
        <div className="form-section">
          <h2>Form Section</h2>
         
          <div className="form-tabs">
            <div className="tab active">Dealer Detail</div>
            <div className="tab">Daddress</div>
          </div>
         
          <div className="form-fields">
            <div className="field-row">
              <div className="field-col">
                <label>Child Field</label>
                <select
                  name="childField"
                  value={formData.childField}
                  onChange={handleChange}
                >
                  <option>-- Please Select --</option>
                </select>
              </div>
             
              <div className="field-col">
                <label>Parent Field</label>
                <input
                  type="text"
                  name="parentField"
                  value={formData.parentField}
                  onChange={handleChange}
                />
              </div>
            </div>
           
            <div className="field-row">
              <div className="field-col">
                <label>district</label>
                <input
                  type="text"
                  name="district"
                  value={formData.district}
                  onChange={handleChange}
                />
              </div>
             
              <div className="field-col">
                <label>state</label>
                <select
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                >
                  <option>-- Please Select --</option>
                </select>
              </div>
            </div>
           
            <div className="field-row">
              <div className="field-col full-width">
                <label>plot no</label>
                <input
                  type="text"
                  name="plotNo"
                  value={formData.plotNo}
                  onChange={handleChange}
                />
              </div>
            </div>
           
            <div className="button-group">
              <button type="button" className="btn btn-save" onClick={onClose}>Close</button>
              <button type="button" className="btn btn-save" onClick={handleSubmit}>Save</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
 
export default AddFormData;



