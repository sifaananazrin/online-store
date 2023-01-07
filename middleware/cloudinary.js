const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');



cloudinary.config({
  cloud_name: 'dvekmmxxx',
  api_key: '599266113875923',
  api_secret: '8PSGsrCJc7myQNE_SJ700hA-yPk',
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'brandy',
    allowedFormats: ['jpeg', 'png', 'jpg', 'webp'],
  },
});
module.exports = {
  cloudinary, storage,
};