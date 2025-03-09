import { NextResponse } from "next/server"

// This would normally call your Python function through some mechanism
// like a child process, API call, or serverless function
export async function POST(request: Request) {
  try {
    const data = await request.json()
    
    console.log("Received request data:", data)
    

    // Mock response - in a real implementation, this would call your Python function
    const results = generateDrgCombinations(data)
    

    return NextResponse.json({ results })
  } catch (error) {
    console.error("Error processing DRG analysis:", error)
    return NextResponse.json({ error: "Failed to process DRG analysis" }, { status: 500 })
  }
}

// 

// Mock function that simulates what your Python function would do
function generateDrgCombinations(data: any) {
  const { diagnosisCodes, procedureCodes, patientInfo, optimizationCriteria } = data
  console.log("Received request data:", data)
     
  // Create all possible combinations by trying each diagnosis as principal
  const combinations = diagnosisCodes.map((pdx: any, index: number) => {
    const secondaryDiagnoses = diagnosisCodes.filter((_: any, i: number) => i !== index).map((code: any) => code.value)

    // Simulate different DRGs based on principal diagnosis
    let drg, description, weight, payment

    switch (pdx.value) {
      case "J18.9":
        drg = "177"
        description = "Respiratory Infections with Major Complication or Comorbidity"
        weight = 1.8325
        payment = 12500
        break
      case "J44.9":
        drg = "190"
        description = "Chronic Obstructive Pulmonary Disease with Major CC"
        weight = 1.9547
        payment = 13250
        break
      case "E11.9":
        drg = "639"
        description = "Diabetes with Complications with CC"
        weight = 1.3854
        payment = 9450
        break
      case "I10":
        drg = "304"
        description = "Hypertension without Major CC"
        weight = 0.7231
        payment = 4950
        break
      default:
        drg = "999"
        description = "Unspecified DRG"
        weight = 1.0
        payment = 8000
    }

    // Add some randomness to make it more realistic
    weight = weight * (0.95 + Math.random() * 0.1)
    payment = Math.round(payment * (0.95 + Math.random() * 0.1))

    return {
      id: `result-${index + 1}`,
      rank: index + 1,
      principalDiagnosis: pdx.value,
      secondaryDiagnoses,
      drg,
      description,
      weight,
      payment,
      difference: 0, // Will be calculated later
      isOptimal: false, // Will be determined later
      isCurrent: index === 0, // First one is current
    }
  })

  // Sort by payment (or other criteria) and calculate differences
  let sortedCombinations

  if (optimizationCriteria === "reimbursement") {
    sortedCombinations = [...combinations].sort((a, b) => b.payment - a.payment)
  } else if (optimizationCriteria === "los") {
    sortedCombinations = [...combinations].sort((a, b) => a.weight - b.weight)
  } else {
    // Clinical appropriateness - just use a random sort for the mock
    sortedCombinations = [...combinations].sort(() => Math.random() - 0.5)
  }

  // Calculate differences and set optimal
  const currentPayment = combinations.find((c) => c.isCurrent)?.payment || 0

  return sortedCombinations.map((combo, index) => {
    return {
      ...combo,
      rank: index + 1,
      difference: ((combo.payment - currentPayment) / currentPayment) * 100,
      isOptimal: index === 0,
    }
  })
}



// import { NextResponse } from "next/server"

// export async function POST(request: Request) {
//   try {
//     const data = await request.json()

//     console.log("Received request data:", data)

//     // Call the Python API with the data
//     const pythonResponse = await fetch("http://localhost:8000/drg-generator", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         diagnosisCodes: data.diagnosisCodes,
//         procedureCodes: data.procedureCodes,
//         patientInfo: data.patientInfo,
//       }),
//     })

//     if (!pythonResponse.ok) {
//       const errorText = await pythonResponse.text()
//       console.error("Python service error:", errorText)
//       return NextResponse.json({ error: "Python DRG generator failed" }, { status: 500 })
//     }

//     const { drgCode } = await pythonResponse.json()

//     console.log("DRG Code from Python:", drgCode)

//     // Map DRG code to descriptions, weights, and payments (customize as needed)
//     const drgMapping = {
//       "177": {
//         description: "Respiratory Infections with Major Complication or Comorbidity",
//         weight: 1.8325,
//         payment: 12500,
//       },
//       "190": {
//         description: "Chronic Obstructive Pulmonary Disease with Major CC",
//         weight: 1.9547,
//         payment: 13250,
//       },
//       "639": {
//         description: "Diabetes with Complications with CC",
//         weight: 1.3854,
//         payment: 9450,
//       },
//       "304": {
//         description: "Hypertension without Major CC",
//         weight: 0.7231,
//         payment: 4950,
//       },
//       "999": {
//         description: "Unspecified DRG",
//         weight: 1.0,
//         payment: 8000,
//       },
//     }

//     const drgInfo = drgMapping[drgCode] || drgMapping["999"]

//     // Optional: Add randomness like before if you want
//     let weight = drgInfo.weight * (0.95 + Math.random() * 0.1)
//     let payment = Math.round(drgInfo.payment * (0.95 + Math.random() * 0.1))

//     // Build your result object
//     const result = {
//       id: `result-1`,
//       rank: 1,
//       principalDiagnosis: data.diagnosisCodes[0]?.value || "",
//       secondaryDiagnoses: data.diagnosisCodes.slice(1).map((code: any) => code.value),
//       drg: drgCode,
//       description: drgInfo.description,
//       weight: weight,
//       payment: payment,
//       difference: 0,
//       isOptimal: true,
//       isCurrent: true,
//     }

//     return NextResponse.json({ results: [result] })
//   } catch (error) {
//     console.error("Error processing DRG analysis:", error)
//     return NextResponse.json({ error: "Failed to process DRG analysis" }, { status: 500 })
//   }
// }

// import { NextResponse } from 'next/server';
// import { exec } from 'child_process';
// import { promises as fs } from 'fs';
// import path from 'path';
// import os from 'os';

// export async function POST(request: Request) {
//   try {
//     const data = await request.json();
//     console.log("Received request data:", data);

    
//     // Prepare data for Python script
//     const tempInputFile = path.join(os.tmpdir(), `drg_input_${Date.now()}.json`);
//     await fs.writeFile(tempInputFile, JSON.stringify(data));
    
//     // Execute Python script
//     const drgResult = await executePythonScript(tempInputFile);
//     console.log("DRG:", drgResult);
    
    
//     // Clean up temp file
//     await fs.unlink(tempInputFile).catch(e => console.warn('Error deleting temp file:', e));
    
//     return NextResponse.json({ result: drgResult });
//   } catch (error) {
//     console.error("Error processing DRG analysis:", error);
//     return NextResponse.json(
//       { error: "Failed to process DRG analysis" }, 
//       { status: 500 }
//     );
//   }
// }

// async function executePythonScript(inputFile: string): Promise<string> {
//   return new Promise((resolve, reject) => {
//     // Get the absolute path to your Python script
//     const pythonScript = path.resolve(process.cwd(), 'scripts', 'drg_analyzer.py');
    
//     console.log("Python script path:", pythonScript);
//     console.log("Input file path:", inputFile);
    
//     // Properly quote paths for Windows
//     const command = `python "${pythonScript}" "${inputFile}"`;
//     console.log("Executing command:", command);

    
//     exec(command, (error, stdout, stderr) => {
//       if (error) {
//         console.error(`Python execution error: ${error}`);
//         console.error(`stderr: ${stderr}`);
//         return reject(error);
//       }
      
//       if (stderr) {
//         console.warn(`Python stderr: ${stderr}`);
//       }
      
//       // Trim any whitespace/newlines from the output
//       const result = stdout.trim();
//       console.log("Res:", result);
    
//       resolve(result);
//     });
//   });
// }

// import { NextResponse } from 'next/server';
// import { exec } from 'child_process';
// import { promises as fs } from 'fs';
// import path from 'path';
// import os from 'os';

// export async function POST(request: Request) {
//   try {
//     const data = await request.json();
//     console.log("Received request data:", data);
    
//     // Create temp input and output file paths
//     const tempInputFile = path.join(os.tmpdir(), `drg_input_${Date.now()}.json`);
//     const tempOutputFile = path.join(os.tmpdir(), `drg_output_${Date.now()}.txt`);
    
//     // Write input data to temp file
//     await fs.writeFile(tempInputFile, JSON.stringify(data));
    
//     // Execute Python script with output file parameter
//     await executePythonScript(tempInputFile, tempOutputFile);
    
//     // Read results from output file
//     const result = await fs.readFile(tempOutputFile, 'utf8');
    
//     // Clean up temp files
//     await Promise.all([
//       fs.unlink(tempInputFile).catch(e => console.warn('Error deleting input file:', e)),
//       fs.unlink(tempOutputFile).catch(e => console.warn('Error deleting output file:', e))
//     ]);
    
//     return NextResponse.json({ result: result.trim() });
//   } catch (error) {
//     console.error("Error processing DRG analysis:", error);
//     return NextResponse.json(
//       { error: "Failed to process DRG analysis" }, 
//       { status: 500 }
//     );
//   }
// }

// async function executePythonScript(inputFile: string, outputFile: string): Promise<void> {
//   return new Promise((resolve, reject) => {
//     const pythonScript = path.resolve(process.cwd(), 'scripts', 'drg_analyzer.py');
    
//     console.log("Python script path:", pythonScript);
//     console.log("Input file path:", inputFile);
//     console.log("Output file path:", outputFile);
    
//     const command = `python "${pythonScript}" "${inputFile}" "${outputFile}"`;
//     console.log("Executing command:", command);
    
//     exec(command, (error, stdout, stderr) => {
//       if (error) {
//         console.error(`Python execution error: ${error}`);
//         console.error(`stderr: ${stderr}`);
//         return reject(error);
//       }
      
//       if (stderr) {
//         console.warn(`Python stderr: ${stderr}`);
//       }
      
//       resolve();
//     });
//   });
// }


// import { NextResponse } from 'next/server';
// import { spawn } from 'child_process';
// import { promises as fs } from 'fs';
// import path from 'path';
// import os from 'os';

// export async function POST(request: Request) {
//   try {
//     const data = await request.json();
//     console.log("Received request data:", data);
    
//     // Create temp input and output file paths
//     const tempInputFile = path.join(os.tmpdir(), `drg_input_${Date.now()}.json`);
//     const tempOutputFile = path.join(os.tmpdir(), `drg_output_${Date.now()}.txt`);
    
//     // Write input data to temp file
//     await fs.writeFile(tempInputFile, JSON.stringify(data));
    
//     // Execute Python script with output file parameter
//     await executePythonScript(tempInputFile, tempOutputFile);
    
//     // Read results from output file
//     const result = await fs.readFile(tempOutputFile, 'utf8');
    
//     // Clean up temp files
//     await Promise.all([
//       fs.unlink(tempInputFile).catch(e => console.warn('Error deleting input file:', e)),
//       fs.unlink(tempOutputFile).catch(e => console.warn('Error deleting output file:', e))
//     ]);
    
//     return NextResponse.json({ result: result.trim() });
//   } catch (error) {
//     console.error("Error processing DRG analysis:", error);
//     return NextResponse.json(
//       { error: "Failed to process DRG analysis" }, 
//       { status: 500 }
//     );
//   }
// }

// async function executePythonScript(inputFile: string, outputFile: string): Promise<void> {
//   return new Promise((resolve, reject) => {
//     const pythonScript = path.resolve(process.cwd(), 'scripts', 'drg_analyzer.py');
    
//     console.log("Python script path:", pythonScript);
//     console.log("Input file path:", inputFile);
//     console.log("Output file path:", outputFile);
    
//     // Use spawn instead of exec
//     const pythonProcess = spawn('python', [
//       pythonScript,
//       inputFile,
//       outputFile
//     ]);
    
//     // Capture any error output
//     let errorOutput = '';
//     pythonProcess.stderr.on('data', (data) => {
//       errorOutput += data.toString();
//       console.error(`Python stderr: ${data}`);
//     });
    
//     // Handle process completion
//     pythonProcess.on('close', (code) => {
//       if (code !== 0) {
//         console.error(`Python process exited with code ${code}`);
//         console.error(`Error output: ${errorOutput}`);
//         return reject(new Error(`Python process exited with code ${code}: ${errorOutput}`));
//       }
//       resolve();
//     });
    
//     // Handle process errors
//     pythonProcess.on('error', (error) => {
//       console.error(`Failed to start Python process: ${error}`);
//       reject(error);
//     });
//   });
// }