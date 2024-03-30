var MenuItems = document.getElementById("MenuItems");
MenuItems.style.maxHeight = "0px";
function menutoggle() {
  if (MenuItems.style.maxHeight == "0px") {
    MenuItems.style.maxHeight = "200px";
  } else {
    MenuItems.style.maxHeight = "0px";
  }
}
var LoginForm = document.getElementById("LoginForm");
var Indicator = document.getElementById("Indicator");
function login() {
  RegForm.style.transform = "translatex(300px)";
  LoginForm.style.transform = "translatex(300px)";
  Indicator.style.transform = "translate(0px)";
}

function authUser(e) {
  e.preventDefault();
  let username = document.getElementById("username").value;
  let password = document.getElementById("password").value;
  if (username && password) {
    fetch("../Data/users/user.json")
      .then((response) => response.json())
      .then((data) => {
        let loggedInUser = data.find(
          (user) => user.username === username && user.password === password
        );
        if (loggedInUser) {
          console.log("loggedIn", loggedInUser);
          localStorage.setItem("user", JSON.stringify(loggedInUser));
          let firstPage = loggedInUser.type == 'buyer' ? 'SearchProducts.html' : 'SellingItems.html'
          window.location.href = firstPage;
        } else {
          alert("Incorrect username or password. Please try again.");
        }
      })
      .catch((error) => console.error("Error fetching data:", error));
  }
}

