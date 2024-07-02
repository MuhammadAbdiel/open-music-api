const Joi = require("joi");

const routes = (handler) => [
  {
    method: "POST",
    path: "/users",
    handler: handler.postUserHandler,
    options: {
      description: "Add a new user",
      notes: "Registers a new user to the system",
      tags: ["api", "users"],
      validate: {
        payload: Joi.object({
          username: Joi.string()
            .required()
            .description("Unique username for the user"),
          password: Joi.string()
            .required()
            .description("Password for the user"),
          fullname: Joi.string()
            .required()
            .description("Full name of the user"),
        }).label("Post-users-payload"),
      },
      response: {
        status: {
          201: Joi.object({
            status: Joi.string().valid("success").required(),
            message: Joi.string().required(),
            data: Joi.object({
              userId: Joi.string().required(),
            }).required(),
          }).label("Post-users-response"),
        },
      },
    },
  },
  {
    method: "GET",
    path: "/users/{id}",
    handler: handler.getUserByIdHandler,
    options: {
      description: "Get user by ID",
      notes: "Fetches user details by user ID",
      tags: ["api", "users"],
      validate: {
        params: Joi.object({
          id: Joi.string().required().description("User ID"),
        }).label("Get-user-by-id-params"),
      },
      response: {
        status: {
          200: Joi.object({
            status: Joi.string().valid("success").required(),
            data: Joi.object({
              id: Joi.string().required(),
              username: Joi.string().required(),
              fullname: Joi.string().required(),
            }).required(),
          }).label("Get-user-by-id-response"),
        },
      },
    },
  },
];

module.exports = routes;
