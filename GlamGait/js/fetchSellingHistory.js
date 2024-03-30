function appendProducts(products, productContainer) {
    products.forEach((product, index) => {
      if (index % 3 === 0) {
        const row = document.createElement("div");
        row.classList.add("row");
        productContainer.appendChild(row);
      }
  
      const productDiv = document.createElement("div");
      productDiv.classList.add("col-4");
  
      const link = document.createElement("a")
      const image = document.createElement("img");
      image.src = product.image;
      link.appendChild(image)
      link.href = `SellingDetails.html?q=${product.id}`;

  
  
      const heading = document.createElement("h4");
      heading.textContent = product.name;
  
      const ratingDiv = document.createElement("div");
      ratingDiv.classList.add("rating");
      for (let i = 0; i < 5; i++) {
        const star = document.createElement("i");
        if (i < product.rating) {
          star.classList.add("fa", "fa-star");
        } else {
          star.classList.add("fa", "fa-star-o");
        }
        ratingDiv.appendChild(star);
      }
  
      const price = document.createElement("p");
      price.textContent = product.price;
  
      productDiv.appendChild(link);
      productDiv.appendChild(heading);
      productDiv.appendChild(ratingDiv);
      productDiv.appendChild(price);
  
      const currentRow = productContainer.lastElementChild;
      currentRow.appendChild(productDiv);
    });
  }
  
  function loadProducts() {
    let userDetails =  JSON.parse(localStorage.getItem('user'))
    fetch("../Data/transaction/transaction.json").then((response) => response.json()).then((transactions) => {
        fetch("../Data/products/products.json")
        .then((response) => response.json())
        .then((products) => {
          const productContainer = document.getElementById("productContainer");
          let userTransactions = transactions.filter((t)=>t.sellerID.includes(userDetails.id))
          let metaData =[] 
          userTransactions.map((tx)=>{
              tx.metadata.map((m)=>{
                  metaData.push(m.product_id)
                })
            })
            let userProducts = products.filter((prod)=>prod.seller_id == userDetails.id  && metaData.includes(prod.id))
            console.log("userPord",userProducts)
          appendProducts(userProducts, productContainer);
          // Loop through products
        })
    
        .catch((error) => console.error("Error loading products:", error));
    })
   
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
  
  window.onload = () => {
    generateNavbar();
    loadProducts();
  };
  