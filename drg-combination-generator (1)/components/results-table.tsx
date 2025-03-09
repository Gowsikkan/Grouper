"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Check, ChevronDown, ChevronUp } from "lucide-react"
import { DrgContext } from "@/context/drg-context"
import { motion } from "framer-motion"

export default function ResultsTable() {
  const { drgResults } = DrgContext.useContext()
  const [sortField, setSortField] = useState("rank")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")

  const handleSort = (field: string) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const getSortIcon = (field: string) => {
    if (field !== sortField) return null
    return sortDirection === "asc" ? <ChevronUp className="h-4 w-4 ml-1" /> : <ChevronDown className="h-4 w-4 ml-1" />
  }

  return (
    <div className="h-[400px] overflow-y-auto rounded-md ">
      <Table className="w-full relative">
        <TableHeader className="sticky top-0 bg-background z-10">
          <TableRow>
            <TableHead className="w-[5%]">
              {/* <Button
                className="h-8 px-2 -ml-3 font-medium"
                onClick={() => handleSort("rank")}
              >
                Rank
                {getSortIcon("rank")}
              </Button> */}Rank
            </TableHead>
            <TableHead className="w-[10%]">
            Principal Dx
            </TableHead>
            <TableHead className="w-[15%]">Secondary Dx</TableHead>
            <TableHead className="w-[7%]">
              {/* <Button
                className="h-8 px-2 -ml-3 font-medium"
                onClick={() => handleSort("drg")}
              >
                DRG
                {getSortIcon("drg")}
              </Button> */}
              DRG
            </TableHead>
            <TableHead className="w-[25%]">Description</TableHead>
            <TableHead className="w-[8%]">
              {/* <Button
                className="h-8 px-2 -ml-3 font-medium"
                onClick={() => handleSort("weight")}
              >
                Weight
                {getSortIcon("weight")}
              </Button> */}
              Weight
            </TableHead>
            <TableHead className="w-[12%]">
              {/* <Button
                className="h-8 px-2 -ml-3 font-medium"
                onClick={() => handleSort("payment")}
              >
                Payment
                {getSortIcon("payment")}
              </Button> */}
              Payment
            </TableHead>
            <TableHead className="w-[10%]">
              {/* <Button
                className="h-8 px-2 -ml-3 font-medium"
                onClick={() => handleSort("difference")}
              >
                % Diff
                {getSortIcon("difference")}
              </Button> */}
              % Diff
            </TableHead>
            <TableHead className="w-[8%]">Preference</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {drgResults.length === 0 ? (
            <TableRow>
              <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                No results yet. Click "Generate Combinations" to analyze possible DRGs.
              </TableCell>
            </TableRow>
          ) : (
            drgResults.map((result, index) => (
              <motion.tr
                key={result.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className={`${
                  result.isOptimal
                    ? "bg-gradient-to-r from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100"
                    : result.isCurrent
                      ? "bg-gradient-to-r from-blue-50 to-cyan-50 hover:from-blue-100 hover:to-cyan-100"
                      : "hover:bg-slate-50"
                } transition-colors`}
              >
                <TableCell>
                  <Badge
                    className={result.isOptimal ? "bg-gradient-to-r from-green-600 to-emerald-600" : ""}
                  >
                    #{result.rank}
                  </Badge>
                </TableCell>
                <TableCell>
                  <span className="font-medium">{result.principalDiagnosis}</span>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {result.secondaryDiagnoses.map((code, i) => (
                      <span key={i} className="text-xs px-1.5 py-0.5 bg-slate-100 rounded">
                        {code}
                      </span>
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                  <span className="font-medium">{result.drg}</span>
                </TableCell>
                <TableCell>
                  <span className="text-sm text-muted-foreground">{result.description}</span>
                </TableCell>
                <TableCell>
                  <span className="font-medium">{result.weight.toFixed(2)}</span>
                </TableCell>
                <TableCell>
                  <span className="font-medium">${result.payment.toLocaleString()}</span>
                </TableCell>
                <TableCell>
                  <span
                    className={`font-medium ${
                      result.difference > 0 ? "text-green-600" : result.difference < 0 ? "text-red-600" : ""
                    }`}
                  >
                    {result.difference > 0 ? "+" : ""}
                    {result.difference.toFixed(1)}%
                  </span>
                </TableCell>
                <TableCell>
                  {result.isCurrent ? (
                    <Badge className="border-blue-600 text-blue-600"  variant="secondary">
                      Current
                    </Badge>
                  ) : result.isOptimal ? (
                    <Badge className="border-green-600 text-green-600" variant="secondary">
                      Optimal
                    </Badge>
                  ) : (
                    <Button
                      className="h-8 w-8 hover:bg-blue-100 hover:text-blue-600 transition-colors"  variant="secondary"
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                  )}
                </TableCell>
              </motion.tr>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}

