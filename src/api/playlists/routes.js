const Joi = require("joi");

const routes = (handler) => [
  {
    method: "POST",
    path: "/playlists",
    handler: handler.postPlaylistHandler,
    options: {
      auth: "musicapi_jwt",
      description: "Create a new playlist",
      tags: ["api", "playlists"],
      validate: {
        payload: Joi.object({
          name: Joi.string().required(),
          owner: Joi.string().optional(),
        }).label("CreatePlaylistPayload"),
      },
      response: {
        schema: Joi.object({
          status: Joi.string().valid("success").required(),
          data: Joi.object({
            playlistId: Joi.string().required(),
          }).label("CreatePlaylistResponse"),
        }),
      },
    },
  },
  {
    method: "GET",
    path: "/playlists",
    handler: handler.getPlaylistsHandler,
    options: {
      auth: "musicapi_jwt",
      description: "Get all playlists",
      tags: ["api", "playlists"],
      response: {
        schema: Joi.object({
          status: Joi.string().valid("success").required(),
          data: Joi.object({
            playlists: Joi.array()
              .items(
                Joi.object({
                  id: Joi.string().required(),
                  name: Joi.string().required(),
                  owner: Joi.string().optional(),
                }).label("Playlist")
              )
              .required(),
          }).label("GetPlaylistsResponse"),
        }),
      },
    },
  },
  {
    method: "DELETE",
    path: "/playlists/{id}",
    handler: handler.deletePlaylistByIdHandler,
    options: {
      auth: "musicapi_jwt",
      description: "Delete a playlist by ID",
      tags: ["api", "playlists"],
      validate: {
        params: Joi.object({
          id: Joi.string().required(),
        }).label("DeletePlaylistParams"),
      },
      response: {
        schema: Joi.object({
          status: Joi.string().valid("success").required(),
        }),
      },
    },
  },
  {
    method: "POST",
    path: "/playlists/{id}/songs",
    handler: handler.postPlaylistSongHandler,
    options: {
      auth: "musicapi_jwt",
      description: "Add a song to a playlist",
      tags: ["api", "playlists"],
      validate: {
        params: Joi.object({
          id: Joi.string().required(),
        }).label("PlaylistIdParams"),
        payload: Joi.object({
          songId: Joi.string().required(),
        }).label("AddSongToPlaylistPayload"),
      },
      response: {
        schema: Joi.object({
          status: Joi.string().valid("success").required(),
          data: Joi.object({
            playlistId: Joi.string().required(),
            songId: Joi.string().required(),
          }).label("AddSongToPlaylistResponse"),
        }),
      },
    },
  },
  {
    method: "GET",
    path: "/playlists/{id}/songs",
    handler: handler.getPlaylistSongsHandler,
    options: {
      auth: "musicapi_jwt",
      description: "Get all songs in a playlist",
      tags: ["api", "playlists"],
      validate: {
        params: Joi.object({
          id: Joi.string().required(),
        }).label("PlaylistIdParams"),
      },
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
                }).label("SongInPlaylist")
              )
              .required(),
          }).label("GetPlaylistSongsResponse"),
        }),
      },
    },
  },
  {
    method: "DELETE",
    path: "/playlists/{id}/songs",
    handler: handler.deletePlaylistSongByIdHandler,
    options: {
      auth: "musicapi_jwt",
      description: "Remove a song from a playlist",
      tags: ["api", "playlists"],
      validate: {
        params: Joi.object({
          id: Joi.string().required(),
        }).label("PlaylistIdParams"),
        payload: Joi.object({
          songId: Joi.string().required(),
        }).label("RemoveSongFromPlaylistPayload"),
      },
      response: {
        schema: Joi.object({
          status: Joi.string().valid("success").required(),
        }),
      },
    },
  },
  {
    method: "GET",
    path: "/playlists/{id}/activities",
    handler: handler.getActivitiesByPlaylistIdHandler,
    options: {
      auth: "musicapi_jwt",
      description: "Get activities related to a playlist",
      tags: ["api", "playlists"],
      validate: {
        params: Joi.object({
          id: Joi.string().required(),
        }).label("PlaylistIdParams"),
      },
      response: {
        schema: Joi.object({
          status: Joi.string().valid("success").required(),
          data: Joi.object({
            activities: Joi.array()
              .items(
                Joi.object({
                  id: Joi.string().required(),
                  playlistId: Joi.string().required(),
                  songId: Joi.string().required(),
                  userId: Joi.string().required(),
                  action: Joi.string().required(),
                  time: Joi.string().required(),
                }).label("Activity")
              )
              .required(),
          }).label("GetActivitiesResponse"),
        }),
      },
    },
  },
];

module.exports = routes;
