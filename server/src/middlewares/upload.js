// middleware/upload.js
import multer from "multer";

const storage = multer.memoryStorage(); // keep file in memory
const upload = multer({ storage });

export default upload;
