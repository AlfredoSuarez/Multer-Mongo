const express = require( 'express' );
const cors = require( 'cors' );
const app = express();
//import routes
const initRoutes = require( './routes' );

//cors config

var corsOptions = {
    origin: "http://localhost:8090"
};

//
app.use(cors(corsOptions))
app.use( express.urlencoded( { extended: false } ) );

//routes
initRoutes( app );

let port = 8090;
app.listen( port, () => {
    console.log('server is running!!')
})