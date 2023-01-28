const path = require("path");
const multer = require("multer");

// ##################### CREATE MULTER STORAGE!!!!

const storage = multer.diskStorage({
    destination: (req, file, cb) =>{
        cb(null, 'uploads/')
    },
    filename: (req, file, cb) => {
        let ext = path.extname(file.originalname)
        cb(null, Date.now() + ext)
    }
})

var upload = multer({
    storage:storage,
    fileFilter: (req, file, cb) =>{
        if(
            file.mimetype == 'image/png' || 
            file.mimetype == 'image/jpg' 
        ){
                cb(null, true)
        }else{
            console.log("Only Png & Jpg File Supported!");
            cb(null, false)
        }
    },
    limits:{
        fileSize: 1024 * 1024 *2
    }
});


// ############################ END MODULE!!!!

module.exports = upload