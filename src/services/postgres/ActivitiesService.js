const { nanoid } = require("nanoid");
const { Pool } = require("pg");

class ActivitiesService {
  constructor() {
    this._pool = new Pool();
  }

  async addActivity({ playlistId, songId, userId }) {
    const id = `activity-${nanoid(16)}`;
    const time = new Date();

    const query = {
      text: "INSERT INTO playlist_song_activities VALUES($1, $2, $3, $4, $5, $6) RETURNING id",
      values: [id, playlistId, songId, userId, "add", time],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new Error("Activity gagal ditambahkan");
    }

    return result.rows[0].id;
  }

  async deleteActivity({ playlistId, songId, userId }) {
    const id = `activity-${nanoid(16)}`;
    const time = new Date();

    const query = {
      text: "INSERT INTO playlist_song_activities VALUES($1, $2, $3, $4, $5, $6) RETURNING id",
      values: [id, playlistId, songId, userId, "delete", time],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new Error("Activity gagal ditambahkan");
    }

    return result.rows[0].id;
  }
}

module.exports = ActivitiesService;
