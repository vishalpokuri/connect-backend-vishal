const mongoose = require('mongoose');

const userPhotoSchema = new mongoose.Schema({
    username_1: { type: String, required: true },
    username_2: { type: String, required: true },
    photoId: { type: mongoose.Schema.Types.ObjectId, ref: 'photos.files', required: true }  // Reference to the GridFS photo
});

const UserPhoto = mongoose.model('UserPhoto', userPhotoSchema);
module.exports = UserPhoto;
