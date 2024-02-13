import { initModalWindows, displayEdit, hideEdit } from "./modalDisplay.js";

import { errorMessage } from "./globals.js";

// Variables
import { url } from "./globals.js";
const gallery = document.querySelector(".gallery");
const miniatures = document.querySelector(".miniatures");
const filterSection = document.querySelector(".filters");
var photo = document.getElementById("photo");
var title = document.getElementById("title");
var category = document.getElementById("category");
const submitButton = document.querySelector(".valider");

// Get works and categories
let photos = [];
let categories = [];
try {
  const reponse = await fetch(`${url}works`);
  photos = await reponse.json();
} catch (error) {
  const errorText = `Affichage des projets impossible - ${error}`;
  errorMessage(errorText, "displayError");
}

// galleries creation
genererPhotos(photos, gallery);
genererPhotos(photos, miniatures);

// categories filters and form options creation
const cat = await fetch(`${url}categories`);
categories = await cat.json();
filters();

// If a token is registered, home page modifications
let valeurToken = window.sessionStorage.getItem("token");
const token = JSON.parse(valeurToken);
if (valeurToken) {
  editDisplay();
  initModalWindows();
  // add or delete functions
  removeWork();
  previewPhoto();
  envoiPhoto();
  // delete token upon disconnection
  suppressionToken();
}

// Event listeners on fields and checking fields
photo.addEventListener("input", fillCheck);
title.addEventListener("input", fillCheck);
category.addEventListener("input", fillCheck);
fillCheck();

// FUNCTIONS

/**
 * This function creates the galleries
 * @param {*} photos : works
 * @param {*} location : location of the gallery (home page or modal window)
 */
function genererPhotos(photos, location) {
  for (let i = 0; i < photos.length; i++) {
    genererPhoto(photos, location, i);
  }
}

function genererPhoto(photos, location, i) {
  const fichePhoto = photos[i];
  // tags creation
  const figure = document.createElement("figure");
  figure.classList = `figure${photos[i].id}`;
  figure.dataset.id = photos[i].id;
  const imagePhoto = document.createElement("img");
  imagePhoto.src = fichePhoto.imageUrl;
  imagePhoto.alt = fichePhoto.title;
  const trashButton = document.createElement("button");
  trashButton.classList = "trashButton";
  trashButton.dataset.id = photos[i].id;
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
  const filtreTous = document.createElement("button");
  filtreTous.innerText = "Tous";
  filtreTous.classList = "Tous";
  filterSection.appendChild(filtreTous);
  // filters buttons
  for (let index = 0; index < categories.length; index++) {
    const ficheCategorie = categories[index];
    const filtre = document.createElement("button");
    filtre.innerText = ficheCategorie.name;
    filtre.classList = `bouton${index}`;
    filterSection.appendChild(filtre);

    // form options
    const option = document.createElement("option");
    option.value = index + 1;
    option.innerText = ficheCategorie.name;
    category.appendChild(option);

    // initialize filtration on click
    const bouton = document.querySelector(".bouton" + index);
    bouton.addEventListener("click", function () {
      const photosFiltrees = photos.filter(function (photos) {
        filterButton.forEach(function (button) {
          button.classList.remove("actived");
        });
        bouton.classList = "actived";
        return photos.categoryId === index + 1;
      });
      gallery.innerText = "";
      genererPhotos(photosFiltrees, gallery);
    });
  }

  // filter button "All" ("Tous")
  const boutonTous = document.querySelector(".Tous");
  const filterButton = document.querySelectorAll(".filters button");
  boutonTous.classList = "actived";
  boutonTous.addEventListener("click", function () {
    filterButton.forEach((button) => {
      button.classList.remove("actived");
    });
    boutonTous.classList = "actived";
    gallery.innerText = "";
    genererPhotos(photos, gallery);
  });
}

// this function adapts the display of the home page in edit mode
function editDisplay() {
  // black bar
  let header = document.querySelector("body");
  let barre = document.createElement("div");
  barre.classList = "barreEdition";
  barre.innerHTML =
    "<div class='bouton-filtre1'><i class='fa-regular fa-pen-to-square'></i> Mode édition</div>";
  header.prepend(barre);

  // Edit button
  let projets = document.querySelector("#projets");
  let modifier = document.createElement("div");
  modifier.innerHTML =
    "<button id='modifyButton'><i class='fa-regular fa-pen-to-square'></i> modifier</button>";
  projets.appendChild(modifier);

  // filters remove
  filterSection.innerHTML = "<br>";

  // login to logout
  let log = document.querySelector(".boutonLog");
  log.classList = "logout";
  log.innerText = "logout";
}

// This function delete the token by clicking logout
function suppressionToken() {
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
      const confirmationBox = document.querySelector(".choice");
      displayEdit(confirmationBox);
      const id = button.dataset.id;
      const noButton = document.querySelector(".no");
      const yesButton = document.querySelector(".yes");
      yesButton.addEventListener("click", function(){
        hideEdit(confirmationBox);
        deleteWork(id);
      });
      noButton.addEventListener("click", function(){
        hideEdit(confirmationBox);
      });
    });
  });
}

// This function deletes the chosen work and updates the gallery display
function deleteWork(i) {
  fetch(`${url}works/${i}`, {
    method: "DELETE",
    headers: {
      "Content-type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  }).then((response) => {
    if (response.ok) {
      const img = document.querySelectorAll(`.figure${i}`);
      img.forEach((image) => {
        image.remove();
      });
    } else {
      const errorText = `Suppression impossible : ${response.statusText}`;
      errorMessage(errorText, "modalError");
    }
  });
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
    const previewElement = document.querySelector(".addPhoto");
    previewElement.append(img);
  }
}

// This function checks the data before sending new works
async function envoiPhoto() {
  const envoi = document.querySelector(".edition .valider");
  envoi.addEventListener("click", (event) => {
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
  await fetch(`${url}works`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  }).then(async (response) => {
    if (!response.ok) {
      const errorMsg = `Ajout impossible : ${response.statusText}`;
      errorMessage(errorMsg, "modalError");
    }

    // Get the new work and add it to galleries
    const reponse = await fetch(`${url}works`);
    const photos = await reponse.json();
    const ind = photos.length - 1;
    genererPhoto(photos, gallery, ind);
    genererPhoto(photos, miniatures, ind);

    // Restart delete function
    removeWork();
    document.querySelector("#close").click();
  });
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