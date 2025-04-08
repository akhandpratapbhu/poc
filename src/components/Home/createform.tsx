import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import React, { useEffect, useState } from 'react';

const defaultSteps = [
    'Job Card Details', 'Vehicle Information', 'Customer Information',
    'Service Details', 'Sales & Warranty Information', 'Mechanic & Workshop Details',
    'Service & Cost Details', 'Additional Actions & Attachment', 'Final Submission Approval'
];

export default function VerticalLinearStepper() {
    const [activeStep, setActiveStep] = React.useState(0);
    const [skipped, setSkipped] = React.useState(new Set<number>());

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

    const [section, setSection] = useState<any[]>([]);
    const [steps, setSteps] = useState<string[]>(defaultSteps);
    // const [formData, setFormData] = useState<{ [key: string]: { value: string } }>({});
    const [formData, setFormData] = useState<Record<string, { name: string; value: string; options?: any[] }>>({});

    useEffect(() => {
        fetch(`https://localhost:7060/api/employee/GetFormData?id=5`)
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
        const { value } = e.target;
        setFormData(prev => ({
            ...prev,
            [attr.id]: {
                ...prev[attr.id],
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
                                                                        onChange={(e) => handleChange(e, attr)}
                                                                    >
                                                                        <option value="">-- Please Select --</option>
                                                                        {attr.options?.map((option: string, index: number) => (
                                                                            <option key={index} value={option}>
                                                                                {option}
                                                                            </option>
                                                                        ))}
                                                                    </select>
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
                                        <Button variant="contained" onClick={handleNext}>
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
