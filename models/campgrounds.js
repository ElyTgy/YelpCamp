const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CampGroundSchema = new Schema({
    title: String,
    price: {type:Number,min:0},
    description: String,
    location: String,
    image: String,
    reviews:[
        {
            type: Schema.Types.ObjectId,
            ref: "Review"
        }
    ]
})

module.exports = mongoose.model('Campground', CampGroundSchema)
