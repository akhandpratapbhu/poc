
import React, { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

// Define the structure of the API response
interface Entity {
  id: number;
  name: string;
  label: string;
  isActive: boolean;
  createdBy: number;
  createdDate: string;
  modifiedBy: number;
  modifiedDate: string;
  sectionId: number;
  formSections: any;
  attributes: any[];
}

const MaterialTableFormData = () => {
  const navigate = useNavigate();

  // Define state with a type
  const [entities, setEntities] = useState<Entity[]>([]);

  useEffect(() => {
    fetch("https://localhost:7060/api/Home/Index")
      .then((response) => response.json())
      .then((data) => setEntities(data)) // ✅ Now TypeScript knows the structure of 'data'
      .catch((error) => console.error("Error fetching entities:", error));
  }, []);

  console.log(entities);

  const editRow = (entity: any) => {
    navigate(`/employee/index/${entity.id}`, { state: { entityData: entity } });
  };
  

  const handleStatusChange = (id: number) => {
    fetch(`https://localhost:7060/api/Home/ChangeStatus?id=${id}`, { method: "GET" })
      .then((response) => {
        if (response.ok) {
          alert("Entity modified successfully!");
          // Update state to reflect changes
          setEntities((prev) =>
            prev.map((entity) =>
              entity.id === id ? { ...entity, isActive: !entity.isActive } : entity
            )
          );
        }
      })
      .catch((error) => alert("Error submitting form. Please try again."));
  };

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
          {entities.map((entity) => (
            <TableRow key={entity.id}>
              <TableCell>{entity.id}</TableCell>
              <TableCell>{entity.name}</TableCell>
              <TableCell>{entity.isActive ? "Active" : "Inactive"}</TableCell>
              <TableCell>
                <Button
                  variant="contained"
                  sx={{ backgroundColor: "green", color: "white", marginRight: 1 }}
                  onClick={() => editRow(entity)}
                >
                  EDIT
                </Button>

                <Button
                  variant="contained"
                  sx={{ backgroundColor: "red", color: "white" }}
                  onClick={() => handleStatusChange(entity.id)}
                >
                  {entity.isActive ? "DEACTIVATE" : "ACTIVATE"}
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

