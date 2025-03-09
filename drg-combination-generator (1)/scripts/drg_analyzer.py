# #!/usr/bin/env python3
# import sys
# import json
# from drgpy.msdrg_allvers import DRGEngine
# import traceback
# import os



# def analyze_drg(data):
#     """
#     This is where you place your existing Python logic to analyze DRG codes.
#     Replace this function with your actual implementation.
    
#     Args:
#         data: The input data from the JavaScript front-end
        
#     Returns:
#         A string containing the DRG code
#     """
#     # Replace this with your actual DRG analysis logic
#     # This is just a placeholder example
#     de = DRGEngine(version="v40")
#     simplified_data = {
#     "dig code": [diag["value"] for diag in data["diagnosisCodes"]],
#     "proc code": [proc["value"] for proc in data["procedureCodes"]],
#     "gender": data["patientInfo"]["gender"],
#     "adm date": data["patientInfo"]["admissionDate"],
#     "is alive": data["patientInfo"]["dischargedAlive"]
# }
#     drg_code = de.get_drg(simplified_data['dig code'],simplified_data['proc code'])
#     # drg_code = "JSS"
#     return drg_code     

# if __name__ == "__main__":
#     try:
#         if len(sys.argv) < 3:
#             sys.stderr.write("ERROR: Input file path and output file path required\n")
#             sys.exit(1)
        
#         input_file = sys.argv[1]
#         output_file = sys.argv[2]
        
#         # Suppress any print statements that might be in your code
#         sys.stdout = open(os.devnull, 'w')
        
#         with open(input_file, 'r') as f:
#             data = json.load(f)
        
#         result = analyze_drg(data)
        
#         # Write the result to the output file
#         with open(output_file, 'w') as f:
#             f.write(result)
        
#         # Exit quietly
#         sys.exit(0)
        
#     except Exception as e:
#         # Use stderr for error reporting
#         sys.stderr.write(f"ERROR: {str(e)}\n")
#         sys.stderr.write(traceback.format_exc())
#         sys.exit(1)

#!/usr/bin/env python3
import sys
import json
import traceback
import os
import logging
from drgpy.msdrg import DRGEngine

from drgpy.msdrg_allvers import DRGEngineAllVers

# Set up logging to a file
log_file = os.path.join(os.path.dirname(__file__), 'drg_analyzer.log')
logging.basicConfig(
    filename=log_file,
    level=logging.DEBUG,
    format='%(asctime)s - %(levelname)s - %(message)s'
)

def analyze_drg(data):
    """
    This is where you place your existing Python logic to analyze DRG codes.
    
    Args:
        data: The input data from the JavaScript front-end
        
    Returns:
        A string containing the DRG code
    """
    # Log the input data for debugging
    logging.debug(f"Received data: {json.dumps(data, indent=2)}")
    
    simplified_data = {
    "dig code": [diag["value"] for diag in data["diagnosisCodes"]],
    "proc code": [proc["value"] for proc in data["procedureCodes"]],
    "gender": data["patientInfo"]["gender"],
    "adm date": data["patientInfo"]["admissionDate"],
    "is alive": data["patientInfo"]["dischargedAlive"]
}
    de = DRGEngineAllVers()
    logging.debug(f"simplified_data data: {json.dumps(simplified_data, indent=2)}")
    de = DRGEngine(version="v40")
    
    logging.debug(f"simplified_data data2: {json.dumps(simplified_data, indent=2)}")
    drg_code = de.get_drg(simplified_data['dig code'],simplified_data['proc code'])
    # drg_code = "JSS"

    logging.debug(f"Generated DRG code: {drg_code}")
    return drg_code


if __name__ == "__main__":
    try:
        logging.info("------ Starting DRG analysis ------")
        
        if len(sys.argv) < 3:
            logging.error("Insufficient arguments provided")
            sys.stderr.write("ERROR: Input file path and output file path required\n")
            sys.exit(1)
        
        input_file = sys.argv[1]
        output_file = sys.argv[2]
        
        logging.info(f"Input file: {input_file}")
        logging.info(f"Output file: {output_file}")
        
        with open(input_file, 'r') as f:
            data = json.load(f)
            logging.debug(f"Loaded input data, keys: {list(data.keys())}")
        
        result = analyze_drg(data)
        logging.info(f"Analysis result: {result}")
        
        # Write the result to the output file
        with open(output_file, 'w') as f:
            f.write(result)
        
        logging.info("Successfully wrote result to output file")
        sys.exit(0)
        
    except Exception as e:
        logging.exception(f"Error in DRG analysis: {str(e)}")
        sys.stderr.write(f"ERROR: {str(e)}\n")
        sys.stderr.write(traceback.format_exc())
        sys.exit(1)