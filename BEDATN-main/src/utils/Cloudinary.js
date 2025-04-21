const cloudinary = require("cloudinary");
require ('dotenv').config()
cloudinary.config({
  cloud_name: "dohckhz5a", 
  api_key: "756544657237585", 
  api_secret: "wuJPImMArIpgmIZbLSrG595Fuz0"
});

console.log(process.env.API_KEY);
console.log(process.env.CLOUD_NAME);
console.log(process.env.SECRET_KEY);
const cloudinaryUploadImg = async (fileToUploads) => {
  return new Promise((resolve) => {
    cloudinary.uploader.upload(fileToUploads, (result) => {
      console.log(result);
      console.log(fileToUploads);
      resolve(
        {
          url: result.secure_url,
          asset_id: result.asset_id,
          public_id: result.public_id,
        },
        {
          resource_type: "auto",
        }
      );
    });
  });
};
const cloudinaryDeleteImg = async (fileToDelete) => {
  return new Promise((resolve) => {
    cloudinary.uploader.destroy(fileToDelete, (result) => {
      resolve(
        {
          url: result.secure_url,
          asset_id: result.asset_id,
          public_id: result.public_id,
        },
        {
          resource_type: "auto",
        }
      );
    });
  });
};

module.exports = { cloudinaryUploadImg, cloudinaryDeleteImg };