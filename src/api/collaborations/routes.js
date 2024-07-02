const Joi = require("joi");

const routes = (handler) => [
  {
    method: "POST",
    path: "/collaborations",
    handler: handler.postCollaborationHandler,
    options: {
      auth: "musicapi_jwt",
      description: "Create a collaboration on a playlist",
      tags: ["api", "collaborations"],
      validate: {
        payload: Joi.object({
          playlistId: Joi.string()
            .required()
            .description("ID of the playlist to collaborate on"),
          userId: Joi.string()
            .required()
            .description("ID of the user to collaborate"),
        }).label("CollaborationPayload"),
      },
      response: {
        status: {
          201: Joi.object({
            status: Joi.string().valid("success").required(),
            message: Joi.string().required().description("Success message"),
          }),
        },
      },
    },
  },
  {
    method: "DELETE",
    path: "/collaborations",
    handler: handler.deleteCollaborationHandler,
    options: {
      auth: "musicapi_jwt",
      description: "Delete a collaboration on a playlist",
      tags: ["api", "collaborations"],
      validate: {
        payload: Joi.object({
          playlistId: Joi.string()
            .required()
            .description("ID of the playlist to remove collaboration"),
          userId: Joi.string()
            .required()
            .description("ID of the user to remove collaboration"),
        }).label("DeleteCollaborationPayload"),
      },
      response: {
        status: {
          200: Joi.object({
            status: Joi.string().valid("success").required(),
            message: Joi.string().required().description("Success message"),
          }),
        },
      },
    },
  },
];

module.exports = routes;
