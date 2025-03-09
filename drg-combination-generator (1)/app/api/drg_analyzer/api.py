# import sys
# sys.path.append("../../")
# import json
# from drgpy.msdrg_allvers import DRGEngineAllVers
# # Read input JSON from Node.js
# input_data = json.loads(sys.stdin.read())

# # Extract input values
# diagnosis_codes = [code["value"] for code in input_data["diagnosisCodes"]]
# procedure_codes = [code["value"] for code in input_data["procedureCodes"]]
# admission_date = input_data["patientInfo"]["admissionDate"]
# gender = "M" if input_data["patientInfo"]["gender"].lower() == "male" else "F"
# discharged_alive = input_data["patientInfo"]["dischargedAlive"]

# # Create DRG engine
# de = DRGEngineAllVers()
# print(diagnosis_codes,procedure_codes,admission_date,gender,discharged_alive)

# # Get DRG result
# drg_result = de.get_drg(diagnosis_codes, procedure_codes, admission_date, gender, discharged_alive)

# # Format output
# output = {
#     "drg": drg_result[0] if drg_result else "Unknown",
#     "description": drg_result[1] if len(drg_result) > 1 else "No description available",
# }

# # Return JSON response
# print(json.dumps(output))

# drg_engine.py  

import sys
import json
from drgpy.msdrg_allvers import DRGEngineAllVers

# def main():
#     # Read JSON from stdin
#     input_data = json.load(sys.stdin)

#     diagnosis_codes = [d['value'] for d in input_data['diagnosisCodes']]
#     procedure_codes = [p['value'] for p in input_data['procedureCodes']]
#     patient_info = input_data['patientInfo']

#     de = DRGEngineAllVers()

#     # Example usage: You can replace the params with your data
#     drg_result = de.get_drg(diagnosis_codes, procedure_codes, patient_info['admissionDate'], patient_info['gender'][0].upper(), patient_info['dischargedAlive'])

#     # Send result as JSON back to Node.js
#     print(json.dumps({
#         "drg": drg_result
#     }))

# if __name__ == "__main__":
#     main()

from fastapi import FastAPI, Request
from pydantic import BaseModel
from typing import List, Dict

app = FastAPI()

class DRGRequest(BaseModel):
    diagnosisCodes: List[Dict]
    procedureCodes: List[Dict]
    patientInfo: Dict

@app.post("/drg-generator")
async def generate_drg(data: DRGRequest):
    # Access inputs
    diagnosis_codes = [d["value"] for d in data.diagnosisCodes]
    procedure_codes = [p["value"] for p in data.procedureCodes]
    patient_info = data.patientInfo

    # Call your DRG generation logic (replace this)
    drg_code = my_drg_code_generator(diagnosis_codes, procedure_codes, patient_info)
    de = DRGEngineAllVers()

    # Example usage: You can replace the params with your data
    # drg_code = de.get_drg(diagnosis_codes, procedure_codes, patient_info['admissionDate'], patient_info['gender'][0].upper(), patient_info['dischargedAlive'])

    return {"drgCode": drg_code}

def my_drg_code_generator(diagnosis_codes, procedure_codes, patient_info):
    # Your actual logic here!
    # This is just an example placeholder
    if "J18.9" in diagnosis_codes:
        return "177"
    elif "J44.9" in diagnosis_codes:
        return "190"
    else:
        return "999"
