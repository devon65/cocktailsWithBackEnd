Vue.component('star-rating', VueStarRating.default);

var app = new Vue({
    el: '#app',

    data: {
        username = "username";
        password = "password";
        number: '',
        max: 0,
        currentDrink: '',
        currentPicture: '',
        currentCorrectAnswer: '',
        drinkArray: [],
        drinkOptionsArray: [],
        guessedDrinks: [],
        startButton: true,
        nextQuestionButton: false,
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
        incorrectArray: ["Incorrect: Sorry my friend", "Incorrect, Incorrect: Better luck next time",
                        "Incorrect: What are you? Mormon?", "Incorrect: sorry Shirley Temple",
                        "Incorrect: I guess you only know the virgin drinks"],
},

    created: function() {
        this.cocktail();
        (var i = 0; i < this.drinkArray.length; ++i){
            this.drinkOptionsArray[i] = i;
        }
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
            axios.get("api/credentials/", {
                username: this.username
                }).then(response => {
                    if (response.foundUsername) {
                        if (response.password === this.password) {
                            this.guessedDrinks = response.guessedDrinks;
                        }
                        else {
                            //error, incorrect password
                        }
                    }
                    else {
                        this.createAccount
                    }

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
                guessedDrinks = response.guessedDrinks;
                console.log(":)");
            })
        },

        start: function() {
            this.startButton = false;
            this.setCurrentDrink();
            this.selectAnswer();
            this.setAnswers();
        },
        nextQuestion: function() {
            this.nextQuestionButton = false;
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
            var randNum = Math.floor(Math.random() * (this.max));
            this.currentDrink = this.drinkArray[randNum].strDrink;
            this.currentPicture = this.drinkArray[randNum].strDrinkThumb;
        },

        cocktail: function() {
            fetch('https://www.thecocktaildb.com/api/json/v1/1/filter.php?c=Cocktail').then(response => {
                return response.json();
        }).then(json => {
            console.log(json);
            this.drinkArray = json.drinks;
            this.max = this.drinkArray.length - 1;
            this.setCurrentDrink();
            return true;
        }).catch(err => {
            })
    }
    }});