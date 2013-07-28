'use strict'

Application.Filters.filter('titleFilter', function() {
  return function(list, title) {
    if (!title || title == "") { return list; }
    var resultList = list.filter(function(item) {
      return item.title.toLowerCase().indexOf(title.toLowerCase()) != -1;
    });
    return resultList;
  };
});
