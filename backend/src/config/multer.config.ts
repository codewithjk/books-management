import multer, { FileFilterCallback } from "multer";
import path from "path";

const uploadDirectory = path.join(__dirname, "../../public/uploads");
export const upload = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, uploadDirectory); // Destination folder
        },
        filename: (req, file, cb) => {
            cb(null, `${Date.now()}-${file.originalname}`); // Unique file name
        },
    }),
    fileFilter: (req, file, cb: FileFilterCallback) => {
        const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
        if (!allowedTypes.includes(file.mimetype)) {
            return cb(new Error("Only JPG, JPEG, and PNG formats are allowed."));
        }
        cb(null, true);
    },
    limits: { fileSize: 2 * 1024 * 1024 }, // Max file size: 2MB
});
