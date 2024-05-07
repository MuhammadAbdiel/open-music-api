/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable("playlists", {
    id: {
      type: "VARCHAR(50)",
      primaryKey: true,
    },
    name: {
      type: "TEXT",
      notNull: true,
    },
    owner: {
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
  // pgm.addConstraint("playlists", "unique_owner", "UNIQUE(owner)");
  // pgm.addConstraint(
  //   "playlists",
  //   "fk_playlists.owner_users.id",
  //   "FOREIGN KEY(owner) REFERENCES users(id) ON DELETE CASCADE"
  // );
};

exports.down = (pgm) => {
  pgm.dropTable("playlists");
};
