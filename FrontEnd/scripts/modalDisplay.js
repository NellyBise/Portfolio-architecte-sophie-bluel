// Variables
const editWindow = document.querySelector(".edition");
const returnButton = document.querySelector("#return");
const addEdit = document.querySelector(".addEdit");
const deleteEdit = document.querySelector(".deleteEdit");

// FUNCTIONS

/**
 * These functions display and hide modal windows
 * @param {*} window : edit window or confirmation window
 */
export function displayEdit(window) {
  window.style.display = "flex";
  deleteEdit.style.display = "flex";
  addEdit.style.display = "none";
  window.removeAttribute("aria-hidden");
}
export function hideEdit(window) {
  window.style.display = "none";
  window.setAttribute("aria-hidden", "true");
  displayReset();
}

// This function initializes the management of modal windows
export function initModalWindows() {
  const modifyButton = document.querySelector("#modifyButton");
  modifyButton.addEventListener("click", () => {
    displayEdit(editWindow);
    addWork();
  });

  // Hide by clicking outside the window, on the cross or pressing escape
  editWindow.addEventListener("click", function (event) {
    if (event.target === editWindow) {
      hideEdit(editWindow);
    }
  });
  const boutonClose = document.querySelector("#close");
  boutonClose.addEventListener("click", () => {
    hideEdit(editWindow);
  });
  window.addEventListener("keydown", function (e) {
    if (e.key === "Escape" || e.key === "Esc") {
      hideEdit(editWindow);
    }
  });
}

// These functions display add work function
function addWork() {
  const addButton = document.querySelector("#addPhoto");
  addButton.addEventListener("click", () => {
    returnButton.style.display = "flex";
    addPhotoEdit();
  });
}
function addPhotoEdit() {
  const editionTitle = document.querySelector("#editionTitle");
  editionTitle.innerText = "Ajout photo";
  addEdit.style.display = "flex";
  deleteEdit.style.display = "none";
  editReturn();
}

// This function returns to delete function
function editReturn() {
  returnButton.addEventListener("click", () => {
    displayReset();
    displayEdit(editWindow);
  });
}

// This function resets the display to edit function and clean the form and errors
function displayReset() {
  document.getElementById("form").reset();
  const preview = document.querySelector(".preview");
  if (preview) {
    preview.remove();
  }
  returnButton.style.display = "none";
  editionTitle.innerText = "Galerie photo";
  const error = document.querySelector("#errorMessage");
  if (error) {
    error.remove();
  }
}