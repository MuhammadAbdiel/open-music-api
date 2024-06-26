/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable("user_album_likes", {
    id: {
      type: "VARCHAR(50)",
      primaryKey: true,
    },
    "userId": {
      type: "VARCHAR(50)",
      notNull: true,
      references: '"users"',
      onDelete: "CASCADE",
    },
    "albumId": {
      type: "VARCHAR(50)",
      notNull: true,
      references: '"albums"',
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
  //   "user_album_likes",
  //   "unique_user_id_and_album_id",
  //   "UNIQUE(user_id, album_id)"
  // );

  // pgm.addConstraint(
  //   "user_album_likes",
  //   "fk_user_album_likes.user_id_users.id",
  //   "FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE"
  // );

  // pgm.addConstraint(
  //   "user_album_likes",
  //   "fk_user_album_likes.album_id_albums.id",
  //   "FOREIGN KEY(album_id) REFERENCES albums(id) ON DELETE CASCADE"
  // );
};

exports.down = (pgm) => {
  pgm.dropTable("user_album_likes");
};
