import React from "react";
import { useNavigate } from "react-router-dom";
import "./EntityTable.css"; // External CSS for styling

const EntityTable = ({ entities }) => {
  const navigate = useNavigate();

  const addData = (id) => {
    navigate(`/employee/addFormData/${id}`);
  };

  return (
    <div className="text-center">
      <h1 className="display-4">Welcome</h1>
      <div className="grid-container">
        <h4>Active Entities</h4>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Is Active</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {entities
              .filter((entity) => entity.isActive)
              .map((entity) => (
                <tr key={entity.id}>
                  <td>{entity.id}</td>
                  <td>{entity.name}</td>
                  <td>{entity.isActive ? "Yes" : "No"}</td>
                  <td>
                    <button
                      className="action-btn edit-btn"
                      onClick={() => addData(entity.id)}
                    >
                      Add Data
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EntityTable;
