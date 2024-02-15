// Variables
const url = "http://localhost:5678/api/";
const gallery = document.querySelector(".gallery");
const miniatures = document.querySelector(".miniatures");
const filterSection = document.querySelector(".filters");
const submitButton = document.querySelector(".validate");
const editWindow = document.querySelector(".edition");
const returnButton = document.querySelector("#return");
const addEdit = document.querySelector(".addEdit");
const deleteEdit = document.querySelector(".deleteEdit");
const header = document.querySelector("body");
const log = document.querySelector(".logButton");
const confirmationBox = document.querySelector(".choice");
const noButton = document.querySelector(".no");
const yesButton = document.querySelector(".yes");
const previewElement = document.querySelector(".addPhoto");
const closeButton = document.querySelector("#close");
const addButton = document.querySelector("#addPhoto");
const editionTitle = document.querySelector("#editionTitle");
const errors = document.querySelectorAll(".errorMessage");
const photo = document.getElementById("photo");
const title = document.getElementById("title");
const category = document.getElementById("category");
let photos = [];
let categories = [];
let token = "";

init();


// FUNCTIONS

// this function initialise the home page display and the functions
async function init() {
// Get works and categories  
try {
    const workResponse = await fetch(`${url}works`);
    photos = await workResponse.json();
    const categoriesResponse = await fetch(`${url}categories`);
    categories = await categoriesResponse.json();
    console.log(workResponse)
  } catch (error) {
    const errorText = `Affichage des projets impossible : ${error.statusText}`;
    errorMessage(errorText, "displayError");
    return
  }

  // Galleries creation
  generatePhotos(photos, gallery);
  generatePhotos(photos, miniatures);
  filters();

  // If a token is registered, home page modifications
  let valeurToken = window.sessionStorage.getItem("token");
  if (valeurToken !== null) {
    token = JSON.parse(valeurToken);
    editDisplay();
    initModalWindows();
    // Add or delete functions
    removeWork();
    previewPhoto();
    sendPhoto();
    // Delete token upon disconnection
    removeToken();

    // Event listeners on fields and checking fields
    photo.addEventListener("input", fillCheck);
    title.addEventListener("input", fillCheck);
    category.addEventListener("input", fillCheck);
    fillCheck();
  }
}

/**
 * This function creates the galleries
 * @param {object} photos : works
 * @param {string} location : location of the gallery (home page or modal window)
 */
function generatePhotos(photos, location) {
  for (let i = 0; i < photos.length; i++) {
    generatePhoto(photos[i], location);
  }
}
/**
 * This function add one work to galleries
 * @param {object} fichePhoto : photo id
 * @param {string} location : location of the gallery (home page or modal window)
 */
function generatePhoto(fichePhoto, location) {
  // tags creation
  const figure = document.createElement("figure");
  figure.classList = `figure${fichePhoto.id}`;
  figure.dataset.id = fichePhoto.id;
  const imagePhoto = document.createElement("img");
  imagePhoto.src = fichePhoto.imageUrl;
  imagePhoto.alt = fichePhoto.title;
  const trashButton = document.createElement("button");
  trashButton.classList = "trashButton";
  trashButton.dataset.id = fichePhoto.id;
  trashButton.innerHTML = "<i class='fa-solid fa-trash-can'></i>";
  const titrePhoto = document.createElement("figcaption");
  titrePhoto.innerText = fichePhoto.title;

  // elements connection
  location.appendChild(figure);
  figure.appendChild(imagePhoto);

  // display adapt (home page or modal window)
  if (location === gallery) {
    figure.appendChild(titrePhoto);
  } else {
    figure.append(trashButton);
  }
}

// This function create categories filters and form options creation
function filters() {
  const allFilter = document.createElement("button");
  allFilter.innerText = "Tous";
  allFilter.classList = "Tous";
  filterSection.appendChild(allFilter);
  // filters buttons
  for (let index = 0; index < categories.length; index++) {
    const ficheCategorie = categories[index];
    const filter = document.createElement("button");
    filter.innerText = ficheCategorie.name;
    filter.classList = `button${index}`;
    filterSection.appendChild(filter);

    // form options
    const option = document.createElement("option");
    option.value = index + 1;
    option.innerText = ficheCategorie.name;
    category.appendChild(option);

    // initialize filtration on click
    const button = document.querySelector(".button" + index);
    button.addEventListener("click", function () {
      const filteredPhotos = photos.filter(function (photos) {
        filterButton.forEach(function (button) {
          button.classList.remove("actived");
        });
        button.classList = "actived";
        return photos.categoryId === index + 1;
      });
      gallery.innerText = "";
      generatePhotos(filteredPhotos, gallery);
    });
  }

  // filter button "All" ("Tous")
  const allButton = document.querySelector(".Tous");
  const filterButton = document.querySelectorAll(".filters button");
  allButton.classList = "actived";
  allButton.addEventListener("click", function () {
    filterButton.forEach(function (button) {
      button.classList.remove("actived");
    });
    allButton.classList = "actived";
    gallery.innerText = "";
    generatePhotos(photos, gallery);
  });
}

// this function adapts the display of the home page in edit mode
function editDisplay() {
  // black bar
  const bar = document.createElement("div");
  bar.classList = "barreEdition";
  bar.innerHTML =
    "<div class='bouton-filtre1'><i class='fa-regular fa-pen-to-square'></i> Mode édition</div>";
  header.prepend(bar);

  // Edit button
  const projects = document.querySelector("#projects");
  const modify = document.createElement("div");
  modify.innerHTML =
    "<button id='modifyButton'><i class='fa-regular fa-pen-to-square'></i> modifier</button>";
  projects.appendChild(modify);

  // filters remove
  filterSection.innerHTML = "<br>";

  // login to logout
  log.classList = "logout";
  log.innerText = "logout";
}

// This function delete the token by clicking logout
function removeToken() {
  const logout = document.querySelector(".logout");
  logout.addEventListener("click", function () {
    sessionStorage.removeItem("token");
    window.location.href = "index.html";
  });
}

// This function delete a work by clicking on the trash button
function removeWork() {
  const deleteButtons = document.querySelectorAll(".trashButton");
  deleteButtons.forEach(function (button) {
    button.addEventListener("click", function (event) {
      event.preventDefault();
      // remove confirm
      displayEdit(confirmationBox);
      const id = button.dataset.id;
      yesButton.addEventListener("click", function () {
        hideEdit(confirmationBox);
        deleteWork(id);
      });
      noButton.addEventListener("click", function () {
        hideEdit(confirmationBox);
      });
    });
  });
}

// This function deletes the chosen work and updates the gallery display
async function deleteWork(i) {
    const deleteResponse = await fetch(`${url}works/${i}`, {
    method: "DELETE",
    headers: {
      "Content-type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
    if (!deleteResponse.ok) {
      const errorText = `Suppression impossible : ${deleteResponse.statusText}`;
      errorMessage(errorText, "modalError");
      return
      }
     const img = document.querySelectorAll(`.figure${i}`);
      img.forEach(function(image){
        image.remove(); 
    })
}

// This function previews photos before sending
function previewPhoto() {
  photo.addEventListener("change", preview);
  function preview({ target }) {
    const file = target.files[0];
    const src = URL.createObjectURL(file);
    const img = document.createElement("img");
    img.classList = "preview";
    img.src = src;
    previewElement.append(img);
  }
}

// This function checks the data before sending new works
async function sendPhoto() {
  submitButton.addEventListener("click", (event) => {
    event.preventDefault();
    try {
      formatCheck(photo.files[0]);
      sizeCheck(photo.files[0]);
      titleCheck(title.value);
      const formData = new FormData();
      formData.append("image", photo.files[0]);
      formData.append("title", title.value);
      formData.append("category", category.value);
      formPost(formData);
    } catch (error) {
      errorMessage(error, "modalError");
    }
  });
}

// This function sends the new work and add it to galleries
async function formPost(formData) {
    const addResponse = await fetch(`${url}works`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });
  if (!addResponse.ok) {
    const errorMsg = `Ajout impossible : ${addResponse.statusText}`;
      errorMessage(errorMsg, "modalError");
      return
  }
    // Get the new work and add it to galleries
    try {
      const reponse = await fetch(`${url}works`);
      photos = await reponse.json();
    } catch (error) {
      const errorMsg = `Ajout effectué, affichage impossible : ${error.statusText}`;
      errorMessage(errorMsg, "modalError");
      return
    }
    const ind = photos.length - 1;
    generatePhoto(photos[ind], gallery);
    generatePhoto(photos[ind], miniatures);

    // Restart delete function
    removeWork();
    closeButton.click();
}

// This function checks if the fields are filled
function fillCheck() {
  if (
    photo.files.length > 0 &&
    title.value.trim() !== "" &&
    category.value !== ""
  ) {
    submitButton.disabled = false;
  } else {
    submitButton.disabled = true;
  }
}

// These functions check size and format of the image
function sizeCheck(photo) {
  if (photo.size / 1024 > 4096) {
    throw new Error("La taille de l'image est trop grande.");
  }
}
function formatCheck(photo) {
  const types = ["image/jpg", "image/jpeg", "image/png"];
  if (!types.includes(photo.type)) {
    throw new Error("L'image n'est pas au bon format.");
  }
}
function titleCheck(title) {
  if (title.length < 4) {
    throw new Error("Le titre de la photo est trop court.");
  }
}

// This function displays error messages (once)
function errorMessage(error, errorLocation) {
  const errorDisplay = document.getElementById(errorLocation);
  errorDisplay.innerText = error;
}

// MODAL DISPLAY FUNCTIONS

/**
 * These functions display and hide modal windows
 * @param {*} window : edit window or confirmation window
 */
function displayEdit(window) {
  window.style.display = "flex";
  deleteEdit.style.display = "flex";
  addEdit.style.display = "none";
  window.removeAttribute("aria-hidden");
}
function hideEdit(window) {
  window.style.display = "none";
  window.setAttribute("aria-hidden", "true");
  displayReset();
}

// This function initializes the management of modal windows
function initModalWindows() {
  const modifyButton = document.querySelector("#modifyButton");
  modifyButton.addEventListener("click", () => {
    displayEdit(editWindow);
    addWork();
  });

  // Hide by clicking outside the window (on mousedown for only listening the click down), on close button or pressing escape
  editWindow.addEventListener("mousedown", function (event) {
    if (event.target === editWindow) {
      hideEdit(editWindow);
    }
  });
  closeButton.addEventListener("click", () => {
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
  addButton.addEventListener("click", () => {
    returnButton.style.display = "flex";
    addPhotoEdit();
  });
}
function addPhotoEdit() {
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
  for (let i = 0; i < errors.length; i++){
    errors[i].innerText = ""
  }
}
