var app = new Vue({
    el: '#app',

    data: {
        username: '',
        password: '',
        number: '',
        max: 0,
        currentDrink: '',
        currentPicture: '',
        currentCorrectAnswer: '',
        drinkArray: [],
        drinkOptionsArray: [],
        guessedDrinks: [],
        startButton: false,
        nextQuestionButton: false,
        signInScreen: true,
        quizScreen: false,
        areYouSureMessage: false,
        forgotPass: true,
        message: '',
        forgotten:'',
        answerCounter: 0,
        results: '',
        results: '',
        answerA: '',
        answerB: '',
        answerC: '',
        answerD: '',
        answerArray: ["answerA", "answerB", "answerC", "answerD"],
        correctArray: ["Right you are!", "Attaboy!", "Righto!", "Hot Dawg!", "Couldn’t have done it better myself",
                        "Right on", "Outstanding", "Right on the money"],
        incorrectArray: ["Incorrect: Sorry my friend", "Incorrect", "Incorrect: Better luck next time",
                        "Incorrect: What are you? Mormon?", "Incorrect: sorry Shirley Temple",
                        "Incorrect: I guess you only know the virgin drinks"],
},

    created: function() {
        this.cocktail();
    },

    watch: {
        number: function(value,oldvalue) {
            if (oldvalue === '') {
                this.max = value;
            } else {
                this.cocktail();
            }
        },
    },

    computed: {

    },

    methods: {
        signIn: function() {
            var myUsername = this.username;
            axios.post("api/credentials/get/", {
                username: myUsername
                }).then(response => {
                    if (response.data.foundUsername) {
                        if (response.data.credential.password === this.password) {
                            this.guessedDrinks = response.data.credential.guessedDrinks;
                            this.answerCounter = response.data.credential.answerCounter;
                            this.message = "";
                            this.signInScreen = false;
                            this.startButton = true;
                        }
                        else {
                            this.message = "Username and password don't match. Please try again. :)";
                        }
                    }
                    else {
                        this.createAccount();
                        this.message = "";
                        this.signInScreen = false;
                        this.startButton = true;
            }
            this.forgotten = "";
                return true;
        }).catch(err => {
            });
        },

        createAccount: function() {
            axios.post("api/credentials/", {
                username: this.username,
                password: this.password,
                guessedDrinks: this.drinkOptionsArray
            }).then(response => {
                this.guessedDrinks = response.data.credential.guessedDrinks;
                console.log(":)");
            })
        },

        updateAccount: function () {
            axios.put("api/credentials/update/", {
                username: this.username,
                guessedDrinks: this.guessedDrinks,
                answerCounter: this.answerCounter
            }).then(response => {
                console.log("happiness :D");
            }).catch(err => {
            });
        },

        deleteAccountAreYouSure: function () {
                this.startButton = false;
                this.nextQuestionButton = false;
                this.signInScreen = false;
                this.quizScreen = false;
                this.areYouSureMessage = true;
        },

        deleteAccountNo: function () {
            this.areYouSureMessage = false;
            this.quizScreen = true;
        },

        deleteAccountYes: function () {
            axios.delete("/api/credentials/" + this.username).then(response => {
                this.startButton = false;
                this.nextQuestionButton = false;
                this.signInScreen = true;
                this.quizScreen = false;
                this.areYouSureMessage = false;
                this.username = "";
                this.password = "";
                this.answerCounter = 0;
                this.guessedDrinks = this.drinkOptionsArray;
                this.message = "Exito! Account Deleted! Stay sober! :)";
            }).catch(err => {
            });
        },

        forgotPassword: function () {
            this.forgotPass = false;
            this.forgotten = "Nope, too bad."
        },

        prettyPlease: function () {
            this.forgotPass = true;
            this.forgotten = "Ai'ight, since you asked so nicely. Here you go!";

            var myUsername = this.username;
            axios.post("api/credentials/get/", {
                username: myUsername
            }).then(response => {
                if (response.data.foundUsername) {
                this.password = response.data.credential.password;
            }
        else {
                this.forgotten = "Hey! That's not even a valid username!";
            }
            return true;
        }).catch(err => {
            });
        },

        start: function() {
            this.startButton = false;
            this.quizScreen = true;
            this.setCurrentDrink();
            this.selectAnswer();
            this.setAnswers();
        },
        nextQuestion: function() {
            this.nextQuestionButton = false;
            this.updateAccount();
            this.start();
        },

        selectAnswer: function() {
            var randNum = Math.floor(Math.random() * (this.answerArray.length));
            this.currentCorrectAnswer = this.answerArray[randNum];
        },

        selectDrink: function () {
            var randNum = Math.floor(Math.random() * (this.drinkArray.length));
           return this.drinkArray[randNum].strDrink;
        },

        selectCorrectResponse: function(){
            var randNum = Math.floor(Math.random() * (this.correctArray.length));
            return this.correctArray[randNum];
        },

        selectIncorrectResponse: function(){
            var randNum = Math.floor(Math.random() * (this.incorrectArray.length));
            return this.incorrectArray[randNum];
        },

        setAnswers: function(){
            if ("answerA" === this.currentCorrectAnswer){
                this.answerA = this.currentDrink;
            }
            else{
                do{
                    this.answerA = this.selectDrink();
                }while(this.answerA === this.currentDrink);
            }
            if ("answerB" === this.currentCorrectAnswer){
                this.answerB = this.currentDrink;
            }
            else{
                do{
                    this.answerB = this.selectDrink();
                }while((this.answerB === this.currentDrink) || (this.answerB === this.answerA));
            }
            if("answerC" === this.currentCorrectAnswer){
                this.answerC = this.currentDrink;
            }
            else{
                do{
                    this.answerC = this.selectDrink();
                }while(this.answerC === this.currentDrink || (this.answerC === this.answerA) ||
                (this.answerC === this.answerB));
            }
            if("answerD" === this.currentCorrectAnswer){
                this.answerD = this.currentDrink;
            }
            else{
                do{
                    this.answerD = this.selectDrink();
                }while(this.answerD === this.currentDrink || (this.answerD === this.answerA) ||
                (this.answerD === this.answerB) || (this.answerD === this.answerC));
            }
        },


        A: function() {
            if (this.answerA === this.currentDrink) {
                this.results = this.selectCorrectResponse();
                ++this.answerCounter;
            }
            else {
                this.results = this.selectIncorrectResponse();
            }
            this.nextQuestionButton = true;
        },
        B: function() {
            if (this.answerB === this.currentDrink) {
                this.results = this.selectCorrectResponse();
                ++this.answerCounter;
            }
            else {
                this.results = this.selectIncorrectResponse();
            }
            this.nextQuestionButton = true;
        },
        C: function() {
            if (this.answerC === this.currentDrink) {
                this.results = this.selectCorrectResponse();
                ++this.answerCounter;
            }
            else {
                this.results = this.selectIncorrectResponse();
            }
            this.nextQuestionButton = true;
        },
        D: function() {
            if (this.answerD === this.currentDrink) {
                this.results = this.selectCorrectResponse();
                ++this.answerCounter;
            }
            else {
                this.results = this.selectIncorrectResponse();
            }
            this.nextQuestionButton = true;
        },

        setCurrentDrink: function() {
            if (this.guessedDrinks.length === 0) {
                this.guessedDrinks = this.drinkOptionsArray;
            }
            var randNum = Math.floor(Math.random() * (this.guessedDrinks.length));
            var drinkIndex = this.guessedDrinks[randNum];
            this.guessedDrinks.splice(randNum, 1);
            this.currentDrink = this.drinkArray[drinkIndex].strDrink;
            this.currentPicture = this.drinkArray[drinkIndex].strDrinkThumb;
        },

        cocktail: function() {
            fetch('https://www.thecocktaildb.com/api/json/v1/1/filter.php?c=Cocktail').then(response => {
                return response.json();
        }).then(json => {
            console.log(json);
            this.drinkArray = json.drinks;
            this.max = this.drinkArray.length - 1;
            for (var i = 0; i < this.drinkArray.length; ++i){
                this.drinkOptionsArray[i] = i;
            }
            this.guessedDrinks = this.drinkOptionsArray;
            this.setCurrentDrink();
            return true;
        }).catch(err => {
            })
    }
    }});
