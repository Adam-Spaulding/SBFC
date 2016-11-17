// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
app = angular.module('revolution', ['ionic', 'revolution.controllers', 'textAngular', 'ngQuill', 'ngImgCrop'])

app.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {


     // Enable to debug issues.
  // window.plugins.OneSignal.setLogLevel({logLevel: 4, visualLevel: 4});

  var notificationOpenedCallback = function(jsonData) {
    console.log('didReceiveRemoteNotificationCallBack: ' + JSON.stringify(jsonData));
  };

  window.plugins.OneSignal.init("Onesignal App ID here",
                                 {googleProjectNumber: "***Google Sender/Project ID here***"},
                                 notificationOpenedCallback);

  // Show an alert box if a notification comes in when the user is in your app.
  window.plugins.OneSignal.enableInAppAlertNotification(true);


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
})

app.config(function($stateProvider, $urlRouterProvider) {

  $stateProvider

    .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })

    .state('app.login', {
      url: '/login',
      views: {
        'menuContent': {
          templateUrl: 'templates/login.html',
          controller: 'UserCtrl'
        }
      }
    })

    .state('app.register', {
      url: '/register',
      views: {
        'menuContent': {
          templateUrl: 'templates/register.html',
          controller: 'UserCtrl'
        }
      }
    })

    .state('app.profile', {
      url: '/profile',
      views: {
        'menuContent': {
          templateUrl: 'templates/profile.html',
          controller: 'UserCtrl'
        }
      }
    })

    .state('app.forgot', {
      url: '/forgot',
      views: {
        'menuContent': {
          templateUrl: 'templates/forgot.html',
          controller: 'UserCtrl'
        }
      }
    })

    .state('app.home', {
      url: '/home',
      views: {
        'menuContent': {
          templateUrl: 'templates/home.html',
          controller: 'HomeCtrl'
        }
      }
    })

    .state('app.news', {
      url: '/news',
      views: {
        'menuContent': {
          templateUrl: 'templates/news.html',
          controller: 'NewsCtrl'
        }
      }
    })

    .state('app.newslist', {
      url: '/newslist/:id',
      views: {
        'menuContent': {
          templateUrl: 'templates/newslist.html',
          controller: 'NewslistCtrl'
        }
      }
    })

    .state('app.blog', {
      url: '/blog/:id',
      views: {
        'menuContent': {
          templateUrl: 'templates/blog.html',
          controller: 'BlogCtrl'
        }
      }
    })

    .state('app.post', {
      url: '/post/:id',
      views: {
        'menuContent': {
          templateUrl: 'templates/post.html',
          controller: 'BlogCtrl'
        }
      }
    })

    .state('app.firebase', {
      url: '/firebase',
      views: {
        'menuContent': {
          templateUrl: 'templates/firebase.html',
          controller: 'FirebaseCtrl'
        }
      }
    })

    .state('app.elements', {
      url: '/elements',
      views: {
        'menuContent': {
          templateUrl: 'templates/elements.html',
          controller: 'ElementsCtrl'
        }
      }
    })

    .state('app.plugins', {
      url: '/plugins',
      views: {
        'menuContent': {
          templateUrl: 'templates/plugins.html',
          controller: 'PluginsCtrl'
        }
      }
    })

    .state('app.chat', {
      cache: false,
      url: '/chat',
      views: {
        'menuContent': {
          templateUrl: 'templates/chat.html',
          controller: 'ChatCtrl'
        }
      }
    })

    .state('app.add', {
      cache: false,
      url: '/add',
      views: {
        'menuContent': {
          templateUrl: 'templates/add.html',
          controller: 'ChatCtrl'
        }
      }
    })

    .state('app.weather', {
      cache: false,
      url: '/weather',
      views: {
        'menuContent': {
          templateUrl: 'templates/weather.html',
          controller: 'WeatherCtrl'
        }
      }
    })

    .state('app.contact', {
      url: '/home/contact',
      views: {
        'menuContent': {
          templateUrl: 'templates/contact.html',
          controller: 'ContactCtrl'
        }
      }
    })

    .state('app.youtube', {
      url: '/videos',
      views: {
        'menuContent': {
          templateUrl: 'templates/youtube.html',
          controller: 'YoutubeCtrl'
        }
      }
    })

    .state('app.video', {
      url: '/video/:id/:index',
      views: {
        'menuContent': {
          templateUrl: 'templates/youtubevideo.html',
          controller: 'YoutubeCtrl'
        }
      }
    })

    .state('app.maps', {
      url: '/home/maps',
      views: {
        'menuContent': {
          templateUrl: 'templates/maps.html',
          controller: 'MapsCtrl'
        }
      }
    })

    .state('app.admob', {
      url: '/admob',
      views: {
        'menuContent': {
          templateUrl: 'templates/admob.html',
          controller: 'AdmobCtrl'
        }
      }
    })


  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/home');
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
