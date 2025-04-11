import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import React, { useEffect, useState } from 'react';
import './getform.css';
import { useNavigate } from 'react-router-dom';
const defaultSteps = [
    'Job Card Details', 'Vehicle Information', 'Customer Information',
    'Service Details', 'Sales & Warranty Information', 'Mechanic & Workshop Details',
    'Service & Cost Details', 'Additional Actions & Attachment', 'Final Submission Approval'
];

export default function VerticalLinearStepper() {
    const [activeStep, setActiveStep] = React.useState(0);
    const [skipped, setSkipped] = React.useState(new Set<number>());
    const navigate = useNavigate();
    const isStepOptional = (step: number) => step === 1;

    const isStepSkipped = (step: number) => skipped.has(step);

    const handleNext = () => {
        let newSkipped = skipped;
        if (isStepSkipped(activeStep)) {
            newSkipped = new Set(newSkipped.values());
            newSkipped.delete(activeStep);
        }

        setActiveStep((prev) => prev + 1);
        setSkipped(newSkipped);
    };

    const handleBack = () => {
        setActiveStep((prev) => prev - 1);
    };

    const handleSkip = () => {
        if (!isStepOptional(activeStep)) {
            throw new Error("You can't skip a step that isn't optional.");
        }

        setActiveStep((prev) => prev + 1);
        setSkipped((prevSkipped) => {
            const newSkipped = new Set(prevSkipped.values());
            newSkipped.add(activeStep);
            return newSkipped;
        });
    };

    const handleReset = () => {
        setActiveStep(0);
    };

    const [allSectionformData, setallSectionformData] = useState<any>(null);
    const [inputValues, setInputValues] = useState<{ [key: string]: string }>({});

    const [section, setSection] = useState<any[]>([]);
    const [steps, setSteps] = useState<string[]>(defaultSteps);
    // const [formData, setFormData] = useState<{ [key: string]: { value: string } }>({});
    const [formData, setFormData] = useState<Record<string, { name: string; value: string; options?: any[] }>>({});
    //   const [autocompleteData, setAutocompleteData] = useState([]);
    const [autocompleteData, setAutocompleteData] = useState<any[]>([]);  // Type the state here

    //const [formValues, setFormValues] = useState({});
    const [formValues, setFormValues] = useState<Record<string, string>>({});

    const [inputValue, setInputValue] = useState('');

    // Fetch data from the API
    const fetchAutocompleteData = async () => {
        try {
            const response = await fetch('https://localhost:7060/api/spare/GetPartMasterByPartNo?partno');
            const data = await response.json();
            setAutocompleteData(data);
        } catch (error) {
            console.error('Error fetching autocomplete data:', error);
        }
    };
    
    const fetchAutocompleteDataByOnChange = async (partNo: string) => {
        try {
            const response = await fetch(`https://localhost:7060/api/spare/GetPartMasterByPartNo?partno=${partNo}`);
            const data = await response.json();
            console.log("datra", data);

            setAutocompleteData(data);
        } catch (error) {
            console.error('Error fetching autocomplete data:', error);
        }
    };
    // Fetch data when component mounts
    useEffect(() => {
        fetchAutocompleteData();
    }, []);


    useEffect(() => {
        fetch(`https://localhost:7060/api/employee/GetFormData?id=9`)
            .then((response) => response.json())
            .then((data) => setallSectionformData(data))
            .catch((error) => console.error("Error fetching entities:", error));
    },
        []);
    useEffect(() => {
        if (!allSectionformData) return; // wait for data

        const entityData = allSectionformData;
        console.log("entityData", entityData.formSections);

        const sectionData = entityData.formSections.map((section: any) => ({
            ...section,
            attributes: entityData.attributes
                .filter((attr: any) => attr.sectionId === section.id)
                .sort((a: { sortOrder: number; }, b: { sortOrder: number; }) => a.sortOrder - b.sortOrder)
        }));

        setSection(sectionData);
    }, [allSectionformData]); // 👈 dependency to rerun on data update
    console.log("sectionData", section);
    // This runs when section data is updated
    useEffect(() => {
        if (section.length > 0) {
            const sectionSteps = section.map(s => s.sectionName); // or use any other property
            setSteps(sectionSteps);
        } else {
            setSteps(defaultSteps);
        }
    }, [section]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>, attr: any) => {
        const { name, value } = e.target;
        console.log("intstringchangefield", attr.name, value);

        setFormData(prev => ({
            ...prev,
            [attr.id]: {
                ...prev[attr.id],
                name: attr.name,
                value: value,
            },
        }));
    };
    useEffect(() => {
        const initialData: any = {};
        section.forEach(sec => {
            sec.attributes.forEach((attr: { id: string | number; }) => {
                initialData[attr.id] = { value: "" };
            });
        });
        setFormData(initialData);
    }, [section]);
    const fetchDropdownOptions = async (attr: any) => {
        console.log("attr", attr);

        try {
            const response = await fetch("https://localhost:7060/api/employee/addDropdown", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    screenId: String(9),
                    controlId: String(attr.id),
                    sourceField: attr.masterSource,
                    valueField: attr.valueField,
                    dependentField: "",
                    dependentFieldValue: ""
                }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log("data", data);

            setFormData((prev) => ({
                ...prev,
                [attr.id]: {
                    value: prev[attr.id]?.value || "", // ✅ Keep previously selected value
                    name: attr.name,
                    options: data.options,             // ✅ Update options only
                },
            }));

        } catch (error) {
            console.error("Error fetching dropdown options", error);
        }
    };

    const [submittedRows, setSubmittedRows] = useState<Record<string, string>[]>([]);
    const [selectedAttributeId, setSelectedAttributeId] = useState<string | null>(null);

    const handleInputChangedatagrid = (e: React.ChangeEvent<HTMLInputElement>, attrId: any) => {
        const { name, value } = e.target;

        setFormValues(prev => ({
            ...prev,
            [name]: value
        }));
console.log(autocompleteData,value);

        const selectedPart = autocompleteData.find(item => item.partno === value);
        console.log("Selected part:", selectedPart, "for attrId:", attrId);
        setSelectedAttributeId(attrId)
        if (selectedPart) {
            const updated = {
                [name]: selectedPart.partno,
                hsncode: selectedPart.hsncode,
                partdescription: selectedPart.partdescription,
                taxpercentage: selectedPart.taxpercentage,
                //taxableamount: selectedPart.TaxableAmount
                // Add other fields if needed
            };

            // Optional merge update if you want to keep existing form values:
            setFormValues(prev => ({
                ...prev,
                ...updated
            }));
        }
    };

    console.log("autocompleteData",autocompleteData);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        console.log(name, value);
        setFormValues(prev => ({ ...prev, [name]: value }));
        console.log(formData, formValues);
    };
    console.log(formValues);

    const handleAddRow = () => {
        setSubmittedRows(prev => [...prev, formValues]);
        setFormValues({}); // Clear input fields
    };
    console.log(submittedRows);
    const handleDeleteRow = (indexToDelete: number) => {
        setSubmittedRows(prev => prev.filter((_, index) => index !== indexToDelete));
    };


    // Map your regular form fields
    const AllfieldsDataModel = Object.values(formData)
        .filter((field: any) => field?.name) // Remove invalid entries
        .map(({ name, value }) => ({
            name,
            value
        }));

    type TransformedEntry = {
        name: string;
        value: string;
        AttributeId: string;
        GridDatas: any[];
    };

    // Transformation
    const transformedData: TransformedEntry[] = [{
        name: "datagrid",
        value: "",
       AttributeId: String(selectedAttributeId) ?? "",
        GridDatas: submittedRows.map(item => {
            const rowData: any = Object.entries(item).map(([key, value]) => ({
                Name: key,
                Value: String(value)
            }));
            return { RowData: rowData };
        })
    }];

    console.log(transformedData);


    const completeData = [
        ...AllfieldsDataModel,  // Spread to include AllfieldsDataModel
        ...transformedData      // Spread to include transformedData
    ];


console.log("completeData",completeData);

    const handleSubmit = async () => {

        try {
            const response = await fetch("https://localhost:7060/api/employee/InsertFormData", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({  
                    id: String(9),       
                    formName: 'Sale -invoice',
                    fieldsDataModel: completeData,

                }),
            });

            if (!response.ok) throw new Error("Failed to submit form");

            alert("Form submitted successfully!");
            navigate(`/allparts`)
        } catch (error) {
            console.error("Error submitting form", error);
            alert("Error submitting form. Please try again.");
        }
    };
    return (
        <Box sx={{ display: 'flex', flexDirection: 'row', p: 2 }}>
            {/* Stepper Section */}
            <Box sx={{ width: '25%', pr: 2 }}>
                <Stepper activeStep={activeStep} orientation="vertical">
                    {steps.map((label, index) => {
                        const stepProps: { completed?: boolean } = {};
                        const labelProps: {
                            optional?: React.ReactNode;
                        } = {};
                        if (isStepOptional(index)) {
                            labelProps.optional = (
                                <Typography variant="caption">Optional</Typography>
                            );
                        }
                        if (isStepSkipped(index)) {
                            stepProps.completed = false;
                        }
                        return (
                            <Step key={label} {...stepProps}>
                                <StepLabel {...labelProps}>{label}</StepLabel>
                            </Step>
                        );
                    })}
                </Stepper>
            </Box>

            {/* Form/Card Section */}
            <Box sx={{ flexGrow: 1 }}>
                <Card sx={{ p: 2 }}>
                    <CardContent>
                        {activeStep === steps.length ? (
                            <React.Fragment>
                                <Typography variant="h6" gutterBottom>
                                    All steps completed - you're finished
                                </Typography>
                                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                                    <Button variant="contained" onClick={handleReset}>Reset</Button>
                                </Box>
                            </React.Fragment>
                        ) : (
                            <React.Fragment>
                                <Typography variant="h6" gutterBottom>
                                    Step {activeStep + 1}: {steps[activeStep]}
                                </Typography>

                                <Typography sx={{ mt: 1, mb: 3 }}>
                                    <div className="col-md-10">
                                        <div className="tab-content">
                                            {section
                                                .filter((_, index) => index === activeStep) // 👈 Only show the active section
                                                .map((section, sectionIndex) => (
                                                    <div key={sectionIndex} className="mb-4">
                                                        {/* <h5>{section.sectionName}</h5> */}

                                                        {section.attributes.map((attr: {
                                                            id(id: any): unknown;
                                                            options: any; label: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined; dataType: string;
                                                        }, attrIndex: React.Key | null | undefined) => (
                                                            <div key={attrIndex} className="form-group">
                                                                <label>{attr.label}</label>

                                                                {attr.dataType.toLowerCase() === "dropdown" ? (
                                                                    <select
                                                                        className="form-control"
                                                                        value={formData[String(attr.id)]?.value || ""}
                                                                        onClick={() => fetchDropdownOptions(attr)}
                                                                        onChange={(e) => handleChange(e, attr)}
                                                                    >
                                                                        <option value="">-- Please Select --</option>
                                                                        {(formData[String(attr.id)]?.options ?? []).map((option) => (
                                                                            <option key={option.keyField} value={option.keyField}>
                                                                                {option.valueField}
                                                                            </option>
                                                                        ))}
                                                                    </select>

                                                                ) : attr.dataType.toLowerCase() === "grid" && (attr as any).gridMaster ? (
                                                                    <div className="grid-block mb-3">
                                                                        <table className="table table-striped table-hover table-bordered shadow-sm rounded">
                                                                            <thead className="thead-dark">
                                                                                <tr>
                                                                                    {(attr as any).gridMaster.gridElements
                                                                                        .flatMap((gridItem: { valueField: string[] }) => gridItem.valueField)
                                                                                        .map((field: string, index: number) => (
                                                                                            <th key={index} className="text-center align-middle">{field}</th>
                                                                                        ))}
                                                                                    <th className="text-center align-middle">Action</th>
                                                                                </tr>
                                                                            </thead>
                                                                            <tbody>
                                                                                <tr>
                                                                                    {(attr as any).gridMaster.gridElements
                                                                                        .flatMap((gridItem: { valueField: string[] }) => gridItem.valueField)
                                                                                        .map((field: string, index: number) => (
                                                                                            <td key={index}>

                                                                                                {field === 'partno' ? (

                                                                                                    <div>
                                                                                                        <input
                                                                                                            type="text"
                                                                                                            name={field}
                                                                                                            className="form-control"
                                                                                                            value={formValues[field] || ''}
                                                                                                            onChange={(e) => handleInputChangedatagrid(e, attr.id)}

                                                                                                            //   onBlur={handlePartNoSelect} // <-- Auto-fill on blur
                                                                                                            placeholder={`Enter ${field}`}
                                                                                                            list={`autocomplete-${field}`}
                                                                                                        />
                                                                                                        <datalist id={`autocomplete-${field}`}>
                                                                                                            {autocompleteData
                                                                                                                .filter(item =>
                                                                                                                    item.partno.toLowerCase().includes((inputValues[field] || '').toLowerCase())
                                                                                                                )
                                                                                                                .map(item => (
                                                                                                                    <option key={item.ID} value={item.partno}>
                                                                                                                        {item.partdescription}
                                                                                                                    </option>
                                                                                                                ))}
                                                                                                        </datalist>
                                                                                                    </div>
                                                                                                ) : (
                                                                                                    <input
                                                                                                        type="text"
                                                                                                        name={field}
                                                                                                        className="form-control"
                                                                                                        value={formValues[field] || ''}
                                                                                                        onChange={handleInputChange}
                                                                                                        placeholder={`Enter ${field}`}
                                                                                                    />
                                                                                                )}

                                                                                            </td>
                                                                                        ))}
                                                                                    <td className="text-center">
                                                                                        <button onClick={handleAddRow} className="btn btn-sm btn-success px-3">
                                                                                            Add
                                                                                        </button>
                                                                                    </td>
                                                                                </tr>
                                                                            </tbody>
                                                                        </table>

                                                                        {submittedRows.length > 0 && (() => {
                                                                            const fieldNames = (attr as any)?.gridMaster?.gridElements?.flatMap(
                                                                                (gridItem: { valueField: string[] }) => gridItem.valueField
                                                                            ) || [];

                                                                            return (
                                                                                <table className="table table-bordered">
                                                                                    <thead>
                                                                                        <tr>
                                                                                            {fieldNames.map((field: string, index: number) => (
                                                                                                <th key={index}>{field}</th>
                                                                                            ))}
                                                                                            <th>Action</th>
                                                                                        </tr>
                                                                                    </thead>
                                                                                    <tbody>
                                                                                        {submittedRows.map((row: any, rowIndex: number) => (
                                                                                            <tr key={rowIndex}>
                                                                                                {fieldNames.map((col: string, colIndex: number) => (
                                                                                                    <td key={colIndex}>{row[col]}</td>
                                                                                                ))}
                                                                                                <td>
                                                                                                    <button
                                                                                                        onClick={() => handleDeleteRow(rowIndex)}
                                                                                                        className="btn btn-danger"
                                                                                                    >
                                                                                                        Delete
                                                                                                    </button>
                                                                                                </td>
                                                                                            </tr>
                                                                                        ))}
                                                                                    </tbody>
                                                                                </table>
                                                                            );
                                                                        })()}


                                                                    </div>

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
                                                ))}
                                        </div>
                                    </div>
                                </Typography>


                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Button
                                        disabled={activeStep === 0}
                                        onClick={handleBack}
                                        variant="outlined"
                                    >
                                        Back
                                    </Button>

                                    <Box>
                                        {isStepOptional(activeStep) && (
                                            <Button
                                                color="inherit"
                                                onClick={handleSkip}
                                                sx={{ mr: 1 }}
                                            >
                                                Skip
                                            </Button>
                                        )}
                                        <Button variant="contained" onClick={activeStep === steps.length - 1 ? handleSubmit : handleNext}>
                                            {activeStep === steps.length - 1 ? 'Submit' : 'Proceed'}
                                        </Button>

                                    </Box>
                                </Box>
                            </React.Fragment>
                        )}
                    </CardContent>
                </Card>
            </Box>
        </Box>
    );
}
