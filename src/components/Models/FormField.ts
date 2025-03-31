// Convert FormFieldModel to a TypeScript interface
interface FormFieldModel {
    name: string;
    value: string;
  }
  
  // Convert FormField to a TypeScript interface
  interface FormField {
    id: string;
    name: string;
    label: string;
    dataType: string;
    isRequired: string;
    masterSource: string;
    valueField: string;
    sortOrder: number;
  }
  
  // Convert FormModel to a TypeScript interface
  interface FormModel {
    id: string;
    formName: string;
    fieldsDataModel: FormFieldModel[];
  }
  
  // Convert FormData to a TypeScript interface
  interface FormData {
    id: string;
    sId: string;
    formName: string;
    fieldsData: FormField[];
  }
  
  export type { FormFieldModel, FormField, FormModel, FormData };
  