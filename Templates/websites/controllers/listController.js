(function () {
    "use strict";

    angular.module(APPNAME)
        .controller('listController', ListController); 

    ListController.$inject = ['$scope', '$baseController', "$websitesService"];

    function ListController(
        $scope
        , $baseController
        , $websitesService) {


        var vm = this;//this points to a new {}  //WebsiteController
        vm.headingInfo = "Your websites";
        vm.items = null;
        vm.selectedEmployee = null;

        vm.$websitesService = $websitesService;
        vm.$scope = $scope;

        vm.receiveItems = _receiveItems;
        vm.onEmpError = _onEmpError;
        vm.deleteWebsite = _deleteWebsite;
        vm.onDeleteSuccess = _onDeleteSuccess;


        //-- this line to simulate inheritance
        $baseController.merge(vm, $baseController);

        //this is a wrapper for our small dependency on $scope
        vm.notify = vm.$websitesService.getNotifier($scope);

        //this is like the sabio.startUp function
        render();

        function render() {
            vm.$websitesService.loadWebsitesRows(vm.receiveItems, vm.onEmpError); 
        }

        function _receiveItems(data) {
            //$location.path('/list');
            vm.notify(function () {
                vm.items = data.items;
            });
        }
        function _onEmpError(jqXhr, error) {
            console.log(error);
        }

        function _deleteWebsite(websiteId) {
         if(confirm("Are You Sure You Want to Delete This website!")){
             vm.$websitesService.deleteWebsite(websiteId, vm.onDeleteSuccess, vm.onEmpError);
}
        };
        function _onDeleteSuccess(data) { 
            //window.location.replace('/websites');
            console.log(data);
            render();
            //vm.$alertService.success("Website Delete!");
        };

    }
})();