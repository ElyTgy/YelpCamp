const Joi = require("joi");

module.exports.campgroundJoiSchema =  Joi.object({
    campground:Joi.object({
        title:Joi.string().required(),
        price: Joi.number().required().min(0),
        description: Joi.string(),
        location: Joi.string().required(),
        image: Joi.string().required()
    }).required()
});


module.exports.reviewJoiSchema = Joi.object({
    review: Joi.object({
        rating:Joi.number().required(),
        body:Joi.string().required()
    }).required()
})
