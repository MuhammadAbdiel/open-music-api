const Joi = require("joi");

const routes = (handler) => [
  {
    method: "POST",
    path: "/songs",
    handler: handler.postSongHandler,
    options: {
      description: "Create a new song",
      tags: ["api", "songs"],
      validate: {
        payload: Joi.object({
          title: Joi.string().required(),
          year: Joi.number().integer().required(),
          genre: Joi.string().required(),
          performer: Joi.string().required(),
          duration: Joi.number().integer().allow(null),
          albumId: Joi.string().allow(null),
        }).label("Post-songs-payload"),
      },
      response: {
        schema: Joi.object({
          status: "success",
          data: Joi.object({
            id: Joi.string(),
            title: Joi.string(),
            year: Joi.number().integer(),
            performer: Joi.string(),
            genre: Joi.string(),
            duration: Joi.number().integer().allow(null),
            albumId: Joi.string().allow(null),
          }).label("Post-songs-response"),
        }),
      },
    },
  },
  {
    method: "GET",
    path: "/songs",
    handler: handler.getSongsHandler,
    options: {
      description: "Get all songs",
      tags: ["api", "songs"],
      response: {
        schema: Joi.object({
          status: Joi.string().valid("success").required(),
          data: Joi.object({
            songs: Joi.array()
              .items(
                Joi.object({
                  id: Joi.string().required(),
                  title: Joi.string().required(),
                  performer: Joi.string().required(),
                  year: Joi.number().integer().optional(),
                  genre: Joi.string().optional(),
                  duration: Joi.number().integer().optional(),
                  albumId: Joi.string().optional(),
                  createdAt: Joi.string().optional(),
                  updatedAt: Joi.string().optional(),
                }).label("Song")
              )
              .required(),
          }).required(),
        }),
      },
    },
  },
  {
    method: "GET",
    path: "/songs/{id}",
    handler: handler.getSongByIdHandler,
    options: {
      description: "Get a song by ID",
      tags: ["api", "songs"],
      validate: {
        params: Joi.object({
          id: Joi.string().required(),
        }).label("Get-song-by-id-params"),
      },
      response: {
        schema: Joi.object({
          status: "success",
          data: Joi.object({
            song: Joi.object({
              id: Joi.string(),
              title: Joi.string(),
              year: Joi.number().integer(),
              performer: Joi.string(),
              genre: Joi.string(),
              duration: Joi.number().integer().allow(null),
              albumId: Joi.string().allow(null),
            }),
          }).label("Get-song-by-id-response"),
        }),
      },
    },
  },
  {
    method: "PUT",
    path: "/songs/{id}",
    handler: handler.putSongByIdHandler,
    options: {
      description: "Update a song by ID",
      tags: ["api", "songs"],
      validate: {
        params: Joi.object({
          id: Joi.string().required(),
        }).label("Put-song-by-id-params"),
        payload: Joi.object({
          title: Joi.string().required(),
          year: Joi.number().integer().required(),
          genre: Joi.string().required(),
          performer: Joi.string().required(),
          duration: Joi.number().integer().allow(null),
          albumId: Joi.string().allow(null),
        }).label("Put-song-by-id-payload"),
      },
      response: {
        schema: Joi.object({
          status: "success",
          data: Joi.object({
            id: Joi.string(),
            title: Joi.string(),
            year: Joi.number().integer(),
            performer: Joi.string(),
            genre: Joi.string(),
            duration: Joi.number().integer().allow(null),
            albumId: Joi.string().allow(null),
          }).label("Put-song-by-id-response"),
        }),
      },
    },
  },
  {
    method: "DELETE",
    path: "/songs/{id}",
    handler: handler.deleteSongByIdHandler,
    options: {
      description: "Delete a song by ID",
      tags: ["api", "songs"],
      validate: {
        params: Joi.object({
          id: Joi.string().required(),
        }).label("Delete-song-by-id-params"),
      },
      response: {
        schema: Joi.object({
          status: "success",
        }).label("Delete-song-by-id-response"),
      },
    },
  },
];

module.exports = routes;
