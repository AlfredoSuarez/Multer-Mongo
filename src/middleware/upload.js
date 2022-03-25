const util = require( 'util' );
const multer = require( 'multer' );
const { GridFsStorage } = require( 'multer-gridfs-storage' );
const dbConfig = require( '../config/db.config' );

var storage = new GridFsStorage( {
    //mongodb://localhost:27017//G9-DB"
    url: dbConfig.url + dbConfig.database,
    options: { useNewUrlParser: true, useUnifiedTopology: true },
    file: ( req, file ) => {
        const match = ["image/png", "image/jpeg"];
        if ( match.indexOf( file.mimetype ) === -1 ) {
           
            //2022-03-23:19:11:2323-dash-pepito.jpeg
            const filename = `${Date.now()}-dash-${file.originalname}`;
            return filename;
        }
        return {
            bucketName: dbConfig.imgBucket,
            filename: `${Date.now()}-dash-${file.originalname}`
        }
    }
} );

var uploadFiles = multer( { storage: storage } ).single( 'file', 10 );
var uploadFilesMiddleware = util.promisify( uploadFiles );
module.exports = uploadFilesMiddleware;