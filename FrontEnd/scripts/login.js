import { errorMessage } from "./globals.js";

// Variables
import { url } from "./globals.js";
const login = document.querySelector("#loginForm");

//EventListener du login
login.addEventListener("submit", (event) => {
  event.preventDefault();
  loginManagement();
});

// FUNCTIONS

// This function manages the connection
async function loginManagement() {
  let email = document.getElementById("email").value;
  let password = document.getElementById("password").value;

  // Sending ids
  try {
    const reponse = await fetch(`${url}users/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    });
    // Saving token and home page return or error message
    const dataReponse = await reponse.json();
    if (reponse.ok) {
      enregistrementToken(dataReponse);
      window.location.href = "index.html";
    } else if (reponse.status === 404) {
      const errorText = "L'email n'est pas valide.";
      errorMessage(errorText, "loginError") 
    }else{
      const errorText = "Le mot de passe n'est pas valide.";
      errorMessage(errorText, "loginError")
    }
  } catch (error) {
    const errorText = "Connexion impossible : pas de réponse.";
    errorMessage(errorText, "loginError") 
  }
}

// This function saves token to session storage
function enregistrementToken(dataReponse) {
  const token = dataReponse.token;
  const valeurToken = JSON.stringify(token);
  window.sessionStorage.setItem("token", valeurToken);
}
