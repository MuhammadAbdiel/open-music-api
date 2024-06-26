/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable("playlist_songs", {
    id: {
      type: "VARCHAR(50)",
      primaryKey: true,
    },
    "playlistId": {
      type: "VARCHAR(50)",
      notNull: false,
      references: '"playlists"',
      onDelete: "CASCADE",
    },
    "songId": {
      type: "VARCHAR(50)",
      notNull: true,
      references: '"songs"',
      onDelete: "CASCADE",
    },
    created_at: {
      type: "TIMESTAMP",
      notNull: true,
      default: pgm.func("current_timestamp"),
    },
    updated_at: {
      type: "TIMESTAMP",
      notNull: true,
      default: pgm.func("current_timestamp"),
    },
  });

  // Via Query SQL
  // pgm.addConstraint(
  //   "playlist_songs",
  //   "unique_playlist_id_and_song_id",
  //   "UNIQUE(playlist_id, song_id)"
  // );

  // pgm.addConstraint(
  //   "playlist_songs",
  //   "fk_playlist_songs.playlist_id_playlists.id",
  //   "FOREIGN KEY(playlist_id) REFERENCES playlists(id) ON DELETE CASCADE"
  // );

  // pgm.addConstraint(
  //   "playlist_songs",
  //   "fk_playlist_songs.song_id_songs.id",
  //   "FOREIGN KEY(song_id) REFERENCES songs(id) ON DELETE CASCADE"
  // );
};

exports.down = (pgm) => {
  pgm.dropTable("playlist_songs");
};
