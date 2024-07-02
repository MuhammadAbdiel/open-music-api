const Joi = require("joi");
const path = require("path");

const routes = (handler) => [
  {
    method: "POST",
    path: "/albums",
    handler: handler.postAlbumHandler,
    options: {
      description: "Create a new album",
      tags: ["api", "albums"],
      validate: {
        payload: Joi.object({
          title: Joi.string().required(),
          year: Joi.number()
            .integer()
            .min(1900)
            .max(new Date().getFullYear())
            .required(),
          performer: Joi.string().required(),
        }).label("Post-albums-payload"),
      },
      response: {
        schema: Joi.object({
          status: "success",
          data: {
            id: Joi.string(),
          },
        }).label("Post-albums-response"),
      },
    },
  },
  {
    method: "GET",
    path: "/albums",
    handler: handler.getAlbumsHandler,
    options: {
      description: "Get all albums",
      tags: ["api", "albums"],
      response: {
        schema: Joi.object({
          status: "success",
          data: Joi.array().items(
            Joi.object({
              id: Joi.string(),
              title: Joi.string(),
              year: Joi.number().integer(),
              performer: Joi.string(),
            })
          ),
        }).label("Get-albums-response"),
      },
    },
  },
  {
    method: "GET",
    path: "/albums/{id}",
    handler: handler.getAlbumByIdHandler,
    options: {
      description: "Get an album by ID",
      tags: ["api", "albums"],
      validate: {
        params: Joi.object({
          id: Joi.string().required(),
        }).label("Get-albums-id-params"),
      },
      response: {
        schema: Joi.object({
          status: "success",
          data: Joi.object({
            id: Joi.string(),
            title: Joi.string(),
            year: Joi.number().integer(),
            performer: Joi.string(),
          }),
        }).label("Get-albums-id-response"),
      },
    },
  },
  {
    method: "PUT",
    path: "/albums/{id}",
    handler: handler.putAlbumByIdHandler,
    options: {
      description: "Update an album by ID",
      tags: ["api", "albums"],
      validate: {
        params: Joi.object({
          id: Joi.string().required(),
        }).label("Put-albums-id-params"),
        payload: Joi.object({
          title: Joi.string(),
          year: Joi.number().integer().min(1900).max(new Date().getFullYear()),
          performer: Joi.string(),
        }).label("Put-albums-id-payload"),
      },
      response: {
        schema: Joi.object({
          status: "success",
        }).label("Put-albums-id-response"),
      },
    },
  },
  {
    method: "DELETE",
    path: "/albums/{id}",
    handler: handler.deleteAlbumByIdHandler,
    options: {
      description: "Delete an album by ID",
      tags: ["api", "albums"],
      validate: {
        params: Joi.object({
          id: Joi.string().required(),
        }).label("Delete-albums-id-params"),
      },
      response: {
        schema: Joi.object({
          status: "success",
        }).label("Delete-albums-id-response"),
      },
    },
  },
  {
    method: "POST",
    path: "/albums/{id}/covers",
    handler: handler.postUploadCoverHandler,
    options: {
      description: "Upload a cover image for an album",
      tags: ["api", "albums"],
      payload: {
        allow: "multipart/form-data",
        multipart: true,
        output: "stream",
        maxBytes: 512000,
      },
      validate: {
        params: Joi.object({
          id: Joi.string().required(),
        }).label("Post-albums-id-covers-params"),
      },
      response: {
        schema: Joi.object({
          status: "success",
          data: {
            file: Joi.string(),
          },
        }).label("Post-albums-id-covers-response"),
      },
    },
  },
  {
    method: "GET",
    path: "/albums/covers/{param*}",
    handler: {
      directory: {
        path: path.resolve(__dirname, "file/covers"),
      },
    },
    options: {
      description: "Get album cover images",
      tags: ["api", "albums"],
    },
  },
  {
    method: "POST",
    path: "/albums/{id}/likes",
    handler: handler.postLikesAlbumHandler,
    options: {
      description: "Like an album",
      tags: ["api", "albums"],
      auth: "musicapi_jwt",
      validate: {
        params: Joi.object({
          id: Joi.string().required(),
        }).label("Post-albums-id-likes-params"),
      },
      response: {
        schema: Joi.object({
          status: "success",
        }).label("Post-albums-id-likes-response"),
      },
    },
  },
  {
    method: "DELETE",
    path: "/albums/{id}/likes",
    handler: handler.deleteLikesAlbumHandler,
    options: {
      description: "Unlike an album",
      tags: ["api", "albums"],
      auth: "musicapi_jwt",
      validate: {
        params: Joi.object({
          id: Joi.string().required(),
        }).label("Delete-albums-id-likes-params"),
      },
      response: {
        schema: Joi.object({
          status: "success",
        }).label("Delete-albums-id-likes-response"),
      },
    },
  },
  {
    method: "GET",
    path: "/albums/{id}/likes",
    handler: handler.getLikesAlbumHandler,
    options: {
      description: "Get likes of an album",
      tags: ["api", "albums"],
      validate: {
        params: Joi.object({
          id: Joi.string().required(),
        }).label("Get-albums-id-likes-params"),
      },
      response: {
        schema: Joi.object({
          status: "success",
          data: Joi.array().items(
            Joi.object({
              userId: Joi.string(),
            })
          ),
        }).label("Get-albums-id-likes-response"),
      },
    },
  },
];

module.exports = routes;
