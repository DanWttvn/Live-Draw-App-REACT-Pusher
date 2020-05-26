require('dotenv').config();
const express = require("express");
const app = express();

const bodyParser = require("body-parser"); //ahora express icluye bodyparse, pero bueno. habria que cambiar el app.use(bodyp->express.json())
const cors = require("cors");
const path = require("path")

//todo:
const pusherKeys = require("./config/keys").mongoURI;
// const mongoose = require("mongoose");


// Pusher
const Pusher = require('pusher');

const pusher = new Pusher({
  appId: pusherKeys.appId,
  key: pusherKeys.key,
  secret: pusherKeys.secret,
  cluster: pusherKeys.cluster,
  encrypted: true
});

pusher.trigger('my-channel', 'my-event', {
  'message': 'hello world'
});


app.use(bodyParser.json()); //para poder leer ,manda json
app.use(
	bodyParser.urlencoded({ //urlencoded es que te pone name&apellido?xxx en lugar de un json object
		extended: true
	})
);
// app.use(cors()); //*instalar?

// Pusher
app.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*');
	res.header(
	  'Access-Control-Allow-Headers',
	  'Origin, X-Requested-With, Content-Type, Accept'
	);
	next();
});

app.post('/paint', (req, res) => {
	pusher.trigger('painting', 'draw', req.body);
	res.json(req.body);
});

// app.use("/api/pusher", require("./routes/api/pusher"));





//todo:
// mongoose.connect(db, { // db = my key
// 	useNewUrlParser: true, 
// 	useCreateIndex: true, 
// 	useUnifiedTopology: true 
// })
//     .then(() => console.log('Connection to Mongo DB established'))
//     .catch(err => console.log(err));


// ENDPOINTS
// app.use("/api/games", require("./routes/api/games"));
	// -users
	// 	-puntuacion
	// -drawing
// app.use("/api/words", require("./routes/api/words"));
// app.use("/api/users", require("./routes/api/users")); ??


// DEPLOY
// Serve statuc asssets if in production
if (process.env.NODE_ENV === "production") {
	//set static folder
	app.use(express.static("client/build"));
	app.get("*", (req, res) => {
		res.sendFile(path.resolve(__dirname, "client", "build", "index.html"))
	});
}


const port = process.env.PORT || 5000; //el puerto que sea y, si no hay ninguno, el 5000

app.listen(port, () => {
	console.log("Server running on " + port + " port");
});