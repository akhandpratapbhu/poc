import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Modal, Button, Form } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import PartialForm from "./PartialForm";

interface AttributeofPartialFormData {
  id: string | number;
  name: string;
  dataType: string;
  isRequired: boolean | number;
  label: string;
}
const EntityForm = () => {

  const location = useLocation();
  const model = location.state?.entityData; // Get the passed data
  console.log(model);
  const [sections, setSections] = useState([]);
  useEffect(() => {
    fetch(`https://localhost:7060/api/employee/GetSections?screenId=${model.id}`)
      .then((response) => response.json())
      .then((data) => setSections(data)) 
      .catch((error) => console.error("Error fetching entities:", error));
  }, []);

  const [itemName, setitemName] = useState("");
  // State to store form data
  const [formData, setFormData] = useState({
    fieldType: itemName,
    fieldName: "",
    fieldLabel: "",
    isDependent: "0",
    dependentField: "",
    isRequired: "0",
    defaultValue: "",
  });
  // Handle change for text inputs
  const handleInputChange = (e: React.ChangeEvent<any>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const [showDependentField, setShowDependentField] = useState(false);
  const [showDefaultValue, setShowDefaultValue] = useState(false);


  // Handle dependent field dropdown change
  const handleDropdownChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, isDependent: value }));

    // Show dependent field input if "Yes" is selected
    setShowDependentField(value === "1");
  };

  // Handle required field dropdown change
  const handleIsRequiredChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, isRequired: value }));

    // Show default value input if "Yes" is selected
    setShowDefaultValue(value === "1");
  };
  //const [attributes, setAttributes] = useState(model.Attributes || []);
  const [sectionName, setSectionName] = useState("");

  const [showFieldModal, setShowFieldModal] = useState(false);
  const [showSectionModal, setShowSectionModal] = useState(false);
  const [attributes, setAttributes] = useState<{ id: number; label: string }[]>(
    []
  );

  const handleDragStart = (event: React.DragEvent<HTMLLIElement>, item: string) => {
    event.dataTransfer.setData("text/plain", item);
    console.log("item", item);
    setitemName(item)
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();

    setShowFieldModal(true)
    // const itemLabel = event.dataTransfer.getData("text/plain");
    const itemLabel = formData.fieldLabel
    setAttributes([...attributes, { id: attributes.length + 1, label: itemLabel }]);
  };
  const [attributesofPartialFormData, setAttributesofPartialFormData] = useState<AttributeofPartialFormData[]>([]);
  const getSection = async (sId: React.Key | null | undefined) => {
    console.log("Fetching section with ID:", sId);

    try {
      const response = await fetch(`https://localhost:7060/api/employee/PartialForm?entityId=${model.id}&sId=${sId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const PartialFormData = await response.json();  // Convert response to JSON
      setAttributesofPartialFormData(PartialFormData)
      console.log("PartialForm:", PartialFormData);
    } catch (error) {
      console.error("Error posting data:", error);
    }
  }


  const addSectionModel = () => {
    setShowSectionModal(true);
  };

  const handleCloseFieldModal = () => setShowFieldModal(false);
  const handleCloseSectionModal = () => setShowSectionModal(false);

  const saveSection = async () => {
    if (sectionName.trim() === "") return;
    //setSections([...sections, { Id: sections.length + 1, SectionName: sectionName }]);

    try {
      const response = await fetch(`https://localhost:7060/api/employee/SaveSection?screenId=${model.id}&sectionName=${sectionName}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();
      console.log("Success:", result);
    } catch (error) {
      console.error("Error posting data:", error);
    }
    handleCloseSectionModal();
  };
  const saveField = () => {
    console.log("Saving new field...", formData);

    handleCloseFieldModal();
  };

  const saveForm = async () => {
    const newField = {
      fieldName: formData.fieldName,
      fieldLabel: formData.fieldLabel,
      fieldType: formData.fieldType,
      isDependent: formData.isDependent,
      isRequired: formData.isRequired,
      defaultValue: formData.defaultValue || null,
    };

    try {
      const response = await fetch("https://localhost:7060/api/Home/Index", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newField),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();
      console.log("Success:", result);
    } catch (error) {
      console.error("Error posting data:", error);
    }
    handleCloseFieldModal();
  };

  const cancelForm = () => {
    console.log("Form cancelled");
  };


  return (
    <>
      <div className="container mt-4">
        <h1 className="text-center">{model.label}</h1>
        <input id="EntityId" type="hidden" value={model.id} />
        <input id="EntityName" type="hidden" value={model.name} />
        <input id="SectionId" type="hidden" value={model.sectionId} />

        <div className="row border p-3 rounded" style={{ borderColor: "black" }}>
          <div className="col-md-3">
            <div className="row">
              <div className="col-md-6">
                <h4>Draggable Items</h4>
                <ul className="list-group">
                  {["String", "Number", "Dropdown"].map((item, index) => (
                    <li
                      key={index}
                      className="list-group-item"
                      draggable
                      onDragStart={(e) => handleDragStart(e, item)}
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="col-md-6">
                <h4>Form Section</h4>
                <ul className="list-group">
                  {sections.map((section: { id: React.Key | null | undefined; sectionName: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined; }) => (
                    // <li key={section.id} className="list-group-item" onClick={() => getSection(section.id)}>
                    //   {section.sectionName}
                    // </li>
                    <div>
                      <button onClick={() => getSection(section.id)}> {section.sectionName}</button>
                      {/* <PartialForm attributes={attributesofPartialFormData} /> */}
                    </div>
                  ))}
                </ul>
                <ul className="list-group mt-2">
                  <li className="list-group-item" onClick={addSectionModel}>+ Add Section</li>
                </ul>
              </div>
            </div>
          </div>
          <div className="col-md-9">
            <form>
              <div className="border p-3 rounded" style={{ borderColor: "red", minHeight: "50px" }}>
                <PartialForm attributes={attributesofPartialFormData} />
                {/* Drop Area */}
                <div
                  style={{ borderColor: "red", minHeight: "100px" }}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleDrop}
                >
                  <h4>Drop Items Here</h4>
                  {attributes.map((attr) => (
                    <div key={attr.id} className="row mb-2">
                      <div className="col-md-6">
                        <label>{attr.label}</label>
                        <input type="text" className="form-control" readOnly />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="text-center mt-3">
                <button type="button" className="btn btn-secondary me-2" onClick={cancelForm}>
                  Close
                </button>
                <button type="button" className="btn btn-success" onClick={saveForm}>
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Add New Field Modal */}
      <Modal show={showFieldModal} onHide={handleCloseFieldModal}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Field</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-2">
              <Form.Label>Field Type</Form.Label>
              <Form.Control
                type="text"
                name="fieldType"
                value={itemName}
                disabled
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Field Name</Form.Label>
              <Form.Control
                type="text"
                name="fieldName"
                value={formData.fieldName}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Field Label</Form.Label>
              <Form.Control
                type="text"
                name="fieldLabel"
                value={formData.fieldLabel}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Is Dependent Field</Form.Label>
              <select
                className="form-control"
                name="isDependent"
                value={formData.isDependent}
                onChange={handleDropdownChange}
              >
                <option value="0">No</option>
                <option value="1">Yes</option>
              </select>
              {showDependentField && (
                <div className="mb-2">
                  <label className="form-label">Dependent Field</label>
                  <select
                    className="form-control"
                    name="dependentField"
                    value={formData.dependentField}
                    onChange={handleInputChange}
                  >
                    <option value="child">Child field</option>
                    <option value="parent">Parent field</option>
                  </select>
                </div>
              )}
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Required Field</Form.Label>
              <select
                className="form-control"
                name="isRequired"
                value={formData.isRequired}
                onChange={handleIsRequiredChange}
              >
                <option value="0">No</option>
                <option value="1">Yes</option>
              </select>
              {showDefaultValue && (
                <div className="mb-2">
                  <label className="form-label">Default Value</label>
                  <input
                    type="text"
                    className="form-control"
                    name="defaultValue"
                    value={formData.defaultValue}
                    onChange={handleInputChange}
                  />
                </div>
              )}
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseFieldModal}>Close</Button>
          <Button variant="success" onClick={saveField}>Save</Button>
        </Modal.Footer>
      </Modal>

      {/* Add New Section Modal */}
      <Modal show={showSectionModal} onHide={handleCloseSectionModal}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Section</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-2">
              <Form.Label>Screen Name</Form.Label>
              {/* <Form.Control type="text" value={model.Label} disabled /> */}
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Section Name</Form.Label>
              <Form.Control
                type="text"
                value={sectionName}
                onChange={(e) => setSectionName(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseSectionModal}>Close</Button>
          <Button variant="success" onClick={saveSection}>Save</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default EntityForm;
