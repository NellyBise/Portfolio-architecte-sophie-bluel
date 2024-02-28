// Variables
const url = "http://localhost:5678/api/";
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
    }else{
      const errorText = "email ou mot de passe non valide";
      errorMessage(errorText, "loginError")
    }
  } catch (error) {
    const errorText = "Connexion impossible : pas de réponse";
    errorMessage(errorText, "loginError") 
  }
}

// This function saves token to session storage
function enregistrementToken(dataReponse) {
  const token = dataReponse.token;
  const valeurToken = JSON.stringify(token);
  window.sessionStorage.setItem("token", valeurToken);
}

// This function displays error messages (once)
function errorMessage(error, errorLocation) {
  const errorDisplay = document.getElementById(errorLocation)
  errorDisplay.innerText = error;
}