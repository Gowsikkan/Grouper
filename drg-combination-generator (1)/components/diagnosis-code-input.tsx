"use client"

import type React from "react"

import { useState } from "react"
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, X, GripVertical } from "lucide-react"
import { DrgContext } from "@/context/drg-context"
import { motion } from "framer-motion"

export default function DiagnosisCodeInput() {
  const { diagnosisCodes, setDiagnosisCodes } = DrgContext.useContext()
  const [newCode, setNewCode] = useState("")

  const handleAddCode = () => {
    if (newCode.trim()) {
      setDiagnosisCodes([
        ...diagnosisCodes,
        {
          id: `diag-${Date.now()}`,
          value: newCode.trim().toUpperCase(),
          description: "Diagnosis description would come from API",
        },
      ])
      setNewCode("")
    }
  }

  const handleRemoveCode = (index: number) => {
    const updatedCodes = [...diagnosisCodes]
    updatedCodes.splice(index, 1)
    setDiagnosisCodes(updatedCodes)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleAddCode()
    }
  }

  const onDragEnd = (result: any) => {
    if (!result.destination) return

    const items = Array.from(diagnosisCodes)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    setDiagnosisCodes(items)
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Diagnosis Codes</h3>
      <p className="text-sm text-muted-foreground">
        Enter diagnosis codes below. The first code is considered the principal diagnosis. Drag to reorder.
      </p>

      <div className="flex gap-2">
        <Input
          placeholder="Enter ICD-10 code (e.g., J18.9)"
          value={newCode}
          onChange={(e) => setNewCode(e.target.value)}
          onKeyDown={handleKeyDown}
          className="shadow-sm"
        />
        <Button
          onClick={handleAddCode}
          className="shadow-sm bg-gradient-to-r from-orange-600 to-orange-600 hover:from-orange-700 hover:to-orange-700 transition-all duration-300"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add
        </Button>
      </div>

      <div className="diagnosis-code-container min-h-[100px] border rounded-md p-4 bg-white shadow-sm">
        {diagnosisCodes.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">No diagnosis codes added yet</div>
        ) : (
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="diagnosis-codes" direction="horizontal">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef} className="flex flex-wrap gap-2">
                  {diagnosisCodes.map((code, index) => (
                    <Draggable key={code.id} draggableId={code.id} index={index}>
                      {(provided, snapshot) => (
                        <motion.div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          initial={{ scale: 0.9, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ duration: 0.2 }}
                          className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-white shadow-md ${
                            snapshot.isDragging ? "shadow-lg" : ""
                          } ${
                            index === 0
                              ? "bg-gradient-to-r from-orange-500 to-red-500" // Principal diagnosis
                              : "bg-gradient-to-r from-blue-500 to-indigo-500" // Secondary diagnosis
                          }`}
                        >
                          <GripVertical className="h-4 w-4 cursor-grab" />
                          <span className="font-medium">{code.value}</span>
                          <button
                            onClick={() => handleRemoveCode(index)}
                            className="ml-1 hover:bg-white/20 rounded-full p-0.5 transition-colors"
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </motion.div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        )}
      </div>

      <div className="text-sm text-muted-foreground">
        <span className="inline-block w-3 h-3 rounded-full bg-gradient-to-r from-orange-500 to-red-500 mr-2"></span>
        Principal Diagnosis
        <span className="inline-block w-3 h-3 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 mx-2 ml-4"></span>
        Secondary Diagnosis
      </div>
    </div>
  )
}

