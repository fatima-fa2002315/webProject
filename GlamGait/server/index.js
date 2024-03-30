const express = require("express");
const fs = require("fs").promises;
const cors = require("cors");
const multer = require("multer");

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cors());

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "../images");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage: storage });

function generateRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

app.post("/addtransaction", async (req, res) => {
  const { data } = req.body;
  console.log("addTransaction",data)

  try {
    const existingData = await fs.readFile("../Data/transaction/transaction.json", "utf8");
    const jsonData = JSON.parse(existingData);
    jsonData.push({
      ...data,
      transaction_time: new Date(),
      order_id: `ODR${generateRandomNumber(data.metadata.length, new Date().getTime())}`,
    });


    const existingUsers = await fs.readFile("../Data/users/user.json", "utf8");
    let allUsers = JSON.parse(existingUsers);
    let filteredUsers = allUsers.filter(user => user.id != data.buyer_id);
    let currentUser = allUsers.find(user => user.id == data.buyer_id);
    let currentMoney = parseInt(currentUser.wallet);
    currentMoney -= parseInt(data.transaction_price);
    currentUser.wallet = currentMoney;
    filteredUsers.push(currentUser);


    await fs.writeFile("../Data/users/user.json", JSON.stringify(filteredUsers,null,2));

    await fs.writeFile("../Data/transaction/transaction.json", JSON.stringify(jsonData, null, 2));

    console.log("Data appended to files successfully");
    res.status(200).send("Data appended to files successfully");
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/uploadProduct", upload.single("image"), (req, res) => {
  const { name, rating, description, price, seller_id } = req.body;
  const imagePath = req.file ? req.file.path.replace(/\\/g, "/") : null;
  const productData = {
    name,
    rating,
    description,
    price,
    image: imagePath,
    seller_id,
    id: generateRandomNumber(seller_id, new Date().getTime()),
  };

  try {
    fs.readFile("../Data/products/products.json", "utf8")
      .then((existingData) => {
        const jsonData = JSON.parse(existingData);

        jsonData.push(productData);

        const updatedData = JSON.stringify(jsonData, null, 2);
        return fs.writeFile("../Data/products/products.json", updatedData);
      })
      .then(() => {
        console.log("Data appended to file successfully");
        res.status(200).json({ message: "Data appended to file successfully" });
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  } catch (error) {
    console.error("Error writing to file:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
