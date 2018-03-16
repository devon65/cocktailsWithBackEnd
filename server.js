const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static('public'))

var credentials = [];
//var id = 0;

app.get('/api/credentials', (req, res) => {
    var username = req.body.username;
    var password = "";
    var guessedDrinks = [];
    var foundUsername = false;
    for (var i = 0; i < credentials.length; ++i){
        if (credentials[i].username === username);
        {
            foundUsername = true;
            guessedDrinks = credentials[i];
            password = credentials[i].password;
            i = credentials.length;
        }
    }

    var credential = {username:username, password:password, drinksArray: guessedDrinks};

    res.send({username: username, password: password, guessedDrinks: guessedDrinks, foundUsername: foundUsername});
});

app.post('/api/credentials', (req, res) => {
    var credential = {username: req.body.username, password: req.body.password, drinksArray: req.body.guessedDrinks};
    credentials.push(credential);
    res.send({username: username, password: password, guessedDrinks: guessedDrinks});
    console.log("done son");
});

app.put('/api/credentials/:id', (req, res) => {
    var id = parseInt(req.params.id);
    var credentialsMap = credentials.map(credential => { return credential.id; });
    var index = credentialsMap.indexOf(id);
    var credential = credentials[index];
    //credential.completed = req.body.completed;
    //credential.text = req.body.text;
    //credential.selected = req.body.selected;
  //   // handle drag and drop re-ordering
  //   if (req.body.orderChange) {
  //     var indexTarget = credentialsMap.indexOf(req.body.orderTarget);
  //     credentials.splice(index,1);
  //     credentials.splice(indexTarget,0,credential);
  // }
  res.send(credential);
});

app.delete('/api/credentials/:id', (req, res) => {
  var id = parseInt(req.params.id);
  var removeIndex = credentials.map(credential => { return credential.id; }).indexOf(id);
  if (removeIndex === -1) {
    res.status(404).send("Sorry, that credential doesn't exist");
    return;
  }
  credentials.splice(removeIndex, 1);
  res.sendStatus(200);
});

app.listen(3000, () => console.log('Server listening on port 3000!'))