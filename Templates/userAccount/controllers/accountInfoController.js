(function () {
    "use strict";

    angular.module(APPNAME)
        .controller('accountInfoController', AccountInfoController);

    AccountInfoController.$inject = ['$scope', '$baseController', '$userPageService'];

    function AccountInfoController(
        $scope
        , $baseController
        , $userPageService) {

        var vm = this;

        $baseController.merge(vm, $baseController);
        vm.$userPageService = $userPageService;
        vm.$scope = $scope;
        vm.notify = vm.$userPageService.getNotifier($scope);

        vm.user = {};
        vm.controllerForm = null;
        vm.showFormErrors = false;

        vm.userLoaded = _userLoaded;
        vm.updateUser = _updateUser;
        vm.ajaxError = _ajaxError;
        vm.updated = _updated;
        vm.resetForm = _resetForm;

        render();

        function render() {
            vm.$userPageService.GetCurrentUserId(vm.userLoaded, vm.ajaxError)
        }

        function _userLoaded(data) {
            console.log("userLoaded data ", data.item);
            vm.notify(function () {
                vm.user = data.item;
            });
        };

        function _updateUser() {
            vm.showFormErrors = true;

            if (vm.controllerForm.$valid) {
                console.log("form valid data", vm.user);
                vm.$userPageService.updateCurrentUser(vm.user, vm.updated, vm.ajaxError);
            };
        };

        function _updated() {
            vm.$alertService.success("User info updated.");
        };

        function _ajaxError() {
            vm.$alertService.error("Something went wrong, please contact admin.");
        };

        function _resetForm() {
            vm.$alertService.warning("Form reseted.");
            vm.user = {};
        };
    }
})();
