"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

// Types
type DiagnosisCode = {
  id: string
  value: string
  description: string
}

type ProcedureCode = {
  id: string
  value: string
  description: string
}

type PatientInfo = {
  gender: string
  age: number
  admissionDate: string
  dischargeStatus: string
  dischargedAlive: boolean
}

type DrgResult = {
  id: string
  rank: number
  principalDiagnosis: string
  secondaryDiagnoses: string[]
  drg: string
  description: string
  weight: number
  payment: number
  difference: number
  isOptimal: boolean
  isCurrent: boolean
}

type DrgContextType = {
  diagnosisCodes: DiagnosisCode[]
  setDiagnosisCodes: (codes: DiagnosisCode[]) => void
  procedureCodes: ProcedureCode[]
  setProcedureCodes: (codes: ProcedureCode[]) => void
  patientInfo: PatientInfo
  setPatientInfo: (info: PatientInfo) => void
  drgResults: DrgResult[]
  setDrgResults: (results: DrgResult[]) => void
  optimizationCriteria: string
  setOptimizationCriteria: (criteria: string) => void
  onDragEnd: (result: any) => void
  isLoading: boolean
  generateCombinations: () => Promise<void>
}

// Default values
const defaultDiagnosisCodes: DiagnosisCode[] = [
  { id: "diag-1", value: "J18.9", description: "Pneumonia, unspecified organism" },
  { id: "diag-2", value: "E11.9", description: "Type 2 diabetes mellitus without complications" },
  { id: "diag-3", value: "I10", description: "Essential (primary) hypertension" },
  { id: "diag-4", value: "J44.9", description: "Chronic obstructive pulmonary disease, unspecified" },
]

const defaultProcedureCodes: ProcedureCode[] = [
  {
    id: "proc-1",
    value: "0BH17EZ",
    description: "Insertion of Endotracheal Airway into Trachea, Via Natural or Artificial Opening",
  },
]

const defaultPatientInfo: PatientInfo = {
  gender: "male",
  age: 67,
  admissionDate: new Date().toISOString().split("T")[0],
  dischargeStatus: "home",
  dischargedAlive: true,
}

// Create context
const DrgContext = createContext<DrgContextType | undefined>(undefined)

// Provider component
export function DrgProvider({ children }: { children: ReactNode }) {
  const [diagnosisCodes, setDiagnosisCodes] = useState<DiagnosisCode[]>(defaultDiagnosisCodes)
  const [procedureCodes, setProcedureCodes] = useState<ProcedureCode[]>(defaultProcedureCodes)
  const [patientInfo, setPatientInfo] = useState<PatientInfo>(defaultPatientInfo)
  const [drgResults, setDrgResults] = useState<DrgResult[]>([])
  const [optimizationCriteria, setOptimizationCriteria] = useState<string>("reimbursement")
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const onDragEnd = (result: any) => {
    if (!result.destination) return

    const items = Array.from(diagnosisCodes)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    setDiagnosisCodes(items)
  }

  const generateCombinations = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/drg_analyzer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          diagnosisCodes,
          procedureCodes,
          patientInfo,
          optimizationCriteria, 
        }),
      })
      
      console.log(response)

      if (!response.ok) {
        const errorDetails = await response.text();  // Get error details from the response body
        console.error("Error details:", errorDetails);
        throw new Error("Failed to analyze DRG combinations");
      }

      const data = await response.json()
      console.log("s",data)
      setDrgResults(data.results)
    } catch (error) {
      console.error("Error generating DRG combinations:", error)
      // In a real app, you'd want to show an error message to the user
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <DrgContext.Provider
      value={{
        diagnosisCodes,
        setDiagnosisCodes,
        procedureCodes,
        setProcedureCodes,
        patientInfo,
        setPatientInfo,
        drgResults,
        setDrgResults,
        optimizationCriteria,
        setOptimizationCriteria,
        onDragEnd,
        isLoading,
        generateCombinations,
      }}
    >
      {children}
    </DrgContext.Provider>
  )
}

// Custom hook to use the context
DrgContext.useContext = () => {
  const context = useContext(DrgContext)
  if (context === undefined) {
    throw new Error("useDrgContext must be used within a DrgProvider")
  }
  return context
}

export { DrgContext }

