const autoBind = require("auto-bind");

class AlbumHandler {
  constructor(
    albumsService,
    albumsValidator,
    storageService,
    uploadsValidator
  ) {
    this._albumsService = albumsService;
    this._albumsValidator = albumsValidator;
    this._storageService = storageService;
    this._uploadsValidator = uploadsValidator;

    autoBind(this);
  }

  async postAlbumHandler(request, h) {
    this._albumsValidator.validateAlbumPayload(request.payload);

    const { name, year } = request.payload;
    const albumId = await this._albumsService.addAlbum({ name, year });

    return h
      .response({
        status: "success",
        message: "Album berhasil ditambahkan",
        data: {
          albumId,
        },
      })
      .code(201);
  }

  async getAlbumsHandler() {
    const albums = await this._albumsService.getAlbums();

    return {
      status: "success",
      data: {
        albums,
      },
    };
  }

  async getAlbumByIdHandler(request) {
    const { id } = request.params;
    const album = await this._albumsService.getAlbumById(id);

    return {
      status: "success",
      data: {
        album,
      },
    };
  }

  async putAlbumByIdHandler(request) {
    this._albumsValidator.validateAlbumPayload(request.payload);

    const { id } = request.params;
    const { name, year } = request.payload;
    await this._albumsService.editAlbumById(id, { name, year });

    return {
      status: "success",
      message: "Album berhasil diperbarui",
    };
  }

  async deleteAlbumByIdHandler(request) {
    const { id } = request.params;
    await this._albumsService.deleteAlbumById(id);

    return {
      status: "success",
      message: "Album berhasil dihapus",
    };
  }

  async postUploadCoverHandler(request, h) {
    const { id } = request.params;
    const { cover } = request.payload;

    await this._albumsService.getAlbumById(id);

    this._uploadsValidator.validateImageHeaders(cover.hapi.headers);

    const filename = await this._storageService.writeFile(cover, cover.hapi);
    // const fileLocation = await this._storageService.writeFile(
    //   cover,
    //   cover.hapi
    // );
    const fileLocation = `http://${process.env.HOST}:${process.env.PORT}/albums/covers/${filename}`;

    await this._albumsService.editAlbumCoverById(id, fileLocation);

    return h
      .response({
        status: "success",
        message: "Sampul berhasil diunggah",
      })
      .code(201);
  }
}

module.exports = AlbumHandler;
