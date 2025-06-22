import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "avatars", // or "chat-app"
    allowed_formats: ["jpg", "png", "jpeg", "webp"],
    transformation: [{ width: 500, height: 500, crop: "limit" }],
  },
});

const upload = multer({ storage });

export default upload;
