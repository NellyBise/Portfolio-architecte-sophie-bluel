// Variable
export const url = "http://localhost:5678/api/";


// Function

// This function displays error messages (once)
export function errorMessage(error, errorLocation) {
    const errorCheck = document.querySelector("#errorMessage");
    if (!errorCheck) {
      const errorDisplay = document.createElement("p");
      errorDisplay.innerText = error;
      errorDisplay.id = "errorMessage";
      errorLocation.append(errorDisplay);
    } else {
      errorCheck.innerText = error;
    }
  }
