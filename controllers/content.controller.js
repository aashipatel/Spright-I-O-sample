// AdminBlog Angular Content Controller
        (function () {
            "use strict";

            angular.module(APPNAME)
                .controller('adminBlogsContentController', adminBlogsContentController);

            adminBlogsContentController.$inject = ['$scope', '$baseController', '$blogService', '$textAngularService'];

            function adminBlogsContentController(
                $scope
                , $baseController
                , $blogService
                , $textAngularService) {

                //  controllerAs with vm syntax: https://github.com/johnpapa/angular-styleguide#style-y032
                var vm = this;//this points to a new {}
                vm.blog = null;
                vm.dt = null;

                // *HOISTING* Bindable members (functions) always go up top while the "meat" of the functions go below: https://github.com/johnpapa/angular-styleguide#style-y033
                vm.addBlog = _addBlog;
                vm.slugCat = _slugCat;
                vm.today = _today;
                //vm.clear = _clear;
                //vm.popup1 = _popup1;
                vm.open1 = _open1;
                //vm.toggleMin = _toggleMin;
                //vm.inlineOptions = _inlineOptions;
                //vm.dateOptions = _dateOptions;
                vm.setDate = _setDate;
                //vm.formats = _formats;
                //vm.format = _format;
                //vm.altInputFormats = _altInputFormats;
                //vm.getDayClass = _getDayClass;
                //vm.disabled = _disabled;
                //vm.formatDate = _formatDate;

                //-- this line to simulate inheritance
                $baseController.merge(vm, $baseController);

                vm.$blogService = $blogService;
                vm.$scope = $scope;
                vm.$textAngularService = $textAngularService;
                

                //this is a wrapper for our small dependency on $scope
                vm.notify = vm.$blogService.getNotifier($scope);
                vm.notify = vm.$textAngularService.getNotifier($scope);

                //this is like the sabio.startUp function
                render();

                function render() {
                    vm.adminBlogId = vm.$routeParams.adminBlogId;
                    if (vm.adminBlogId && vm.adminBlogId.length > 0) {
                        console.log("Editing Blog", vm.adminBlogId);
                        vm.$blogService.getBlogById(vm.adminBlogId, _GetBlogSuccess, _onGetBlogError);
                    };
                };

                function _addBlog() {
                    vm.showNewBlogErrors = true;
                    vm.websiteId = vm.$routeParams.websiteId;

                    if (vm.blogForm.$valid) {
                     
                        var payload = vm.blog;
                        console.log("Loading Blog Data", payload);
                        // Allows the use of datepicker
                        payload.publishDate = moment(payload.publishDate).format('YYYY-MM-DD, hh:mm:ss a');
                        payload.websiteId = vm.websiteId;
                        //Timestamps the current Time (Use for very accurate timestamp)
                        //payload.publishDate = moment().utc(payload.publishDate).format('YYYY-MM-DD, hh:mm:ss a');

                        //second if statement to see if its an update or an insert
                        if (vm.adminBlogId && vm.adminBlogId.length > 0) {
                            vm.$blogService.updateBlog(payload, vm.adminBlogId, _updateBlogSuccess, _updateBlogError);
                            console.log("update blog", payload);
                        }
                        else {
                           
                            vm.$blogService.insertBlog(payload, _insertBlogSuccess, _insertBlogError);
                            console.log("New Blog Created!");
                        }
                    }

                    else {
                        console.log("Blog Form Not Submitted");
                    };
                };

                function _setDate(year, month, day) {
                    vm.dt = new Date(year, month, day);
                };

                //vm.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
                //vm.format = vm.formats[0];
                //vm.altInputFormats = ['M!/d!/yyyy'];

                //vm.inlineOptions = {
                //    customClass: _getDayClass,
                //    minDate: new Date(),
                //    showWeeks: true
                //};

                //vm.dateOptions = {
                //    dateDisabled: _disabled,
                //    formatYear: 'yy',
                //    maxDate: new Date(2020, 5, 22),
                //    minDate: new Date(),
                //    startingDay: 1
                //};

                //function _toggleMin() {
                //    console.log("Min Works!");
                //    vm.inlineOptions.minDate = vm.inlineOptions.minDate ? null : new Date();
                //    vm.dateOptions.minDate = vm.inlineOptions.minDate;
                //};

                //_toggleMin();

                //function _getDayClass(data) {
                //    var date = data.date,
                //      mode = data.mode;
                //    if (mode === 'day') {
                //        var dayToCheck = new Date(date).setHours(0, 0, 0, 0);

                //        for (var i = 0; i < vm.events.length; i++) {
                //            var currentDay = new Date(vm.events[i].date).setHours(0, 0, 0, 0);

                //            if (dayToCheck === currentDay) {
                //                return vm.events[i].status;
                //            }
                //        }
                //    }

                //    return '';
                //};

                //function _disabled(data) {
                //    var date = data.date,
                //      mode = data.mode;
                //    return mode === 'day' && (date.getDay() === 0 || date.getDay() === 6);
                //};

                function _open1() {
                    vm.popup1.opened = true;
                };

                vm.popup1 = {
                    opened: false
                };

                var tomorrow = new Date();
                tomorrow.setDate(tomorrow.getDate() + 1);
                var afterTomorrow = new Date();
                afterTomorrow.setDate(tomorrow.getDate() + 1);
                vm.events = [
                  {
                      date: tomorrow,
                      status: 'full'
                  },
                  {
                      date: afterTomorrow,
                      status: 'partially'
                  }
                ];

                //function _formatDate(date) {
                //    //var localDate = moment('01/01/2016', 'MM/DD/YYYY', true).format()
                //    var utcTime = moment.utc(payload).format('MMMM Do YYYY, h:mm:ss a');
                //    console.log("utc time is %s", date);
                //    return utcTime;   
                //};

                function _today() {
                    //console.log("Set Today's Date");
                    vm.dt = new Date();
                };
                _today();

                //function _clear() {
                //    vm.dt = null;
                //};

                function _GetBlogSuccess(data) {
                    //this receives the data and calls the special notify method that will trigger
                    //cont.. angular to refresh the UI
                    console.log("Retrieved", data);
                    vm.notify(function () {
                        vm.blog = data.item;
                       
                    });
                };

                function _onGetBlogError(jqXhr, error) {
                    console.error(error);
                    vm.$alertService.error();
                };

                function _updateBlogSuccess() {
                    console.log("Blog Updated!");
                    vm.$alertService.success();
                };

                function _updateBlogError() {
                    vm.$alertService.error();
                };

                function _insertBlogSuccess() {
                    vm.$alertService.success();
                };

                function _insertBlogError() {
                    vm.$alertService.error();
                };

                function _slugCat(text) {

                    vm.blog.slug = text.toLowerCase().replace(/[^\w ]+/g, '').replace(/ +/g, '-');
                };
               
                function _checkboxModel() {
                    value1: true
                    value2: true

                };


            }
        })();