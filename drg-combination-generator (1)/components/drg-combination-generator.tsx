"use client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

import { ArrowDownUp, FileDown, FilePlus, BarChart3, Save, Lightbulb } from "lucide-react"
import { Loader2 } from "lucide-react"

import DiagnosisCodeInput from "./diagnosis-code-input"
import ProcedureCodeInput from "./procedure-code-input"
import PatientInfoForm from "./patient-info-form"
import ResultsTable from "./results-table"
import VisualizationPanel from "./visualization-panel"
import RecommendationPanel from "./recommendation-panel"
import { DrgContext, DrgProvider } from "@/context/drg-context"
import React, {useContext} from "react"

export default function DrgCombinationGenerator() {
  return (
    <DrgProvider>
      <DrgCombinationGeneratorContent />
    </DrgProvider>
  )
}

function DrgCombinationGeneratorContent() {
  const { isLoading, generateCombinations } = DrgContext.useContext()
  

  return (
    <div className="container mx-auto py-6">
      {/* Main heading moved to page.tsx */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
        {/* Left Panel - Inputs */}
        <div className="xl:col-span-4">
          <Card>
            <CardContent className="p-6">
              <Tabs defaultValue="diagnosis" className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-4">
                  <TabsTrigger value="diagnosis">Diagnosis Codes</TabsTrigger>
                  <TabsTrigger value="procedures">Procedures</TabsTrigger>
                  <TabsTrigger value="patient">Patient Info</TabsTrigger>
                </TabsList>
                <TabsContent value="diagnosis">
                  <DiagnosisCodeInput />
                </TabsContent>
                <TabsContent value="procedures">
                  <ProcedureCodeInput />
                </TabsContent>
                <TabsContent value="patient">
                  <PatientInfoForm />
                </TabsContent>
              </Tabs>
              <Separator className="my-5 " />
              <div className="flex flex-col gap-10   ">
                <Button className="shadow-sm bg-gradient-to-r from-orange-600 to-orange-600 hover:from-orange-700 hover:to-orange-700 transition-all duration-300 w-full mt-1 " onClick={generateCombinations} disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    "Generate Combinations"
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
          <Card  className="mt-6">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <BarChart3 className="h-5 w-5 mr-2 text-primary" />
                  <h2 className="text-xl font-bold">Visualizations</h2>
                </div>
                <VisualizationPanel />
              </CardContent>
            </Card>
            
          
        </div>

        {/* Right Panel - Results */}
        <div className="xl:col-span-8">
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">DRG Combinations</h2>
              
              </div>
              <ResultsTable />
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <BarChart3 className="h-5 w-5 mr-2 text-primary" />
                  <h2 className="text-xl font-bold">Visualization</h2>
                </div>
                <VisualizationPanel />
              </CardContent>
            </Card>


            <Card>
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <Lightbulb className="h-5 w-5 mr-2 text-primary" />
                  <h2 className="text-xl font-bold">Recommendations</h2>
                </div>
                <RecommendationPanel />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

// function OptimizationCriteria() {
//   const { optimizationCriteria, setOptimizationCriteria } = DrgContext.useContext()

//   return (
//     <div className="flex items-center gap-2">
//       <span className="text-sm font-medium">Optimize for:</span>
//       <select
//         className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm"
//         value={optimizationCriteria}
//         onChange={(e) => setOptimizationCriteria(e.target.value)}
//       >
//         <option value="reimbursement">Reimbursement</option>
//         <option value="los">Length of Stay</option>
//         <option value="clinical">Clinical Appropriateness</option>
//       </select>
//     </div>
//   )
// }

