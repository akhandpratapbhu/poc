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


import React, { useEffect, useState } from 'react';
import './AddFormData.css';
import { useLocation } from 'react-router-dom';
import PartialForm from './PartialForm';

type Section = {
  id: number;
  sectionName: string;
  entityId: number;
  sortOrder: number;
};
interface AttributeofPartialFormData {
  id: string |undefined;
  name: string;
  dataType: string;
  isRequired: boolean | number;
  label: string;
}

interface Attribute {
  id: string | number;
  name: string;
  dataType: string;
  isRequired: boolean;
  label: string;
}

interface Props {
  attributesofPartialFormData: Attribute[];
}
const AddFormData = () => {

  const [sections, setSections] = useState<Section[]>([]);
  const location = useLocation();
  const model = location.state?.entityData; // Get the passed data
  useEffect(() => {
    fetch(`https://localhost:7060/api/employee/GetSections?screenId=${model.id}`)
      .then((response) => response.json())
      .then((data) => setSections(data))
      .catch((error) => console.error("Error fetching entities:", error));
  }, []);
  const [activeTab, setActiveTab] = useState<number>(sections[0]?.id);

  const [currentSection, setCurrentSection] = useState(0);

  const handleNext = () => {
    if (currentSection < sections.length - 1) {
      const nextSectionId = sections[currentSection + 1].id;
      setCurrentSection(currentSection + 1);
      getSection(nextSectionId); // Fetch and update data for the next tab
    }
  };



  const [attributesofPartialFormData, setAttributesofPartialFormData] = useState<AttributeofPartialFormData[]>([]);


  useEffect(() => {
    if (sections.length > 0) {
      setActiveTab(sections[0].id);
      getSection(sections[0].id);
    }
  }, [sections]); // Runs when `sections` are updated

  const getSection = async (sId: number) => {
    setActiveTab(sId);
    try {
      const response = await fetch(
        `https://localhost:7060/api/employee/PartialForm?entityId=${model.id}&sId=${sId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const PartialFormData = await response.json();
      setAttributesofPartialFormData(PartialFormData);
    } catch (error) {
      console.error("Error posting data:", error);
    }
  };
  const [formData, setFormData] = useState<Record<string, {name:string; value: string; options?: any[] }>>({});
const[allfielddata,setallfielddata]=useState<{name:string; value: string}[]>([])

  const handleChange = (
    e: React.ChangeEvent<HTMLSelectElement> | React.ChangeEvent<HTMLInputElement>, 
    attr: AttributeofPartialFormData
  ) => {
    const { value } = e.target;
    if (!attr.id) return; // ✅ Prevent undefined key
  
    console.log(attr.name, value); // ✅ Logs only name and value
  
    setFormData((prev) => ({
      ...prev,
      [String(attr.id)]: { name: attr.name, value }, // ✅ Correct structure
    }));
    // Handle dependent dropdowns
    // if (attr.parentOf) {
    //   attr.parentOf.split(",").forEach((depId) => {
    //     const dependentField = entity.attributes.find((a) => String(a.id) === String(depId));
    //     if (dependentField?.dataType.toLowerCase() === "dropdown") {
    //       fetchDropdownOptions(dependentField);
    //     }
    //   });
    // }
    const handleAddField = (attrId: string) => {
      setallfielddata((prev) => [
        ...prev,
        { 
          name: formData[attrId]?.name || "", 
          value: formData[attrId]?.value || "" 
        }
      ]);
    };
  };

  
  

  const handleSubmit = async () => {
    const formattedData = attributesofPartialFormData.map((attr) => ({
      name: attr.name,
      value: formData[String(attr.id)]?.value || "",
    }));
  console.log("allfielddata",allfielddata);
  console.log("formData",formData);
    try {
      const response = await fetch("https://localhost:7060/api/employee/InsertFormData", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({  // ✅ Correctly stringifying the body
          id: model.id,       // ✅ Ensure these are included if needed
          formName: model.name,
          fieldsDataModel: allfielddata,
        }),
      });
  
      if (!response.ok) throw new Error("Failed to submit form");
  
      alert("Form submitted successfully!");
      window.location.href = "/";
    } catch (error) {
      console.error("Error submitting form", error);
      alert("Error submitting form. Please try again.");
    }
  };
  
  return (
    <div className="dealer-master-container">
      <h1>{model.name}</h1>

      <div className="form-container">
        <div className="form-section">
          <h2>Form Section</h2>

          {/* Tab Navigation */}
          <div className="form-tabs">
            {sections.map((section) => (
              <div
                key={section.id}
                className={`tab ${activeTab === section.id ? "active" : ""}`}
                onClick={() => getSection(section.id)}
              >
                {section.sectionName}
              </div>
            ))}
          </div>
          <div className="form-fields">
            {/* <PartialForm attributes={attributesofPartialFormData} /> */}
            <div className="col-md-10">
            <div className="tab-content">
    {attributesofPartialFormData.map((attr) => (
      <div key={attr.id} className="form-group">
        <label>{attr.label}</label>
        {attr.dataType.toLowerCase() === "dropdown" ? (
          <select
            className="form-control"
            value={formData[String(attr.id)]?.value || ""}
            onChange={(e) => handleChange(e, attr)}
          >
            <option value="">-- Please Select --</option>
            {(formData[String(attr.id)]?.options ?? []).map((option) => (
              <option key={option.keyField} value={option.keyField}>
                {option.valueField}
              </option>
            ))}
          </select>
        ) : (
          <input
            type={attr.dataType.toLowerCase() === "int" ? "number" : "text"}
            className="form-control"
            value={formData[String(attr.id)]?.value || ""}
            onChange={(e) => handleChange(e, attr)}
          />
        )}
      </div>
    ))}
  </div>
            
          </div>
          </div>

          {/* Tab Content */}

          <div className="button-group">
            {currentSection < sections.length - 1 ? (
              <button type="button" className="btn btn-primary" onClick={handleNext}>
                Next
              </button>
            ) : (
              <button type="button" className="btn btn-save" onClick={handleSubmit}>
                Save
              </button>
            )}
          </div>
        </div>
      </div>
    </div>

  );
};

export default AddFormData;


