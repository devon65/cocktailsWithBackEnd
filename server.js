const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static('public'))

let credentials = [];
//let id = 0;

app.post('/api/credentials/get', (req, res) => {
    let myUsername = req.body.username;
    let password = "";
    let guessedDrinks = [];
    let foundUsername = false;
    let answerCounter = 0;
    for (let i = 0; i < credentials.length; ++i){
        if (credentials[i].username === myUsername){
            foundUsername = true;
            guessedDrinks = credentials[i].guessedDrinks;
            password = credentials[i].password;
            answerCounter = credentials[i].answerCounter;
            break;
        }
    }

    let credential = {username: myUsername, password: password, guessedDrinks: guessedDrinks,
        answerCounter: answerCounter};

    res.send({credential: credential, foundUsername: foundUsername});
});

app.get('/api/credentials', (req, res) => {
    res.send(credentials);
});

app.post('/api/credentials', (req, res) => {
    let answerCounter = 0;
    let credential = {username: req.body.username, password: req.body.password, guessedDrinks: req.body.guessedDrinks,
        answerCounter: answerCounter};
    credentials.push(credential);
    res.send({credential: credential});
    console.log("done son");
});

app.put('/api/credentials/:username', (req, res) => {
    let myUsername = req.body.username;

    let foundUsername = false;
    for (let i = 0; i < credentials.length; ++i){
        if (credentials[i].username === myUsername){
            credentials[i].guessedDrinks = req.body.guessedDrinks;
            credentials[i].answerCounter = req.body.answerCounter;
            console.log(req.body.answerCounter + ", " + credentials[i].answerCounter);
            foundUsername = true;
            break;
        }
    }

  res.send(foundUsername);
});

app.delete('/api/credentials/:username', (req, res) => {
    let myUsername = req.params.username;

    for (let i = 0; i < credentials.length; ++i){
        if (credentials[i].username === myUsername){
            credentials.splice(i, 1);
            break;
        }
    }

    res.sendStatus(200);
});

app.listen(4040, () => console.log('Server listening on port 4040!'))