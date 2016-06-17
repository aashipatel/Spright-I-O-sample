
(function () {
    "use strict";

    angular.module(APPNAME)
        .controller('addressController', AddressController);

    AddressController.$inject = ['$scope', '$baseController', "$AddressesService"];

    function AddressController(
        $scope
        , $baseController
        , $AddressesService) {


        var vm = this;// this points to a new {}
        vm.headingInfo = "Angular 101";
        vm.addressId = $("#addressId").val();

        //for google maps Geo Coding
        vm.geocoder = null;
        vm.map = null;
        vm.geocodeResponse = null;
        vm.marker = null;

        vm.update = false;

        vm.items = null;
        vm.selectedAddress = null;
        vm.newAddress = {};
        vm.addressForm = null;
        vm.controllerFormVisible = false;
        vm.showNewAddressErrors = false;
        vm.activateSaveBtn = true; // disabling of the save address btn on start up - until the form is validated via Geo coding

        vm.$AddressesService = $AddressesService;
        vm.$scope = $scope;

        vm.receiveItems = _receiveItems;
        vm.onEmpError = _onEmpError;
        vm.selectAddress = _selectAddress;
        vm.saveStatus = _saveStatus;
        vm.showAddressForm = _showAddressForm;
        vm.addAddress = _addAddress;
        vm.echoAddress = _echoAddress;
        vm.resetForm = _resetForm;
        vm.submitAddressForm = _submitAddressForm; // used and binded to the save address button in HTML above
        vm.checkAddressGeo = _checkAddressGeo;



        //-- this line to simulate inheritance
        $baseController.merge(vm, $baseController);

        // This is a wrapper for our small dependency on $scope
        vm.notify = vm.$AddressesService.getNotifier($scope);

        // This is like the sabio.startUp function
        render();

        // If Id is present, populare the form with that address
        function render() {

            vm.map = new google.maps.Map($('#googleMap')[0], {
                zoom: 12,
                center: { lat: 34.0522, lng: -118.2437 }
            });

            vm.marker = new google.maps.Marker({
                position: { lat: 34.0522, lng: -118.2437 },
                map: vm.map
            });

            vm.geocoder = new google.maps.Geocoder();

            vm.$AddressesService.populateByCurrentUser(_addressPopulateByIdSuccess, _addressPopulateByIdError);
          
        }

        // Assigning/Sedning the new address from the user input/form to "addString" variable then shipping over to the Geocode address validation
        function _checkAddressGeo() {

            if (vm.addressForm.$valid) {
                if (!vm.newAddress.lineTwo) {
                    vm.newAddress.lineTwo = "";
                }
                console.log("line2 is ", vm.newAddress.lineTwo);
                var addressString = vm.newAddress.line + " " + vm.newAddress.lineTwo + " " + vm.newAddress.city + " " + vm.newAddress.stateId + " " + vm.newAddress.zipCode;
                _codeAddress(addressString);
                console.log('this is the code string:', addressString);
            }
            else {
                vm.showNewAddressErrors = true;
                console.log("form submitted with invalid data :(")
            }
        }

        //Assigning the addressString varibale to the Geo Coder function and starting the process to validate the address
        function _codeAddress(address) { //? why not hoist on top??
            console.log("address string -> ", address);

            vm.geocoder.geocode({ 'address': address }, _onCodeAddress);
        }

        // Google Geo coder gets the address and does the validation process for us
        function _onCodeAddress(results, status) {
            vm.notify(function () {
                vm.geocodeResponse = JSON.stringify(results, null, "     ");
            });

            if (status == google.maps.GeocoderStatus.OK) {

                var geometry = results[0].geometry;
                var loc = geometry.location;

                console.log("got location data from API", loc);

                vm.map.setCenter(loc);

                var marker = new google.maps.Marker({
                    map: vm.map,
                    position: loc
                });

                if (geometry.viewport)
                    vm.map.fitBounds(geometry.viewport);

                var lat = loc.lat();
                var lon = loc.lng();

                console.log("found coordinates in reply -> (%s, %s)", lat, lon); //console log

                vm.newAddress.latitude = lat;
                vm.newAddress.longitude = lon;

                _submitAddressForm;

                // Activation of the save addres btn once the validation comes back as "valid"
                vm.notify(function () {
                    vm.activateSaveBtn = false;
                });

                // save address 
               // _submitAddressForm(vm.newAddress);
            } else {
                alert('We could not find the address. Please check your information and try again. : ' + status);
            }
        }


        // The Populte form by Id Ajax call Sunccess, passing the date to the vm.newAddress and pushed into the form
        function _addressPopulateByIdSuccess(data) {

            if (data.item === null) {
                console.log("lets create a new address");
            } else {
                vm.update = true;
                vm.notify(function () {
                    vm.newAddress = data.item;

                });

                var lat = data.item.latitude;
                var lng = data.item.longitude;
                var newLatLng = new google.maps.LatLng(lat, lng);
                vm.marker.setPosition(newLatLng);
                vm.map.setCenter(newLatLng);

                // Console log the data being passed into the HTML form for population byt Id
                console.log('Populate by Id worked', data);

            }
        }

        // Failed update by Id Ajax
        function _addressPopulateByIdError() {
            console.log('Populate by Id failed');
        }


        // Call Update Address bu Id or Create Address function if the form has been populated by the address from the Manage page by the Edit button
        function _submitAddressForm(data) {

            console.log('adddress Id for update ', vm.addressId)
            if (vm.update === true) {

                // Ajax call for Address Update service ajax refactoring
                vm.$AddressesService.updateAddress(vm.newAddress, vm.newAddress.id, _addressUpdateSuccess, _addressUpdateError);

            }
                // Ajax call for Creating of a new Address
            else {
                //  Ajax address creation service ajax refactoring
                vm.$AddressesService.createAddress(vm.newAddress, _createAddressSucccess, _createAddressfail)
            }

            console.log('payload:', vm.newAddress);
        }

        // Ajax call to create access success + window location change on success to mange page
        function _createAddressSucccess(event) {
            vm.$alertService.success("Address added.");
            console.log("new ", event);
            vm.update = true;
            vm.newAddress.id = event.item;
        }

        // Ajax create new address fail message
        function _createAddressfail(event) {
            console.log('Address creation fail');
        }

        // Ajax address update success message
        function _addressUpdateSuccess(event) {
            console.log('Address created!', vm.newAddress);
            vm.$alertService.success("Address updated.");

        }

        // Ajax address update fail message
        function _addressUpdateError(event) {
            console.log('Update Address Fail');
        }


        function _receiveItems(data) {
            //this receives the data and calls the special
            //notify method that will trigger ng to refresh UI
            vm.notify(function () {
                vm.items = data.items;
            });
        }
        //Not being used I think
        function _resetForm() {
            console.log("reset form");
            vm.controllerFormVisible = false;
            vm.showNewAddressErrors = false;
            vm.newAddress = null;
            vm.addressForm.$setPristine();
            vm.addressForm.$setUntouched()
        }

        // Address form visible on startup
        function _showAddressForm() {
            console.log("show form!");
            vm.AddressFormVisible = !vm.AddressFormVisible;
        }

        function _addAddress() {
            vm.showNewAddressErrors = true;

            if (vm.controllerForm.$valid) {
                console.log("data is valid! go save this object -> ", vm.newAddress);
            }
            else {
                console.log("form submitted with invalid data :(")
            }
        }

        //call to Ajax to create address
        function _addAddress() {
            console.log(vm.newAddress);
            vm.$AddressesService.createAddress(vm.newAddress, _createAddressSucccess, _createAddressfail)

        }

        function _echoAddress() {
            console.log("ECHO Address -> ", vm.newAddress);
        }

        function _selectAddress(anEmp) {
            console.log(anEmp);
            vm.selectedAddress = anEmp;
        }

        function _saveStatus(anEmp) {
            console.log("Go and save this new data");
            console.log(anEmp);
        }

        function _onEmpError(jqXhr, error) {
            console.error(error);
        }
    }
})();
