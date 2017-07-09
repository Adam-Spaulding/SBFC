function init() {
  window.initGapi(); // Calls the init function defined on the window
}

var app = angular.module('revolution.controllers', ['firebase', 'ngCordova', 'ngMap', 'ngResource', 'ngAnimate']);

app.controller('AppCtrl', function ($scope, $rootScope, $timeout, $firebaseArray, $state, $ionicLoading, $ionicSideMenuDelegate, $ionicHistory, FirebaseUser, $firebaseAuth, $firebaseObject) {

  // side menu open/closed - changing navigation icons
  $scope.$watch(function () {
    return $ionicSideMenuDelegate.getOpenRatio();
  },
    function (ratio) {
      if (ratio === 1 || ratio === -1) {
        $scope.isActive = true;
      } else {
        $scope.isActive = false;
      }
    });

  // go back button
  $scope.back = function () {
    $ionicHistory.goBack();
  }

  // array
  var refArrayAlerts = firebase.database().ref().child("userInfo");
  // create a synchronized array
  $scope.alerts = $firebaseArray(refArrayAlerts);

  $scope.getUserStatus = function() {
    // get firebase user
    var user = FirebaseUser.status();
    if(user) {
      $rootScope.user = user.email;
      $rootScope.userUid = user.uid;
      var refArray = firebase.database().ref().child("users").child($rootScope.userUid);
      var currentUserProfile = $firebaseObject(refArray);
      currentUserProfile.$loaded().then(function(user){
        // localStorage.setItem("email", user.email)
        // localStorage.setItem(user.uid)
        // localStorage.setItem("name", user.name)
        $rootScope.username = user.name;
      })
    } else {
      $rootScope.user = 'Anonymous';
      $rootScope.userUid = 0;
    }
  }

  // $scope.$watch(
  //   function ($scope) {
  //     return ($scope.getUserStatus());
  //   },
  //   function (newValue) {
  //   }
  // );

  $scope.logout = function () {
    $firebaseAuth().$signOut();
    $timeout(function () {
      $scope.getUserStatus();
      $state.go('app.login');
    }, 1000)
  }

  // USER PROFILE
  $scope.goToProfile = function (uid) {
    // $rootScope.userUid = localStorage.userUid;
    // $rootScope.user = localStorage.email;
    var refArray = firebase.database().ref().child("users").child($rootScope.userUid);
    $scope.userProfile = $firebaseObject(refArray);
    $state.go('app.profile');
  }

  // USER PROFILE
  $scope.getUserRoles = function (uid) {
    // $rootScope.userUid = localStorage.userUid;
    // $rootScope.user = localStorage.email;
    var refArray = firebase.database().ref().child("users").child($rootScope.userUid);
    $scope.userProfile = $firebaseObject(refArray);
    // $state.go('app.profile');
  }


  // RIGHT SIDE MENU NOTIFICATIONS

  $scope.data = {
    showDelete: true
  };

  $scope.edit = function (item) {
    alert('Edit Item: ' + item.id);
  };
  $scope.share = function (item) {
    alert('Share Item: ' + item.id);
  };

  $scope.moveItem = function (item, fromIndex, toIndex) {
    $scope.notifications.splice(fromIndex, 1);
    $scope.notifications.splice(toIndex, 0, item);
  };

  $scope.onItemDelete = function (item) {
    $scope.notifications.splice($scope.notifications.indexOf(item), 1);
  };

  $rootScope.userUid = localStorage.userUid;
  $rootScope.user = localStorage.email;

})

app.controller('UserCtrl', function ($scope, $rootScope, $state, $ionicLoading, $ionicSideMenuDelegate, $ionicViewService, $firebaseObject, $firebaseAuth, $firebaseArray, ionicToast) {


  $ionicSideMenuDelegate.canDragContent(false);

  $scope.start = function () {
    $state.go('app.home');
  };

  $scope.authObj = $firebaseAuth();

  // firebase register
  $scope.register = function (email, password, phone, name) {
    if (email == null || password == null || phone == null || name == null) {
      ionicToast.show('Please enter your name, a valid email, password, and phone number.', 'bottom', true, 4500);
      // alert('Email or Password must not be empty!');
      return
    }
    $scope.authObj.$createUserWithEmailAndPassword(email, password, name)
      .then(function (firebaseUser) {

        // create 'user' array same id - to store user profile
        var refArray = firebase.database().ref().child("users").child(firebaseUser.uid);
        var users = $firebaseObject(refArray);
        users.email = firebaseUser.email;
        users.phone = 'phone';
        users.user = ("true");
        users.dus = ("false");
        users.admin = ("false");
        users.expert = ("false");
        users.location = 'location';
        users.name = name;
        users.$save().then(function (ref) {
        }, function (error) {
          console.log("Error:", error);
        });

        ionicToast.show('Success! Please remember to complete your profile.', 'bottom', false, 2500);
        $state.go('app.home');
      }).catch(function (error) {
        console.error("Error: ", error);
        ionicToast.show('Please enter a valid email, password, and phone number.', 'bottom', false, 4500);
        // alert('User register failed!');
      });
  };

  // firebase login
  $scope.login = function (email, password) {
    if (email == null || password == null) {
      ionicToast.show('The email or passowrd is not correct. Please try again.', 'bottom', true, 4500);
      // alert('That username or passowrd is not correct. Please try again.');

      return
    } else {
      window.localStorage.setItem("password", password);
      // window.localStorage.setItem("userUid", userUid)
    }
    $scope.authObj.$signInWithEmailAndPassword(email, password).then(function (firebaseUser) {
      //alert("Signed in!");
      $scope.getUserStatus();
      console.log($rootScope.user);
      // redirect to home screen

      var refArray = firebase.database().ref().child("users").child($rootScope.userUid);
      var currentUserProfile = $firebaseObject(refArray);
      localStorage.setItem("email", firebaseUser.email);
      localStorage.setItem("userUid", firebase.uid)
      $rootScope.user = firebaseUser.email;
      $rootScope.userUid = firebaseUser.uid;
      currentUserProfile.$loaded().then(function (user) {
        localStorage.setItem("email", user.email)
        localStorage.setItem("userUid", $rootScope.userUid)
        localStorage.setItem("name", user.name)
        $rootScope.username = user.name;
        $state.go('app.home');
      })
      // localStorage.setItem("name", users.name);
    }).catch(function (error) {
      console.error("Authentication failed:", error);
      // alert('User login failed!');
      ionicToast.show('The email or passowrd is not correct. Please try again.', 'bottom', false, 2500);
    });
  }


  // reset password
  $scope.reset = function (email) {
    if (email == null) {
      alert('Please enter your email address');
      return
    }
    $scope.authObj.$sendPasswordResetEmail(email).then(function () {
      alert("Success! The instructions will be in your email in a few moments.");
      $state.go('app.login');
    }).catch(function (error) {
      console.error("Error: ", error);
      alert('Password reset failed!');
    });
  }
})

app.controller('NewsCtrl', function ($scope, $ionicLoading, FeedSources, FeedList) {

  $ionicLoading.show({
    template: 'Loading news...'
  });

  // NEWS SOURCES - from services
  $scope.categories = FeedSources;

  $ionicLoading.hide();

});

app.controller('NewslistCtrl', function ($http, $scope, $state, $ionicLoading, $stateParams, $ionicModal, FeedSources, FeedList) {

  $ionicLoading.show({
    template: 'Please wait while we load the latest articles from the Seacoast Moms Blog...'
  });

  $scope.posts = [];
  var wordpressUrl = "https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Fseacoast.citymomsblog.com%2Ffeed%2F&api_key=4ttyqm0kfrvec25ygfqnw27nmdmqc4gkieabiii2&order_by=&order_dir=desc&count=20";

  $http.get(wordpressUrl)
    .success(function (response) {
      angular.forEach(response.items, function (child) {
        $scope.posts.push(child);
        $ionicLoading.hide();
      });
    })
    .error(function (response, status) {
      console.log("Error while received response. " + status + response);
    });



  $scope.openUrl = function (link) {
    window.open(link, '_blank', 'location=yes,toolbar=yes');
    return false;
  }

})

app.controller('HomeCtrl', function ($scope, $ionicLoading, $ionicSideMenuDelegate, $ionicScrollDelegate) {

  $ionicSideMenuDelegate.canDragContent(true);

  // TABS
  $scope.tab = 1;
  $scope.activeMenu = 1;

  $scope.setTab = function (newTab) {
    $scope.tab = newTab;
    $scope.activeMenu = newTab;
  };

  $scope.isSet = function (tabNum) {
    return $scope.tab === tabNum;
  };

  // ACCORDIONS
  // initiate an array to hold all active tabs
  $scope.activeTabs = [];

  // check if the tab is active
  $scope.isOpenTab = function (tab) {
    // check if this tab is already in the activeTabs array
    if ($scope.activeTabs.indexOf(tab) > -1) {
      // if so, return true
      return true;
    } else {
      // if not, return false
      return false;
    }
  }

  // function to 'open' a tab
  $scope.openTab = function (tab) {
    // check if tab is already open
    if ($scope.isOpenTab(tab)) {
      //if it is, remove it from the activeTabs array
      $scope.activeTabs.splice($scope.activeTabs.indexOf(tab), 1);
    } else {
      // if it's not, add it!
      $scope.activeTabs = [];
      $scope.activeTabs.push(tab);
    }
  }
})

app.controller('BlogCtrl', function ($scope, $ionicLoading, $stateParams, Blog, $cordovaSocialSharing) {

  $ionicLoading.show({
    template: 'Loading posts...'
  });

  $scope.categShow = false;
  $scope.showCategories = function () {
    if ($scope.categShow == false) {
      $scope.categShow = true;
    } else {
      $scope.categShow = false;
    }
  }

  // WORDPRESS CATEGORIES
  Blog.categories().then(
    function (data) {
      $scope.categories = data.data.categories;
      $ionicLoading.hide();
    },
    function (error) {
    }
  )

  // WORDPRESS POSTS
  $scope.getPosts = function () {
    Blog.posts($stateParams.id).then(
      function (data) {
        $scope.posts = data.data.posts;
        $ionicLoading.hide();
      },
      function (error) {
      }
    )
  }

  // WORDPRESS SINGLE POST
  $scope.getPost = function () {
    Blog.post($stateParams.id).then(
      function (data) {
        $scope.post = firebase(ref.userInfo(id));
        $ionicLoading.hide();
      },
      function (error) {
      }
    )
  }
  //
  // // SHARE
  // $scope.shareTwitter = function (message, image) {
  //   $cordovaSocialSharing
  //     .shareViaTwitter(message, image, 'linkhere')
  //     .then(function (result) {
  //       // Success!
  //     }, function (err) {
  //       // An error occurred. Show a message to the user
  //     });
  // }
  // $scope.shareFacebook = function (message, image) {
  //   $cordovaSocialSharing
  //     .shareViaFacebook(message, image, 'link')
  //     .then(function (result) {
  //       // Success!
  //     }, function (err) {
  //       // An error occurred. Show a message to the user
  //     });
  // }
  // $scope.shareWhatsApp = function (message, image) {
  //   $cordovaSocialSharing
  //     .shareViaWhatsApp(message, image, 'link')
  //     .then(function (result) {
  //       // Success!
  //     }, function (err) {
  //       // An error occurred. Show a message to the user
  //     });
  // }

})

var gLink = "";

app.controller('FirebaseCtrl', function ($rootScope, $scope, $ionicLoading, $filter, $ionicSlideBoxDelegate, Firebase, $firebaseObject, $firebaseArray, $stateParams, $sce) {

  $scope.showReplyBox = null;
  $scope.repliedToComment = true;
  $scope.show = function () {
    $ionicLoading.show({
      template: 'Loading...',
      duration: 3000
    }).then(function () {
      console.log("The loading indicator is now displayed");
    });
  };
  $scope.hide = function () {
    $ionicLoading.hide().then(function () {
      console.log("The loading indicator is now hidden");
    });
  };

  // array
  var refArrayAlerts = firebase.database().ref().child("userInfo");
  // create a synchronized array
  $scope.alerts = $firebaseArray(refArrayAlerts);

  // $scope.getUserStatus = function () {
  //   // get firebase user
  //   var user = FirebaseUser.status();
  //   if (user) {
  //     $rootScope.user = user.email;
  //     $rootScope.userUid = user.uid;
  //     console.log(user.email)
  //     // $state.go('app.home');
  //     // $rootScope.userExpert = user.expert;
  //   } else {
  //     $rootScope.user = 'Anonymous';
  //     $rootScope.userUid = 0;
  //     $state.go('app.login');
  //     console.log(user)
  //   }
  // }

  // FIREBASE
  // $scope.body = $sce.trustAsHtml(htmlBody);

  $scope.trustedHtml = function (plainText) {
    return $sce.trustAsHtml(plainText);
  };

  $scope.articleID = $stateParams.id;
  $scope.selectedArticle = {};

  // object
  var URL = Firebase.url();

  /*var refObject = firebase.database().ref().child("data"); // work with firebase url + object named 'data'
  // download the data into a local object
  var syncObject = $firebaseObject(refObject);
  // synchronize the object with a three-way data binding
  syncObject.$bindTo($scope, "firebaseObject"); // $scope.firebaseObject is your data from Firebase - you can edit/save/remove
  */
  $ionicLoading.hide();

  //to sanitize html
  $scope.sanitizeMe = function (text) {
    return $sce.trustAsHtml(text)
  };

  // array
  var refArrayMessages = firebase.database().ref().child("messages");
  // create a synchronized array
  $scope.messages = $firebaseArray(refArrayMessages); // $scope.messages is your firebase array, you can add/remove/edit
  // add new items to the array
  // the message is automatically added to our Firebase database!
  $scope.addMessage = function (message) {
    $scope.newMessageText = null;
    $scope.messages.$add({
      text: message
    });

  };

  String.prototype.replaceAll = function (search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
  };
  // array
  var refArray = firebase.database().ref().child("userInfo");
  var startDate = '1481306373397';
  var endDate = new Date().getTime() + '';
  // create a synchronized array
  var articleListRef = $firebaseArray(refArray); // $scope.messages is your firebase array, you can add/remove/edit

  // add new items to the array
  // the message is automatically added to our Firebase database!
  articleListRef.$loaded()
    .then(function (x) {
      $scope.articles = x;
      if ($scope.articleID) {
        $scope.articles.forEach(function (d, i) {
          if (d.$id == $scope.articleID) {
            $scope.selectedArticle = d;
            var body = d.body;
            var tempBody = d.body;
            // body = body.replaceAll('href.*"', "");
            // gLink = tempBody.match(/href="([^"]*)/)[1];
            // body = body.replace("<a", "<label");
            // body = body.replace("</a>", "</label>");
            $scope.selectedArticle.body = body;
            console.log(gLink);
            //$scope.selectedArticle.body = "<a href='http://www.google.com' target='_blank'>Post</a>";
          }
        })
      }
    })
    .catch(function (error) {
      console.log("Error:", error);
    });

  $scope.getItemsFromThePast = function () {
    return function (item, type) {
      if (item) {
        var today = new Date().getTime();
        return item.publish_date <= today;
      }
    }
  }
  $scope.addMessage = function (message) {
    $scope.newMessageText = null;
    $scope.articles.$add({
      text: message
    });
  };

  // $(document).on('click', function (evt) {
  //   if ($(evt.target).is('label')) {
  //     var inAppBrowserRef = window.open(gLink, '_system', 'location=yes', 'clearcache: yes', 'toolbar: no');
  //   }
  // });
  if ($scope.articleID) {
    var refCommentArray = firebase.database().ref().child("comments").child($scope.articleID);
    $scope.allComments = $firebaseArray(refCommentArray);
  }
  $scope.model = {
    theField: 'hello'
  };
  $scope.reply = {
    comment: ''
  };
  $scope.mainUser = {
    comment: ''
  };
  $scope.someFunc = function () {
    $scope.model.theField = '';
  }

  $scope.postComment = function (com) {
    var commentObj = {
      comment: com,
      email: localStorage.email,
      name: localStorage.username || localStorage.name,
      date: new Date().getTime()
    }
    $scope.mainUser.comment = '';
    refCommentArray.push(commentObj, function (error) {
      if (error) {
        console.log('Error has occured during saving process')
      }
      else {
        console.log("Data has been saved succesfully");
        $scope.mainUser.comment = '';
      }
    });
  }

  $scope.replyComment = function (ind) {
    $scope.showReplyBox = ind;
    $scope.repliedToComment = false;
  }
  $scope.isShowing = function (index) {
    // $scope.repliedToComment = false;
    return $scope.showReplyBox == index;
  }

  $scope.postReplyComment = function (comReply, parentComment) {
    var commentReplyObj = {
      comment: comReply,
      email: localStorage.email,
      name: localStorage.username || localStorage.name,
      date: new Date().getTime()
    }
    $scope.reply.comment = '';
    $scope.repliedToComment = true;
    console.log("Data hss been saved succesfully ",$rootScope)
    var refCommentReplyArray = firebase.database().ref().child("comments").child($scope.articleID).child(parentComment.$id).child('reply')
    refCommentReplyArray.push(commentReplyObj, function (error) {
      if (error) {
        console.log('Error has occured during saving process')
      }
      else {
        $scope.reply.comment = '';
        console.log("Data hss been saved succesfully")
      }
    });
  }

  $scope.removeComment = function (type, commentInfo, parentInd, ind) {
    if (type == 'reply') {
      var refCommentReplyRemove = firebase.database().ref().child("comments").child($scope.articleID).child(parentInd).child('reply').child(ind);
      refCommentReplyRemove.remove()
        .then(function () {
          console.log("Remove succeeded.")
        })
        .catch(function (error) {
          console.log("Remove failed: " + error.message)
        });
      console.log('replied comment', commentInfo, ind)
    } else {
      var refCommentCommentRemove = firebase.database().ref().child("comments").child($scope.articleID).child(commentInfo.$id);
      refCommentCommentRemove.remove()
        .then(function () {
          console.log("Remove succeeded.")
        })
        .catch(function (error) {
          console.log("Remove failed: " + error.message)
        });
      console.log('comment', commentInfo)
    }
  }

})

app.controller('UsersCtrl', function ($scope, $ionicLoading, $filter, $ionicSlideBoxDelegate, Firebase, $firebaseObject, $firebaseArray, $stateParams, $sce) {

  $ionicLoading.show({
    template: 'Loading...'
  });

  if (!Date.now) {
    Date.now = function () { return new Date().getTime(); }
  }

  // FIREBASE

  // object
  var URL = Firebase.url();

  var refObject = firebase.database().ref().child("users"); // work with firebase url + object named 'data'
  // download the data into a local object
  var syncObject = $firebaseObject(refObject);
  // synchronize the object with a three-way data binding
  syncObject.$bindTo($scope, "firebaseObject"); // $scope.firebaseObject is your data from Firebase - you can edit/save/remove
  $ionicLoading.hide();


  // array
  var refArray = firebase.database().ref().child("users");
  // create a synchronized array
  $scope.users = $firebaseArray(refArray); // $scope.messages is your firebase array, you can add/remove/edit
  // add new items to the array
  // the message is automatically added to our Firebase database!
  $scope.updateAdmin = function (users) {
    // $scope.newMessageText = null;
    $scope.users.$add({
      admin: true
    });

  };

  $scope.changeRoleSettings = function (user, role) {
    var refArray = firebase.database().ref().child("users").child(user.$id);
    var roleToChange = role;
    var changesInUser = {};
    changesInUser[role] = user[role];
    refArray.update(changesInUser)
    console.log('Push Notification Change', user);
  };

  $scope.emailNotificationChange = function () {
    console.log('Email Notification Change', $scope.emailNotification);
  };

  $scope.pushNotification = { checked: true };

})

app.controller('ElementsCtrl', function ($scope) {

})


app.controller('PluginsCtrl', function ($scope, $ionicLoading, $ionicPlatform, $cordovaToast, $cordovaAppRate, $cordovaBarcodeScanner, $cordovaDevice) {

  // toast message
  $scope.showToast = function () {
    $ionicPlatform.ready(function () {
      $cordovaToast.showLongBottom('Here is a toast message').then(function (success) {
        // success
      }, function (error) {
        // error
      });
    })
  }

  // rate my app
  $scope.showApprate = function () {

    $ionicPlatform.ready(function () {

      $cordovaAppRate.promptForRating(true).then(function (result) {
        // success
      });

    })

  }

  // barcode scanner
  $scope.showBarcode = function () {

    $ionicPlatform.ready(function () {

      $cordovaBarcodeScanner
        .scan()
        .then(function (barcodeData) {
          // Success! Barcode data is here
          alert(barcodeData.text);
          console.log("Barcode Format -> " + barcodeData.format);
          console.log("Cancelled -> " + barcodeData.cancelled);
        }, function (error) {
          // An error occurred
          console.log("An error happened -> " + error);
        });

    })

  }

  // device info
  $scope.showDeviceinfo = function () {

    $ionicPlatform.ready(function () {

      var device = $cordovaDevice.getDevice();
      var cordova = $cordovaDevice.getCordova();
      var model = $cordovaDevice.getModel();
      var platform = $cordovaDevice.getPlatform();
      var uuid = $cordovaDevice.getUUID();
      var version = $cordovaDevice.getVersion();

      alert('Your device has ' + platform);

    })

  }

  $ionicSideMenuDelegate.canDragContent(true);


  // TABS
  $scope.tab = 1;
  $scope.activeMenu = 1;

  $scope.setTab = function (newTab) {
    $scope.tab = newTab;
    $scope.activeMenu = newTab;
  };

  $scope.isSet = function (tabNum) {
    return $scope.tab === tabNum;
  };


  // ACCORDIONS
  // initiate an array to hold all active tabs
  $scope.activeTabs = [];

  // check if the tab is active
  $scope.isOpenTab = function (tab) {
    // check if this tab is already in the activeTabs array
    if ($scope.activeTabs.indexOf(tab) > -1) {
      // if so, return true
      return true;
    } else {
      // if not, return false
      return false;
    }
  }

  // function to 'open' a tab
  $scope.openTab = function (tab) {
    // check if tab is already open
    if ($scope.isOpenTab(tab)) {
      //if it is, remove it from the activeTabs array
      $scope.activeTabs.splice($scope.activeTabs.indexOf(tab), 1);
    } else {
      // if it's not, add it!
      $scope.activeTabs = [];
      $scope.activeTabs.push(tab);
    }
  }


});


// rate my app preferences
app.config(function ($cordovaAppRateProvider) {

  document.addEventListener("deviceready", function () {

    var prefs = {
      language: 'en',
      appName: 'SBFC',
      iosURL: '<my_app_id>',
      androidURL: 'market://details?id=<package_name>',
      windowsURL: 'ms-windows-store:Review?name=<...>'
    };

    $cordovaAppRateProvider.setPreferences(prefs)

  }, false);

})

app.controller('ChatCtrl', function ($scope, $rootScope, $state, $timeout, $ionicLoading, $firebaseAuth, $firebaseArray, $location, FirebaseUser, ngQuillConfig, ionicToast) {

  $scope.getUserStatus = function () {
    // console.log("hey adam")
  };

  $scope.user = {
    published: '',
    alert: '',
    publish_date: new Date(),
    title: ''
  }

  // $scope.urlParam = $location.search();

  /* datepicker */
  $scope.valuationDate = new Date();
  $scope.valuationDatePickerIsOpen = false;

  $scope.valuationDatePickerOpen = function () {

    $scope.valuationDatePickerIsOpen = true;
  };

  var pdfDoc = angular.element(document.querySelector('#fileInput'));

  /* /datepicker */

  $scope.message = '';

  var downloadUrl = '';

  $scope.showToolbar = true;

  $scope.categoryDropDown = {
    selected: null,
    categoryOptions: [
      { id: 0, name: 'No Category', value: '' },
      { id: 1, name: 'Ask an Expert', value: 'ask-an-expert' },
      { id: 2, name: 'Marketplace', value: 'marketplace' },
      { id: 3, name: 'Baby Photo', value: 'baby-photo' }
    ]
  };

  /*$scope.translations = angular.extend({}, ngQuillConfig.translations, {
   15: 'smallest'
   });*/

  /*$scope.toggle = function() {
   $scope.showToolbar = !$scope.showToolbar;
   };*/
  // Own callback after Editor-Creation
  /*$scope.editorCallback = function (editor, name) {
   console.log('createCallback', editor, name);
   };*/

  $scope.readOnly = false;

  $scope.isReadonly = function () {
    return $scope.readOnly;
  };

  $scope.clear = function () {
    return $scope.message = '';
  };

  // Event after an editor is created --> gets the editor instance on optional the editor name if set
  $scope.$on('editorCreated', function (event, editor, name) {
    console.log('createEvent', editor, name);
  });

  $timeout(function () {
    $scope.message = '';
    console.log($scope.message);
  }, 3000);
  $scope.getMessages = function () {

    //$scope.version = textAngularManager.getVersion();
    //$scope.versionNumber = $scope.version.substring(1);
    /*$scope.orightml = '<h2>Try me!</h2><p>textAngular is a super cool WYSIWYG Text Editor directive for AngularJS</p><p><img class="ta-insert-video" ta-insert-video="http://www.youtube.com/embed/2maA1-mvicY" src="" allowfullscreen="true" width="300" frameborder="0" height="250"/></p><p><b>Features:</b></p><ol><li>Automatic Seamless Two-Way-Binding</li><li>Super Easy <b>Theming</b> Options</li><li style="color: green;">Simple Editor Instance Creation</li><li>Safely Parses Html for Custom Toolbar Icons</li><li class="text-danger">Doesn&apos;t Use an iFrame</li><li>Works with Firefox, Chrome, and IE9+</li></ol><p><b>Code at GitHub:</b> <a href="https://github.com/fraywing/textAngular">Here</a> </p><h4>Supports non-latin Characters</h4><p>昮朐 魡 燚璒瘭 譾躒鑅, 皾籈譧 紵脭脧 逯郹酟 煃 瑐瑍, 踆跾踄 趡趛踠 顣飁 廞 熥獘 豥 蔰蝯蝺 廦廥彋 蕍蕧螛 溹溦 幨懅憴 妎岓岕 緁, 滍 蘹蠮 蟷蠉蟼 鱐鱍鱕, 阰刲 鞮鞢騉 烳牼翐 魡 骱 銇韎餀 媓幁惁 嵉愊惵 蛶觢, 犝獫 嶵嶯幯 縓罃蔾 魵 踄 罃蔾 獿譿躐 峷敊浭, 媓幁 黐曮禷 椵楘溍 輗 漀 摲摓 墐墆墏 捃挸栚 蛣袹跜, 岓岕 溿 斶檎檦 匢奾灱 逜郰傃</p>';
     $scope.htmlcontent = $scope.orightml;*/
    //$scope.disabled = false;


    $timeout(function () {
      // set firebase refference for messages - if user is logged in, set to match user uid, if there is no user, show public messages
      var refArray = firebase.database().ref().child("chat/" + $rootScope.userUid);
      // create a synchronized array
      $scope.messages = $firebaseArray(refArray); // $scope.messages is your firebase array, you can add/remove/edit
    }, 100)
  };

  $scope.getMessages();

  // send message
  $scope.send = function (message) {

    $scope.getMessages();

    // set a random image as user avatar - change this to match your structure
    var randomIndex = Math.round(Math.random() * (4));
    randomIndex++;
    $scope.avatar = 'img/users/' + randomIndex + '.jpg';
    // add new items to the array
    // the message is automatically added to our Firebase database!
    $scope.messages.$add({
      text: message,
      email: $rootScope.user,
      user: $rootScope.userUid,
      avatar: $scope.avatar
    });
    $scope.message = '';
  };

  $scope.storeImageToDB = function (file, resolve) {

    /*var file = document.querySelector('input[type=file]').files[0];
     console.log(file);*/
    var storageRef = firebase.storage().ref().child('images');
    // Get a reference to store file at photos/<FILENAME>.jpg
    var photoRef = storageRef.child(file.name);
    // Upload file to Firebase Storage
    var uploadTask = photoRef.putString(file.base64, 'data_url');
    uploadTask.on('state_changed', null, null, function (snapshot) {
      console.log('success');
      console.log(snapshot);
      // When the image has successfully uploaded, we get its download URL
      downloadUrl = uploadTask.snapshot.downloadURL;
      console.log(downloadUrl);
      resolve(downloadUrl);
      // Set the download URL to the message box, so that the user can send it to the database
      //$scope.userDisplayPic = downloadUrl;
    });
  };
  $scope.storePDFDocToDB = function (file, resolve) {

    /*var file = document.querySelector('input[type=file]').files[0];
     console.log(file);*/
    var storageRef = firebase.storage().ref().child('pdf');
    // Get a reference to store file at photos/<FILENAME>.jpg
    var photoRef = storageRef.child(file.name);
    // Upload file to Firebase Storage
    var uploadTask = photoRef.put(file);
    uploadTask.on('state_changed', null, null, function (snapshot) {
      console.log('success');
      console.log(snapshot);
      // When the image has successfully uploaded, we get its download URL
      downloadUrl = uploadTask.snapshot.downloadURL;
      console.log(downloadUrl);
      resolve(downloadUrl);
      // Set the download URL to the message box, so that the user can send it to the database
      //$scope.userDisplayPic = downloadUrl;
    });
  };

  $scope.location = $location;
  $scope.$watch('location.search()', function () {
    $scope.user.title = ($location.search()).target;
    $scope.categoryDropDown.selected = ($location.search()).category;
    $scope.user.published = ($location.search()).published;
  }, true);

  $scope.changeTarget = function (name) {
    $location.search('target', name);
  }

  // function extractLinkFromBody(text) {
  //   var urlRegex = /(https?:\/\/[^\s]+)/g;
  //   return text.replace(urlRegex, function (url) {
  //     var indexOfATag = url.indexOf('<');
  //     var slicedUrl = url.slice(0, indexOfATag);
  //     /*console.log(slicedUrl)
  //      return '<a href="' + slicedUrl + '">' + slicedUrl + '</a>'; */
  //     return '<a href="' + slicedUrl + '" onClick="window.open("' + slicedUrl + '");return false;">' + slicedUrl + '</a>';
  //   });
  //   // or alternatively
  //   // return text.replace(urlRegex, '<a href="$1">$1</a>')
  // }
  var ref = firebase.database().ref().child("userInfo");
  var userNode = $firebaseArray(ref);
  $scope.saveData = function (user, msg, b64) {
    ionicToast.show('Saving...', 'bottom', true, 2500);
    var pdfIsTrue = false;
    var userData = {};
    userData = $scope.user;
    // userData.body = extractLinkFromBody(userData.body)
    console.log(user, msg);
    userData.body = msg;
    userData.publish_date = new Date(userData.publish_date).getTime();
    userData.author = $rootScope.user;
    userData.category = $scope.categoryDropDown.selected;

    imgObj.base64 = b64;
    pdfDoc = pdfDoc[0].files[0];
    if (pdfDoc) {
      if (pdfDoc.name.indexOf('pdf') > -1) {
        pdfIsTrue = false;
      }
    }
    console.log(pdfDoc);
    if (pdfDoc) {
      var uploadPromiseImgs = new Promise(function (resolve, reject) {
        if (pdfIsTrue) {
          $scope.storePDFDocToDB(pdfDoc, resolve);
        } else {
          $scope.storeImageToDB(imgObj, resolve);
        }
      });
      Promise.all([uploadPromiseImgs]).then(function (data) {
        userData.img = downloadUrl;

        userNode.$add(userData).then(function (success) {
          var addedObjDetails = success.path.o;
          var addedObj = addedObjDetails[1];
          $state.go('app.edit', { 'id': addedObj })
          console.log(success);
          console.log(addedObj[1]);
          ionicToast.show('Saved!', 'bottom', false, 2500);
        });
      }).catch(function (err) {
        console.log(err);
        ionicToast.show('Oops... something went wrong. Title, body, and Image are required.', 'bottom', false, 2500);
      })
    } else {
      userNode.$add(userData).then(function (success) {
        var addedObjDetails = success.path.o;
        var addedObj = addedObjDetails[1];
        $state.go('app.edit', { 'id': addedObj })
        console.log(success);
        console.log(addedObj[1]);
        ionicToast.show('Saved!', 'bottom', false, 2500);
      });
    }

  };
  var imgObj = {};
  $scope.myImage = '';
  $scope.myCroppedImage = '';

  var handleFileSelect = function (evt) {
    var file = evt.currentTarget.files[0];
    imgObj.name = file.name;
    var reader = new FileReader();
    reader.onload = function (evt) {
      $scope.$apply(function ($scope) {
        $scope.myImage = evt.target.result;
      });
    };
    reader.readAsDataURL(file);
  };
  angular.element(document.querySelector('#fileInput')).on('change', handleFileSelect);

})


app.controller('EditCtrl', function ($scope, $rootScope, $state, $stateParams, $timeout, $ionicLoading, $firebaseAuth, $firebaseObject, $firebaseArray, FirebaseUser, ngQuillConfig, ionicToast) {


  $scope.articleID = $stateParams.id;
  $scope.getUserStatus();

  $scope.user = {
    published: '',
    alert: '',
    publish_date: new Date(),
    title: ''
  }

  // array
  var refArray = firebase.database().ref().child("userInfo").child($scope.articleID);
  // create a synchronized array
  var articleListRef = $firebaseObject(refArray); // $scope.messages is your firebase array, you can add/remove/edit
  // add new items to the array
  // the message is automatically added to our Firebase database!
  articleListRef.$loaded()
    .then(function (x) {
      $scope.user = x;
      $scope.categoryDropDown.selected = $scope.user.category;
      $scope.user.publish_date = new Date($scope.user.publish_date);
      $scope.message = $scope.user.body;
      ngQuillConfig.setHTML($scope.user.body);
    })
    .catch(function (error) {
      console.log("Error:", error);
    });

  $scope.$on("editorCreated", function (event, quillEditor) {
    quillEditor.setHTML($scope.user.body);
  });

  /* datepicker */
  $scope.valuationDate = new Date();
  $scope.valuationDatePickerIsOpen = false;

  $scope.valuationDatePickerOpen = function () {

    $scope.valuationDatePickerIsOpen = true;
  };

  /* /datepicker */

  $scope.message = 'Your Body Text ';

  var downloadUrl = '';

  $scope.showToolbar = true;

  $scope.categoryDropDown = {
    selected: null,
    categoryOptions: [
      { id: 0, name: 'No Category', value: '' },
      { id: 1, name: 'Ask an Expert', value: 'ask-an-expert' },
      { id: 2, name: 'Marketplace', value: 'marketplace' },
      { id: 3, name: 'Baby Photo', value: 'baby-photo' }
    ]
  };

  $scope.showToast = function () {
    <!--ionicToast.show(message, position, stick, time); -->
      ionicToast.show('This is a toast at the top.', 'top', false, 2500);
  };

  $scope.hideToast = function () {
    ionicToast.hide();
  };

  /*$scope.translations = angular.extend({}, ngQuillConfig.translations, {
   15: 'smallest'
   });*/

  /*$scope.toggle = function() {
   $scope.showToolbar = !$scope.showToolbar;
   };*/
  // Own callback after Editor-Creation
  /*$scope.editorCallback = function (editor, name) {
   console.log('createCallback', editor, name);
   };*/


  $scope.readOnly = false;

  $scope.isReadonly = function () {
    return $scope.readOnly;
  };

  $scope.clear = function () {
    return $scope.message = '';
  };

  $scope.getMessages = function () {

    //$scope.version = textAngularManager.getVersion();
    //$scope.versionNumber = $scope.version.substring(1);
    /*$scope.orightml = '<h2>Try me!</h2><p>textAngular is a super cool WYSIWYG Text Editor directive for AngularJS</p><p><img class="ta-insert-video" ta-insert-video="http://www.youtube.com/embed/2maA1-mvicY" src="" allowfullscreen="true" width="300" frameborder="0" height="250"/></p><p><b>Features:</b></p><ol><li>Automatic Seamless Two-Way-Binding</li><li>Super Easy <b>Theming</b> Options</li><li style="color: green;">Simple Editor Instance Creation</li><li>Safely Parses Html for Custom Toolbar Icons</li><li class="text-danger">Doesn&apos;t Use an iFrame</li><li>Works with Firefox, Chrome, and IE9+</li></ol><p><b>Code at GitHub:</b> <a href="https://github.com/fraywing/textAngular">Here</a> </p><h4>Supports non-latin Characters</h4><p>昮朐 魡 燚璒瘭 譾躒鑅, 皾籈譧 紵脭脧 逯郹酟 煃 瑐瑍, 踆跾踄 趡趛踠 顣飁 廞 熥獘 豥 蔰蝯蝺 廦廥彋 蕍蕧螛 溹溦 幨懅憴 妎岓岕 緁, 滍 蘹蠮 蟷蠉蟼 鱐鱍鱕, 阰刲 鞮鞢騉 烳牼翐 魡 骱 銇韎餀 媓幁惁 嵉愊惵 蛶觢, 犝獫 嶵嶯幯 縓罃蔾 魵 踄 罃蔾 獿譿躐 峷敊浭, 媓幁 黐曮禷 椵楘溍 輗 漀 摲摓 墐墆墏 捃挸栚 蛣袹跜, 岓岕 溿 斶檎檦 匢奾灱 逜郰傃</p>';
     $scope.htmlcontent = $scope.orightml;*/
    //$scope.disabled = false;


    $timeout(function () {
      // set firebase refference for messages - if user is logged in, set to match user uid, if there is no user, show public messages
      var refArray = firebase.database().ref().child("chat/" + $rootScope.userUid);
      // create a synchronized array
      $scope.messages = $firebaseArray(refArray); // $scope.messages is your firebase array, you can add/remove/edit
    }, 100)
  };

  $scope.getMessages();

  // send message
  $scope.send = function (message) {

    $scope.getMessages();

    // set a random image as user avatar - change this to match your structure
    var randomIndex = Math.round(Math.random() * (4));
    randomIndex++;
    $scope.avatar = 'img/users/' + randomIndex + '.jpg';
    // add new items to the array
    // the message is automatically added to our Firebase database!
    $scope.messages.$add({
      text: message,
      email: $rootScope.user,
      user: $rootScope.userUid,
      avatar: $scope.avatar
    });
    $scope.message = '';
  };

  $scope.storeImageToDB = function (file, resolve) {

    /*var file = document.querySelector('input[type=file]').files[0];
     console.log(file);*/
    var storageRef = firebase.storage().ref().child('images');
    // Get a reference to store file at photos/<FILENAME>.jpg
    var photoRef = storageRef.child(file.name);
    // Upload file to Firebase Storage
    var uploadTask = photoRef.putString(file.base64, 'data_url');
    uploadTask.on('state_changed', null, null, function (snapshot) {
      console.log('success');
      console.log(snapshot);
      // When the image has successfully uploaded, we get its download URL
      downloadUrl = uploadTask.snapshot.downloadURL;
      console.log(downloadUrl);
      resolve(downloadUrl);
      // Set the download URL to the message box, so that the user can send it to the database
      //$scope.userDisplayPic = downloadUrl;
    });
  };

  // function extractLinkFromBody(text) {
  //   var urlRegex = /(https?:\/\/[^\s]+)/g;
  //   return text.replace(urlRegex, function (url) {
  //     var indexOfATag = url.indexOf('<');
  //     var slicedUrl = url.slice(0, indexOfATag);
  //     /*console.log(slicedUrl)
  //     return '<a href="' + slicedUrl + '">' + slicedUrl + '</a>'; */
  //     return '<a href="' + slicedUrl + '" onClick="window.open("' + slicedUrl + '");return false;">' + slicedUrl + '</a>';
  //   });
  //   // or alternatively
  //   // return text.replace(urlRegex, '<a href="$1">$1</a>')
  // }
  var optionsForInApp = {
    location: 'yes',
    clearcache: 'yes',
    toolbar: 'yes',
    closebuttoncaption: 'DONE?'
  };
  function openlink(url) {
    /*$cordovaInAppBrowser.open(url, '_blank', optionsForInApp)
      .then(function(event) {
        // success
      })
      .catch(function(event) {
        // error
      });*/
    var inAppBrowserRef = window.open(url, '_system', 'location=yes', 'clearcache: yes', 'toolbar: no');
    console.log('lala kaka');
  };

  $scope.saveData = function (user, msg, b64) {
    var userData = {};
    userData = $scope.user;
    // if (userData.body.indexOf('<a>') == -1) {
    //   userData.body = extractLinkFromBody(userData.body);
    // }
    console.log(user, msg);
    //userData.body = msg;
    userData.publish_date = new Date(userData.publish_date).getTime();
    userData.author = $rootScope.user;
    userData.category = $scope.categoryDropDown.selected;
    articleListRef = userData;
    imgObj.base64 = b64;
    articleListRef.$save().then(function (ref) {
      // true
      ionicToast.show('Success!.', 'bottom', false, 2500);
      console.log('Successfully updates the object', ref);
    }, function (error) {
      console.log("Error:", error);
    });


    /*var uploadPromiseImgs = new Promise(function(resolve, reject) {
      $scope.storeImageToDB(imgObj,resolve);
    });
    Promise.all([uploadPromiseImgs]).then(function (data) {
      userData.img = downloadUrl;
      var ref = firebase.database().ref().child("userInfo");
      var userNode = $firebaseArray(ref);
      userNode.$add(userData).then(function (success) {
        console.log(success);
      });
    }).catch(function (err) {
      console.log(err);
    })*/
  };
  $scope.deleteEdited = function () {
    articleListRef.$remove().then(function (ref) {
      console.log("Successfully removed the Object:", ref);
      $state.go('app.allcontent')
    }, function (error) {
      console.log("Error:", error);
    });
  }
  var imgObj = {};
  $scope.myImage = '';
  $scope.myCroppedImage = '';

  var handleFileSelect = function (evt) {
    var file = evt.currentTarget.files[0];
    imgObj.name = file.name;
    var reader = new FileReader();
    reader.onload = function (evt) {
      $scope.$apply(function ($scope) {
        $scope.myImage = evt.target.result;
      });
    };
    reader.readAsDataURL(file);
  };
  angular.element(document.querySelector('#fileInput')).on('change', handleFileSelect);

})

app.controller('FileTransferCtrl', function ($scope, $rootScope, $state, $stateParams, $timeout, $ionicLoading, $firebaseAuth, $firebaseObject, $firebaseArray, FirebaseUser, ngQuillConfig, ionicToast) {


  // array
  var refArray = firebase.database().ref().child("folder");
  // create a synchronized array
  var articleListRef = $firebaseArray(refArray); // $scope.messages is your firebase array, you can add/remove/edit
  // add new items to the array
  // the message is automatically added to our Firebase database!
  articleListRef.$loaded()
    .then(function (alluser) {
      $scope.usersFroFileTransfer = alluser;
    })
    .catch(function (error) {
      console.log("Error:", error);
    });


})

app.controller('AddFolderCtrl', function ($scope, $stateParams, $rootScope, $state, $timeout, $ionicLoading, $firebaseAuth, $firebaseArray, FirebaseUser, ngQuillConfig, $q, $firebaseObject, ionicToast) {

  $scope.getUserStatus();

  $scope.user = {
    published: '',
    alert: '',
    publish_date: new Date(),
    title: ''
  }

  /* datepicker */
  $scope.valuationDate = new Date();
  $scope.valuationDatePickerIsOpen = false;

  $scope.valuationDatePickerOpen = function () {

    $scope.valuationDatePickerIsOpen = true;
  };

  var pdfDoc = angular.element(document.querySelector('#fileInput'));

  var folderRef = firebase.database().ref().child("folder");


  /* /datepicker */

  $scope.message = '';

  var downloadUrl = '';
  var downloadUrlArray = [];
  var thumbnailImage;
  var file;
  $scope.folderArray = [];

  $scope.showToolbar = true;

  $scope.categoryDropDown = {
    selected: null,
    categoryOptions: [
      { id: 0, name: 'No Category', value: '' },
      { id: 1, name: 'Ask an Expert', value: 'ask-an-expert' },
      { id: 2, name: 'Marketplace', value: 'marketplace' },
      { id: 3, name: 'Baby Photo', value: 'baby-photo' }
    ]
  };

  /*$scope.translations = angular.extend({}, ngQuillConfig.translations, {
   15: 'smallest'
   });*/

  /*$scope.toggle = function() {
   $scope.showToolbar = !$scope.showToolbar;
   };*/
  // Own callback after Editor-Creation
  /*$scope.editorCallback = function (editor, name) {
   console.log('createCallback', editor, name);
   };*/

  $scope.readOnly = false;

  $scope.isReadonly = function () {
    return $scope.readOnly;
  };

  $scope.clear = function () {
    return $scope.message = '';
  };

  // Event after an editor is created --> gets the editor instance on optional the editor name if set
  $scope.$on('editorCreated', function (event, editor, name) {
    console.log('createEvent', editor, name);
  });

  $timeout(function () {
    $scope.message = '';
    console.log($scope.message);
  }, 3000);
  $scope.getMessages = function () {

    //$scope.version = textAngularManager.getVersion();
    //$scope.versionNumber = $scope.version.substring(1);
    /*$scope.orightml = '<h2>Try me!</h2><p>textAngular is a super cool WYSIWYG Text Editor directive for AngularJS</p><p><img class="ta-insert-video" ta-insert-video="http://www.youtube.com/embed/2maA1-mvicY" src="" allowfullscreen="true" width="300" frameborder="0" height="250"/></p><p><b>Features:</b></p><ol><li>Automatic Seamless Two-Way-Binding</li><li>Super Easy <b>Theming</b> Options</li><li style="color: green;">Simple Editor Instance Creation</li><li>Safely Parses Html for Custom Toolbar Icons</li><li class="text-danger">Doesn&apos;t Use an iFrame</li><li>Works with Firefox, Chrome, and IE9+</li></ol><p><b>Code at GitHub:</b> <a href="https://github.com/fraywing/textAngular">Here</a> </p><h4>Supports non-latin Characters</h4><p>昮朐 魡 燚璒瘭 譾躒鑅, 皾籈譧 紵脭脧 逯郹酟 煃 瑐瑍, 踆跾踄 趡趛踠 顣飁 廞 熥獘 豥 蔰蝯蝺 廦廥彋 蕍蕧螛 溹溦 幨懅憴 妎岓岕 緁, 滍 蘹蠮 蟷蠉蟼 鱐鱍鱕, 阰刲 鞮鞢騉 烳牼翐 魡 骱 銇韎餀 媓幁惁 嵉愊惵 蛶觢, 犝獫 嶵嶯幯 縓罃蔾 魵 踄 罃蔾 獿譿躐 峷敊浭, 媓幁 黐曮禷 椵楘溍 輗 漀 摲摓 墐墆墏 捃挸栚 蛣袹跜, 岓岕 溿 斶檎檦 匢奾灱 逜郰傃</p>';
     $scope.htmlcontent = $scope.orightml;*/
    //$scope.disabled = false;


    $timeout(function () {
      // set firebase refference for messages - if user is logged in, set to match user uid, if there is no user, show public messages
      var refArray = firebase.database().ref().child("chat/" + $rootScope.userUid);
      // create a synchronized array
      $scope.messages = $firebaseArray(refArray); // $scope.messages is your firebase array, you can add/remove/edit
    }, 100)
  };

  //This will contain our files
  var data = Array();

  //Function to check whether or not this will work
  var supported = function () {

    //All of the stuff we need
    if (window.File && window.FileReader && window.FileList && window.Blob && window.XMLHttpRequest) {
      return true;
    } else {
      return false;
    }
  };

  //The Input File has Been Loaded Into Memory!
  var loaded = function (event) {
    //Push the data into our array
    //But don't start uploading just yet
    thumbnailImage = event.target.result;
    file.thumbnailImage = event.target.result;
    data.push(event.target.result);
  };

  var uploadFile = function (event) {
    //Needs a Better Way to
    //Link Data to Button
    var id = $(this).attr('data');
    $.ajax({
      type: "POST",
      //JSFiddle Echo Server
      url: "/echo/html/",

      data: {
        "html": "<li><a target=\"_blank\" href=\"" + data[id] + "\">link</a></li>"
      },
      success: function (data) {
        $("#ajax").append(data);
      },
      dataType: 'html'
    });
  };

  var processFiles = function (event) {

    //If not supported tell them to get a better browser
    if (!supported) {
      alert('upgrade your browser');
      return;
    }

    //Our iterator's up here? as specified by JSLint
    var i;

    //Get the FileList Object - http://goo.gl/AkgYa
    var files = event.target.files;

    //Loop through our files
    for (i = 0; i < files.length; i += 1) {

      //Just for Clarity Create a New Variable
      file = files[i];
      // $scope.folderFile = file;
      $scope.folderArray.push(file)

      //A New Reader for Each File
      var reader = new FileReader();
      //Done reading the file?.. Push the data to the data array
      reader.onload = loaded;

      // Read in the image file as base64
      // You could do it in binary or text - http://goo.gl/4hYSd
      reader.readAsDataURL(file);
      /*

                       //Make Upload Button
                       "<button class=\"upload\" data=\"",
                       i,
                       "\">Upload</button>",
                       //Get Size in Kilobytes
                       "<span>",
                       file.size / 1024,
                       " kb</span>",
      */

      //Build the File Info HTML
      var fileInfo = ["<li>",
        "<img src=\"" + thumbnailImage + "\" class='imgPreview'>",

        file.name,
        "</li>"].join('');

      //Add the Info to the list
      //$("#list").append(fileInfo);


    }
    //Add a Click Listener OUTSIDE of the loop
    $(".upload").on("click", uploadFile);
  };

  //When the Input Changes Reprocess Files
  $("#fileInput").on("change", processFiles);


  $scope.getMessages();

  // send message
  $scope.send = function (message) {

    $scope.getMessages();

    // set a random image as user avatar - change this to match your structure
    var randomIndex = Math.round(Math.random() * (4));
    randomIndex++;
    $scope.avatar = 'img/users/' + randomIndex + '.jpg';
    // add new items to the array
    // the message is automatically added to our Firebase database!
    $scope.messages.$add({
      text: message,
      email: $rootScope.user,
      user: $rootScope.userUid,
      avatar: $scope.avatar
    });
    $scope.message = '';
  };

  function storeFolderImages(file) {

    var innerDeferred = $q.defer();

    //storeFolderImages(myfile, resolve);
    var storageRef = firebase.storage().ref().child('folder').child('images').child(file.name);
    // Upload file to Firebase Storage
    delete file.thumbnailImage;
    var uploadTask = storageRef.put(file);
    uploadTask.on('state_changed', null, null, function () {
      var downloadUrl = uploadTask.snapshot.downloadURL;
      innerDeferred.resolve(downloadUrl);
    })
    // Set the download URL to the message box, so that the user can send it to the database
    //$scope.userDisplayPic = downloadUrl;
    return innerDeferred.promise;
  };
  $scope.saveFolder = function (folderInfo) {
    var deferred = $q.defer();
    console.log(folderInfo, $scope.folderArray)
    var uploadPromiseFolderImgs = $scope.folderArray.map(function (myfile, index) {
      var innerDeferred = $q.defer();

      //storeFolderImages(myfile, resolve);
      var storageRef = firebase.storage().ref().child('folder').child('images').child(myfile.name);
      // Upload file to Firebase Storage
      //delete myfile.thumbnailImage;
      var uploadTask = storageRef.putString(myfile.thumbnailImage, 'data_url');
      uploadTask.on('state_changed', null, null, function () {
        var downloadUrl = uploadTask.snapshot.downloadURL;
        innerDeferred.resolve(downloadUrl);
      })
      // Set the download URL to the message box, so that the user can send it to the database
      //$scope.userDisplayPic = downloadUrl;
      return innerDeferred.promise;
    })
    $q.all(uploadPromiseFolderImgs).then(function (imageResolved) {
      console.log(imageResolved);
      var imgArrNames = [];
      var imagesObj = {};
      var j = 0;
      for (var i = 0; i < imageResolved.length; ++i) {
        var imgArrNames = "image-" + i;
        var indexOfImgName = imgArrNames;
        var indexOfImgReslved = imageResolved[j];
        imagesObj[indexOfImgName] = indexOfImgReslved;
      }
      folderInfo.images = imagesObj;
      var folderNode = $firebaseArray(folderRef);
      folderNode.$add(folderInfo).then(function (success) {
        var addedObjectUid = success.path.o[1];
        ionicToast.show('Successfully added a folder!.', 'bottom', false, 2500);
        $state.go('app.editfolder', { 'id': addedObjectUid })
        console.log(success.path.o[1]);
      });
      deferred.resolve(imageResolved)
    }).catch(function (err) {
      console.log(err);
      deferred.reject(err);
    })
  }
  $scope.saveData = function (user, msg, b64) {
    var pdfIsTrue = false;
    var userData = {};
    userData = $scope.user;
    // userData.body = extractLinkFromBody(userData.body)
    console.log(user, msg);
    userData.body = message;
    userData.publish_date = new Date(userData.publish_date).getTime();
    userData.author = $rootScope.user;
    userData.category = $scope.categoryDropDown.selected;

    imgObj.base64 = b64;
    pdfDoc = pdfDoc[0].files[0];
    if (pdfDoc) {
      if (pdfDoc.name.indexOf('pdf') > -1) {
        pdfIsTrue = true;
      }
    }
    console.log(pdfDoc);

    var uploadPromiseImgs = new Promise(function (resolve, reject) {
      if (pdfIsTrue) {
        $scope.storePDFDocToDB(pdfDoc, resolve);
      } else {
        $scope.storeImageToDB(imgObj, resolve);
      }
    });
    Promise.all([uploadPromiseImgs]).then(function (data) {
      userData.img = downloadUrl;
      var ref = firebase.database().ref().child("userInfo");
      var userNode = $firebaseArray(ref);
      userNode.$add(userData).then(function (success) {
        var addedObjDetails = success.path.o;
        var addedObj = addedObjDetails[1];
        $state.go('app.edit', { 'id': addedObj })
        console.log(success);
        console.log(addedObj[1]);
      });
    }).catch(function (err) {
      console.log(err);
    })
  };
  var imgObj = {};
  $scope.myImage = '';
  $scope.myCroppedImage = '';

  var handleFileSelect = function (evt) {
    var file = evt.currentTarget.files[0];
    imgObj.name = file.name;
    var reader = new FileReader();
    reader.onload = function (evt) {
      $scope.$apply(function ($scope) {
        $scope.myImage = evt.target.result;
      });
    };
    reader.readAsDataURL(file);
  };
  angular.element(document.querySelector('#fileInput')).on('change', handleFileSelect);

})

app.controller('EditFolderCtrl', function ($scope, $stateParams, $rootScope, $state, $timeout, $ionicLoading, $firebaseAuth, $firebaseArray, FirebaseUser, ngQuillConfig, $q, $firebaseObject, ionicToast, $sce) {

  $scope.getUserStatus();
  $scope.editfolderArray = [];
  var uuid = $stateParams.id;
  if ($stateParams.id) {
    $scope.editFolderId = $stateParams.id;
    // array
    var refArray = firebase.database().ref().child("folder").child($scope.editFolderId);
    // create a synchronized array
    var editFolderRef = $firebaseObject(refArray); // $scope.messages is your firebase array, you can add/remove/edit
    // add new items to the array
    // the message is automatically added to our Firebase database!
    editFolderRef.$loaded()
      .then(function (folderData) {
        $scope.editFolder = folderData;
        for (var key in folderData.images) {
          $scope.editfolderArray.push(folderData.images[key]);
        }
      })
      .catch(function (error) {
        console.log("Error:", error);
      });
  }

  $scope.user = {
    published: '',
    publish_date: new Date(),
    title: ''
  }

  $scope.onSocialSharing = function (imgPath) {
    window.plugins.socialsharing.share(null, null, imgPath, null);
  }


  // <button onclick="window.plugins.socialsharing.share('Message and image', null, 'https://www.google.nl/images/srpr/logo4w.png', null)">message and image</button>
  //
  // <button onclick="window.plugins.socialsharing.share('Message, image and link', null, 'https://www.google.nl/images/srpr/logo4w.png', 'http://www.x-services.nl')">message, image and link</button>
  //
  // <button onclick="window.plugins.socialsharing.share('Message, subject, image and link', 'The subject', 'https://www.google.nl/images/srpr/logo4w.png', 'http://www.x-services.nl')">message, subject, image and link</button>

  /* datepicker */
  $scope.valuationDate = new Date();
  $scope.valuationDatePickerIsOpen = false;

  $scope.valuationDatePickerOpen = function () {

    $scope.valuationDatePickerIsOpen = true;
  };

  var pdfDoc = angular.element(document.querySelector('#fileInput'));

  var folderRef = firebase.database().ref().child("folder");

  /* /datepicker */

  $scope.message = '';

  var downloadUrl = '';
  var downloadUrlArray = [];
  var thumbnailImage;
  var file;
  var uploadedFiles = [];
  $scope.folderArray = [];
  var newArrAfterRemovedImg = [];
  $scope.deleteImg = function (imgadd) {
    for (var key in editFolderRef.images) {
      if (editFolderRef.images[key] == imgadd) {
        delete editFolderRef.images[key]
        var indexOfToBeDeleteImg = $scope.editfolderArray.indexOf(imgadd);
        $scope.editfolderArray.splice(indexOfToBeDeleteImg, 1);
        for (var key in editFolderRef.images) {
          newArrAfterRemovedImg.push(editFolderRef.images[key])
        }
        var imgArrNames = [];
        var imagesObj = {};
        for (var i = 0; i < newArrAfterRemovedImg.length; ++i) {
          imgArrNames[i] = "image-" + i;
          var indexOfImgName = imgArrNames[i];
          var indexOfImgReslved = newArrAfterRemovedImg[i];
          imagesObj[indexOfImgName] = indexOfImgReslved;
        }
        editFolderRef.images = imagesObj;
        //console.log('gotcha', editFolderRef)
      }
    }
  }


  $scope.showToolbar = true;

  $scope.categoryDropDown = {
    selected: null,
    categoryOptions: [
      { id: 0, name: 'No Category', value: '' },
      { id: 1, name: 'Ask an Expert', value: 'ask-an-expert' },
      { id: 2, name: 'Marketplace', value: 'marketplace' },
      { id: 3, name: 'Baby Photo', value: 'baby-photo' }
    ]
  };

  /*$scope.translations = angular.extend({}, ngQuillConfig.translations, {
   15: 'smallest'
   });*/

  /*$scope.toggle = function() {
   $scope.showToolbar = !$scope.showToolbar;
   };*/
  // Own callback after Editor-Creation
  /*$scope.editorCallback = function (editor, name) {
   console.log('createCallback', editor, name);
   };*/

  $scope.readOnly = false;

  $scope.isReadonly = function () {
    return $scope.readOnly;
  };

  $scope.clear = function () {
    return $scope.message = '';
  };

  // Event after an editor is created --> gets the editor instance on optional the editor name if set
  $scope.$on('editorCreated', function (event, editor, name) {
    console.log('createEvent', editor, name);
  });

  $timeout(function () {
    $scope.message = '';
    console.log($scope.message);
  }, 5000);
  $scope.getMessages = function () {

    //$scope.version = textAngularManager.getVersion();
    //$scope.versionNumber = $scope.version.substring(1);
    /*$scope.orightml = '<h2>Try me!</h2><p>textAngular is a super cool WYSIWYG Text Editor directive for AngularJS</p><p><img class="ta-insert-video" ta-insert-video="http://www.youtube.com/embed/2maA1-mvicY" src="" allowfullscreen="true" width="300" frameborder="0" height="250"/></p><p><b>Features:</b></p><ol><li>Automatic Seamless Two-Way-Binding</li><li>Super Easy <b>Theming</b> Options</li><li style="color: green;">Simple Editor Instance Creation</li><li>Safely Parses Html for Custom Toolbar Icons</li><li class="text-danger">Doesn&apos;t Use an iFrame</li><li>Works with Firefox, Chrome, and IE9+</li></ol><p><b>Code at GitHub:</b> <a href="https://github.com/fraywing/textAngular">Here</a> </p><h4>Supports non-latin Characters</h4><p>昮朐 魡 燚璒瘭 譾躒鑅, 皾籈譧 紵脭脧 逯郹酟 煃 瑐瑍, 踆跾踄 趡趛踠 顣飁 廞 熥獘 豥 蔰蝯蝺 廦廥彋 蕍蕧螛 溹溦 幨懅憴 妎岓岕 緁, 滍 蘹蠮 蟷蠉蟼 鱐鱍鱕, 阰刲 鞮鞢騉 烳牼翐 魡 骱 銇韎餀 媓幁惁 嵉愊惵 蛶觢, 犝獫 嶵嶯幯 縓罃蔾 魵 踄 罃蔾 獿譿躐 峷敊浭, 媓幁 黐曮禷 椵楘溍 輗 漀 摲摓 墐墆墏 捃挸栚 蛣袹跜, 岓岕 溿 斶檎檦 匢奾灱 逜郰傃</p>';
     $scope.htmlcontent = $scope.orightml;*/
    //$scope.disabled = false;


    $timeout(function () {
      // set firebase refference for messages - if user is logged in, set to match user uid, if there is no user, show public messages
      var refArray = firebase.database().ref().child("chat/" + $rootScope.userUid);
      // create a synchronized array
      $scope.messages = $firebaseArray(refArray); // $scope.messages is your firebase array, you can add/remove/edit
    }, 100)
  };

  //This will contain our files
  var data = Array();

  //Function to check whether or not this will work
  var supported = function () {

    //All of the stuff we need
    if (window.File && window.FileReader && window.FileList && window.Blob && window.XMLHttpRequest) {
      return true;
    } else {
      return false;
    }
  };

  //The Input File has Been Loaded Into Memory!
  var loaded = function (event) {
    //Push the data into our array
    //But don't start uploading just yet
    $scope.editfolderArray.push(event.target.result)
    thumbnailImage = event.target.result;
    file.thumbnailImage = event.target.result;
    data.push(event.target.result);
  };

  var uploadFile = function (event) {
    //Needs a Better Way to
    //Link Data to Button
    var id = $(this).attr('data');
    $.ajax({
      type: "POST",
      //JSFiddle Echo Server
      url: "/echo/html/",

      data: {
        "html": "<li><a target=\"_blank\" href=\"" + data[id] + "\">link</a></li>"
      },
      success: function (data) {
        $("#ajax").append(data);
      },
      dataType: 'html'
    });
  };

  var processFiles = function (event) {

    //If not supported tell them to get a better browser
    if (!supported) {
      alert('upgrade your browser');
      return;
    }

    //Our iterator's up here? as specified by JSLint
    var i;

    //Get the FileList Object - http://goo.gl/AkgYa
    var files = event.target.files;

    //Loop through our files
    for (i = 0; i < files.length; i += 1) {

      //Just for Clarity Create a New Variable
      file = files[i];
      // $scope.folderFile = file;
      $scope.folderArray.push(file)

      //A New Reader for Each File
      var reader = new FileReader();
      //Done reading the file?.. Push the data to the data array
      reader.onload = loaded;

      // Read in the image file as base64
      // You could do it in binary or text - http://goo.gl/4hYSd
      reader.readAsDataURL(file);
      /*

                       //Make Upload Button
                       "<button class=\"upload\" data=\"",
                       i,
                       "\">Upload</button>",
                       //Get Size in Kilobytes
                       "<span>",
                       file.size / 1024,
                       " kb</span>",
      */

      //Build the File Info HTML
      var fileInfo = ["<li>",
        "<img src=\"" + thumbnailImage + "\" class='imgPreview'>",

        file.name,
        "</li>"].join('');

      //Add the Info to the list
      //$("#list").append(fileInfo);


    }
    //Add a Click Listener OUTSIDE of the loop
    $(".upload").on("click", uploadFile);
  };

  //When the Input Changes Reprocess Files
  $("#fileInput").on("change", processFiles);


  $scope.getMessages();

  // send message
  $scope.send = function (message) {

    $scope.getMessages();

    // set a random image as user avatar - change this to match your structure
    var randomIndex = Math.round(Math.random() * (4));
    randomIndex++;
    $scope.avatar = 'img/users/' + randomIndex + '.jpg';
    // add new items to the array
    // the message is automatically added to our Firebase database!
    $scope.messages.$add({
      text: message,
      email: $rootScope.user,
      user: $rootScope.userUid,
      avatar: $scope.avatar
    });
    $scope.message = '';
  };

  function storeFolderImages(file) {

    var innerDeferred = $q.defer();

    //storeFolderImages(myfile, resolve);
    var storageRef = firebase.storage().ref().child('folder').child('images').child(file.name);
    // Upload file to Firebase Storage
    var uploadTask = storageRef.putString(file.thumbnailImage, 'data_url');
    uploadTask.on('state_changed', null, null, function () {
      var downloadUrl = uploadTask.snapshot.downloadURL;
      innerDeferred.resolve(downloadUrl);
    })
    // Set the download URL to the message box, so that the user can send it to the database
    //$scope.userDisplayPic = downloadUrl;
    return innerDeferred.promise;
  };
  $scope.saveFolder = function (folderInfo) {
    var deferred = $q.defer();
    var base64Array = [];
    if ($scope.folderArray.length > 0) {
      var uploadPromiseFolderImgs = $scope.folderArray.map(function (myfile, index) {
        var innerDeferred = $q.defer();

        //storeFolderImages(myfile, resolve);
        var storageRef = firebase.storage().ref().child('folder').child('images').child(myfile.name);
        // Upload file to Firebase Storage
        var uploadTask = storageRef.putString(myfile.thumbnailImage, 'data_url');
        uploadTask.on('state_changed', null, null, function () {
          var downloadUrl = uploadTask.snapshot.downloadURL;
          innerDeferred.resolve(downloadUrl);
        })
        // Set the download URL to the message box, so that the user can send it to the database
        //$scope.userDisplayPic = downloadUrl;
        return innerDeferred.promise;
      })
      $q.all(uploadPromiseFolderImgs).then(function (imageResolved) {
        console.log(imageResolved);
        var imgArrNames = [];
        var imagesObj = {};
        var j = 0;
        if (editFolderRef.images) {
          var alreadyHaveImagesLength = Object.keys(editFolderRef.images).length;
          for (var i = alreadyHaveImagesLength; i < imageResolved.length + alreadyHaveImagesLength; i++) {
            var imgArrNames = "image-" + i;
            var indexOfImgName = imgArrNames;
            var indexOfImgReslved = imageResolved[j];
            imagesObj[indexOfImgName] = indexOfImgReslved;
            editFolderRef.images[imgArrNames] = imageResolved[j];
            j++
          }
          editFolderRef.$save().then(function (ref) {
            ionicToast.show('Successfully edited the folder!.', 'bottom', false, 2500);
            console.log("Success:", ref);
          }, function (error) {
            console.log("Error:", error);
          });
          deferred.resolve(imageResolved)
        } else {
          for (var i = 0; i < imageResolved.length; ++i) {
            var imgArrNames = "image-" + i;
            var indexOfImgName = imgArrNames;
            var indexOfImgReslved = imageResolved[i];
            imagesObj[indexOfImgName] = indexOfImgReslved;
          }
          editFolderRef.images = {};
          editFolderRef.images = imagesObj;
          editFolderRef.$save().then(function (ref) {
            ionicToast.show('Successfully edited the folder!.', 'bottom', false, 2500);
            console.log("Success:", ref);
          }, function (error) {
            console.log("Error:", error);
          });
        }

      }).catch(function (err) {
        console.log(err);
        deferred.reject(err);
      })
    } else {
      editFolderRef.$save().then(function (ref) {
        ionicToast.show('Successfully edited the folder!.', 'bottom', false, 2500);
        console.log("Success:", ref);
      }, function (error) {
        console.log("Error:", error);
      });
    }
    /*var editedObject = {};
    editedObject = folderInfo;
    editedObject.images = editFolderRef.images;*/

    //console.log(folderInfo, $scope.folderArray);
    /*delete editedObject.$$conf;
    delete editedObject.$id;
    delete editedObject.$resolved;
    delete editedObject.$priority;*/

    //firebase.database().ref('folder/' + uuid).set(editedObject);
    /*  var uploadPromiseFolderImgs = $scope.folderArray.map(function (myfile, index) {
      var innerDeferred = $q.defer();

      //storeFolderImages(myfile, resolve);
      var storageRef = firebase.storage().ref().child('folder').child('images').child(file.name);
      // Upload file to Firebase Storage
      var uploadTask = storageRef.putString(file.thumbnailImage, 'data_url');
      uploadTask.on('state_changed', null, null, function () {
        var downloadUrl = uploadTask.snapshot.downloadURL;
        innerDeferred.resolve(downloadUrl);
      })
      // Set the download URL to the message box, so that the user can send it to the database
      //$scope.userDisplayPic = downloadUrl;
      return innerDeferred.promise;
    })
    $q.all(uploadPromiseFolderImgs).then(function (imageResolved) {
      console.log(imageResolved);
      var imgArrNames = [];
      var imagesObj = {};
      for (var i = 0; i < imageResolved.length; ++i) {
        imgArrNames[i] = "image-" + i;
        var indexOfImgName = imgArrNames[i];
        var indexOfImgReslved = imageResolved[i];
        imagesObj[indexOfImgName] = indexOfImgReslved;
      }
      folderInfo.images = imagesObj;
      var folderNode = $firebaseArray(folderRef);
      folderNode.$add(folderInfo).then(function (success) {
        console.log(success);
      });
      deferred.resolve(imageResolved)
    }).catch(function (err) {
      console.log(err);
      deferred.reject(err);
    })*/
  }
  $scope.saveData = function (user, msg, b64) {
    var pdfIsTrue = false;
    var userData = {};
    userData = $scope.user;
    // userData.body = extractLinkFromBody(userData.body)
    console.log(user, msg);
    userData.body = msg;
    userData.publish_date = new Date(userData.publish_date).getTime();
    userData.author = $rootScope.user;
    userData.category = $scope.categoryDropDown.selected;

    imgObj.base64 = b64;
    pdfDoc = pdfDoc[0].files[0];
    if (pdfDoc) {
      if (pdfDoc.name.indexOf('pdf') > -1) {
        pdfIsTrue = true;
      }
    }
    console.log(pdfDoc);

    var uploadPromiseImgs = new Promise(function (resolve, reject) {
      if (pdfIsTrue) {
        $scope.storePDFDocToDB(pdfDoc, resolve);
      } else {
        $scope.storeImageToDB(imgObj, resolve);
      }
    });
    Promise.all([uploadPromiseImgs]).then(function (data) {
      userData.img = downloadUrl;
      var ref = firebase.database().ref().child("userInfo");
      var userNode = $firebaseArray(ref);
      userNode.$add(userData).then(function (success) {
        var addedObjDetails = success.path.o;
        var addedObj = addedObjDetails[1];
        $state.go('app.edit', { 'id': addedObj })
        console.log(success);
        console.log(addedObj[1]);
      });
    }).catch(function (err) {
      console.log(err);
    })
  };
  var imgObj = {};
  $scope.myImage = '';
  $scope.myCroppedImage = '';

  var handleFileSelect = function (evt) {
    var file = evt.currentTarget.files[0];
    imgObj.name = file.name;
    var reader = new FileReader();
    reader.onload = function (evt) {
      $scope.$apply(function ($scope) {
        $scope.myImage = evt.target.result;
      });
    };
    reader.readAsDataURL(file);
  };
  angular.element(document.querySelector('#fileInput')).on('change', handleFileSelect);

})

app.controller('WeatherCtrl', function ($scope, $ionicLoading, weatherService) {

  $scope.getWeather = function () {
    weatherService.get().then(function (data) {
      $scope.weather = data;
    });
  }

})


app.controller('ContactCtrl', function ($scope) {


})



app.controller('YoutubeCtrl', function ($scope, $window, $sce, googleService, $stateParams, $ionicLoading) {

  $ionicLoading.show({
    template: 'Loading videos...'
  });

  $window.initGapi = function () {
    $scope.$apply($scope.getChannel);
  };

  $scope.getChannel = function () {
    googleService.googleApiClientReady().then(function (data) {
      $scope.videos = data.items;
      $scope.channel = data.items[0].snippet.channelTitle;
      $ionicLoading.hide();
    }, function (error) {
      console.log('Failed: ' + error)
    });
  };

  $scope.getVideoId = function () {
    $ionicLoading.show({
      template: 'Loading video...'
    });
    document.getElementById('video').src = $sce.trustAsResourceUrl('https://www.youtube.com/embed/' + $stateParams.id);
    googleService.googleApiClientReady().then(function (data) {
      $scope.video = data.items[$stateParams.index];
      $ionicLoading.hide();
    }, function (error) {
      console.log('Failed: ' + error)
    });
  }

});

app.controller('stopWatchController', function()  {
"use strict";var MINUTE_MILLISECONDS=1000*60;var HOUR_MILLISECONDS=MINUTE_MILLISECONDS*60;var DAY_MILLISECONDS=HOUR_MILLISECONDS*24;var contractionList;function supports_html5_storage(){try{return"localStorage" in window&&window.localStorage!==null}catch(a){return false}}
function replaceElement(b,c){var a=document.getElementById(b);a.innerHTML=c}
function load(){var a;if(supports_html5_storage()){if(localStorage.contractionList.length>0){contractionList=JSON.parse(localStorage.contractionList)}else{contractionList=[]}for(a=0;a<contractionList.length;++a){var b=contractionList[a];b.starttime=new Date(b.starttime);if(b.stoptime!==undefined){b.stoptime=new Date(b.stoptime)}}}}
function initializeContractionList(){if(contractionList===undefined){if(supports_html5_storage()){if(localStorage.contractionList===undefined){localStorage.contractionList=""}load()}else{contractionList=[]}}}
function save(){if(supports_html5_storage()){localStorage.contractionList=JSON.stringify(contractionList)}}
function resetContractionList(){if(supports_html5_storage()){localStorage.removeItem("contractionList")}contractionList=[];save();initializeContractionList()}
function Contraction(){this.starttime=new Date();this.inprogress=1}
function compareContractions(d,c){return d.starttime<c.starttime}
function reverseCompareContractions(d,c){return d.starttime>c.starttime}
function latestContraction(){return contractionList[contractionList.length-1]}
function inContraction(){if(contractionList.length<=0){return false}return latestContraction().inprogress}
function Statistics(b,c,a){this.duration=b;this.period=c;this.count=a}
function statisticsForLast(b){var m=0;var g=0;var j=0;var a=new Date();var h=a-b;var e=0;var o=0;var f;for(f=0;f<contractionList.length;++f){var l=contractionList[f];if(l.starttime>h){if(!l.inprogress){m+=(l.stoptime - l.starttime);e++}if(f>0){var n=l.starttime-contractionList[f-1].starttime;if(n<(2*HOUR_MILLISECONDS)){g+=n;o++}}j++}}var d=m;var k=g;if(e>1){d=m/e}if(o>1){k=g/o}return new Statistics(d,k,j)}function formatDuration(c){if(c<0){return"-"+formatDuration(-1*c)}var f=Math.floor(c/1000);var d=Math.floor(f/60);var e=f%60;if(e<10){e="0"+e}if(d<60){return d+":"+e}var b=Math.floor(d/60);var a=d%60;if(a<10){a="0"+a}return b+":"+a+":"+e}function formatDurationAndPeriod(a,b){return formatDuration(a)+", "+formatDuration(b)+" apart"}var MONTH_NAMES=["January","February","March","April","May","June","July","August","September","October","November","December"];function formatContraction(h){var b="";var e=new Date();if((e-h.starttime)>(6*HOUR_MILLISECONDS)){b=MONTH_NAMES[h.starttime.getMonth()]+" "+h.starttime.getDate()+" "}var a=h.starttime.getHours();var d="AM";if(a>=12){a-=12;d="PM"}if(a==0){a=12}var g=h.starttime.getMinutes();if(g<10){g="0"+g}var f=a+":"+g+" "+d;if(h.inprogress){return b+f+" [inprogress]"}return b+f+" ["+formatDuration(h.stoptime-h.starttime)+"]"}function updateDisplayQuick(){if(contractionList.length===0){replaceElement("nowtext","")}else{var b=latestContraction();var a=new Date();if(b.inprogress){replaceElement("nowtext","Current Contraction Time "+formatDuration(a-b.starttime))}else{replaceElement("nowtext",formatDuration(a-b.starttime)+" Since Last Contraction Started")}}}function setToggleButtonImage(){var d=$("#togglebuttonimage");var c=$("#togglebutton");var b=$("#undobuttonimage");var a=$("#undobutton");if(inContraction()){d.attr("src","img/stop.png");c.mousedown(function(){d.attr("src","img/stop-highlighted.png")}).mouseup(function(){d.attr("src","img/stop.png")}).mouseout(function(){d.attr("src","img/stop.png")});b.attr("src","img/undostart.png");a.mousedown(function(){b.attr("src","img/undostart-highlighted.png")}).mouseup(function(){b.attr("src","img/undostart.png")}).mouseout(function(){b.attr("src","img/undostart.png")})}else{d.attr("src","img/start.png");c.mousedown(function(){d.attr("src","img/start-highlighted.png")}).mouseup(function(){d.attr("src","img/start.png")}).mouseout(function(){d.attr("src","img/start.png")});b.attr("src","img/undostop.png");a.mousedown(function(){b.attr("src","img/undostop-highlighted.png")}).mouseup(function(){b.attr("src","img/undostop.png")}).mouseout(function(){b.attr("src","img/undostop.png")})}}function updateDisplayFull(){var g;updateDisplayQuick();setToggleButtonImage();if(contractionList.length===0){replaceElement("lasttext","")}else{g=latestContraction();replaceElement("lasttext","My Last Contraction Started at "+formatContraction(g))}var b=statisticsForLast(20*MINUTE_MILLISECONDS);replaceElement("twentyminutetext",formatDurationAndPeriod(b.duration,b.period));replaceElement("twentyminutecount",b.count);var f=statisticsForLast(HOUR_MILLISECONDS);replaceElement("sixtyminutetext",formatDurationAndPeriod(f.duration,f.period));replaceElement("sixtyminutecount",f.count);var e=statisticsForLast(DAY_MILLISECONDS);replaceElement("twentyfourhourtext",formatDurationAndPeriod(e.duration,e.period));replaceElement("twentyfourhourcount",e.count);var d="</ul><p>"+contractionList.length+" total</p>";var a;for(a=0;a<contractionList.length;++a){g=contractionList[a];d="<li>"+formatContraction(g)+"</li>"+d}d="<ul>"+d;replaceElement("contractionlist",d)}var timer;var loopcount;function cancelTimer(){clearInterval(timer)}function handleTimer(){if(loopcount<30){updateDisplayQuick()}else{updateDisplayFull();loopcount=0}}function setTimer(){cancelTimer();timer=setInterval(handleTimer,1000);loopcount=0}function pushedToggle(){var a;if(inContraction()){a=latestContraction();a.stoptime=new Date();a.inprogress=0}else{a=new Contraction();contractionList.push(a)}save();updateDisplayFull()}function pushedUndoLastToggle(){var a;if(contractionList.length<=0){return}if(inContraction()){a=contractionList.pop()}else{a=latestContraction();a.inprogress=1}save();updateDisplayFull()}function pushedResetAllData(){var a=window.confirm("Reset all data?  Cannot be undone!");if(a){resetContractionList();updateDisplayFull()}}$(function(){initializeContractionList();updateDisplayFull();setTimer();$(window).focus(function(){updateDisplayFull();setTimer()}).blur(function(){cancelTimer()});$("#togglebutton").click(function(){pushedToggle()});$("#undobutton").click(function(){pushedUndoLastToggle()});$("#resetbutton").click(function(){pushedResetAllData()});var a=$("#resetbuttonimage");var b=$("#resetbutton");a.attr("src","img/reset.png");b.mousedown(function(){a.attr("src","img/reset-highlighted.png")}).mouseup(function(){a.attr("src","img/reset.png")}).mouseout(function(){a.attr("src","img/reset.png")})});var _gaq=_gaq||[];_gaq.push(["_setAccount","UA-18708700-1"]);_gaq.push(["_trackPageview"]);(function(){var b=document.createElement("script");b.type="text/javascript";b.async=true;b.src=("https:"==document.location.protocol?"https://ssl":"http://www")+".google-analytics.com/ga.js";var a=document.getElementsByTagName("script")[0];a.parentNode.insertBefore(b,a)})();
})

app.controller('MapsCtrl', function ($scope) {


})


app.controller('AdmobCtrl', function ($scope) {


  $scope.showBanner = function () {
    if (AdMob) AdMob.showBanner();
  }
  $scope.hideBanner = function () {
    if (AdMob) AdMob.hideBanner();
  }
  $scope.showInterstitial = function () {
    if (AdMob) AdMob.showInterstitial();
  }




})

app.controller('AskanexpertCtrl', function ($scope, $rootScope, $ionicLoading, FirebaseUser, Firebase, $firebaseObject, $firebaseArray) {


  $ionicLoading.show({
    template: 'Loading...'
  });

  if (!Date.now) {
    Date.now = function () { return new Date().getTime(); }
  }

  // FIREBASE

  // object
  var URL = Firebase.url();

  var refObject = firebase.database().ref().child("questions"); // work with firebase url + object named 'data'
  // download the data into a local object
  var syncObject = $firebaseObject(refObject);
  // synchronize the object with a three-way data binding
  syncObject.$bindTo($scope, "firebaseObject"); // $scope.firebaseObject is your data from Firebase - you can edit/save/remove
  $ionicLoading.hide();


  // array
  var refArray = firebase.database().ref().child("questions");
  // create a synchronized array
  $scope.messages = $firebaseArray(refArray); // $scope.messages is your firebase array, you can add/remove/edit
  // add new items to the array
  // the message is automatically added to our Firebase database!
  $scope.addMessage = function (message) {
    $scope.newMessageText = null;
    $scope.messages.$add({
      question: message,
      email: $rootScope.user,
      date: Date(),
      user: $rootScope.userUid
    });


  };

})
