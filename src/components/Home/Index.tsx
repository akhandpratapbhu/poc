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
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
const users = [
    { id: 1, name: "DealerMaster", IsActive: "Active" },
    { id: 2, name: "VehicleMaster", IsActive: "Inactive" },
    { id: 3, name: "VendorMaster", IsActive: "Active" },
    { id: 4, name: "EmployeeMaster", IsActive: "Inactive" },
    { id: 5, name: "ChassisMaster", IsActive: "Active" },
    { id: 6, name: "CustomerMaster", IsActive: "Inactive" },
];

const MaterialTableFormData = () => {

    const navigate = useNavigate();

  function  editRow(Id:number){
    navigate(`/employee/index/${Id}`);
    }
    return (
        <TableContainer component={Paper} sx={{ maxWidth: 900, margin: "auto", marginTop: 4 }}>
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
                                    onClick={() => editRow(user.id)} // ✅ Correct function syntax
                                >
                                    EDIT
                                </Button>

                                <Button
                                    variant="contained"
                                    sx={{ backgroundColor: "red", color: "white" }}
                                >
                                    DEACTIVATE
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default MaterialTableFormData;




