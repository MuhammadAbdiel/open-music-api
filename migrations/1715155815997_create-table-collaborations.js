/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable("collaborations", {
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
    "userId": {
      type: "VARCHAR(50)",
      notNull: true,
      references: '"users"',
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
  //   "collaborations",
  //   "unique_playlist_id_and_user_id",
  //   "UNIQUE(playlist_id, user_id)"
  // );

  // pgm.addConstraint(
  //   "collaborations",
  //   "fk_collaborations.playlist_id_playlists.id",
  //   "FOREIGN KEY(playlist_id) REFERENCES playlists(id) ON DELETE CASCADE"
  // );

  // pgm.addConstraint(
  //   "collaborations",
  //   "fk_collaborations.user_id_users.id",
  //   "FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE"
  // );
};

exports.down = (pgm) => {
  pgm.dropTable("collaborations");
};
