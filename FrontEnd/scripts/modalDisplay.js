// Variables
const editWindow = document.querySelector(".fenetreGestion");
const addWindow = document.querySelector(".fenetreAjout");


// FUNCTIONS

/**
 * These functions display and hide modal windows
 * @param {*} window : edit window, add work window or confirmation window
 */
export function displayEdit(window) {
    window.style.display = "flex";
    window.removeAttribute("aria-hidden");
}
export function hideEdit(window) {
    window.style.display = "none";
    window.setAttribute("aria-hidden","true");
  formReset();
  // delete error messages
  const error = document.querySelector("#errorMessage");
  if (error) {
    error.remove();
  }
}

// This function resets the form
function formReset() {
  document.getElementById("form").reset();
  const preview = document.querySelector(".preview");
  if (preview) {
    preview.remove();
  }
}

// This function initializes the management of modal windows
export function initModalWindows() {
  const modifyButton = document.querySelector("#modifyButton");
  modifyButton.addEventListener("click", () => {
    displayEdit(editWindow);
    addWorkWindow();
    editReturn();
  });

  // Hide by clicking outside thewindow , on the cross or pressing escape
  editWindow.addEventListener("click", function(event) {
    if (event.target === editWindow) {
        hideEdit(editWindow);
    }
  });
  const boutonClose = document.querySelector(".fenetreGestion .close");
  boutonClose.addEventListener("click", () => {
    hideEdit(editWindow);
  });
  window.addEventListener ("keydown", function(e) {
    if (e.key === "Escape" || e.key === "Esc"){
      hideEdit(editWindow)
    }
  })
}

// this function displays add work window
function addWorkWindow() {
  const boutonAjout = document.querySelector("#ajoutPhoto");
  boutonAjout.addEventListener("click", () => {
    displayEdit(addWindow);
    hideEdit(editWindow);
  });
  // hide the window by clicking outside, on the cross or pressing escape
  addWindow.addEventListener("click", (event) => {
    if (event.target === addWindow) {
        hideEdit(addWindow);
    }
  });
  const boutonClose = document.querySelector(".fenetreAjout .close");
  boutonClose.addEventListener("click", () => {
    hideEdit(addWindow);
  });
  window.addEventListener ("keydown", function(e) {
    if (e.key === "Escape" || e.key === "Esc"){
      hideEdit(addWindow)
    }
  })
}

// This function returns on edit window
function editReturn() {
  const boutonRetour = document.querySelector(".retour");
  boutonRetour.addEventListener("click", () => {
    displayEdit(editWindow);
    hideEdit(addWindow);
    formReset();
  });
}
