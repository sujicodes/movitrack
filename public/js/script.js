
document.addEventListener("DOMContentLoaded", function() {

    function setCookie(name, value, days) {
        var expires = "";
        if (days) {
            var date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = "; expires=" + date.toUTCString();
        }
        document.cookie = name + "=" + (value || "") + expires + "; path=/";
    }

    // Function to get a cookie value
    function getCookie(name) {
        var nameEQ = name + "=";
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i];
            while (cookie.charAt(0) === ' ') {
                cookie = cookie.substring(1, cookie.length);
            }
            if (cookie.indexOf(nameEQ) === 0) {
                return cookie.substring(nameEQ.length, cookie.length);
            }
        }
        return null;
    }

    // Show the first tab by default
    var defaultTab = getCookie("selectedTab");

    if (defaultTab){
        defaultTab = document.getElementById(defaultTab);
    } else{
        defaultTab = document.querySelector(".tabcontent");
    }
    
    defaultTab.classList.add("active");
    setTimeout(() => {
        defaultTab.style.opacity = 1;
    }, 10);

    // Handle tab click event
    var tabLinks = document.querySelectorAll(".tablinks");
    tabLinks.forEach(function(tabLink) {
        tabLink.addEventListener("click", function() {
            var tabName = this.getAttribute("data-tab");
            var tabContents = document.querySelectorAll(".tabcontent");
            
            // Hide all tab contents and remove active class from tab links
            tabContents.forEach(function(tabContent) {
                tabContent.classList.remove("active");
                tabContent.style.opacity = 0; // Reset opacity
            });
            tabLinks.forEach(function(tabLink) {
                tabLink.classList.remove("active");
            });

            // Show the clicked tab content with fade effect and add active class to the clicked tab link
            var selectedTab = document.getElementById(tabName);
            selectedTab.classList.add("active");
            setTimeout(() => {
                selectedTab.style.opacity = 1;
            }, 10);
            this.classList.add("active");
            setCookie("selectedTab", tabName, 30);
        });
    });
});