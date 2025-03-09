"use client"

import { AlertCircle, CheckCircle2 } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { DrgContext } from "@/context/drg-context"
import { motion } from "framer-motion"

export default function RecommendationPanel() {
  const { drgResults } = DrgContext.useContext()

  // Find optimal result
  const optimalResult = drgResults.find((result) => result.isOptimal)
  const currentResult = drgResults.find((result) => result.isCurrent)

  if (drgResults.length === 0) {
    return (
      <div className="flex items-center justify-center h-[200px] text-muted-foreground">
        No recommendations available yet
      </div>
    )
  }

  if (!optimalResult) {
    return (
      <div className="space-y-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>No optimal arrangement found</AlertTitle>
          <AlertDescription>
            Unable to determine the optimal DRG arrangement. Please check your input data.
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  const paymentDifference = optimalResult.payment - (currentResult?.payment || 0)
  const isCurrentOptimal = optimalResult.id === currentResult?.id

  return (
    <motion.div
      className="space-y-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {isCurrentOptimal ? (
        <Alert className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <AlertTitle className="text-green-800">Current arrangement is optimal</AlertTitle>
          <AlertDescription className="text-green-700">
            Your current principal diagnosis selection results in the optimal DRG assignment.
          </AlertDescription>
        </Alert>
      ) : (
        <Alert className="bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200">
          <AlertCircle className="h-4 w-4 text-blue-600" />
          <AlertTitle className="text-blue-800">Recommended arrangement</AlertTitle>
          <AlertDescription className="space-y-2">
            <p>
              Using <span className="font-medium">{optimalResult.principalDiagnosis}</span> as the principal diagnosis
              would result in DRG <span className="font-medium">{optimalResult.drg}</span>.
            </p>
            {paymentDifference > 0 && (
              <p className="text-green-600">
                This would increase reimbursement by ${paymentDifference.toLocaleString()}(
                {optimalResult.difference.toFixed(1)}%).
              </p>
            )}
          </AlertDescription>
        </Alert>
      )}

      <div className="text-sm space-y-2 bg-white p-4 rounded-lg shadow-sm">
        <h4 className="font-medium">Clinical Validation:</h4>
        <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
          <li>
            Ensure the principal diagnosis meets the definition of "condition established after study to be chiefly
            responsible for admission"
          </li>
        </ul>
      </div>
    </motion.div>
  )
}

