document.addEventListener("DOMContentLoaded", function () {
    const toggleBtn = document.getElementById("toggleBtn");
    const formContainer = document.getElementById("formContainer");
  
    // Hide the form initially
  
    // Toggle form visibility when the button is clicked
    toggleBtn.addEventListener("click", function () {
        formContainer.classList.toggle("visible");
  });
});
