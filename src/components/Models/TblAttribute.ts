interface TblAttribute {
    id: number;
    sectionId: number;
    name: string;
    label: string;
    entityId: number;
    dataType: string;
    enumDataType: number;
    isRequired: boolean;
    defaultValue: string;
    sortOrder: number;
    isActive: boolean;
    createdBy: number;
    createdDate: string; // Date as ISO string
    modifiedBy?: number | null;
    modifiedDate?: string | null;
    masterSource: string;
    valueField: string;
    isDependent: boolean;
    dependentField: string;
    dependentFieldLabel: string;
    parentOf: string;
  }
  export default TblAttribute;