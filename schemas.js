const BaseJoi = require("joi");
const sanitizeHtml = require("sanitize-html");

//creates an extension for joi using the sanitizeHtml package to remove html
const extension = (joi) => ({
  type: "string",
  base: joi.string(),
  messages: {
    "string.escapeHTML": "{{#label}} must not include HTML!",
  },
  rules: {
    escapeHTML: {
      validate(value, helpers) {
        const clean = sanitizeHtml(value, {
          allowedTags: [],
          allowedAttributes: {},
        });
        if (clean !== value)
          return helpers.error("string.escapeHTML", { value });
        return clean;
      },
    },
  },
});
const Joi = BaseJoi.extend(extension);

module.exports.campgroundSchema = Joi.object({
  //Defines a schema for validating req body before Mongoose
  campground: Joi.object({
    title: Joi.string().required().escapeHTML(),
    price: Joi.number().required().min(0),
    // image: Joi.string().required(),
    location: Joi.string().required().escapeHTML(),
    description: Joi.string().required().escapeHTML(),
  }).required(),
  deleteImages: Joi.array(),
});
//Defines a schema for validating req body of the form date of a review before Mongoose
module.exports.reviewSchema = Joi.object({
  review: Joi.object({
    rating: Joi.number().min(1).max(5).required(),
    body: Joi.string().required().escapeHTML(),
  }).required(),
});
