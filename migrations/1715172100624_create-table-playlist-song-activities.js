/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable("playlist_song_activities", {
    id: {
      type: "VARCHAR(50)",
      primaryKey: true,
    },
    "playlistId": {
      type: "VARCHAR(50)",
      notNull: true,
      references: '"playlists"',
      onDelete: "CASCADE",
    },
    "songId": {
      type: "VARCHAR(50)",
      notNull: true,
      references: '"songs"',
      onDelete: "CASCADE",
    },
    "userId": {
      type: "VARCHAR(50)",
      notNull: true,
      references: '"users"',
      onDelete: "CASCADE",
    },
    action: {
      type: "TEXT",
      notNull: true,
    },
    time: {
      type: "TIMESTAMP",
      notNull: true,
      default: pgm.func("current_timestamp"),
    },
  });

  // Via Query SQL
  // pgm.addConstraint(
  //   "playlist_song_activities",
  //   "unique_playlist_id_and_song_id_and_user_id",
  //   "UNIQUE(playlist_id, song_id, user_id)"
  // );

  // pgm.addConstraint(
  //   "playlist_song_activities",
  //   "fk_playlist_song_activities.playlist_id_playlists.id",
  //   "FOREIGN KEY(playlist_id) REFERENCES playlists(id) ON DELETE CASCADE"
  // );

  // pgm.addConstraint(
  //   "playlist_song_activities",
  //   "fk_playlist_song_activities.song_id_songs.id",
  //   "FOREIGN KEY(song_id) REFERENCES songs(id) ON DELETE CASCADE"
  // );

  // pgm.addConstraint(
  //   "playlist_song_activities",
  //   "fk_playlist_song_activities.user_id_users.id",
  //   "FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE"
  // );
};

exports.down = (pgm) => {
  pgm.dropTable("playlist_song_activities");
};
