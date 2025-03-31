// import React from "react";
// import { useNavigate } from "react-router-dom";
// import TblEntity from '../Models/TblEntity'
// const EntityTable = ({ entities }) => {
//   const navigate = useNavigate();

//   const addData = (id) => {
//     navigate(`/employee/addFormData/${id}`);
//   };

//   return (
//     <div className="text-center">
//       <h1 className="display-4">Welcome</h1>
//       <div className="grid-container">
//         <h4>Active Entities</h4>
//         <table>
//           <thead>
//             <tr>
//               <th>ID</th>
//               <th>Name</th>
//               <th>Is Active</th>
//               <th>Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {entities
//               .filter((entity) => entity.isActive)
//               .map((entity) => (
//                 <tr key={entity.id}>
//                   <td>{entity.id}</td>
//                   <td>{entity.name}</td>
//                   <td>{entity.isActive ? "Yes" : "No"}</td>
//                   <td>
//                     <button
//                       className="action-btn edit-btn"
//                       onClick={() => addData(entity.id)}
//                     >
//                       Add Data
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default EntityTable;
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

const MaterialTableFormData = () => {
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



