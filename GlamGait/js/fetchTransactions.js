function loadHistory() {
  const tableBody = document.querySelector(".small-container.cart-page tbody");
  let userDetails = JSON.parse(localStorage.getItem("user")) || {};
  fetch("../Data/transaction/transaction.json")
    .then((response) => response.json())
    .then((transactions) => {
      const filteredTransactions = transactions.filter(
        (item) => item.buyer_id === parseInt(userDetails.id)
      );
      filteredTransactions.forEach((item) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>
             ${item.order_id}
            </td>
            <td> ${handleDate(item.transaction_time)}
            <td>$${item.transaction_price}</td>
        `;
        tableBody.appendChild(row);
      });
    });
}
const BuyerItems = [
  { text: "Products", link: "SearchProducts.html" },
  {text : "Purchase History",link:"PurchaseHistory.html"}
];

const SellerItems = [
  { text: "Add Product", link: "UploadItem.html" },
  { text: "Products", link: "SellingItems.html" },
];
function generateNavbar() {
  const navbar = document.getElementById("MenuItems");

  // Clear existing items
  navbar.innerHTML = "";
  if (localStorage.getItem("user")) {
    let userDetails = JSON.parse(localStorage.getItem("user"));
    console.log("userDetails", userDetails);
    let navItems = userDetails.type == "seller" ? SellerItems : BuyerItems;
    console.log("navItems", navItems);
    navItems.forEach((item) => {
      const li = document.createElement("li");
      const a = document.createElement("a");
      a.textContent = item.text;
      a.href = item.link;
      li.appendChild(a);
      navbar.appendChild(li);
    });
    const li = document.createElement("li");
    const btn = document.createElement("button");
    btn.classList.add("btn-outline-danger");
    btn.textContent = "LOGOUT";
    btn.onclick = (event) => handlelogout(event)
    li.appendChild(btn);
    navbar.appendChild(li);
  }
}
function handlelogout(e){
  e.preventDefault()
  localStorage.removeItem('user');
  localStorage.removeItem('cart');
  window.location="Login.html";
}

function handleDate(dateString) {
  const date = new Date(dateString);
  const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Add 1 to get the correct month (months are zero-based)
  const day = date.getDate().toString().padStart(2, "0");
  const year = date.getFullYear().toString();

  const formattedDate = `${month}/${day}/${year}`;
  return formattedDate;
}
window.onload = () => {
  let cartItems =  JSON.parse(localStorage.getItem("cart")) || []
  if (cartItems.length > 0) document.querySelector('.cart-badge').textContent = cartItems.length
  generateNavbar();
  loadHistory(false);
};
