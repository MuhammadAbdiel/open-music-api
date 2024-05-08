const { nanoid } = require("nanoid");
const { Pool } = require("pg");
const InvariantError = require("../../exceptions/InvariantError");
const NotFoundError = require("../../exceptions/NotFoundError");
const {
  mapDBToModel: mapDBToModelPlaylists,
} = require("../../utils/playlists");
const {
  mapDBToModel: mapDBToModelPlaylistSongs,
} = require("../../utils/playlist_songs");
const {
  mapDBToModel: mapDBToModelPlaylistSongActivities,
} = require("../../utils/playlist_song_activities");
const AuthorizationError = require("../../exceptions/AuthorizationError");

class PlaylistsService {
  constructor(songsService, collaborationsService, activitiesService) {
    this._pool = new Pool();
    this._songsService = songsService;
    this._collaborationsService = collaborationsService;
    this._activitiesService = activitiesService;
  }

  async getActivitiesByPlaylistId(playlistId) {
    const { id } = await this.getPlaylistById(playlistId);

    const query = {
      text: `
        SELECT 
        playlist_song_activities.id, 
        users.username, 
        songs.title, 
        playlist_song_activities.action, 
        playlist_song_activities.time
        FROM playlist_song_activities
        LEFT JOIN users ON playlist_song_activities."userId" = users.id
        LEFT JOIN songs ON playlist_song_activities."songId" = songs.id
        WHERE playlist_song_activities."playlistId" = $1
        ORDER BY playlist_song_activities.time ASC
      `,
      values: [playlistId],
    };

    const result = await this._pool.query(query);

    return mapDBToModelPlaylistSongActivities(id, result.rows);
  }

  async addPlaylist({ name, owner }) {
    const id = `playlist-${nanoid(16)}`;
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    const query = {
      text: "INSERT INTO playlists VALUES($1, $2, $3, $4, $5) RETURNING id",
      values: [id, name, owner, createdAt, updatedAt],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError("Playlist gagal ditambahkan");
    }

    return result.rows[0].id;
  }

  async getPlaylists(owner) {
    const query = {
      text: `
        SELECT playlists.id, playlists.name, users.username
        FROM playlists
        LEFT JOIN collaborations ON playlists.id = collaborations."playlistId"
        LEFT JOIN users ON playlists.owner = users.id
        WHERE playlists.owner = $1 OR collaborations."userId" = $1
        GROUP BY playlists.id, users.username
      `,
      values: [owner],
    };

    const result = await this._pool.query(query);

    return result.rows.map(mapDBToModelPlaylists);
  }

  async getPlaylistById(id) {
    const query = {
      text: `
        SELECT playlists.id, playlists.name, users.username
        FROM playlists
        LEFT JOIN users ON playlists.owner = users.id
        WHERE playlists.id = $1
      `,
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError("Playlist tidak ditemukan");
    }

    return result.rows.map(mapDBToModelPlaylists)[0];
  }

  async deletePlaylistById(id) {
    const query = {
      text: "DELETE FROM playlists WHERE id = $1 RETURNING id",
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError("Playlist gagal dihapus. Id tidak ditemukan");
    }
  }

  async addPlaylistSong(playlistId, songId, userId) {
    await this._songsService.getSongById(songId);

    const id = `playlist_song-${nanoid(16)}`;
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    const query = {
      text: "INSERT INTO playlist_songs VALUES($1, $2, $3, $4, $5) RETURNING id",
      values: [id, playlistId, songId, createdAt, updatedAt],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError("Lagu gagal ditambahkan ke playlist");
    }

    await this._activitiesService.addActivity({
      playlistId,
      songId,
      userId,
    });

    return result.rows[0].id;
  }

  async getPlaylistSongsById(playlistId) {
    const queryPlaylist = {
      text: `SELECT playlists.id, playlists.name, users.username 
      FROM playlists 
      LEFT JOIN users ON playlists.owner = users.id 
      WHERE playlists.id = $1`,
      values: [playlistId],
    };

    const result = await this._pool.query(queryPlaylist);

    if (!result.rows.length) {
      throw new NotFoundError("Playlist tidak ditemukan");
    }

    const queryPlaylistSongs = {
      text: `SELECT songs.id, songs.title, songs.performer
      FROM playlist_songs
      LEFT JOIN songs ON playlist_songs."songId" = songs.id
      WHERE "playlistId" = $1`,
      values: [playlistId],
    };

    const resultPlaylistSongs = await this._pool.query(queryPlaylistSongs);

    return result.rows.map((playlist) => {
      const songs = resultPlaylistSongs.rows.map((song) => ({
        id: song.id,
        title: song.title,
        performer: song.performer,
      }));

      return mapDBToModelPlaylistSongs(playlist, songs);
    })[0];
  }

  async deletePlaylistSongById(songId, playlistId, userId) {
    const query = {
      text: 'DELETE FROM playlist_songs WHERE "songId" = $1 RETURNING id',
      values: [songId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError("Lagu gagal dihapus. Id tidak ditemukan");
    }

    await this._activitiesService.deleteActivity({
      playlistId,
      songId,
      userId,
    });
  }

  async verifyPlaylistOwner(id, owner) {
    const query = {
      text: "SELECT id, owner FROM playlists WHERE id = $1",
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError("Playlist tidak ditemukan");
    }

    const playlist = result.rows[0];

    if (playlist.owner !== owner) {
      throw new AuthorizationError("Anda tidak berhak mengakses resource ini");
    }
  }

  async verifyPlaylistAccess(playlistId, userId) {
    try {
      await this.verifyPlaylistOwner(playlistId, userId);
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }

      try {
        await this._collaborationsService.verifyCollaborator(
          playlistId,
          userId
        );
      } catch {
        throw error;
      }
    }
  }
}

module.exports = PlaylistsService;
