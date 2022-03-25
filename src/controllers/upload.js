const upload = require( '../middleware/upload' );
const dbConfig = require( '../config/db.config' )
const MongoClient = require( 'mongodb' ).MongoClient;
const GridFSBucket = require( 'mongodb' ).GridFSBucket;
const url = dbConfig.url;
const baseUrl = "http://localhost:8090/files/";
const mongoClient = new MongoClient( url );


const getListFiles = async( req, res ) => {
    
    try {
        await mongoClient.connect();
        const database = mongoClient.db( dbConfig.database );
        const images = database.collection( dbConfig.imgBucket + ".files" );
        const cursor = images.find( {} );

        if ( (await cursor.count()) === 0 ) {
            return res.status( 500 ).send( {
                message: "no files found"
            })
        }

        let fileInfos = [];
        cursor.forEach( ( line ) => {
            fileInfos.push( {
                name: line.filename,
                url: baseUrl + doc.filename
            } )
        } );
        return res.status(200).send(fileInfos);

    } catch (error) {
        return res.status( 500 ).send( {
            message: 'next error' + error. message
        })
    }
}

const uploadFiles = async (req, res) => {
    try {
        await upload( req, res );
        
      console.log(req);
  
      if (req.file.length <= 0) {
        return res
          .status(400)
          .send({ message: "You must select at least 1 file." });
      }
  
      return res.status(200).send({
        message: "Files have been uploaded.",
      });
  
      
    } catch (error) {
      console.log(error);
  
      if (error.code === "LIMIT_UNEXPECTED_FILE") {
        return res.status(400).send({
          message: "Too many files to upload.",
        });
      }
      return res.status(500).send({
        message: `Error when trying upload many files: ${error}`,
      });
  
    
    }
};

const download = async ( req, res ) => {
    try {

    
        await mongoClient.connect();
        const database = mongoClient.db( dbConfig.database );
        const bucket = new GridFSBucket( database, {
            bucketName : dbConfig.imgBucket,
        } )
        let downloadStream = bucket.openDownloadStreamByName( req.params.name );

        downloadStream.on( "data", function ( data ) {
            return res.status( 200 ).write( data );
        } );
        
        downloadStream.on( 'error', function ( err ) {
            return res.status( 404 ).send( { message: "cannot download the image!!" } )
            
        } );
        
        downloadStream.on( 'end', () => {
            return res.end();
        })
        
    } catch (error) {
        return res.status( 500 ).send( {
          message: error.message
      })  
    }
}

module.exports = {
    uploadFiles,
    download,
    getListFiles
}