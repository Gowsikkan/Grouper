"use client"

import { useState } from "react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DrgContext } from "@/context/drg-context"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { motion } from "framer-motion"

export default function VisualizationPanel() {
  const { drgResults } = DrgContext.useContext()
  const [visualizationType, setVisualizationType] = useState("payment")

  const getChartData = () => {
    return drgResults.map((result) => ({
      name: `#${result.rank}`,
      value:
        visualizationType === "payment"
          ? result.payment
          : visualizationType === "weight"
            ? result.weight
            : result.difference,
      drg: result.drg,
      pdx: result.principalDiagnosis,
      isOptimal: result.isOptimal,
      isCurrent: result.isCurrent,
      fill: result.isOptimal ? "#10b981" : result.isCurrent ? "#0ea5e9" : "#6366f1",
    }))
  }

  const getYAxisLabel = () => {
    switch (visualizationType) {
      case "payment":
        return "Payment ($)"
      case "weight":
        return "Relative Weight"
      case "difference":
        return "% Difference"
      default:
        return ""
    }
  }

  const formatYAxis = (value: number) => {
    if (visualizationType === "payment") {
      return `$${value.toLocaleString()}`
    } else if (visualizationType === "weight") {
      return value.toFixed(2)
    } else {
      return `${value}%`
    }
  }

  if (drgResults.length === 0) {
    return (
      <div className="flex items-center justify-center h-[200px] text-muted-foreground">No data to visualize yet</div>
    )
  }

  return (
    <motion.div
      className="space-y-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex justify-end">
        <Select value={visualizationType} onValueChange={setVisualizationType}>
          <SelectTrigger className="w-[180px] bg-white shadow-sm">
            <SelectValue placeholder="Select metric" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="payment">Payment</SelectItem>
            <SelectItem value="weight">Relative Weight</SelectItem>
            <SelectItem value="difference">% Difference</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="h-[250px] bg-white p-4 rounded-lg shadow-sm">
        <ChartContainer
          config={{
            value: {
              label: getYAxisLabel(),
              color: "hsl(var(--chart-1))",
            },
          }}
        >
          <BarChart data={getChartData()} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis dataKey="name" tickLine={false} axisLine={false} />
            <YAxis tickFormatter={formatYAxis} tickLine={false} axisLine={false} />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  indicator="dashed"
                  formatValue={(value) => {
                    if (visualizationType === "payment") {
                      return `$${Number(value).toLocaleString()}`
                    } else if (visualizationType === "weight") {
                      return Number(value).toFixed(2)
                    } else {
                      return `${Number(value).toFixed(1)}%`
                    }
                  }}
                />
              }
            />
            <Bar
              dataKey="value"
              fill="var(--color-value)"
              radius={4}
              fillOpacity={0.9}
              animationDuration={1500}
              animationEasing="ease-in-out"
            />
          </BarChart>
        </ChartContainer>
      </div>
    </motion.div>
  )
}

