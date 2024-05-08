const mapDBToModel = (
  { id, name, username, created_at, updated_at },
  song
) => ({
  id,
  name,
  username,
  songs: song,
  createdAt: created_at,
  updatedAt: updated_at,
});

module.exports = { mapDBToModel };
