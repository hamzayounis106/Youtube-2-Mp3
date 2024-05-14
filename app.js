//Importing the packages
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
  let videoURLEntered = "";

  // Check if the URL contains "watch?v=" or just the video ID
  if (videoURL.includes("watch?v=")) {
    // Extract video ID from URL with "watch?v="
    videoURLEntered = videoURL.split("watch?v=")[1].split("&")[0];
  } else {
    // Extract video ID directly from the URL
    videoURLEntered = videoURL.split("/").pop().split("?")[0];
  }

  if (!videoURLEntered) {
    return res.render("index", {
      success: false,
      message: "Please enter a valid YouTube video URL",
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

      if (result.status === "ok") {
        return res.render("index", {
          success: true,
          songLink: result.link,
          title_video: result.title,
          fileSize: result.filesize,
          duration: result.duration,
        });
      } else {
        return res.render("index", {
          success: false,
          message: result.msg,
        });
      }
    } catch (error) {
      console.error(error);
      return res.render("index", {
        success: false,
        message: "An error occurred while processing the request.",
      });
    }
  }
});

//Listen port
app.listen(PORT, () => {
  console.log(`Server is listening at the port ${PORT}`);
});
