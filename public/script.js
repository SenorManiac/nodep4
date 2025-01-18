document.addEventListener("DOMContentLoaded", () => {
    const password = document.getElementById("password");
    const confirmPassword = document.getElementById("confirm-password");
    const signUpButton = document.querySelector("form button[type='submit']");
    let passwordsMatch = false;
  
    confirmPassword.addEventListener("input", () => {
      if (password.value !== confirmPassword.value) {
        console.log("Passwords do not match");
        confirmPassword.setCustomValidity("Passwords do not match");
        confirmPassword.style.borderColor = "red";
        signUpButton.classList.add("disabled");
        passwordsMatch = false;
      } else {
        confirmPassword.setCustomValidity("");
        confirmPassword.style.borderColor = "black";
        passwordsMatch = true;
        signUpButton.classList.remove("disabled");
      }
    });
  
    signUpButton.disabled = true;
  
    document.querySelector("form").addEventListener("input", () => {
      signUpButton.disabled = !passwordsMatch;
    });
  });