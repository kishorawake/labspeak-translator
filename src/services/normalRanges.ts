export interface NormalRange {
  min: number;
  max: number;
  unit: string;
  panel: string;
  criticalLow?: number;
  criticalHigh?: number;
}

export const normalRanges: Record<string, NormalRange> = {
  "Hemoglobin": { min: 13, max: 17, unit: "gms/dl", panel: "Blood Health (Complete Blood Count)" },
  "WBC Count": { min: 4000, max: 11000, unit: "cells/µL", panel: "Blood Health (Complete Blood Count)" },
  "Neutrophils": { min: 40, max: 70, unit: "%", panel: "Blood Health (Complete Blood Count)" },
  "Lymphocytes": { min: 20, max: 40, unit: "%", panel: "Blood Health (Complete Blood Count)" },
  "Eosinophils": { min: 1, max: 6, unit: "%", panel: "Blood Health (Complete Blood Count)" },
  "Monocytes": { min: 2, max: 8, unit: "%", panel: "Blood Health (Complete Blood Count)" },
  "Basophils": { min: 0, max: 1, unit: "%", panel: "Blood Health (Complete Blood Count)" },
  "Hematocrit": { min: 40, max: 54, unit: "%", panel: "Blood Health (Complete Blood Count)" },
  "RBC Count": { min: 4.5, max: 5.5, unit: "million/µL", panel: "Blood Health (Complete Blood Count)" },
  "MCV": { min: 80, max: 100, unit: "fL", panel: "Blood Health (Complete Blood Count)" },
  "MCH": { min: 27, max: 33, unit: "pg", panel: "Blood Health (Complete Blood Count)" },
  "MCHC": { min: 32, max: 36, unit: "g/dL", panel: "Blood Health (Complete Blood Count)" },
  "RDW-CV": { min: 11, max: 16, unit: "%", panel: "Blood Health (Complete Blood Count)" },
  "Platelet Count": { min: 150000, max: 400000, unit: "/µL", panel: "Blood Health (Complete Blood Count)", criticalLow: 50000, criticalHigh: 1000000 },
  "MPV": { min: 6.5, max: 12, unit: "fL", panel: "Blood Health (Complete Blood Count)" },
  "PDW": { min: 9, max: 17, unit: "fL", panel: "Blood Health (Complete Blood Count)" },
  "Blood Urea": { min: 7, max: 20, unit: "mg/dL", panel: "Kidney Function" },
  "Serum Creatinine": { min: 0.7, max: 1.3, unit: "mg/dL", panel: "Kidney Function" },
  "BUN": { min: 7, max: 20, unit: "mg/dL", panel: "Kidney Function" },
  "Uric Acid": { min: 3.5, max: 7.2, unit: "mg/dL", panel: "Kidney Function" },
  "BUN/Creatinine Ratio": { min: 10, max: 20, unit: "", panel: "Kidney Function" },
  "eGFR": { min: 90, max: 120, unit: "mL/min/1.73m²", panel: "Kidney Function" },
  "Total Bilirubin": { min: 0.1, max: 1.2, unit: "mg/dL", panel: "Liver Health" },
  "Direct Bilirubin": { min: 0, max: 0.3, unit: "mg/dL", panel: "Liver Health" },
  "Indirect Bilirubin": { min: 0.1, max: 0.9, unit: "mg/dL", panel: "Liver Health" },
  "SGOT (AST)": { min: 0, max: 40, unit: "U/L", panel: "Liver Health" },
  "SGPT (ALT)": { min: 0, max: 41, unit: "U/L", panel: "Liver Health" },
  "Alkaline Phosphatase": { min: 44, max: 147, unit: "U/L", panel: "Liver Health" },
  "GGT": { min: 0, max: 55, unit: "U/L", panel: "Liver Health" },
  "Total Protein": { min: 6, max: 8.3, unit: "g/dL", panel: "Liver Health" },
  "Albumin": { min: 3.5, max: 5.5, unit: "g/dL", panel: "Liver Health" },
  "Globulin": { min: 2, max: 3.5, unit: "g/dL", panel: "Liver Health" },
  "A/G Ratio": { min: 1, max: 2.5, unit: "", panel: "Liver Health" },
  "Fasting Blood Sugar": { min: 70, max: 100, unit: "mg/dL", panel: "Blood Sugar", criticalHigh: 250 },
  "Random Blood Sugar": { min: 70, max: 140, unit: "mg/dL", panel: "Blood Sugar", criticalHigh: 300 },
  "HbA1c": { min: 4, max: 5.7, unit: "%", panel: "Blood Sugar", criticalHigh: 10 },
  "Post Prandial Blood Sugar": { min: 70, max: 140, unit: "mg/dL", panel: "Blood Sugar", criticalHigh: 250 },
  "Total Cholesterol": { min: 0, max: 200, unit: "mg/dL", panel: "Lipid Profile" },
  "Triglycerides": { min: 0, max: 150, unit: "mg/dL", panel: "Lipid Profile" },
  "HDL Cholesterol": { min: 40, max: 60, unit: "mg/dL", panel: "Lipid Profile" },
  "LDL Cholesterol": { min: 0, max: 100, unit: "mg/dL", panel: "Lipid Profile" },
  "VLDL Cholesterol": { min: 0, max: 30, unit: "mg/dL", panel: "Lipid Profile" },
  "Non-HDL Cholesterol": { min: 0, max: 130, unit: "mg/dL", panel: "Lipid Profile" },
  "TC/HDL Ratio": { min: 0, max: 5, unit: "", panel: "Lipid Profile" },
  "LDL/HDL Ratio": { min: 0, max: 3.5, unit: "", panel: "Lipid Profile" },
  "Iron": { min: 60, max: 170, unit: "µg/dL", panel: "Anemia Profile", criticalLow: 30 },
  "TIBC": { min: 250, max: 370, unit: "µg/dL", panel: "Anemia Profile" },
  "Ferritin": { min: 20, max: 250, unit: "ng/mL", panel: "Anemia Profile" },
  "Transferrin Saturation": { min: 20, max: 50, unit: "%", panel: "Anemia Profile" },
  "Vitamin B12": { min: 200, max: 900, unit: "pg/mL", panel: "Anemia Profile" },
  "Folate": { min: 3, max: 17, unit: "ng/mL", panel: "Anemia Profile" },
  "Sodium": { min: 136, max: 145, unit: "mEq/L", panel: "Electrolytes", criticalLow: 120, criticalHigh: 160 },
  "Potassium": { min: 3.5, max: 5, unit: "mEq/L", panel: "Electrolytes", criticalLow: 2.5, criticalHigh: 6.5 },
  "Chloride": { min: 98, max: 106, unit: "mEq/L", panel: "Electrolytes", criticalLow: 80, criticalHigh: 120 },
  "Calcium": { min: 8.5, max: 10.5, unit: "mg/dL", panel: "Electrolytes", criticalLow: 6, criticalHigh: 13 },
  "CRP": { min: 0, max: 5, unit: "mg/L", panel: "Inflammation", criticalHigh: 50 },
  "ESR": { min: 0, max: 20, unit: "mm/hr", panel: "Inflammation" },
  "TSH": { min: 0.4, max: 4, unit: "µIU/mL", panel: "Thyroid Function" },
  "T3": { min: 80, max: 200, unit: "ng/dL", panel: "Thyroid Function" },
  "T4": { min: 4.5, max: 12.5, unit: "µg/dL", panel: "Thyroid Function" },
  "Free T3": { min: 2.3, max: 4.2, unit: "pg/mL", panel: "Thyroid Function" },
  "Free T4": { min: 0.8, max: 1.8, unit: "ng/dL", panel: "Thyroid Function" },
  "Urine pH": { min: 4.5, max: 8, unit: "", panel: "Urine Routine" },
  "Urine Specific Gravity": { min: 1.005, max: 1.030, unit: "", panel: "Urine Routine" },
};

export type TestStatus = "normal" | "slightly_low" | "slightly_high" | "critical_low" | "critical_high";

export function classifyTest(testName: string, value: number): { status: TestStatus; range: NormalRange | null } {
  const range = normalRanges[testName];
  if (!range) return { status: "normal", range: null };

  if (range.criticalLow !== undefined && value <= range.criticalLow) return { status: "critical_low", range };
  if (range.criticalHigh !== undefined && value >= range.criticalHigh) return { status: "critical_high", range };
  if (value < range.min) {
    const diff = (range.min - value) / range.min;
    return { status: diff > 0.2 ? "critical_low" : "slightly_low", range };
  }
  if (value > range.max) {
    const diff = (value - range.max) / range.max;
    return { status: diff > 0.3 ? "critical_high" : "slightly_high", range };
  }
  return { status: "normal", range };
}
