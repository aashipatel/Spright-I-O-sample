(function () {
    "use strict";

    angular.module(APPNAME)
        .controller('adminUserManageController', AdminUserManageController);

    AdminUserManageController.$inject = ['$scope', '$baseController', "$adminUserService", "$websitesService", '$routeParams', '$location', '$AdminRolesService'];

    function AdminUserManageController(
        $scope
        , $baseController
        , $adminUserService
        , $websitesService
        , $routeParams
        , $location
        , $AdminRolesService) {

      
        var vm = this;
        vm.headingInfo = "Angular 101";
        vm.item = null;
        vm.webList = null;
        vm.showWebs = null;
        vm.selectedEmployee = null;
        vm.userId = $routeParams.userId;
        vm.showNewEmployeeErrors = false;
        vm.InfoItems = null;
        vm.adminUser = null;
        vm.userRolesList = null;

        
        vm.$websitesService = $websitesService;
        vm.$scope = $scope;
        vm.$adminUserService = $adminUserService;
        vm.$AdminRolesService = $AdminRolesService;
        vm.$scope = $scope;

 
        vm.receiveItems = _receiveItems;
        vm.selectEmployee = _selectEmployee;
        vm.onEmpError = _onEmpError;
        vm.updateAdminUser = _updateAdminUser;
        vm.rolesLoaded = _rolesLoaded;

        vm.onUpdateSuccess = _onUpdateSuccess;
        vm.loadSuccess = _loadSuccess;
        vm.showRoles = ['18fea797-9551-4d1e-a38c-09ca2dd64b91', '68FB8EE9-61C9-45E3-B3F5-251935A3EBD9', '09B66209-A898-4A02-850A-DACA5E5E2FD1'];

        vm.showWebsites = _showWebsites;

       
        $baseController.merge(vm, $baseController);

       
        vm.notify = vm.$adminUserService.getNotifier($scope);

        render();

        function render() {
            vm.$adminUserService.populateByUserId(vm.userId, vm.receiveItems, vm.onEmpError);
            vm.$websitesService.loadWebsitesRows(_loadSuccess, _onEmpError);
        }
        /
        function _loadSuccess(data) {
            vm.$alertService.success("Load website data");
            vm.notify(function () {
                vm.webList = data.items;
            });
            vm.$AdminRolesService.listAdmins(vm.rolesLoaded, vm.onEmpError);
        }

        function _receiveItems(data) {
            vm.item = data.item;
            console.log("website", vm.item)
            var websiteIds = [];
            for (var i = 0; i < vm.item.website.length; i++) {
                console.log("websiteIdList", vm.item.website[i].id);
                websiteIds.push(vm.item.website[i].id);
            }

            vm.notify(function () {
                vm.item.website = websiteIds;
                vm.showRoles = vm.showRoles
                vm.item.roleId = vm.item.roleId;
            });

            vm.showWebsites();
        }

        function _rolesLoaded(data) {
            console.log("user roles list is ", data.items);
            console.log("user roles selected is ", vm.item.roleId);
            vm.notify(function () {
                vm.userRolesList = data.items;

            });

        };

        function _resetEmployeeForm() {
            vm.employeeFormVisible = false;
            vm.showNewEmployeeErrors = false;
            vm.newEmployee = null;
            vm.employeeForm.$setPristine();
            vm.employeeForm.$setUntouched()
        }

        function _showEmployeeForm() {
            vm.employeeFormVisible = !vm.employeeFormVisible;
        }

        function _addEmployee() {
            vm.showNewEmployeeErrors = true;

            if (vm.employeeForm.$valid) {
                console.log("data is valid! go save this object -> ", vm.newEmployee);
            }
            else {
                console.log("form submitted with invalid data :(")
            }
        }

        function _selectEmployee(anEmp) {
            vm.selectedEmployee = anEmp;
        }

        function _saveStatus(anEmp) {
            console.log(anEmp);
        }

        function _onEmpError(res) {
            console.log(res);
        }

        function _updateAdminUser(item) {
            vm.showNewEmployeeErrors = true;
            item.websiteId = item.website;
           
            console.log("Updating", item);
            if (vm.showWebs == false) {

                item.websiteId = [];
            }
            vm.$adminUserService.updateUsersById(vm.userId, item, _onUpdateSuccess, _onEmpError);
        }
        //put method Success handler
        function _onUpdateSuccess(data) {
            console.log("Updated!", data);
            vm.$alertService.success("update website");
   
        }

        function _showWebsites() {

            if (vm.showRoles.indexOf(vm.item.roleId) > -1) {
                vm.showWebs = true;
            } else {
                vm.showWebs = false;
            }
        };


    }
})();
