const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/profiles");
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
        cb(null, uniqueName);
    },
});

const upload = multer({
    storage,
    limits: { fileSize: 2 * 1024 * 1024},
    fileFilter: (req, file, cb) => {
        if (!file.mimetype.startsWith("image/")) {
           return cb(new Error ("File must be image"));
        }
        cb(null, true);
    },
});

module.exports = upload;