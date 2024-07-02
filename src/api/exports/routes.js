const Joi = require("joi");

const routes = (handler) => [
  {
    method: "POST",
    path: "/export/playlists/{playlistId}",
    handler: handler.postExportPlaylistsHandler,
    options: {
      auth: "musicapi_jwt",
      description: "Export songs in a playlist and send via email",
      tags: ["api", "playlists"],
      validate: {
        params: Joi.object({
          playlistId: Joi.string()
            .required()
            .description("ID of the playlist to export"),
        }).label("ExportPlaylistParams"),
        payload: Joi.object({
          targetEmail: Joi.string()
            .email()
            .required()
            .description("Email address to send the export"),
        }).label("ExportPlaylistPayload"),
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
];

module.exports = routes;
