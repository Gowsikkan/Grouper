"use client"

import { DrgContext } from "@/context/drg-context"
import { useContext } from "react";
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { motion } from "framer-motion"

export default function PatientInfoForm() {
  const { patientInfo, setPatientInfo } = DrgContext.useContext()

  const handleChange = (field: string, value: string | number | boolean) => {
    setPatientInfo({
      ...patientInfo,
      [field]: value,
    })
  }

  return (
    <div className="space-y-10">
      <h3 className="text-lg font-semibold">Patient Information</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <motion.div
          className="space-y-2"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Label htmlFor="gender">Gender</Label>
          <RadioGroup
            id="gender"
            value={patientInfo.gender}
            onValueChange={(value) => handleChange("gender", value)}
            className="flex gap-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="male" id="male" />
              <Label htmlFor="male">Male</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="female" id="female" />
              <Label htmlFor="female">Female</Label>
            </div>
            
          </RadioGroup>
        </motion.div>

        {/* <motion.div
          className="space-y-2"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Label htmlFor="age">Age</Label>
          <Input
            id="age"
            type="number"
            min="0"
            max="120"
            value={patientInfo.age}
            onChange={(e) => handleChange("age", Number.parseInt(e.target.value) || 0)}
            className="shadow-sm"
          />
        </motion.div> */}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <motion.div
          className="space-y-2"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Label htmlFor="admissionDate">Admission Date</Label>
          <Input
            id="admissionDate"
            type="date"
            value={patientInfo.admissionDate}
            onChange={(e) => handleChange("admissionDate", e.target.value)}
            className="shadow-sm"
          />
        </motion.div>
{/* 
        <motion.div
          className="space-y-2"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <Label htmlFor="dischargeStatus">Discharge Status</Label>
          <Select value={patientInfo.dischargeStatus} onValueChange={(value) => handleChange("dischargeStatus", value)}>
            <SelectTrigger className="shadow-sm">
              <SelectValue placeholder="Select discharge status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="home">Home</SelectItem>
              <SelectItem value="snf">Skilled Nursing Facility</SelectItem>
              <SelectItem value="rehab">Rehabilitation</SelectItem>
              <SelectItem value="expired">Expired</SelectItem>
              <SelectItem value="ama">Against Medical Advice</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </motion.div> */}
      </div>

      <motion.div
        className="flex items-center space-x-2 pt-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.4 }}
      >
        <Switch
          id="dischargedAlive"
          checked={patientInfo.dischargedAlive}
          onCheckedChange={(checked) => handleChange("dischargedAlive", checked)}
        />
        <Label htmlFor="dischargedAlive">Discharged Alive</Label>
      </motion.div>
      
    </div>
  )
}

