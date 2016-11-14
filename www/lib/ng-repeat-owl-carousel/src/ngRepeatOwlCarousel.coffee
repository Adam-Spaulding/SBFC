angular.module("ocNgRepeat", [])

.directive('ngRepeatOwlCarousel', () ->
  restrict : 'A'
  scope :
    carouselInit : '&'
  link : (scope, element, attrs) ->
    if scope.$parent? and scope.$parent.$last
      scope.carouselInit()()
)