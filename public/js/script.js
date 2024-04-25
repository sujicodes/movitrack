document.addEventListener("DOMContentLoaded", function() {
  // Show the first tab by default
  document.querySelector(".tabcontent").style.display = "block";
  document.querySelector(".tablinks").classList.add("active");

  // Handle tab click event
  var tabLinks = document.querySelectorAll(".tablinks");
  tabLinks.forEach(function(tabLink) {
      tabLink.addEventListener("click", function() {
          var tabName = this.getAttribute("data-tab");
          var tabContents = document.querySelectorAll(".tabcontent");
          
          // Hide all tab contents and remove active class from tab links
          tabContents.forEach(function(tabContent) {
              tabContent.style.display = "none";
          });
          tabLinks.forEach(function(tabLink) {
              tabLink.classList.remove("active");
          });

          // Show the clicked tab content and add active class to the clicked tab link
          document.getElementById(tabName).style.display = "block";
          this.classList.add("active");
      });
  });
});