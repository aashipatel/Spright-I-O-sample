(function () {
    "use strict";

    angular.module(APPNAME)
        .controller('smsConfirmationController', SmsConfirmationController); //just give the conrtoller a name?

    SmsConfirmationController.$inject = ['$scope', '$baseController', '$userPageService', '$uibModalInstance'];

    function SmsConfirmationController(
        $scope
        , $baseController
        , $userPageService
        , $uibModalInstance
        ) {

        //-- this line to simulate inheritance
        $baseController.merge(vm, $baseController);
        var vm = this;//this points to a new {}  //WebsiteController
        vm.$userPageService = $userPageService;
        vm.$uibModalInstance = $uibModalInstance;
        vm.$scope = $scope;

        vm.confCode = null;
        vm.payload = null;
        vm.smsConfirmForm = null;
        vm.confCode = null;
        vm.payload = null;

        vm.oValidateSuccess = _oValidateSuccess;
        vm.onValidateError = _onValidateError;


        vm.showConfErrors = false;

        //this is a wrapper for our small dependency on $scope

        vm.notify = vm.$userPageService.getNotifier($scope);

        render();

        function render() {
        };


        vm.submit = function () {

            if (vm.smsConfirmForm.$valid) {
                vm.payload = {

                    confirmCode: vm.confCode.confirmCode,
                }

                console.log("testing payload before ajax call:", vm.payload);
                $userPageService.validateSMSFourDigitCode(vm.payload, _oValidateSuccess, _onValidateError)
            } else {

                vm.showConfErrors = true;
                console.log("Entered Code Is Not Valid :(")
            }
        };

        function _oValidateSuccess() {
            vm.$uibModalInstance.dismiss('success!');
            console.log("The Ajax call was a success, here is the code:", vm.payload);
            

        };

        function _onValidateError() {
            console.log("The Ajax call was a Failure. DEBUG!");
        };

        vm.cancel = function () {
            vm.$uibModalInstance.dismiss('cancel');
        };

      

    }


  

})();