var app = angular.module('revolution.controllers', ['firebase', 'ngResource']);

app.controller('AppCtrl', function($scope, $ionicLoading, $ionicSideMenuDelegate,$ionicScrollDelegate, FeedList) {

  // side menu open/closed - changing navigation icons
  $scope.$watch(function () {
    return $ionicSideMenuDelegate.getOpenRatio();
  },
    function (ratio) {
      if (ratio === 1 || ratio === -1){
        $scope.isActive= true;
      } else{
          $scope.isActive = false;
    }
  });

  // top menu animation
  $scope.topMenu = false;
  $scope.gotScrolled = function() {
    var top = $ionicScrollDelegate.getScrollPosition().top;
    if(top > 100) {
      $scope.topMenu = true;
      $scope.$apply();
    } else {
      $scope.topMenu = false;
      $scope.$apply();
    }
  }

$ionicLoading.show({
      template: 'Loading...'
    });

// RIGHT SIDE MENU NOTIFICATIONS

  $scope.data = {
    showDelete: false
  };
  
  $scope.edit = function(item) {
    alert('Edit Item: ' + item.id);
  };
  $scope.share = function(item) {
    alert('Share Item: ' + item.id);
  };
  
  $scope.moveItem = function(item, fromIndex, toIndex) {
    $scope.notifications.splice(fromIndex, 1);
    $scope.notifications.splice(toIndex, 0, item);
  };
  
  $scope.onItemDelete = function(item) {
    $scope.notifications.splice($scope.notifications.indexOf(item), 1);
  };

  $scope.notifications = [{
    id: 1,
    user: 'Janice Burke',
    text: 'Lorem ipsum dolor sit amet, per veri petentium iudicabit in.',
    img: '1.jpg'
  },{
    id: 2,
    user: 'Raymond Powell',
    text: 'Per tale expetendis signiferumque eu, mea partem causae vocent id.',
    img: '2.jpg'
  },{
    id: 3,
    user: 'Danielle Beck',
    text: 'Velit malorum eos ne, his ut probo possit contentiones.',
    img: '3.jpg'
  },{
    id: 4,
    user: 'Ronald Hall',
    text: 'Posse petentium imperdiet nec ex, ea sed detraxit molestiae.',
    img: '4.jpg'
  },{
    id: 5,
    user: 'Catherine Hunt',
    text: 'Semper urbanitas ullamcorper ut eam. Sint summo consequuntur ad nam, vix cu mucius alienum detracto, et eum zril labores abhorreant.',
    img: '5.jpg'
  }]


})

app.controller('UserCtrl', function($scope, $state, $ionicLoading, $ionicSideMenuDelegate, $firebaseAuth) {

  $ionicLoading.hide();
  $ionicSideMenuDelegate.canDragContent(false);

  $scope.facebook = function() {
    var auth = $firebaseAuth();
    // login with Facebook
    auth.$signInWithPopup("facebook").then(function(firebaseUser) {
      console.log("Signed in as:", firebaseUser, firebaseUser.user.displayName, firebaseUser.user.email, firebaseUser.user.photoURL, firebaseUser.UID );
      $scope.email = firebaseUser.user.email;
      $scope.username = firebaseUser.user.displayName;
    }).catch(function(error) {
      console.log("Authentication failed:", error);
    });
  }



  $scope.start = function() {
    $state.go('app.home');
  }

})

app.controller('HomeCtrl', function($scope, $ionicLoading, $ionicSideMenuDelegate) {

  $ionicLoading.hide();

  $ionicSideMenuDelegate.canDragContent(true);

  
        
        // OWL CAROUSEL INIT
   
      /*  $scope.carouselInitializer = function() {
          $(".about-carousel").owlCarousel({
            items: 3,
            navigation: true,
            pagination: false,
            navigationText: ["<i class='fa fa-angle-left'></i>", "<i class='fa fa-angle-right'></i>"]
          });
        }; */

    





})


app.controller('NewsCtrl', function($scope, $ionicLoading, FeedList) {

  // NEWS FEED
  var getNews = function(num) {
      $scope.news = [];

      FeedList.get(num).then(function(feeddata){
        var data = feeddata[0].entries;
        for(x=0;x<data.length;x++) {
            var img = data[x].mediaGroups[0].contents[0].url ;
          $scope.news.push({
            title: data[x].title,
            excerpt: data[x].contentSnippet,  
            img: img  
          })
        }
        $ionicLoading.hide();
        })
      
    }
    getNews(10);

})



app.controller('BlogCtrl', function($scope, $ionicLoading, $stateParams, Blog) {

  $scope.categShow = false;
  $scope.showCategories = function() {
    if($scope.categShow == false) {
      $scope.categShow = true;
    } else {
      $scope.categShow = false;
    }
  }

  Blog.categories().then(
    function(data){
      $scope.categories = data.data.categories;
      $ionicLoading.hide();
    },
    function(error){
    }
  )

   


// WORDPRESS FEED
  Blog.posts($stateParams.id).then(
    function(data){
      $scope.posts = data.data.posts;
      $ionicLoading.hide();
    },
    function(error){
    }
  )






})


app.controller('FirebaseCtrl', function($scope, $ionicLoading, Firebase, $firebaseObject, $firebaseArray) {

  // FIREBASE

  // object
  var URL = Firebase.url();

  var refObject = firebase.database().ref().child("data");
  // download the data into a local object
  var syncObject = $firebaseObject(refObject);
  // synchronize the object with a three-way data binding
  syncObject.$bindTo($scope, "firebaseObject");
    $ionicLoading.hide();
  

  // array
  var refArray = firebase.database().ref().child("messages");
  // create a synchronized array
  $scope.messages = $firebaseArray(refArray);
  // add new items to the array
  // the message is automatically added to our Firebase database!
  $scope.addMessage = function(message) {
    $scope.newMessageText = null;
    $scope.messages.$add({
      text: message
    });

  };

})




app.controller('ElementsCtrl', function($scope, $ionicLoading) {
  $ionicLoading.hide();
})












