 (function () {
            "use strict";

            angular.module(APPNAME)
                .controller('adminUserIndexController', AdminUserIndexController);

            AdminUserIndexController.$inject = ['$scope', '$baseController', "$adminUserService"];
           
            function AdminUserIndexController(
                  $scope
                , $baseController
                , $adminUserService) {

                //  controllerAs with vm syntax: https://github.com/johnpapa/angular-styleguide#style-y032
                var vm = this;//this points to a new {}
                vm.headingInfo = "Angular 101";
                vm.items = null;
                vm.selectedEmployee = null;
                vm.currentPage = 1;
                vm.pageSize = 20;
                vm.totalItems = null;
                vm.items = [];
                vm.Query = null;


                //  bindable members (functions) always go up top while the "meat" of the functions go below: https://github.com/johnpapa/angular-styleguide#style-y033
                vm.receiveItems = _receiveItems;
                vm.selectEmployee = _selectEmployee;
                vm.onEmpError = _onEmpError;
                vm.deleteUser = _deleteAdminUser;
                vm.deleteSuccess = _deleteSuccess;
                vm.editUser = _editAdminUser;

                vm.pageChangeHandler = _pageChangeHandler;
                vm.$adminUserService = $adminUserService;
                vm.$scope = $scope;
                vm.listAllUsers = _listAllUsers;

                //-- this line to simulate inheritance
                $baseController.merge(vm, $baseController);

                //this is a wrapper for our small dependency on $scope
                vm.notify = vm.$adminUserService.getNotifier($scope);

                //this is like the sabio.startUp function
                render();

                function render() {
                    console.log("got here")
                    vm.listAllUsers();
                    //  defer data operations into an external service: https://github.com/johnpapa/angular-styleguide#style-y035
                    //vm.$adminUserService.listAllUsers(vm.receiveItems, vm.onEmpError);
                }
                function _listAllUsers() {
                    var payload = {
                        Query: vm.Query,
                        currentPage: vm.currentPage,
                        itemsPerPage: vm.pageSize
                    }
                    vm.$adminUserService.listAllUsers(payload, vm.receiveItems, vm.onEmpError);
                };
                function _receiveItems(data) {
                    console.log("me" + data);
                    vm.notify(function () {
                        vm.items = data.items;
                        vm.totalItems = data.totalItems;
                        vm.currentPage = data.currentPage;
                        
                        
                    });
                    
                }
            function _selectEmployee(anEmp) {
                console.log(anEmp);
                vm.selectedEmployee = anEmp;
            }
 
            function _saveStatus(anEmp) {
                console.log("Go and save this new data");
                console.log(anEmp);
            }
 
            function _onEmpError(jqXhr, error) {
                console.log(error);
            }
            function _deleteAdminUser(userId) {
                console.log("delete this contact", userId);
                vm.$adminUserService.deleteUserById(userId, vm.deleteSuccess, vm.onEmpError);
            }
            function _deleteSuccess() {
                console.log("deleted!!");
                vm.$alertService.success(" Delete!");
                render();
            }
            function _editAdminUser(userId) {
            }
            
            function _pageChangeHandler(currentPage) {
                vm.currentPage = currentPage;
                _listAllUsers();
            };
        }
        })();