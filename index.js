require("dotenv").config();
const express = require("express");
const app = express();
const multer = require("multer");
const upload = multer({ dest: "uploads" });
const mongoose = require("mongoose");
const port = process.env.PORT || 3000;
const File = require("./models/FileModel");
const bcrypt = require("bcrypt");

app.use(express.json());
app.use(express.urlencoded({ extended: true })); // for reading form data
mongoose.connect(process.env.DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("index");
});

app.post("/upload", upload.single("file"), async (req, res) => {
  const fileData = {
    path: req.file.path,
    originalName: req.file.originalname,
  };
  if (req.body.password) {
    fileData.password = await bcrypt.hash(req.body.password, 8);
  }
  const file = new File(fileData);
  console.log(file);
  await file.save();
  res.render("index", { fileLink: `${req.headers.origin}/file/${file.id}` });
});

app.get("/file/:id", download );
app.post("/file/:id", download );

app.listen(port, () => {
  console.log(`server started on ${port}`);
});


async function download (req, res)  {
    const id = req.params.id;
    const file = await File.findOne({ id });
    if (file.password) {
      if (req.body.password==null) {
        res.render("password");
        return; // so that this get call ends here
      }
      if(!await bcrypt.compare(req.body.password,file.password)){
          res.render("password",{error:true})
      }
    }
  
    file.downloadCount++;
    await file.save();
    res.download(file.path, file.originalName);
    
  }