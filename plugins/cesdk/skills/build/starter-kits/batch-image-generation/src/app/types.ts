/**
 * App Types for Batch Image Generation
 */

/** Output format for rendered images */
export type OutputFormat = 'image/png' | 'image/jpeg';

/** Employee data for template personalization */
export interface Employee {
  id: string;
  imagePath: string;
  firstName: string;
  lastName: string;
  department: string;
}

/** Template definition with scene data and dimensions */
export interface Template {
  id: string;
  label: string;
  sceneString: string;
  previewImagePath: string;
  width: number;
  height: number;
  outputFormat: OutputFormat;
}

/** Team image state for display */
export interface TeamImage {
  isLoading: boolean;
  src: string;
  sceneString: string | null;
  employee: Employee;
}
