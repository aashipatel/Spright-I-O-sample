// Controller

(function () {
    "use strict";

    angular.module(APPNAME)
        .controller('ContactController', ContactController);

    ContactController.$inject = ['$scope', '$baseController', "$contactService"];

    function ContactController(
        $scope
        , $baseController
        , $contactService) {

        var vm = this;//this points to a new {}

        vm.item = null;
        vm.selectedEmployee = null;
        vm.contactForm = null;
        vm.AddContact = null;

        vm.showitemErrors = false;


        //vm.showNewEmployeeErrors = false;
        vm.UpdateContact = _UpdateContact;
        vm.AddContact = _AddContact;
        vm.$contactService = $contactService;
        vm.onUpdateSuccess = _onUpdateSuccess;
        vm.contactUpdateId = $("#contactUpdateId").val();
        vm.$scope = $scope;


        // vm.receiveItems = _receiveItems;
        vm.onEmpError = _onEmpError;
        vm.selectEmployee = _selectEmployee;



        //-- this line to simulate inheritance
        $baseController.merge(vm, $baseController);

        //this is a wrapper for our small dependency on $scope
        vm.notify = vm.$contactService.getNotifier($scope);

        //this is like the sabio.startUp function
        render();

        function render() {
            if (vm.contactUpdateId && vm.contactUpdateId.length > 0) {
                console.log("Edit mode - Render Existing Info");
                vm.$contactService.byId(vm.contactUpdateId, _onContactPopById, _onEmpError);
            }
        }
        function _onContactPopById(data) {
            console.log("edit", data);

            vm.notify(function () {
                vm.item = data.item;
                console.log("contact working", vm.item);
            });
        }

        function _resetEmployeeForm() {
            console.log("reset form");
            vm.employeeFormVisible = false;
            vm.showNewEmployeeErrors = false;
            vm.newEmployee = null;
            vm.employeeForm.$setPristine();
            vm.employeeForm.$setUntouched()
        }

        function _contactForm() {
            console.log("show form!");
            vm.contactFormVisible = !vm.contactFormVisible;
        }

        function _AddContact() {
            vm.showitemErrors = true;

            if (vm.contactForm.$valid) {
                console.log("data is valid! go save this object -> ", vm.newEmployee);
                if (vm.contactUpdateId && vm.contactUpdateId.length > 0) {
                    vm.$contactService.UpdateContact(vm.contactUpdateId, vm.item, _onUpdateSuccess, _onUpdateError);
                }
                else {
                    vm.$contactService.AddContact(vm.item, _insertSuccess, _onEmpError);
                }
            }

            else {
                console.log("form submitted with invalid data")
            }
        }


        function __insertSuccess(response) {
            console.log(response)
            //vm.$alertService.success();
        }

        function _UpdateContact(contactUpdateId) {
            console.log("test", contactUpdateId);
            //vm.$alertService.success();
            vm.showitemErrors = true;
            vm.$contactService.UpdateContact(vm.contactUpdateId, vm.item, _onUpdateSuccess, _onUpdateError);
            //vm.$alertService.success();
        }

        function _onUpdateSuccess(data) {
            console.log(vm.onUpdateSuccess, data);
            vm.$alertService.success("Contact Update!");
            window.location.href = '/contact/list/';
            render();
            vm.notify(function () {
                vm.item = data.item;
                console.log("contact working", vm.item);
            });
        }

        function _onUpdateError(error) {
            console.log(error)
            vm.$alertService.error("Contact Error");
        }


        function _echoEmployee() {
            console.log("ECHO employee -> ", vm.newEmployee);
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
            console.error(error);
            //vm.$alertService.error();
        }
    }
})();