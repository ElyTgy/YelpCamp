const cities = require("./cities")
const Campground = require("../models/campgrounds")
const mongoose = require("mongoose");
const { places, descriptors } = require('./seedHelpers');

mongoose.connect("mongodb://localhost:27017/yelp-camp",{
    useNewUrlParser:true,
    useCreateIndex: true,
    useUnifiedTopology: true
})
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", ()=>{
    console.log("Database connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)];

async function seedDb()
{
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const camp = new Campground({
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            image: "https://source.unsplash.com/collection/483251/",
            description: `Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime mollitia,
            molestiae quas vel sint commodi repudiandae consequuntur voluptatum laborum
            numquam blanditiis harum quisquam eius sed odit fugiat iusto fuga praesentium
            optio, eaque rerum! Provident similique accusantium nemo autem. Veritatis
            obcaecati tenetur iure eius earum ut molestias architecto voluptate aliquam
            nihil, eveniet aliquid culpa officia aut! Impedit sit sunt quaerat, odit,
            tenetur error, harum nesciunt ipsum debitis quas aliquid. Reprehenderit,
            quia. Quo neque error repudiandae fuga? Ipsa laudantium molestias eos 
            sapiente officiis modi at sunt excepturi expedita sint? Sed quibusdam
            recusandae alias error harum maxime adipisci amet laborum.`,
            price: Math.floor(Math.random()*30)+10
        })
        await camp.save();
    }
}

seedDb().then(()=>{
    mongoose.connection.close();
})
