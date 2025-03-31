// import React from "react";

// const PartialForm = ({ attributes }) => {
//   if (!attributes || attributes.length === 0) return null;

//   return (
//     <div>
//       {attributes.map((attr, index) => (
//         index % 2 === 0 ? (
//           <div className="form-row" key={attr.id}>
//             <div className="form-group">
//               <label 
//                 data-id={attr.id} 
//                 data-name={attr.name} 
//                 data-dataType={attr.dataType} 
//                 data-isRequired={Number(attr.isRequired)} 
//                 data-label={attr.label}
//               >
//                 {attr.label}
//               </label>
//               <input type="text" id={`attr_${attr.id}`} name={`attr_${attr.id}`} readOnly />
//             </div>
//             {index + 1 < attributes.length && (
//               <div className="form-group">
//                 <label 
//                   data-id={attributes[index + 1].id} 
//                   data-name={attributes[index + 1].name} 
//                   data-dataType={attributes[index + 1].dataType} 
//                   data-isRequired={Number(attributes[index + 1].isRequired)} 
//                   data-label={attributes[index + 1].label}
//                 >
//                   {attributes[index + 1].label}
//                 </label>
//                 <input type="text" id={`attr_${attributes[index + 1].id}`} name={`attr_${attributes[index + 1].id}`} readOnly />
//               </div>
//             )}
//           </div>
//         ) : null
//       ))}
//     </div>
//   );
// };

// export default PartialForm;