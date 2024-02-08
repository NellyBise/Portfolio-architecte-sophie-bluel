import {
  initAddEventListenerGestion,
  afficherGestion,
  cacherGestion,
} from "./modalDisplay.js";

export const url ="http://localhost:5678/api/";

//récupération des photos et catégories
let photos = [];
let categories = [];
try {
  const reponse = await fetch(url+"works");
  photos = await reponse.json();
} catch (error) {
  const affichageErreur = document.createElement("p");
  affichageErreur.innerText = "Affichage des projets impossible - " + error;
  affichageErreur.id = "erreurMessage"
  document.querySelector(".filtres").append(affichageErreur);
}

//Création de la galerie projets et de celle du mode édition
const gallery = document.querySelector(".gallery");
const miniatures = document.querySelector(".miniatures");
genererPhotos(photos, gallery);
genererPhotos(photos, miniatures);

//Création des boutons filtres et des option du formulaire d'ajout
const cat = await fetch(url+"categories");
categories = await cat.json();
filtres();

//si un token est enregistré, modification de la page d'accueil (barre noire, bouton modifier et logout)
let valeurToken = window.sessionStorage.getItem("token");
const token = JSON.parse(valeurToken);
if (valeurToken) {
  pageEdition();
  initAddEventListenerGestion();
  //appel des fonctions de supression ou ajout des photos
  suppression();
  previewPhoto();
  envoiPhoto();
  //suppression du token si déconnection
  suppressionToken();
}


// FONCTIONS UTILISEES

/**
 * Fonction pour générer les galeries de photos
 * @param {*} photos
 * @param {*} location localisation de la galerie : accueil ou fenêtre modale
 */
function genererPhotos(photos, location) {
  for (let i = 0; i < photos.length; i++) {
    const fichePhoto = photos[i];

    //création des balises
    const figure = document.createElement("figure");
    figure.classList = "figure" + photos[i].id;
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

    //rattachement des éléments
    location.appendChild(figure);
    figure.appendChild(imagePhoto);

    //adaptation affichage accueil ou fenêtre modale
    if (location === gallery) {
      figure.appendChild(titrePhoto);
    } else {
      figure.append(trashButton);
    }
  }
}

//fonction pour rafraîchir les affichage des galeries
async function galleryRefresh(photos) {
  const reponse = await fetch(url+"works");
  photos = await reponse.json();
  const gallery = document.querySelector(".gallery");
  document.querySelector(".gallery").innerHTML = "";
  genererPhotos(photos, gallery);
  const miniatures = document.querySelector(".miniatures");
  document.querySelector(".miniatures").innerHTML = "";
  genererPhotos(photos, miniatures);
  //relancement de la fonction suppression sur la nouvelle galerie
  suppression();
}

//fonction pour créer les filtres et la liste de choix en mode édition en fonction de la liste de catégories
function filtres() {
  const filtres = document.querySelector(".filtres");
  const filtreTous = document.createElement("button");
  const select = document.querySelector("#categorie");
  filtreTous.innerText = "Tous";
  filtreTous.classList = "Tous";
  filtres.appendChild(filtreTous);
  for (let index = 0; index < categories.length; index++) {
    const ficheCategorie = categories[index];

    //création des boutons filtres
    const filtre = document.createElement("button");
    filtre.innerText = ficheCategorie.name;
    filtre.classList = "bouton" + index;
    filtres.appendChild(filtre);

    //création des valeurs de sélection pour l'ajout de photo
    const option = document.createElement("option");
    option.value = index + 1;
    option.innerText = ficheCategorie.name;
    select.appendChild(option);

    //filtration au clic sur les boutons
    const bouton = document.querySelector(".bouton" + index);
    bouton.addEventListener("click", function () {
      const photosFiltrees = photos.filter(function (photos) {
        const boutonFiltre = document.querySelectorAll(".filtres button");
        boutonFiltre.forEach(function (boutonF) {
          boutonF.classList.remove("actived");
        });
        bouton.classList = "actived";
        return photos.categoryId === index + 1;
      });
      document.querySelector(".gallery").innerHTML = "";
      genererPhotos(photosFiltrees, gallery);
    });
  }

  //création du bouton filtre "Tous"
  const boutonTous = document.querySelector(".Tous");
  boutonTous.classList = "actived";
  boutonTous.addEventListener("click", function () {
    const boutonFiltre = document.querySelectorAll(".filtres button");
    boutonFiltre.forEach(function (boutonF) {
      boutonF.classList.remove("actived");
    });
    boutonTous.classList = "actived";
    document.querySelector(".gallery").innerHTML = "";
    genererPhotos(photos, gallery);
  });
}

/**
 * Fonction pour adapter l'affichage de la page d'accueil en mode édition
 */
function pageEdition() {
  //barre noire
  let header = document.querySelector("body");
  let barre = document.createElement("div");
  barre.classList = "barreEdition";
  barre.innerHTML =
    "<button class='bouton-filtre1'><i class='fa-regular fa-pen-to-square'></i> Mode édition</button>";
  header.prepend(barre);

  //bouton Modifier
  let projets = document.querySelector("#projets");
  let modifier = document.createElement("div");
  modifier.innerHTML =
    "<button id='boutonModifier'><i class='fa-regular fa-pen-to-square'></i> modifier</button>";
  projets.appendChild(modifier);

  //suppression des filtres
  document.querySelector(".filtres").innerHTML = "<br>";

  // changement de login en logout
  let log = document.querySelector(".boutonLog");
  log.classList = "logout";
  log.innerText = "logout";
}

//Fonction pour supprimer le token du local storage si clic sur logout
function suppressionToken() {
  const logout = document.querySelector(".logout");
  logout.addEventListener("click", function () {
    sessionStorage.removeItem("token");
    window.location.href = "index.html";
  });
}

// Fonction pour supprimer une photo en cliquant sur la corbeille
function suppression() {
  const deleteButtons = document.querySelectorAll(".trashButton");
  deleteButtons.forEach((button) => {
    button.addEventListener("click", function (event) {
      event.preventDefault();
      //demander confirmation de la suppression
      const confirmationBox = document.querySelector(".supprimer");
      afficherGestion(confirmationBox);
      const id = button.dataset.id;
      const noButton = document.querySelector(".no");
      const yesButton = document.querySelector(".yes");
      yesButton.addEventListener("click", handleConfirmation);
      noButton.addEventListener("click", handleCancellation);

      // Gestion de la confirmation puis supression des gestionnaires d'événements
      function handleConfirmation() {
        cacherGestion(confirmationBox);
        supprimer(id);
        yesButton.removeEventListener("click", handleConfirmation);
        noButton.removeEventListener("click", handleCancellation);
      }
      // Gestion de l'annulation puis supression des gestionnaires d'événements
      function handleCancellation() {
        cacherGestion(confirmationBox);
        yesButton.removeEventListener("click", handleConfirmation);
        noButton.removeEventListener("click", handleCancellation);
      }
    });
  });
}

// fonction pour supprimer la photo demandée et actualiser l'affichage des 2 galeries
function supprimer(i) {
  fetch(url+"works/" + i, {
    method: "DELETE",
    headers: {
      "Content-type": "application/json",
      Authorization: "Bearer " + token,
    },
  }).then((response) => {
    if (response.ok) {
      //maj galeries
      galleryRefresh(photos);
    } else {
      const affichageErreur = document.createElement("p");
      affichageErreur.innerText =
        "Suppression impossible : " + response.statusText;
      affichageErreur.id = "erreurMessage";
      document.querySelector(".gestion h3").append(affichageErreur);
    }
  });
}

//Fonction de prévisualisation photo avant envoi
function previewPhoto() {
  const photoInput = document.getElementById("photo");
  photoInput.addEventListener("change", preview);
  function preview({ target }) {
    const file = target.files[0];
    const src = URL.createObjectURL(file);
    const img = document.createElement("img");
    img.classList = "preview";
    img.src = src;
    const previewElement = document.querySelector(".ajoutPhoto");
    previewElement.append(img);
  }
}

//fonction pour ajouter une photo
async function envoiPhoto() {
  const envoi = document.querySelector(".fenetreAjout .valider");
  envoi.addEventListener("click", (event) => {
    event.preventDefault();
    try {
      const photo = document.getElementById("photo").files[0];
      formatCheck(photo);
      sizeCheck(photo);
      const formData = new FormData();
      formData.append("image", photo);
      formData.append("title", titre);
      formData.append("category", categorie);

      formPost(formData);
    } catch (error) {
      //affichage de l'erreur
      ErrorMessage(error);
    }
  });
}

// Fonction pour envoyer la photo et mettre à jour l'&affichage des galeries
async function formPost(formData) {
  await fetch(url+"works", {
    method: "POST",
    headers: {
      Authorization: "Bearer " + token,
    },
    body: formData,
  }).then((response) => {
    if (response.ok) {
      //maj galeries
      galleryRefresh(photos);
      document.querySelector(".retour").click();
    } else {
      //affichage de l'erreur
      const erreurMsg = "Ajout impossible : " + response.statusText;
      ErrorMessage(erreurMsg);
    }
  });
}

//fonction d'activation du bouton valider
var formulaire = document.getElementById("form");
var champ1 = document.getElementById("photo");
var champ2 = document.getElementById("titre");
var champ3 = document.getElementById("categorie");
var boutonSubmit = document.querySelector(".valider");

// Fonction pour vérifier si les champs sont remplis
function verifierChampsRemplis() {
  if (champ1.files.length > 0 && champ2.value.trim() !== "" && champ3.value !== "") {
    boutonSubmit.disabled = false;
  } else {
    boutonSubmit.disabled = true;
  }
}

// Ajouter des écouteurs d'événements pour vérifier les champs lorsqu'ils sont modifiés
champ1.addEventListener('input', verifierChampsRemplis);
champ2.addEventListener('input', verifierChampsRemplis);
champ3.addEventListener('input', verifierChampsRemplis);
// Vérifier les champs au chargement de la page
verifierChampsRemplis();

//fonctions de vérification de l'image
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

//Fonction pour afficher les erreurs dans l'ajout de photo
function ErrorMessage(erreur) {
  const erreurAjout = document.querySelector(".erreurAjout");
  if (!erreurAjout) {
    const affichageErreur = document.createElement("p");
    affichageErreur.innerText = erreur;
    affichageErreur.id = "erreurMessage"
    document.querySelector(".fenetreAjout h3").append(affichageErreur);
  }
  erreurAjout.innerText = erreur;
}
