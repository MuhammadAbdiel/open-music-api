const mapDBToModel = ({ id, name, year, created_at, updated_at }, song) => ({
  id,
  name,
  year,
  songs: song,
  createdAt: created_at,
  updatedAt: updated_at,
});

module.exports = { mapDBToModel };
