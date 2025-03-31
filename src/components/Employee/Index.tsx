// import React, { useState } from "react";


// const FormBuilder = () => {
 

//   return (
//     <div className="container">
//       <h1 className="text-center">Label</h1>
//       <input id="EntityId" type="hidden" value="Id" />

//       <div className="row border p-3 rounded">
//         <div className="col-md-3">
//           <h4>Draggable Items</h4>
//           <ul className="list-group">
//             <li className="list-group-item">String</li>
//             <li className="list-group-item">Number</li>
//             <li className="list-group-item">Dropdown</li>
//           </ul>

//           <h4 className="mt-3">Form Sections</h4>
//           <ul className="list-group">
//             {sections.map((section) => (
//               <li key={section.Id} className="list-group-item">{section.SectionName}</li>
//             ))}
//           </ul>
//           <button className="btn btn-primary mt-2" onClick={() => setShowSectionModal(true)}>
//             + Add Section
//           </button>
//         </div>

//         <div className="col-md-9">
//           <form>
//             <div className="border p-3 rounded">
//               {attributes.map((attr, index) => (
//                 <div key={attr.Id} className="form-group mb-3">
//                   <label>{attr.Label}</label>
//                   <input type="text" className="form-control" readOnly />
//                 </div>
//               ))}
//             </div>

//             <div className="text-center mt-3">
//               <button type="button" className="btn btn-secondary mx-2">Close</button>
//               <button type="button" className="btn btn-success">Save</button>
//             </div>
//           </form>
//         </div>
//       </div>

//       {/* Section Modal */}
//       {showSectionModal && (
//         <div className="modal show d-block" tabIndex="-1">
//           <div className="modal-dialog">
//             <div className="modal-content">
//               <div className="modal-header">
//                 <h5 className="modal-title">Add New Section</h5>
//                 <button className="btn-close" onClick={() => setShowSectionModal(false)}></button>
//               </div>
//               <div className="modal-body">
//                 <label className="form-label">Section Name</label>
//                 <input className="form-control" value={newSection} onChange={(e) => setNewSection(e.target.value)} />
//               </div>
//               <div className="modal-footer">
//                 <button className="btn btn-secondary" onClick={() => setShowSectionModal(false)}>Close</button>
//                 <button className="btn btn-success" onClick={addSection}>Save</button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default FormBuilder;
import React from "react";

const NotFound = () => {
  return <h1>404 - Page Not Found</h1>;
};

export default NotFound;
