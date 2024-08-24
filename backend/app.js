const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

const uri =
  "mongodb+srv://namuradbaccha1234:lMBVRaqyTAamyeuQ@cluster0.lmfax.mongodb.net/";

const binSchema = new mongoose.Schema({
  binNumber: { type: String, required: true, unique: true },
  data: [
    {
      binLevel: { type: Number, required: true },
      timestamp: { type: Date, default: Date.now },
    },
  ],
});

const Bin = mongoose.model("Bin", binSchema);

const connectDb = async () => {
  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
    process.exit(1);
  }
};

connectDb();

app.post("/send-request", async (req, res) => {
  const { binNumber, binLevel } = req.body;

  if (binNumber && binLevel) {
    try {
      await Bin.findOneAndUpdate(
        { binNumber },
        { $push: { data: { binLevel } } },
        { upsert: true, new: true }
      );
      console.log(
        `Received request: Bin Number - ${binNumber}, Bin Level - ${binLevel}`
      );
      res.status(200).send("Request received and data updated successfully");
    } catch (error) {
      console.error("An error occurred while updating the data:", error);
      res.status(500).send("Internal Server Error");
    }
  } else {
    res.status(400).send("Invalid request");
  }
});

app.get("/bin-data/:binNumber", async (req, res) => {
  const { binNumber } = req.params;
  try {
    const bin = await Bin.findOne({ binNumber });
    if (bin) {
      res.status(200).json(bin.data);
    } else {
      res.status(404).send("Bin not found");
    }
  } catch (error) {
    console.error("An error occurred while retrieving the data:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/bin-data", async (req, res) => {
  try {
    const bins = await Bin.find({});
    if (bins.length > 0) {
      res.status(200).json(bins);
    } else {
      res.status(404).send("No bins found");
    }
  } catch (error) {
    console.error("An error occurred while retrieving the data:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
