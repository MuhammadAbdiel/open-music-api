const { nanoid } = require("nanoid");
const { Pool } = require("pg");
const InvariantError = require("../../exceptions/InvariantError");
const NotFoundError = require("../../exceptions/NotFoundError");
const { mapDBToModel } = require("../../utils/albums");

class AlbumsService {
  constructor(cacheService) {
    this._pool = new Pool();
    this._cacheService = cacheService;
  }

  async addAlbum({ name, year }) {
    const id = `album-${nanoid(16)}`;
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    const query = {
      text: "INSERT INTO albums (id, name, year, created_at, updated_at) VALUES($1, $2, $3, $4, $5) RETURNING id",
      values: [id, name, year, createdAt, updatedAt],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length || !result.rows[0].id) {
      throw new InvariantError("Album gagal ditambahkan");
    }

    return result.rows[0].id;
  }

  async getAlbums() {
    const result = await this._pool.query("SELECT * FROM albums");

    const resultSong = await this._pool.query(
      'SELECT songs.id, songs.title, songs.performer, albums.id AS "albumId" FROM albums JOIN songs ON albums.id = "songs.albumId"'
    );

    return result.rows.map((album) => {
      const songs = resultSong.rows
        .filter((song) => song.albumId === album.id)
        .map((song) => ({
          id: song.id,
          title: song.title,
          performer: song.performer,
        }));

      return mapDBToModel(album, songs);
    });
  }

  async getAlbumById(id) {
    const query = {
      text: 'SELECT id, name, year, "coverUrl" FROM albums WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError("Album tidak ditemukan");
    }

    const querySong = {
      text: 'SELECT songs.id, songs.title, songs.performer FROM albums JOIN songs ON albums.id = songs."albumId" WHERE albums.id = $1',
      values: [id],
    };

    const resultSong = await this._pool.query(querySong);

    return result.rows.map((album) => ({
      ...album,
      songs: resultSong.rows,
    }))[0];
  }

  async editAlbumById(id, { name, year }) {
    const updatedAt = new Date().toISOString();
    const query = {
      text: "UPDATE albums SET name = $1, year = $2, updated_at = $3 WHERE id = $4 RETURNING id",
      values: [name, year, updatedAt, id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError("Gagal memperbarui album. Id tidak ditemukan");
    }
  }

  async deleteAlbumById(id) {
    const query = {
      text: "DELETE FROM albums WHERE id = $1 RETURNING id",
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError("Album gagal dihapus. Id tidak ditemukan");
    }
  }

  async editAlbumCoverById(id, fileLocation) {
    const updatedAt = new Date().toISOString();
    const query = {
      text: 'UPDATE albums SET "coverUrl" = $1, updated_at = $2 WHERE id = $3 RETURNING id',
      values: [fileLocation, updatedAt, id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError("Gagal memperbarui album. Id tidak ditemukan");
    }
  }

  async likeAlbum(albumId, userId) {
    await this.getAlbumById(albumId);

    const query = {
      text: 'SELECT * FROM user_album_likes WHERE "albumId" = $1 AND "userId" = $2',
      values: [albumId, userId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      const id = `like-${nanoid(16)}`;
      const createdAt = new Date().toISOString();
      const updatedAt = createdAt;

      const insertQuery = {
        text: 'INSERT INTO user_album_likes (id, "albumId", "userId", created_at, updated_at) VALUES($1, $2, $3, $4, $5) RETURNING id',
        values: [id, albumId, userId, createdAt, updatedAt],
      };

      const insertResult = await this._pool.query(insertQuery);

      if (!insertResult.rows.length || !insertResult.rows[0].id) {
        throw new InvariantError("Gagal menyukai album");
      }
    } else {
      throw new InvariantError("Anda sudah menyukai album ini");
    }
  }

  async unlikeAlbum(albumId, userId) {
    await this.getAlbumById(albumId);

    const deleteQuery = {
      text: 'DELETE FROM user_album_likes WHERE "albumId" = $1 AND "userId" = $2 RETURNING id',
      values: [albumId, userId],
    };

    const deleteResult = await this._pool.query(deleteQuery);

    if (!deleteResult.rows.length) {
      throw new InvariantError("Gagal untuk batal menyukai album");
    }

    await this._cacheService.delete(`album:${albumId}:likes`);
  }

  async getLikesByAlbumId(albumId) {
    try {
      const source = "cache";
      const likes = await this._cacheService.get(`album:${albumId}:likes`);

      return { likes: +likes, source };
    } catch (error) {
      await this.getAlbumById(albumId);

      const query = {
        text: 'SELECT * FROM user_album_likes WHERE "albumId" = $1',
        values: [albumId],
      };

      const result = await this._pool.query(query);
      const likes = result.rows.length;

      await this._cacheService.set(`album:${albumId}:likes`, likes);
      const source = "server";

      return { likes, source };
    }
  }
}

module.exports = AlbumsService;
