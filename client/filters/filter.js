app.filter('dateFilter', function(){
  return function (input) {
  if (!input) {
    return 'No Info.'
  }
  var year = input.toString().substr(0,4);
  var month = input.toString().substr(4,2);
  var day = input.toString().substr(6,8);
  var monthArr = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  var numberMonthArr = ['01','02','03','04','05','06','07','08','09','10','11','12'];
  for (var i = 0; i < numberMonthArr.length; i++) {
    if (numberMonthArr[i] == month) {
      return monthArr[i] + '. ' + day + ', ' + year
    }
  }
  }
});
