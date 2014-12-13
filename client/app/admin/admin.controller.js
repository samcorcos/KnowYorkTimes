'use strict';

angular.module('knowyorktimesApp')
  .controller('AdminCtrl', function ($scope, $http, Auth, User, $mdToast) {
    // Use the User $resource to fetch all users
    $scope.users = User.query();

    $http.get('/api/questions').success(function(questions) {
      $scope.questions = questions;
    });


    $scope.quizObject = {
      date: "",
      questions: [],
      playsInfo: {}
    }

    $scope.flexQuestionsArray = [];

    $scope.fakeImagesArray = [];
    $scope.fakeTitlesArray = [];
    $scope.fakeSnippetsArray = [];

    $scope.indexQuestion = 1;

    $scope.buildQuestions = function() {


      $http.get('/api/names').success(function(results) {
        var parsedRes = JSON.parse(results.body)
        var docsArray = parsedRes['response']['docs'];
        console.log(docsArray);

        console.log("-----------------------------------docsArray");
        console.log(docsArray);

        // loop over articles and create flexObjects from them, also create the fake answer arrays
        docsArray.forEach(function(articleObject) {
          if (articleObject.multimedia.length > 0 && articleObject.headline.main && articleObject.snippet ) {
          var articleImage = "http://www.nytimes.com/" + articleObject.multimedia[0].url;
          var articleTitle = articleObject.headline.main;
          var articleSnippet = articleObject.snippet;
          var newFlexQuestion = new FlexQuestion(articleImage, articleTitle, articleSnippet);
          $scope.flexQuestionsArray.push(newFlexQuestion);
          $scope.fakeImagesArray.push(articleImage);
          $scope.fakeTitlesArray.push(articleTitle);
          $scope.fakeSnippetsArray.push(articleSnippet);
        }
        });

        // loop over the just created array of flexQuestions as well as the fake answer arrays and assign the flexQuestions fakeAnswers properties
        $scope.flexQuestionsArray.forEach(function(flexQuestion) {

          // fake images
          $scope.fakeImagesArray.forEach(function(fakeImage) {
            if (flexQuestion.image !== fakeImage) {
              flexQuestion.fakeImages.push(fakeImage);
            }
          });

          // fake Titles
          $scope.fakeTitlesArray.forEach(function(fakeTitle) {
            if (flexQuestion.title !== fakeTitle) {
              flexQuestion.fakeTitles.push(fakeTitle);
            }
          });

          // fake Spippets
          $scope.fakeSnippetsArray.forEach(function(fakeSnippet) {
            if (flexQuestion.snippet !== fakeSnippet) {
              flexQuestion.fakeSnippets.push(fakeSnippet);
            }
          });

        });

        // loop over the flex questions and set there display properties
        $scope.flexQuestionsArray.forEach(function(flexQuestion) {
          flexQuestion.setDisplayAnswer("image");
          flexQuestion.setDisplayAnswer("title");
          flexQuestion.setDisplayAnswer("snippet");
          flexQuestion.setDisplayAnswer("name");
        });

        console.log("---------------------------------flexQestionsArray");
        console.log($scope.flexQuestionsArray);
        console.log("--------------------------------fakeImagesArray");
        console.log($scope.fakeImagesArray);
        console.log("--------------------------------fakeTitlesArray");
        console.log($scope.fakeTitlesArray);
        console.log("--------------------------------fakeSnippetsArray");
        console.log($scope.fakeSnippetsArray);
        // console.log(questions);



        // loop through your questions for each of them save the to data base
        $scope.flexQuestionsArray.forEach(function(felxQuestion) {


          $http.post('/api/questions', {
            index: $scope.indexQuestion,
            image: felxQuestion.image,
            displayImage: felxQuestion.displayImage,
            fakeImages: felxQuestion.fakeImages,
            title: felxQuestion.title,
            displayTitle: felxQuestion.displayTitle,
            fakeTitles: felxQuestion.fakeTitles,
            snippet: felxQuestion.snippet,
            displaySnippet: felxQuestion.displaySnippet,
            fakeSnippets: felxQuestion.fakeSnippets,
            name: felxQuestion.name,
            displayName: felxQuestion.displayName,
            fakeNames: felxQuestion.fakeNames,
            displayAnswer: felxQuestion.displayAnswer

          }).
          success(function(data) {
            return data;
          }).
          error(function(err) {
            console.log(err);
          });

          $scope.indexQuestion++;
        });

        $http.get('/api/questions').success(function(questions) {

          questions.forEach(function(question) {
            question.oneRandomFakeAnswer = function(answerName){
              var fakeAnswerArrayName = "";
              if (answerName === "image") {
                fakeAnswerArrayName = "fakeImages";
              } else if (answerName === "title") {
                fakeAnswerArrayName = "fakeTitles";
              } else if (answerName === "snippet") {
                fakeAnswerArrayName = "fakeSnippets";
              }  else if (answerName === "snippet") {
                fakeAnswerArrayName = "fakeNames";
              }
              if (fakeAnswerArrayName === "fakeImages") {
                var randomIndex = Math.floor((Math.random() * (this.fakeImages.length -1)) + 0);
                this.displayImage = this.fakeImages[randomIndex];
              } else if (fakeAnswerArrayName === "fakeTitles" ){
                var randomIndex = Math.floor((Math.random() * (this.fakeTitles.length -1)) + 0);
                this.displayTitle = this.fakeTitles[randomIndex];
              } else if (fakeAnswerArrayName === "fakeSnippets"){
                var randomIndex = Math.floor((Math.random() * (this.fakeSnippets.length -1)) + 0);
                this.displaySnippet = this.fakeSnippets[randomIndex];
              } else if (fakeAnswerArrayName === "fakeNames" ) {
                var randomIndex = Math.floor((Math.random() * (this.fakeNames.length -1)) + 0);
                this.displayName = this.fakeNames[randomIndex];
              }
            };

            question.setDisplayAnswer = function(answerName) {
              var randomNumber = Math.floor((Math.random() * 2) + 0);
              if (randomNumber === 1 && answerName === "title" ) {
                this.displayTitle = this.title;
              } else if (randomNumber === 1 && answerName === "image" ) {
                this.displayImage = this.image;
              } else if (randomNumber === 1 && answerName === "snippet" ) {
                this.displaySnippet = this.snippet;
              } else if (randomNumber === 1 && answerName === "name") {

              } else {
                return this.oneRandomFakeAnswer(answerName);
              }
            };

            question.correctAnswer = function(yesorno, answerType) {
              console.log(answerType);
              this.setDisplayedAnswer(answerType);

              if (yesorno === "yes"){
                if (this.displayAnswer === this.image || this.displayAnswer === this.title || this.displayAnswer === this.snippet || this.displayAnswer === this.name) {
                  alert("you are correct");
                } else {
                  alert("you soooo wrong!!!!!!!!");
                }
              } else if (yesorno === "no") {
                if (this.displayAnswer === this.image || this.displayAnswer === this.title || this.displayAnswer === this.snippet || this.displayAnswer === this.name) {
                  alert("you soooo wrong!!!!!!!!");
                } else {
                  alert("you are correct");
                }
              }
            };

            question.setDisplayedAnswer = function(answerType) {
              if (answerType === "image") {
                this.displayAnswer = this.displayImage;
              } else if (answerType === "title") {
                this.displayAnswer = this.displayTitle;
                console.log("got here");
              } else if (answerType === "snippet") {
                this.displayAnswer = this.displaySnippet;
              } else if (answerType === "name") {
                this.displayAnswer = this.displayName;
              }
            };


          });

          $scope.questions = questions;
        });
    });
  };


  $scope.yesButtonClickImageToTitle = function(questionObject) {
     if (questionObject.displayTitle === questionObject.title) {

       $mdToast.show(
         $mdToast.simple()
         .content('Your Right!')
         .position('bottom right')
         .hideDelay(2000)
       );
     } else {

       $mdToast.show(
         $mdToast.simple()
         .content('Your Wrong :(')
         .position('bottom right')
         .hideDelay(2000)
       );
     }
     currentQuestionIndex += 1;
  }

  $scope.noButtonClickImageToTitle = function(questionObject) {
    if (questionObject.displayTitle !== questionObject.title) {

      $mdToast.show(
        $mdToast.simple()
        .content('Your Right!')
        .position('bottom right')
        .hideDelay(2000)
      );
    } else {

      $mdToast.show(
        $mdToast.simple()
        .content('Your Wrong :(')
        .position('bottom right')
        .hideDelay(2000)
      );
    }
    currentQuestionIndex += 1;
  }






  console.log($scope.questions);

  $scope.names = ['Igor Minar', 'Brad Green', 'Dave Geddes', 'Naomi Black', 'Greg Weber', 'Dean Sofer', 'Wes Alvaro', 'John Scott', 'Daniel Nadasi'];
  $scope.showSimpleToast = function() {
    $mdToast.show(
      $mdToast.simple()
      .content('Your Right!')
      .position('bottom right')
      .hideDelay(2000)
    );

    currentQuestionIndex += 1;
  };




  var currentQuestionIndex = 1;
  $scope.filterQuestion = function(question) {
    return question.index === currentQuestionIndex;
  }

  function FlexQuestion(image, title, snippet){
    this.image = image;
    this.displayImage = "";
    this.fakeImages = [];
    this.title = title;
    this.displayTitle = "";
    this.fakeTitles = [];
    this.snippet = snippet;
    this.displaySnippet = "";
    this.fakeSnippets = [];
    this.name = "";
    this.displaame = "";
    this.fakeNames = [];
    this.displayAnswer = "";


    this.oneRandomFakeAnswer = function(answerName){
      var fakeAnswerArrayName = "";
      if (answerName === "image") {
        fakeAnswerArrayName = "fakeImages";
      } else if (answerName === "title") {
        fakeAnswerArrayName = "fakeTitles";
      } else if (answerName === "snippet") {
        fakeAnswerArrayName = "fakeSnippets";
      }  else if (answerName === "snippet") {
        fakeAnswerArrayName = "fakeNames";
      }
      if (fakeAnswerArrayName === "fakeImages") {
        var randomIndex = Math.floor((Math.random() * (this.fakeImages.length -1)) + 0);
        this.displayImage = this.fakeImages[randomIndex];
      } else if (fakeAnswerArrayName === "fakeTitles" ){
        var randomIndex = Math.floor((Math.random() * (this.fakeTitles.length -1)) + 0);
        this.displayTitle = this.fakeTitles[randomIndex];
      } else if (fakeAnswerArrayName === "fakeSnippets"){
        var randomIndex = Math.floor((Math.random() * (this.fakeSnippets.length -1)) + 0);
        this.displaySnippet = this.fakeSnippets[randomIndex];
      } else if (fakeAnswerArrayName === "fakeNames" ) {
        var randomIndex = Math.floor((Math.random() * (this.fakeNames.length -1)) + 0);
        this.displayName = this.fakeNames[randomIndex];
      }
    };

    this.setDisplayAnswer = function(answerName) {
      var randomNumber = Math.floor((Math.random() * 2) + 0);
      if (randomNumber === 1 && answerName === "title" ) {
        this.displayTitle = this.title;
      } else if (randomNumber === 1 && answerName === "image" ) {
        this.displayImage = this.image;
      } else if (randomNumber === 1 && answerName === "snippet" ) {
        this.displaySnippet = this.snippet;
      } else if (randomNumber === 1 && answerName === "name") {

      } else {
        return this.oneRandomFakeAnswer(answerName);
      }
    };

    this.correctAnswer = function(yesorno, answerType) {
      console.log(answerType);
      this.setDisplayedAnswer(answerType);

      if (yesorno === "yes"){
        if (this.displayAnswer === this.image || this.displayAnswer === this.title || this.displayAnswer === this.snippet || this.displayAnswer === this.name) {
          alert("you are correct");
        } else {
          alert("you soooo wrong!!!!!!!!");
        }
      } else if (yesorno === "no") {
        if (this.displayAnswer === this.image || this.displayAnswer === this.title || this.displayAnswer === this.snippet || this.displayAnswer === this.name) {
          alert("you soooo wrong!!!!!!!!");
        } else {
          alert("you are correct");
        }
      }
    };

    this.setDisplayedAnswer = function(answerType) {
      if (answerType === "image") {
        this.displayAnswer = this.displayImage;
      } else if (answerType === "title") {
        this.displayAnswer = this.displayTitle;
        console.log("got here");
      } else if (answerType === "snippet") {
        this.displayAnswer = this.displaySnippet;
      } else if (answerType === "name") {
        this.displayAnswer = this.displayName;
      }
    }
  };


});