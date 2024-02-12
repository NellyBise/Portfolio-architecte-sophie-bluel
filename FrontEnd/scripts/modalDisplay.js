// Variables
const editWindow = document.querySelector(".edition");
const returnButton = document.querySelector(".return");
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
  returnButton.style.display = "none";
  formReset();
  // delete error messages
  const error = document.querySelector("#errorMessage");
  if (error) {
    error.remove();
  }
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
  const boutonClose = document.querySelector(".edition .close");
  boutonClose.addEventListener("click", () => {
    hideEdit(editWindow);
  });
  window.addEventListener("keydown", function (e) {
    if (e.key === "Escape" || e.key === "Esc") {
      hideEdit(editWindow);
    }
  });
}

// this function displays add work window
function addWork() {
  const boutonAjout = document.querySelector("#addPhoto");
  boutonAjout.addEventListener("click", () => {
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

function editReturn() {
  returnButton.addEventListener("click", () => {
    formReset();
    displayEdit(editWindow);
    returnButton.style.display = "none";
    addWork();
  });
}

// This function resets the form
function formReset() {
  document.getElementById("form").reset();
  const preview = document.querySelector(".preview");
  if (preview) {
    preview.remove();
  }
}