import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Modal, Button, Form } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import PartialForm from "./PartialForm";

interface AttributeofPartialFormData {
  id: string | number;
  name: string;
  dataType: string;
  isRequired: boolean | number;
  label: string;
  sortOrder:number
}
type Section = {
  id: number;
  sectionName: string;
  entityId: number;
  sortOrder: number;
};
const EntityForm = () => {

  const location = useLocation();
  const navigate = useNavigate();
  const model = location.state?.entityData; // Get the passed data
  console.log(typeof (model.id));
  const [sections, setSections] = useState<Section[]>([]);
  const [masters, setMasters] = useState([]);
  useEffect(() => {
    getSectionAllData();
    getAllMasterData();
  }, []);
  function getSectionAllData() {
    
    fetch(`https://localhost:7060/api/employee/GetSections?screenId=${model.id}`)
      .then((response) => response.json())
      .then((data) => setSections(data))
      .catch((error) => console.error("Error fetching entities:", error));
  }
  function getAllMasterData() {
    fetch(`https://localhost:7060/api/Home/GetMasters`)
      .then((response) => response.json())
      .then((data) => setMasters(data))
      .catch((error) => console.error("Error fetching entities:", error));
  }
  const [activeTab, setActiveTab] = useState<number | undefined>(undefined);

  useEffect(() => {
    if (sections.length > 0) {
      setActiveTab(sections[0].id);
    }
  }, [sections]);
  console.log(activeTab);
    useEffect(() => {
      if (sections.length > 0) {
        setActiveTab(sections[0].id);
        getSection(sections[0].id);
      }
    }, [sections]); // Runs when `sections` are updated
  const [itemName, setitemName] = useState("");
  // State to store form data
  const [formData, setFormData] = useState({
    fieldType: "",
    fieldName: "",
    fieldLabel: "",
    isDependent: false,
    dependentField: "",
    isRequired: false,
    defaultValue: "",
    mastersource: "",
    valuefield: ""
  });
  const [getAttributeData, setGetAttributeData] = useState([]);
  function getAttribute(master:any){
    console.log(master.id);
    
    fetch(`https://localhost:7060/api/employee/GetAttributes?masterId=${master.id}`)
    .then((response) => response.json())
    .then((data) => setGetAttributeData(data))
    .catch((error) => console.error("Error fetching entities:", error));
  }
  // Handle change for text inputs
  const handleInputChange = (e: React.ChangeEvent<any>) => {
    const { name, value} = e.target;
    console.log(name,value,masters);
    const selectedMaster = masters.find((master:{id:number;name:string}) => master.id == (value));
    console.log(selectedMaster);
    if (name === "mastersource" && selectedMaster) {
      getAttribute(selectedMaster);
    }
  

  
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const [showDependentField, setShowDependentField] = useState(false);
  const [showDefaultValue, setShowDefaultValue] = useState(false);


  // Handle dependent field dropdown change
  const handleDropdownChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value === "Yes"; // Convert to boolean
    setFormData((prev) => ({ ...prev, isDependent: value }));

    // Show dependent field input if "Yes" is selected
    setShowDependentField(value);
  };

  // Handle required field dropdown change
  const handleIsRequiredChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value === "1"; // Convert to boolean
    setFormData((prev) => ({ ...prev, isRequired: value }));

    // Show default value input if "Yes" is selected
    setShowDefaultValue(value);
  };
  //const [attributes, setAttributes] = useState(model.Attributes || []);
  const [sectionName, setSectionName] = useState("");

  const [showFieldModal, setShowFieldModal] = useState(false);
  const [showSectionModal, setShowSectionModal] = useState(false);
  const [attributes, setAttributes] = useState<{ id: number; label: string }[]>(
    []
  );

  const [fieldAllAttributes, setFieldAllAttributes] = useState<
    {
      id: number;
      label: string;
      name: string;
      datatype: string;
      mastersource: string;
      valuefield: string;
      isrequired: boolean;
      defaultvalue: string;
      isdependent: boolean;
      dependentfield: string;
      sortOrder: number;
    }[]
  >([]);


  const handleDragStart = (event: React.DragEvent<HTMLLIElement>, item: string) => {
    event.dataTransfer.setData("text/plain", item);
    console.log("item", item);
    setitemName(item)
    setFormData((prev) => ({
      ...prev, // Preserve existing state
      fieldType: item, // Update only fieldType
    }));
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();

    setShowFieldModal(true)

  };
  const [activeSectionId, setActiveSectionId] = useState<null | undefined | number>(sections[0]?.id);
console.log(activeSectionId);

  const [attributesofPartialFormData, setAttributesofPartialFormData] = useState<AttributeofPartialFormData[]>([]);
  const getSection = async (sId: React.Key | null | undefined) => {
    console.log("Fetching section with ID:", sId);
    setActiveSectionId((prev) => {
      const newId = sId as number;
      console.log("Previous activeSectionId:", prev);
      console.log("New activeSectionId:", newId);
      return newId;
    });
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

  console.log("activeSectionId:", activeSectionId);
  const addSectionModel = () => {
    setShowSectionModal(true);
  };

  const handleCloseFieldModal = () => {
    setShowFieldModal(false)
    setShowDefaultValue(false)
    setShowDependentField(false);
    setFormData({
      fieldType: "",
      fieldName: "",
      fieldLabel: "",
      isDependent: false,
      dependentField: "",
      isRequired: false,
      defaultValue: "",
      mastersource: "",
      valuefield: ""
    })
  };
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
      // Update sections state to trigger useEffect
      getSectionAllData()
    } catch (error) {
      console.error("Error posting data:", error);
    }
    handleCloseSectionModal();
  };

  const saveField = () => {
    console.log("Saving new field...", formData);
    if(attributesofPartialFormData.length>0){
      var maxSortOrder = Math.max(...attributesofPartialFormData.map(item => item.sortOrder));
    }
    else{
      maxSortOrder=0;
    }

    setFieldAllAttributes((prevAttributes) => {
      const updatedFieldAllAttributes = [
        ...prevAttributes,
        {
          id: 0 ,
          label: formData.fieldLabel,
          name: formData.fieldName,
          datatype: formData.fieldType,
          mastersource: formData.mastersource,
          valuefield: formData.valuefield,
          isrequired: formData.isRequired,
          defaultvalue: formData.defaultValue,
          isdependent: formData.isDependent,
          dependentfield: formData.dependentField,
          sortOrder: maxSortOrder+prevAttributes.length + 1,
        },
      ];
      console.log("Saving all attributes...", updatedFieldAllAttributes); // Logs correct updated state
      return updatedFieldAllAttributes;
    });


    setAttributes(prevAttributes => {
      const updatedAttributes = [...prevAttributes, { id: prevAttributes.length + 1, label: formData.fieldLabel }];
      console.log("Saving all attributes...", updatedAttributes); // Logs the correct updated state
      return updatedAttributes;
    });
    handleCloseFieldModal();
  };

  const saveForm = async () => {
    const newField = {
      id: String(model.id),
      sId: String(activeSectionId),
      formName: model.name,
      fieldsData: fieldAllAttributes
    };

    try {
      const response = await fetch("https://localhost:7060/api/employee/submit-form", {
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
    navigate(`/`)
  };

  const cancelForm = () => {
    handleCloseFieldModal();
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
                  <div>
                    {sections.map((section: { id: number; sectionName: string }) => (
                      <div key={section.id}>
                        <button
                          className={`list-group-item ${activeSectionId === section.id ? "active" : ""}`}
                          onClick={() => getSection(section.id)}
                        >
                          {section.sectionName}
                        </button>
                      </div>
                    ))}
                  </div>
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
                  <h4>Drop Items Here(newly field added here)</h4>
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
            {itemName === "Dropdown" && (
              <>
               <Form.Group className="mb-2">
  <Form.Label>Master Source</Form.Label>
  <select
    className="form-control"
    name="mastersource"
    value={formData.mastersource}
    onChange={handleInputChange}
  >
    <option value="">Select Master...</option> {/* This is your placeholder option */}
    {masters.map((master: { id: number; name: string }) => (
      <option key={master.id} value={master.id}>
        {master.name}
      </option>
    ))}
  </select>
</Form.Group>



                <Form.Group className="mb-2">
                  <Form.Label>Value field</Form.Label>
                  <select
                    className="form-control"
                    name="valuefield"
                    value={formData.valuefield}
                    onChange={handleInputChange}
                  >
                     <option value="">Select value....</option>
                    {getAttributeData.map((attr: { id: number; name: string }) => (
                      <option key={attr.id} value={attr.id}>
                        {attr.name}
                      </option>
                    ))}
                  </select>
                </Form.Group>
              </>
            )}
            <Form.Group className="mb-2">
              <Form.Label>Is Dependent Field</Form.Label>
              <select
                className="form-control"
                name="isDependent"
                value={formData.isDependent ? "Yes" : "No"} // Convert boolean back to string for UI
                onChange={handleDropdownChange}
              >
                <option value="No">No</option>
                <option value="Yes">Yes</option>
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
                       <option value="">Select dependent value....</option>
                    {attributesofPartialFormData.map((attr) => (
                      <option key={attr.id} value={attr.id}>
                        {attr.name}
                      </option>
                    ))}
                    {fieldAllAttributes.map((attr) => (
                      <option key={attr.id} value={attr.id}>
                        {attr.name}
                      </option>
                    ))}

                  </select>
                </div>
              )}
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Required Field</Form.Label>
              <select
                className="form-control"
                name="isRequired"
                value={formData.isRequired ? "1" : "0"} // Convert boolean back to string for UI
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
