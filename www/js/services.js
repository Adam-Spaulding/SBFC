// NEWS FEED SERVICES

var feeds = [];

app.factory('FeedLoader', function ($resource) {
    return $resource('http://ajax.googleapis.com/ajax/services/feed/load', {}, {
        fetch: { method: 'JSONP', params: {v: '1.0', callback: 'JSON_CALLBACK'} }
    });
});

app.service('FeedSources', function ($resource, $firebaseArray, $q) {


  this.getFeed = function (source, num) {
    var feeds = [];
    var deferred = $q.defer();
    var usersRef = firebase.database().ref('userInfo');
    var list = $firebaseArray(usersRef);
    list.$loaded()
      .then(function (feed) {
        deferred.resolve(feed);
      }).catch(function (error) {
        console.log("Error:", error);
        deferred.reject('err while updating user');
      });
    /*var feedSources = source;
     FeedLoader.fetch({q: feedSources, num: num}, {}, function (data) {
     var feed = data.responseData.feed;
     feeds.push(feed);
     deferred.resolve(feeds);
     });*/

    return deferred.promise;
  };
  /*
    var feedSources = [
            {id: 0, title: 'Time', url: 'http://time.com/feed/', description: 'Current & Breaking News | National & World Updates', img: 'https://pbs.twimg.com/profile_images/1700796190/Picture_24.png'},
            {id: 1, title: 'Mashable', url: 'http://mashable.com/feed/', description: 'Mashable is a global, multi-platform media and entertainment company.', img: 'http://instacurity.com/wp-content/uploads/2013/10/mashable-logo.png'},
            {id: 2, title: 'Wordpress', url: 'https://en.blog.wordpress.com/feed/', description: 'The latest news on WordPress.com and the WordPress community.', img: 'https://s.w.org/about/images/logos/wordpress-logo-notext-rgb.png'}
        ];
        return feedSources;*/
});

app.service('FeedList', function ($rootScope, FeedLoader, $q, $firebaseObject) {
    this.get = function(feedId) {
        var feeds = [];
        var deferred= $q.defer();
      var usersRef = firebase.database().ref('userInfo').child(feedId);
      var list = $firebaseObject(usersRef);
      list.$loaded()
        .then(function (feed) {
          deferred.resolve(feed);
        }).catch(function (error) {
          console.log("Error:", error);
          deferred.reject('err while updating user');
        });
                /*FeedLoader.fetch({q: feedSources, num: num}, {}, function (data) {
                    var feed = data.responseData.feed;
                    feeds.push(feed);
                    deferred.resolve(feeds);
                });*/

        return deferred.promise;
    };
});



// WORDPRESS FEED SERVICES

app.service('Blog', function($http) {
    var address = 'http://seacoast.citymomsblog.com/wp/api/';
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
        var url = "https://***firebase app name here***.firebaseio.com";
        return url;
    };
});


// Chat SERVICES

app.service('ChatService', function() {
    this.checkAuthStatus = function(user,success,failure) {
      if(user){
        if(user == 'Anonymous'){
          failure(false)
        }else{
          success(true)
        }
      }else{
        failure(false)
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
        } else {
          return false;
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
                playlistId: 'PLfhH-72g-AanqXu9hz2fS2lTt6G0U4HOx',  // your playlist id here
                maxResults: 21
            });
            request.execute(function(response) {
                deferred.resolve(response.result);
            });
        });
        return deferred.promise;
    };
}])
