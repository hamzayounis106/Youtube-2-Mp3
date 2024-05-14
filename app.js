// //Importing the  packages
const axios = require("axios");
const express = require("express");
const fetch = require("node-fetch");
require("dotenv").config();

//Creating the server
const app = express();

//Const port
const PORT = process.env.PORT || 3000;

//Set Template Engine
app.set("view engine", "ejs");
app.use(express.static("public"));

//Parse HTML data from the POST request : This line tells Express to parse incoming requests that are URL-encoded. This is necessary when you're sending data from a client-side form to the server
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(express.json());

//Routing
app.get("/", (req, res) => {
  res.render("index");
});
app.post("/convert-mp3", async (req, res) => {
  const videoURL = req.body.videoUrl;
  const videoURLEntered = videoURL.split("v=")[1];
  const ampersandPosition = videoURLEntered.indexOf("&");
  if (ampersandPosition != -1) {
    videoURLEntered = videoURLEntered.substring(0, ampersandPosition);
    console.log(videoURLEntered);
  }
  if (
    videoURLEntered === undefined ||
    videoURLEntered === "" ||
    videoURLEntered === null
  ) {
    return res.render("index", {
      success: false,
      message: "Please enter a URL",
    });
  } else {
    try {
      const options = {
        method: "GET",
        url: "https://youtube-mp36.p.rapidapi.com/dl",
        params: { id: videoURLEntered },
        headers: {
          "x-rapidapi-key": process.env.API_KEY,
          "x-rapidapi-host": process.env.API_HOST,
        },
      };

      const response = await axios.request(options);
      const result = response.data;
      console.log(result);
      if (result.status === "ok") {
        console.log("OK");
        return res.render("index", {
          success: true,
          songLink: result.link,
          title_video: result.title,
          fileSize: result.filesize,
          duration: result.duration,
        });
      } else {
        console.log("False");
        return res.render("index", {
          success: false,
          message: result.msg,
        });
      }
    } catch (error) {
      console.error(error);
    }
  }
});

//Listen port
app.listen(PORT, () => {
  console.log(`Server is listening at the port ${PORT}`);
});
