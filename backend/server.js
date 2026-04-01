const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const authRoutes = require("./routes/authRoutes");
const petRoutes = require("./routes/petRoutes");
const registrationRoutes = require("./routes/registrationRoutes");
const seedPets = require("./utils/seedPets");

const app = express();

app.use(cors());
app.use(express.json({ limit: "12mb" }));

app.use("/api/auth", authRoutes);
app.use("/api/pets", petRoutes);
app.use("/api/registrations", registrationRoutes);

mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("MongoDB connected");
    await seedPets();

    app.listen(process.env.PORT, () => {
      console.log(`Server running on port ${process.env.PORT}`);
    });
  })
  .catch((err) => console.log(err));
