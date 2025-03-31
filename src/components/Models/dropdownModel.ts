// Convert dynamicControlModel to a TypeScript interface
interface dynamicControlModel {
    id: string;
    screenId: string;
    controlId: string;
    sourceField: string;
    valueField: string;
    dependentField: string;
    dependentFieldValue: string;
  }
  
  export type { dynamicControlModel };