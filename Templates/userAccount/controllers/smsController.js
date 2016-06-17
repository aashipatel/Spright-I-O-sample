(function () {
    "use strict";

    angular.module(APPNAME)
        .controller('smsController', SmsController); //just give the conrtoller a name?

    SmsController.$inject = ['$scope', '$baseController', '$userPageService', '$uibModal'];

    function SmsController(
        $scope
        , $baseController
        , $userPageService
        , $uibModal
        ) {

        //-- this line to simulate inheritance
        $baseController.merge(vm, $baseController);
        var vm = this;//this points to a new {}  //WebsiteController
        vm.$userPageService = $userPageService;
        vm.$uibModal = $uibModal;

        vm.$scope = $scope;

        vm.payload = null;
        vm.smsForm = null;
        vm.newPhone = null;
        vm.confrimPhoneNumber = _confrimPhoneNumber;
        vm.phoneNumberSuccess = _phoneNumberSuccess;
        vm.onPhoneNumberFail = _onPhoneNumberFail;
        vm.openModal = _openModal;

        vm.showConfPhoneErrors = false;

        //this is a wrapper for our small dependency on $scope
        vm.notify = vm.$userPageService.getNotifier($scope);

        render();

        function render() {
        };


        // Button to submit phone number 
        function _confrimPhoneNumber() {

            if (vm.smsForm.$valid) {

                vm.payload = {
                    recipient: vm.newPhone.recipient,
                }
                console.log("This is the recipient number being passed to the Ajax:", vm.payload);
                // Ajax to send the phone number to the server
                vm.$userPageService.receiveSms(vm.payload, _phoneNumberSuccess, _onPhoneNumberFail);
            }
            else {
                vm.showConfPhoneErrors = true;
                console.log("Phone number is not valid :(")
            }
        };

        // On Ajax success open Modal and reset form (reset currently not working haha!)
        function _phoneNumberSuccess() {
            console.log('Ajax call a succes!', vm.payload);
            vm.smsForm.$setPristine();
            _openModal();
        };
        //Ajax Call Fail
        function _onPhoneNumberFail() {
            console.log('Ajax call a fail');

        };

        //Modal Properties 
        function _openModal() {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: "/Scripts/sabio/application/userAccount/templates/smsModalConfirmation.html",       //  this tells it what html template to use. it must exist in a script tag OR external file
                controller: 'smsConfirmationController as smscc',    //  this controller must exist and be registered with angular for this to work
                size: 'lg',
                resolve: {  //  anything passed to resolve can be injected into the modal controller as shown below
                    items: function () {
                        return;
                    }
                }
            });
        }




    }

})();