// import React, { useEffect, useState } from "react";
// import "./styles.css"; // Ensure you create a CSS file for styling

// const IndexPage = () => {
//   const [entities, setEntities] = useState([]);

//   useEffect(() => {
//     fetch("/api/entities") // Adjust API endpoint
//       .then((response) => response.json())
//       .then((data) => setEntities(data))
//       .catch((error) => console.error("Error fetching entities:", error));
//   }, []);

//   const handleStatusChange = (id:any) => {
//     fetch(`/api/changeStatus/${id}`, { method: "POST" })
//       .then((response) => {
//         if (response.ok) {
//           alert("Entity modified successfully!");
//         //   setEntities((prev) =>
//         //     prev.map((entity) =>
//         //       entity.id === id ? { ...entity, isActive: !entity.isActive } : entity
//         //     )
//         //   );
//         }
//       })
//       .catch((error) => alert("Error submitting form. Please try again."));
//   };

//   return (
//     <div className="text-center">
//       <h1 className="display-4">Welcome</h1>
//       {/* <EntityTable title="Active Entities" entities={entities.filter(e => e.isActive)} handleStatusChange={handleStatusChange} />
//       <EntityTable title="Inactive Entities" entities={entities.filter(e => !e.isActive)} handleStatusChange={handleStatusChange} /> */}
//     </div>
//   );
// };

// const EntityTable = ({ title, entities, handleStatusChange }) => (
//   <div className="grid-container">
//     <h4>{title}</h4>
//     <table>
//       <thead>
//         <tr>
//           <th>ID</th>
//           <th>Name</th>
//           <th>Is Active</th>
//           <th>Actions</th>
//         </tr>
//       </thead>
//       <tbody>
//         {entities.map((entity:any) => (
//           <tr key={entity.id}>
//             <td>{entity.id}</td>
//             <td>{entity.name}</td>
//             <td>{entity.isActive ? "Yes" : "No"}</td>
//             <td>
//               {entity.isActive ? (
//                 <button className="action-btn delete-btn" onClick={() => handleStatusChange(entity.id)}>
//                   Deactivate
//                 </button>
//               ) : (
//                 <button className="action-btn edit-btn" onClick={() => handleStatusChange(entity.id)}>
//                   Activate
//                 </button>
//               )}
//             </td>
//           </tr>
//         ))}
//       </tbody>
//     </table>
//   </div>
// );

// export default IndexPage;
import React from "react";

const Contact = () => {
  return <h1>Contact Page</h1>;
};

export default Contact;
