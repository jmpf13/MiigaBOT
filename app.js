 // First add the obligatory web framework
var express      = require( 'express' );
var app          = express();
var bodyParser   = require( 'body-parser' );
var watson       = require( 'watson-developer-cloud' );
var vcapServices = require ( 'vcap_services' );

app.use( bodyParser.urlencoded( {
	extended: false
} ) );

// Util is handy to have around, so thats why that's here.
const util = require( 'util' )
// and so is assert
const assert = require( 'assert' );

// We want to extract the port to publish our app on
var port = process.env.VCAP_APP_PORT || 8080;

// Then we'll pull in the database client library
var MongoClient = require( "mongodb" ).MongoClient;

// Now lets get cfenv and ask it to parse the environment variable
var cfenv  = require( 'cfenv' );
var appenv = cfenv.getAppEnv();

var fs = require( 'fs' );

// Within the application environment (appenv) there's a services object
var services = appenv.services;

// The services object is a map named by service so we extract the one for MongoDB
var mongodb_services = services[ "compose-for-mongodb" ];

// This check ensures there is a services for MongoDB databases
assert( !util.isUndefined( mongodb_services ), "Must be bound to compose-for-mongodb services" );

// We now take the first bound MongoDB service and extract it's credentials object
var credentials = mongodb_services[0].credentials;

// Within the credentials, an entry ca_certificate_base64 contains the SSL pinning key
// We convert that from a string into a Buffer entry in an array which we use when
// connecting.
var ca = [ new Buffer( credentials.ca_certificate_base64, 'base64' ) ];

// This is a global variable we'll use for handing the MongoDB client around
var mongodb;

// This is the MongoDB connection. From the application environment, we got the
// credentials and the credentials contain a URI for the database. Here, we
// connect to that URI, and also pass a number of SSL settings to the
// call. Among those SSL settings is the SSL CA, into which we pass the array
// wrapped and now decoded ca_certificate_base64,
MongoClient.connect( credentials.uri, {
	mongos: {
		ssl: true,
		sslValidate: true,
		sslCA: ca,
		poolSize: 1,
		reconnectTries: 1
	}
},
function( err, db ) {
	// Here we handle the async response. This is a simple example and
	// we're not going to inject the database connection into the
	// middleware, just save it in a global variable, as long as there
	// isn't an error.
	if ( err ) {
		console.log( err );
	} else {
		// Although we have a connection, it's to the "admin" database
		// of MongoDB deployment. In this example, we want the
		// "examples" database so what we do here is create that
		// connection using the current connection.
		mongodb = db.db( "examples" );
	}
} );

// With the database going to be open as some point in the future, we can
// now set up our web server. First up we set it to server static pages
app.use( express.static( __dirname + '/public' ) );

app.put( "/users", function( request, response ) {
	mongodb.collection( "users" ).insertOne( {
		_id: request.body.login,
		name: request.body.name,
		surname: request.body.surname,
		phone: {ddd: request.body.ddd, number: request.body.number},
		email: request.body.email, password: request.body.password
	}, function( error, result ) {
		if (error) {
			response.status(500).send(error);
		} else {
			response.send(result);
		}
	} );
} );

app.get( "/users", function( request, response ) {
	mongodb.collection( "users" ).find().toArray( function( err, words ) {
		if ( err ) {
			response.status( 500 ).send( err );
		} else {
			response.send( words );
		}
	} );
} );

app.put( "/api/chatbot", function( request, response ){
	// Create the service wrapper
	var conversation = watson.conversation ( {
		username: process.env.CONVERSATION_USERNAME || 'f2207c73-7464-4124-9ccf-deb0c5c805a5',
		password: process.env.CONVERSATION_PASSWORD || 'gSr65bHtzuDO',
		version_date: '2016-07-11',
		version: 'v1'
	} );

	var payload = {
		workspace_id: process.env.WORKSPACE_ID || '4f8514a7-cb72-4192-8e35-2d2954811b85',
		input: { text: request.body.text },
		context: request.body.context 
	};

	conversation.message( payload, function( err, res ) {
		if ( err ) {
			response.status( 500 ).send( err );
		} else {
			response.status( 200 ).send( JSON.stringify( res, null, 2 ) );
		}
	} );
} );

app.get( "/api/chatbot", function( request, response ){
	// Create the service wrapper
	var conversation = watson.conversation ( {
		username: process.env.CONVERSATION_USERNAME || 'f2207c73-7464-4124-9ccf-deb0c5c805a5',
		password: process.env.CONVERSATION_PASSWORD || 'gSr65bHtzuDO',
		version_date: '2016-07-11',
		version: 'v1'
	} );

	var payload = {
		workspace_id: process.env.WORKSPACE_ID || '4f8514a7-cb72-4192-8e35-2d2954811b85',
		context: {}
	};

	conversation.message( payload, function( err, res ) {
		if ( err ) {
			response.status( 500 ).send( err );
		} else {
			response.status( 200 ).send( JSON.stringify( res, null, 2 ) );
		}
	} );
} );

app.put( "/api/text", function( request, response ){
	var text_to_speech = watson.text_to_speech( {
		username: process.env.TEXT_TO_SPEECH_USERNAME || '0a20f3f7-60b9-423f-ab44-2ece4033954c',
		password: process.env.TEXT_TO_SPEECH_PASSWORD || 'HyGIb7FUzRLO',
		version: 'v1'
	} );

	var params = {
	  text: request.body.text || "Olá mundo!",
	  voice: 'pt-BR_IsabelaVoice',
	  accept: 'audio/flac'
	};

	// Pipe the synthesized text to a file.
	text_to_speech.synthesize( params ).pipe( fs.createWriteStream('hello_world.flac') );
} );

// Now we go and listen for a connection.
// start server on the specified port and binding host
app.listen( port, function() {
	// print a message when the server starts listening
	console.log( "server starting on localhost:"+ port );
} );

require( "cf-deployment-tracker-client" ).track();
