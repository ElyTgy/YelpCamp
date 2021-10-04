const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");


const UserSchema = new Schema({
    email:{
        type: String,
        required: [true, "Email is required"],
        unique: true,
        trim:true,
        lowercase:true,
        validate:{
            validator: function(v){
                return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
            },
            message: "Please enter a valid email"
        }
    }
})

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);
