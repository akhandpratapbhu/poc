import FormSection from "./FormSection";
import TblAttribute from "./TblAttribute";

 
  // Convert TblEntity model to a TypeScript interface
  interface TblEntity {
    id: number;
    name: string;
    label: string;
    isActive: boolean;
    createdBy: number;
    createdDate: string; // Date as ISO string
    modifiedBy?: number | null;
    modifiedDate?: string | null;
    sectionId: number;
    formSections: FormSection[];
    attributes: TblAttribute[];
  }
  
  export default TblEntity;
  