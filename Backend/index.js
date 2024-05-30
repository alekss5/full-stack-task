const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const multer = require("multer");
const Photo = require("./models/Photo");
const fs = require("fs");
const path = require("path");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose
  .connect(
    "mongodb+srv://Aleksandar:5505667Sa@cluster0.zhgnpyg.mongodb.net/photos?retryWrites=true&w=majority"
  )
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "photos/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });

app.post("/photos", upload.single("photo"), async (req, res) => {
  try {
    const newPhoto = new Photo({
      path: req.file.path,
      title: req.body.title,
      description: req.body.description,
    });
    const savedPhoto = await newPhoto.save();
    res.status(201).json(savedPhoto);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/photos', async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = 6;
      const photos = await Photo.find()
        .skip((page - 1) * limit)
        .limit(limit);
      res.status(200).json(photos);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

app.get("/photos/:id", (req, res) => {
  const photoId = req.params.id;
  const photoPath = path.join(__dirname, "photos", photoId);

  res.sendFile(photoPath, (err) => {
    if (err) {
      return res.status(404).json({ error: "Photo not found" });
    }
  });
});

app.put("/photos/:id", async (req, res) => {
  try {
    const updatedPhoto = await Photo.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedPhoto)
      return res.status(404).json({ error: "Photo not found" });

    res.status(200).json(updatedPhoto);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/photos/:id", async (req, res) => {
  try {
    const photo = await Photo.findById(req.params.id);

    const photoPath = path.join(__dirname, photo.path);
    fs.unlink(photoPath, (err) => {
      if (err) {
        return res.status(500).json({ error: "Failed to delete photo file" });
      }
    });
    await Photo.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "Photo deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(3001, () => {
  console.log("server running");
});
