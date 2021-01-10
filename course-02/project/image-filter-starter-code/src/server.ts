import express from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // GET /filteredimage?image_url={{URL}}
  app.get( "/filteredimage", async (req, res) => {
    const { image_url: imageUrl } = req.query;
    if ( !imageUrl ) {
      res.status(400).send("Missing image_url query parameter");
    }
    const filteredImagePath = await filterImageFromURL(imageUrl);
    res.sendFile(filteredImagePath, () => {
      deleteLocalFiles([filteredImagePath]);
    });
  });
  
  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req, res ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();