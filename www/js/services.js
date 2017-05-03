// NEWS FEED SERVICES

var feeds = [];

app.factory('FeedLoader', function ($resource) {
    return $resource('https://ajax.googleapis.com/ajax/services/feed/load', {}, {
        fetch: { method: 'JSONP', params: {v: '1.0', callback: 'JSON_CALLBACK'} }
    });
});

app.factory('FeedSources', function ($resource) {
    var feedSources = [
            {id: 0, title: 'Time', url: 'http://time.com/feed/', description: 'Current & Breaking News | National & World Updates', img: 'https://pbs.twimg.com/profile_images/1700796190/Picture_24.png'},
            {id: 1, title: 'Mashable', url: 'http://mashable.com/feed/', description: 'Mashable is a global, multi-platform media and entertainment company.', img: 'http://instacurity.com/wp-content/uploads/2013/10/mashable-logo.png'},
            {id: 2, title: 'Seacoast Moms Blog', url: 'http://seacoast.citymomsblog.com/feed/', description: 'The latest posts from the Seacoast Moms Blog.', img: 'http://instacurity.com/wp-content/uploads/2013/10/mashable-logo.png'}
        ];
        return feedSources;
});

// https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20xml%20where%20url%3D%22https%3A%2F%2Fseacoast.citymomsblog.com%2Ffeed%22&format=json&diagnostics=true&callback=

app.service('FeedList', function ($rootScope, FeedLoader, $q) {
    this.get = function(source, num) {
        var feeds = [];
        var deferred= $q.defer();
        var feedSources = source;
                FeedLoader.fetch({q: feedSources, num: num}, {}, function (data) {
                    var feed = data.responseData.feed;
                    feeds.push(feed);
                    deferred.resolve(feeds);
                });

        return deferred.promise;
    };
});


// WORDPRESS FEED SERVICES

app.service('Blog', function($http) {
    var address = 'https://seacoast.citymomsblog.com/wp/api/';
    this.categories = function() {
        var url = address + "get_category_index?callback=JSON_CALLBACK";
        return $http.jsonp(url);
    };
    this.posts = function(cat) {
        var url = address + "get_posts?cat="+cat+"&callback=JSON_CALLBACK";
        return $http.jsonp(url);
    };
    this.post = function(id) {
        var url = address + "get_post?post_id="+id+"&callback=JSON_CALLBACK";
        return $http.jsonp(url);
    };
});



// FIREBASE SERVICES

app.service('Firebase', function() {
    this.url = function(id) {
        var url = "https://sbfc-4f832.firebaseio.com";
        return url;
    };
});


// Chat SERVICES

app.service('ChatService', function($state, $location, ionicToast, FirebaseUser, $firebaseAuth, $ionicViewService, $rootScope) {
    this.checkAuthStatus = function(user,success,failure) {
      var authObj = $firebaseAuth();
      var user = authObj.$getAuth();
      // window.localStorage.getItem("password") === "undefined" || window.localStorage.getItem("password") === null
        if (window.localStorage.getItem("password") === "undefined" || window.localStorage.getItem("password") === null) {
        $ionicViewService.nextViewOptions({
            disableAnimate: true,
            disableBack: true
        });
          console.log('not logged in');
          $state.go('app.login');
          return true
        } else {
          console.log('hey ' + user);
          return false
        }
    };
});

// FIREBASE USER MANAGEMENT

app.service('FirebaseUser', function($firebaseAuth) {
    // get firebase user
    this.status = function() {
        var authObj = $firebaseAuth();
        var firebaseUser = authObj.$getAuth();
        if (firebaseUser) {
            return firebaseUser;
            $state.go('app.home')
        } else {
            return false
            // $state.go('app.login')
        }
    }
});

// WEATHER SERVICE

app.factory('weatherService', ['$http', '$q', function ($http, $q){
    var deferred = $q.defer();
        var key = '***open api key here***';
        var lat = '40.7158026';
        var lon = '-74.0149689';
      function get(lat,lon) {
        var url ='http://api.openweathermap.org/data/2.5/weather?lat='+lat+'&lon='+lon+'&units=metric&appid='+key;
        $http.get(url)
          .success(function(data){
            deferred.resolve(data);
          })
          .error(function(err){
            console.log('Error retrieving markets');
            deferred.reject(err);
          });
        return deferred.promise;
      }

      return {
        get: get
      };
    }]);



// OWL CAROUSEL DIRECTIVES

app.directive("owlCarousel", function() {
    return {
        restrict: 'E',
        transclude: false,
        link: function (scope) {
            scope.initCarousel = function(element) {
              // provide any default options you want
                var defaultOptions = {
                };
                var customOptions = scope.$eval($(element).attr('data-options'));
                // combine the two options objects
                for(var key in customOptions) {
                    defaultOptions[key] = customOptions[key];
                }
                // init carousel
                $(element).owlCarousel(defaultOptions);
            };
        }
    };
});

app.directive('owlCarouselItem', function() {
    return {
        restrict: 'A',
        transclude: false,
        link: function(scope, element) {
          // wait for the last item in the ng-repeat then call init
            if(scope.$last) {
                scope.initCarousel(element.parent());
            }
        }
    };
});





// YOUTUBE SERVICE

app.service('googleService', ['$http', '$q', function ($http, $q) {

    var deferred = $q.defer();
    this.googleApiClientReady = function () {
        gapi.client.setApiKey('AIzaSyAmPxWHTBwqmm9DvoVTn-Xhm9pa-1A9X5w');   // your api key here
        gapi.client.load('youtube', 'v3', function() {
            var request = gapi.client.youtube.playlistItems.list({
                part: 'snippet',
                playlistId: 'PLonzNEfEob9SEtavgsRHmqMTIzqOuGpcz',  // your playlist id here
                maxResults: 50
            });
            request.execute(function(response) {
                deferred.resolve(response.result);
            });
        });
        return deferred.promise;
    };
}])
