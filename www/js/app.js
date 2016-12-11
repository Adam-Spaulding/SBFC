// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
app = angular.module('revolution', ['ionic', 'revolution.controllers', 'ngSanitize', 'textAngular', 'ngQuill', 'ngImgCrop', 'ionic-toast'])



app.run(function($ionicPlatform, $rootScope, $state, ChatService) {
  $ionicPlatform.ready(function() {

    /*$rootScope.$on('$locationChangeSuccess', function() {
      ChatService.checkAuthStatus($rootScope.user, function (succ) {
        console.log('route to SUCCESS');
        //$state.go('app.home');
      }, function (err) {
        console.log('route to LOGIN');
        // $state.go('app.login');
      });
    })*/

     // Enable to debug issues.
  // window.plugins.OneSignal.setLogLevel({logLevel: 4, visualLevel: 4});

  var notificationOpenedCallback = function(jsonData) {
    console.log('didReceiveRemoteNotificationCallBack: ' + JSON.stringify(jsonData));
  };

  window.plugins.OneSignal.init("7fe9fa6d-c066-4c9d-8583-8d931cfacb07",
                                 {googleProjectNumber: "906792644102"},
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
  $rootScope.$on("$stateChangeStart", function(event, toState, toParams, fromState, fromParams){
    if (toState.views.menuContent.authRequired && ChatService.checkAuthStatus($rootScope.user)) { //Assuming the AuthService holds authentication logic
      // User isn’t authenticated
      $state.transitionTo("app.login");
      event.preventDefault();
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
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl',
      authRequired: false
  })

    .state('app.login', {
      url: '/login',
      views: {
        'menuContent': {
          templateUrl: 'templates/login.html',
          controller: 'UserCtrl',
          authRequired: false
        }
      }
    })

    .state('app.register', {
      url: '/register',
      views: {
        'menuContent': {
          templateUrl: 'templates/register.html',
          controller: 'UserCtrl',
          authRequired: false

        }
      }
    })

    .state('app.nhome', {
      //cache: false,
      url: '/nhome',
      views: {
        'menuContent': {
          templateUrl: 'templates/home-tiles.html',
          controller: 'FirebaseCtrl',
          authRequired: true
        }
      }
    })

    .state('app.profile', {
      url: '/profile',
      views: {
        'menuContent': {
          templateUrl: 'templates/profile.html',
          controller: 'UserCtrl',
          authRequired: true
        }
      }
    })

    .state('app.forgot', {
      url: '/forgot',
      views: {
        'menuContent': {
          templateUrl: 'templates/forgot.html',
          controller: 'UserCtrl',
          authRequired: true
        }
      }
    })

    .state('app.macphotography', {
      url: '/home/macphotography',
      views: {
        'menuContent': {
          templateUrl: 'templates/macphotography.html',
          controller: 'HomeCtrl',
          authRequired: true
        }
      }
    })

    .state('app.ask-an-expert', {
      url: '/ask-an-expert',
      views: {
        'menuContent': {
          templateUrl: 'templates/ask-an-expert.html',
          controller: 'FirebaseCtrl',
          authRequired: true
        }
      }
    })

    .state('app.allcontent', {
      url: '/allcontent',
      views: {
        'menuContent': {
          templateUrl: 'templates/all-content.html',
          controller: 'FirebaseCtrl',
          authRequired: true
        }
      }
    })

    .state('app.babypicture', {
      url: '/babypicture',
      views: {
        'menuContent': {
          templateUrl: 'templates/babypicture.html',
          controller: 'FirebaseCtrl',
          authRequired: true
        }
      }
    })

    .state('app.marketplace', {
      url: '/marketplace',
      views: {
        'menuContent': {
          templateUrl: 'templates/marketplace.html',
          controller: 'FirebaseCtrl',
          authRequired: true
        }
      }
    })

    .state('app.articleslist', {
      url: '/articleslist/:id',
      views: {
        'menuContent': {
          templateUrl: 'templates/articleslist.html',
          controller: 'FirebaseCtrl',
          authRequired: true
        }
      }
    })

    .state('app.news', {
      url: '/news',
      views: {
        'menuContent': {
          templateUrl: 'templates/news.html',
          controller: 'NewsCtrl',
          authRequired: true
        }
      }
    })


    .state('app.newslist', {
      url: '/newslist/:id',
      views: {
        'menuContent': {
          templateUrl: 'templates/newslist.html',
          controller: 'NewslistCtrl',
          authRequired: true
        }
      }
    })

    .state('app.smb', {
      url: '/smb',
      views: {
        'menuContent': {
          templateUrl: 'templates/seacoastmomsblog.html',
          controller: 'smbCtrl'
        }
      }
    })

    .state('app.smblist', {
      url: '/smblist/:id',
      views: {
        'menuContent': {
          templateUrl: 'templates/seacoastmomsbloglist.html',
          controller: 'smblistCtrl'
        }
      }
    })

    .state('app.blog', {
      url: '/blog/:id',
      views: {
        'menuContent': {
          templateUrl: 'templates/blog.html',
          controller: 'BlogCtrl',
          authRequired: true
        }
      }
    })

    .state('app.post', {
      url: '/post/:id',
      views: {
        'menuContent': {
          templateUrl: 'templates/post.html',
          controller: 'BlogCtrl',
          authRequired: true
        }
      }
    })

    .state('app.firebase', {
      url: '/firebase',
      views: {
        'menuContent': {
          templateUrl: 'templates/firebase.html',
          controller: 'FirebaseCtrl',
          authRequired: true
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
      views: {
        'menuContent': {
          templateUrl: 'templates/elements.html',
          controller: 'ElementsCtrl',
          authRequired: true
        }
      }
    })

    .state('app.plugins', {
      url: '/plugins',
      views: {
        'menuContent': {
          templateUrl: 'templates/plugins.html',
          controller: 'PluginsCtrl',
          authRequired: true
        }
      }
    })

    .state('app.chat', {
      cache: false,
      url: '/chat',
      views: {
        'menuContent': {
          templateUrl: 'templates/chat.html',
          controller: 'ChatCtrl',
          authRequired: true
        }
      }
    })

    .state('app.add', {
      cache: false,
      url: '/add',
      views: {
        'menuContent': {
          templateUrl: 'templates/add.html',
          controller: 'ChatCtrl',
          authRequired: true
        }
      }
    })

    .state('app.submit-ask-an-expert', {
      cache: false,
      url: '/submit-ask-an-expert',
      views: {
        'menuContent': {
          templateUrl: 'templates/submit-ask-an-expert.html',
          controller: 'AskanexpertCtrl',
          authRequired: true
        }
      }
    })

    .state('app.questions', {
      cache: false,
      url: '/questions',
      views: {
        'menuContent': {
          templateUrl: 'templates/questions.html',
          controller: 'AskanexpertCtrl',
          authRequired: true
        }
      }
    })

    .state('app.edit', {
      cache: false,
      url: '/edit/:id',
      views: {
        'menuContent': {
          templateUrl: 'templates/edit.html',
          controller: 'EditCtrl',
          authRequired: true
        }
      }
    })

    .state('app.weather', {
      cache: false,
      url: '/weather',
      views: {
        'menuContent': {
          templateUrl: 'templates/weather.html',
          controller: 'WeatherCtrl',
          authRequired: true
        }
      }
    })

    .state('app.contact', {
      url: '/home/contact',
      views: {
        'menuContent': {
          templateUrl: 'templates/contact.html',
          controller: 'HomeCtrl',
          authRequired: true
        }
      }
    })

    .state('app.calendar', {
      url: '/home/calendar',
      views: {
        'menuContent': {
          templateUrl: 'templates/calendar.html',
          controller: 'HomeCtrl',
          authRequired: true
        }
      }
    })

    .state('app.youtube', {
      url: '/videos',
      views: {
        'menuContent': {
          templateUrl: 'templates/youtube.html',
          controller: 'YoutubeCtrl',
          authRequired: true
        }
      }
    })

    .state('app.video', {
      url: '/video/:id/:index',
      views: {
        'menuContent': {
          templateUrl: 'templates/youtubevideo.html',
          controller: 'YoutubeCtrl',
          authRequired: true
        }
      }
    })

    .state('app.maps', {
      url: '/home/maps',
      views: {
        'menuContent': {
          templateUrl: 'templates/maps.html',
          controller: 'MapsCtrl',
          authRequired: true
        }
      }
    })

    .state('app.admob', {
      url: '/admob',
      views: {
        'menuContent': {
          templateUrl: 'templates/admob.html',
          controller: 'AdmobCtrl',
          authRequired: true
        }
      }
    })

  function authenticate($rootScope, ChatService, $location) {
    return ChatService.checkAuthStatus($rootScope.user, function (succ) {
      console.log('route to home');
      return true
    }, function (err) {
      console.log('route to LOGIN');
       $location.path('/login');
    })
  }

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/login');
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
