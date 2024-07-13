if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const mongoose = require("mongoose");
const axios = require("axios");
const Campground = require("../models/campground");
const cities = require("./cities");
const { places, descriptors } = require("./seedHelpers");
const { cloudinary } = require("../cloudinary");

mongoose.connect("mongodb://127.0.0.1:27017/yelp-camp");

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => console.log("Database connected"));

const seedImg = async () => {
  //Using the Unsplash API, a request is made to get a random image with the query of camp that is returned
  try {
    const config = {
      params: {
        client_id: `${process.env.UNSPLASH_ACCESS_KEY}`,
        query: "Camp",
      },
    };
    const req = await axios.get(
      "https://api.unsplash.com//photos/random",
      config
    );
    const img = await uploadImage(req.data.urls.small);
    return img;
  } catch (error) {
    console.log(error);
  }
};
//Uploads image on Cloudinary and returns object containing url and filename
const uploadImage = async (imageUrl) => {
  try {
    const uploadResult = await cloudinary.uploader.upload(imageUrl, {
      folder: "YelpCamp",
    });
    const image = {
      url: uploadResult.url,
      filename: uploadResult.original_filename,
    };
    return image;
  } catch (error) {
    console.log(error);
  }
};

const randomElement = (array) =>
  array[Math.floor(Math.random() * array.length)]; //Generates random element from the array passed

const seedDB = async () => {
  for (let i = 0; i < 50; i++) {
    const num = Math.floor(Math.random() * 1000); //generates random num from 0-999
    const image = await seedImg();
    const camp = new Campground({
      title: `${randomElement(descriptors)} ${randomElement(places)}`,
      images: [image], //Random Camp image from Unsplash API
      price: Math.floor(Math.random() * 20 + 10), //random price between range 10-29
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Laboriosam dolorum quo magnam maiores labore dicta rem illo dignissimos ipsum qui numquam atque, omnis temporibus nostrum id. Quae, iure. Nam, quaerat.",
      location: `${cities[num].city}, ${cities[num].state}`, //random num is used to as an index to select a city and state
      author: "6682fbabff4c84197e62c745",
      geometry: {
        type: "Point",
        coordinates: [cities[num].longitude, cities[num].latitude], //passes the longitude and latitude from the city selected
      },
    });
    await camp.save();
  }
};

seedDB().then(() => mongoose.connection.close()); //Once the database has been populated, close the connection
