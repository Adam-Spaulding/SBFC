# ng-repeat Owl Carousel
Directive for initializing Owl Carousel in AngularJS ng-repeat

#Download
##NPM
```shell
npm install ng-repeat-owl-carousel --save
```
##Bower
```shell
bower install ng-repeat-owl-carousel --save
```

#Usage
Add source file to your view
```html
<script src="ngRepeatOwlCarousel.min.js"></script>
```

Add module as dependency to your app
```javascript
angular.module('app', ['ocNgRepeat'])
```
Create Owl Carousel initializer method on controller or page
```javascript
  app.controller("TeamController", [ function() {
      var ctrl;
      ctrl = this;
      ctrl.members = []

      ctrl.carouselInitializer = function() {
        $(".about-carousel").owlCarousel({
          items: 3,
          navigation: true,
          pagination: false,
          navigationText: ["<i class='fa fa-angle-left'></i>", "<i class='fa fa-angle-right'></i>"]
        });
      };
    }
  ]);
```
Add directive to your view and pass carousel initializer method
```html
<div ng-controller="TeamController as tCtrl">
    <div ng-repeat="mbr in tCtrl.members" ng-repeat-owl-carousel carousel-init="tCtrl.carouselInitializer">
    </div>
</div>
```
