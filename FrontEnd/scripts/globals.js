// Variable
export const url = "http://localhost:5678/api/";


// Function

// This function displays error messages (once)
export function errorMessage(error, errorLocation) {
    const errorDisplay = document.getElementById(errorLocation)
    errorDisplay.innerText = error;
  }
