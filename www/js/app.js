// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
app = angular.module('revolution', ['ionic', 'revolution.controllers', 'ngSanitize', 'textAngular', 'ngQuill', 'ngImgCrop', 'ionic-toast', 'ngCsv'])

app.run(function($ionicPlatform, $rootScope, $state, ChatService, $firebaseAuth) {

  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyCX_gH-ZsxFR4O4-91jJKAHGoTuHlIo1k0",
    authDomain: "sbfc-4f832.firebaseapp.com",
    databaseURL: "https://sbfc-4f832.firebaseio.com",
    storageBucket: "sbfc-4f832.appspot.com",
    messagingSenderId: "708872201881"
  };
  firebase.initializeApp(config);

  $ionicPlatform.ready(function() {

    $rootScope.notifications = [];

    // Enable to debug issues.
    // window.plugins.OneSignal.setLogLevel({logLevel: 4, visualLevel: 4});
    window.plugins.OneSignal.enableSound(true);
    window.plugins.OneSignal.enableVibrate(true);

    var notificationOpenedCallback = function(result) {
      // alert("Notification received:\n" + JSON.stringify(result));
      // console.log('Did I receive a notification: ' + JSON.stringify(result));
      var data = result.notification.payload;
      if (data) {
        var item = {};
        item.notificationID = data.notificationID;
        item.title = data.title;
        item.subtitle = data.subtitle;
        item.body = data.body;
        $rootScope.notifications.push(item);
      };
    };

// start tracker
// https://developers.google.com/analytics/devguides/collection/analyticsjs/

    $cordovaGoogleAnalytics.startTrackerWithId('UA-97705129-1');

// set user id
// https://developers.google.com/analytics/devguides/collection/analyticsjs/user-id

    $cordovaGoogleAnalytics.setUserId('USER_ID');


    window.plugins.OneSignal
      .startInit("bbf1fde1-85f5-4d5d-8d49-a3cf529ccece")
      .handleNotificationOpened(notificationOpenedCallback)
      .inFocusDisplaying(window.plugins.OneSignal.OSInFocusDisplayOption.Notification)
      .endInit();

    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });

  $rootScope.$on ('$stateChangeStart', function(event, toState, toParams, fromState, fromParams, currentUser){
    // console.log("transitionTo");
    // $rootScope.user = currentUser;
    if (toState.authRequired && ChatService.checkAuthStatus(currentUser)) { //Assuming the AuthService holds authentication logic
      // console.log("User isn’t authenticated");
      $state.transitionTo('app.login');
      event.preventDefault()
    }
  });
})

app.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
$ionicConfigProvider.tabs.position('bottom');
  $urlRouterProvider.otherwise('/app/admob');

  $stateProvider

  .state('app', {
    url: '/app',
    abstract: true,
    authRequired: false,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })

    .state('app.login', {
      url: '/login',
      // cache: false,
      authRequired: false,
      views: {
        'menuContent': {
          templateUrl: 'templates/login.html',
          controller: 'UserCtrl'
        }
      }
    })

    .state('app.register', {
      url: '/register',
      authRequired: false,
      views: {
        'menuContent': {
          templateUrl: 'templates/register.html',
          controller: 'UserCtrl'
        }
      }
    })

    .state('app.home', {
      url: '/home',
      authRequired: true,
      views: {
        'menuContent': {
          templateUrl: 'templates/home-tiles.html',
          controller: 'HomeCtrl'
        }
      }
    })

    .state('app.feed', {
      url: '/feed',
      authRequired: true,
      views: {
        'menuContent': {
          templateUrl: 'templates/home.html',
          controller: 'FirebaseCtrl'
        }
      }
    })

    .state('app.profile', {
      url: '/profile',
      authRequired: true,
      views: {
        'menuContent': {
          templateUrl: 'templates/profile.html',
          controller: 'AppCtrl'
        }
      }
    })

    .state('app.forgot', {
      url: '/forgot',
      authRequired: false,
      views: {
        'menuContent': {
          templateUrl: 'templates/forgot.html',
          controller: 'UserCtrl'
        }
      }
    })

    .state('app.macphotography', {
      url: '/home/macphotography',
      authRequired: true,
      views: {
        'menuContent': {
          templateUrl: 'templates/macphotography.html',
          controller: 'HomeCtrl'
        }
      }
    })

    .state('app.users', {
      url: '/users',
      authRequired: true,
      views: {
        'menuContent': {
          templateUrl: 'templates/users.html',
          controller: 'UsersCtrl'
        }
      }
    })

    .state('app.ask-an-expert', {
      url: '/ask-an-expert',
      authRequired: true,
      views: {
        'menuContent': {
          templateUrl: 'templates/ask-an-expert.html',
          controller: 'FirebaseCtrl'
        }
      }
    })

    .state('app.contraction-timer', {
      url: '/contraction-timer',
      authRequired: true,
      views: {
        'menuContent': {
          templateUrl: 'templates/contraction-timer.html',
          controller: 'stopWatchController'
        }
      }
    })

    .state('app.image-capture', {
      url: '/image-capture',
      authRequired: true,
      views: {
        'menuContent': {
          templateUrl: 'templates/image-capture.html',
          controller: 'stopWatchController'
        }
      }
    })

// notworking
    .state('app.allcontent', {
      url: '/allcontent',
      authRequired: true,
      views: {
        'menuContent': {
          templateUrl: 'templates/all-content.html',
          controller: 'FirebaseCtrl'
        }
      }
    })

// notworking
    .state('app.babypicture', {
      url: '/babypicture',
      authRequired: true,
      views: {
        'menuContent': {
          templateUrl: 'templates/babypicture.html',
          controller: 'FirebaseCtrl'
        }
      }
    })

    .state('app.marketplace', {
      url: '/marketplace',
      authRequired: true,
      views: {
        'menuContent': {
          templateUrl: 'templates/marketplace.html',
          controller: 'FirebaseCtrl'
        }
      }
    })


// notworking
    .state('app.filetransfer', {
      url: '/filetransfer',
      authRequired: true,
      views: {
        'menuContent': {
          templateUrl: 'templates/FileTransfer.html',
          controller: 'FileTransferCtrl'
        }
      }
    })

// notworking
    .state('app.addfolder', {
      url: '/addfolder',
      authRequired: true,
      views: {
        'menuContent': {
          templateUrl: 'templates/add-folder.html',
          controller: 'AddFolderCtrl'
        }
      }
    })


// notworking
    .state('app.editfolder', {
      url: '/editfolder/:id',
      authRequired: true,
      views: {
        'menuContent': {
          templateUrl: 'templates/edit-folder.html',
          controller: 'EditFolderCtrl'
        }
      }
    })

// notworking
    .state('app.readfolder', {
      url: '/readfolder/:id',
      authRequired: true,
      views: {
        'menuContent': {
          templateUrl: 'templates/read-folder.html',
          controller: 'EditFolderCtrl'
        }
      }
    })

    .state('app.articleslist', {
      url: '/articleslist/:id',
      authRequired: true,
      views: {
        'menuContent': {
          templateUrl: 'templates/articleslist.html',
          controller: 'FirebaseCtrl'
        }
      }
    })

    .state('app.news', {
      url: '/news',
      authRequired: true,
      views: {
        'menuContent': {
          templateUrl: 'templates/news.html',
          controller: 'NewsCtrl'
        }
      }
    })

    .state('app.dus', {
      url: '/dus',
      authRequired: true,
      views: {
        'menuContent': {
          templateUrl: 'templates/dus.html',
          controller: 'FileTransferCtrl'
        }
      }
    })

    .state('app.dus_files', {
      url: '/dus/files',
      authRequired: true,
      views: {
        'menuContent': {
          templateUrl: 'templates/dus_files.html',
          controller: 'FileTransferCtrl'
        }
      }
    })

    .state('app.newslist', {
      url: '/newslist/:id',
      authRequired: true,
      views: {
        'menuContent': {
          templateUrl: 'templates/newslist.html',
          controller: 'NewslistCtrl'
        }
      }
    })


    .state('app.newslistdetails', {
      url: '/newslistdetails',
      authRequired: true,
      views: {
        'menuContent': {
          templateUrl: 'templates/newslistdetails.html',
          controller: 'NewslistCtrl'
        }
      }
    })

    .state('app.smb', {
      url: '/smb',
      authRequired: true,
      views: {
        'menuContent': {
          templateUrl: 'templates/seacoastmomsblog.html',
          controller: 'smbCtrl'
        }
      }
    })

    .state('app.smblist', {
      url: '/smblist/:id',
      authRequired: true,
      views: {
        'menuContent': {
          templateUrl: 'templates/seacoastmomsbloglist.html',
          controller: 'smblistCtrl'
        }
      }
    })

    .state('app.blog', {
      url: '/blog/:id',
      authRequired: true,
      views: {
        'menuContent': {
          templateUrl: 'templates/blog.html',
          controller: 'BlogCtrl'
        }
      }
    })

    .state('app.post', {
      url: '/post/:id',
      authRequired: true,
      views: {
        'menuContent': {
          templateUrl: 'templates/post.html',
          controller: 'BlogCtrl'
        }
      }
    })

    .state('app.firebase', {
      url: '/firebase',
      authRequired: true,
      views: {
        'menuContent': {
          templateUrl: 'templates/firebase.html',
          controller: 'FirebaseCtrl'
        }
      }
    })

    // .state('app.submit', {
    //   url: '/submit',
    //   views: {
    //     'menuContent': {
    //       templateUrl: 'templates/submit-ask-an-expert.html',
    //       controller: 'FirebaseCtrl',
    //       authRequired: true
    //     }
    //   }
    // })

    .state('app.elements', {
      url: '/elements',
      authRequired: true,
      views: {
        'menuContent': {
          templateUrl: 'templates/elements.html',
          controller: 'ElementsCtrl'
        }
      }
    })

    .state('app.plugins', {
      url: '/plugins',
      authRequired: true,
      views: {
        'menuContent': {
          templateUrl: 'templates/plugins.html',
          controller: 'PluginsCtrl'
        }
      }
    })

    .state('app.add', {
      url: '/add',
      authRequired: true,
      views: {
        'menuContent': {
          templateUrl: 'templates/add.html',
          controller: 'ChatCtrl'
        }
      }
    })

    .state('app.submit-ask-an-expert', {
      url: '/submit-ask-an-expert',
      authRequired: true,
      views: {
        'menuContent': {
          templateUrl: 'templates/submit-ask-an-expert.html',
          controller: 'AskanexpertCtrl'
        }
      }
    })

    .state('app.questions', {
      url: '/questions',
      authRequired: true,
      views: {
        'menuContent': {
          templateUrl: 'templates/questions.html',
          controller: 'AskanexpertCtrl'
        }
      }
    })

    .state('app.edit', {
      url: '/edit/:id',
      authRequired: true,
      views: {
        'menuContent': {
          templateUrl: 'templates/edit.html',
          controller: 'EditCtrl'
        }
      }
    })

    .state('app.weather', {
      url: '/weather',
      authRequired: true,
      views: {
        'menuContent': {
          templateUrl: 'templates/weather.html',
          controller: 'WeatherCtrl'
        }
      }
    })

    .state('app.contact', {
      url: '/home/contact',
      authRequired: true,
      views: {
        'menuContent': {
          templateUrl: 'templates/contact.html',
          controller: 'HomeCtrl'
        }
      }
    })

    .state('app.calendar', {
      url: '/home/calendar',
      authRequired: true,
      views: {
        'menuContent': {
          templateUrl: 'templates/calendar.html',
          controller: 'HomeCtrl'
        }
      }
    })

    .state('app.youtube', {
      url: '/videos',
      authRequired: true,
      views: {
        'menuContent': {
          templateUrl: 'templates/youtube.html',
          controller: 'YoutubeCtrl'
        }
      }
    })

    .state('app.video', {
      url: '/video/:id/:index',
      authRequired: true,
      views: {
        'menuContent': {
          templateUrl: 'templates/youtubevideo.html',
          controller: 'YoutubeCtrl'
        }
      }
    })

    .state('app.maps', {
      url: '/home/maps',
      authRequired: true,
      views: {
        'menuContent': {
          templateUrl: 'templates/maps.html',
          controller: 'MapsCtrl'
        }
      }
    })

    .state('app.admob', {
      url: '/admob',
      authRequired: true,
      views: {
        'menuContent': {
          templateUrl: 'templates/admob.html',
          controller: 'AdmobCtrl'
        }
      }
    })

  // function authenticate($rootScope, ChatService, $location, $state) {
  //   var currentUser = localStorage.email  || $rootScope.user;
  //   $rootScope.user = currentUser;
  //   return ChatService.checkAuthStatus(currentUser, function (succ) {
  //     console.log('route to home');
  //     $state.go('app.home');
  //     return true
  //   }, function (err) {
  //     console.log('route to LOGIN');
  //     //  $state.go('app.login');
  //   })
  // }

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/home');

  // $urlRouterProvider.otherwise('/app/home');

})



app.config(function (ngQuillConfigProvider) {
  ngQuillConfigProvider.set([{
    alias: '10',
    size: '10px'
  }, {
    alias: '12',
    size: '12px'
  }, {
    alias: '14',
    size: '14px'
  }, {
    alias: '16',
    size: '16px'
  }, {
    alias: '18',
    size: '18px'
  }, {
    alias: '20',
    size: '20px'
  }, {
    alias: '22',
    size: '22px'
  }, {
    alias: '24',
    size: '24px'
  }], [{
    label: 'Arial',
    alias: 'Arial'
  }, {
    label: 'Sans Serif',
    alias: 'sans-serif'
  }, {
    label: 'Serif',
    alias: 'serif'
  }, {
    label: 'Monospace',
    alias: 'monospace'
  }, {
    label: 'Trebuchet MS',
    alias: '"Trebuchet MS"'
  }, {
    label: 'Verdana',
    alias: 'Verdana'
  }])
})
