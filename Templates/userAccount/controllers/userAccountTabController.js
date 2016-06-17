(function () {
    "use strict";

    angular.module(APPNAME)
        .controller('tabController', TabController);

    TabController.$inject = ['$scope', '$baseController', '$routeParams'];

    function TabController(
        $scope
        , $baseController
        , $routeParams) {

        var vm = this;

        $baseController.merge(vm, $baseController);

        vm.$scope = $scope;
        vm.$routeParams = $routeParams;

        init();

        function init() {
            window.location = "#/user/accountInfo";
        };

        vm.currentRequestLabel = "Current Request:";

        vm.tabs = [
          { link: '#/user/accountInfo', label: 'Account Info' },
          { link: '#/user/address', label: 'Address' },
          { link: '#/user/avatar', label: 'Avatar' },
          { link: '#/user/background', label: 'Background' },
          { link: '#/user/notification', label: 'Notification' },
          { link: '#/user/sms', label: 'Notification Method' },
        ];

        vm.selectedTab = vm.tabs[0];

        vm.tabClass = _tabClass;
        vm.setSelectedTab = _setSelectedTab;

        function _tabClass(tab) {
            if (vm.selectedTab == tab) {
                return "active";
            } else {
                return "";
            }
        }

        function _setSelectedTab(tab) {
            //console.log("set selected tab", tab);
            vm.selectedTab = tab;
        }
    }
})();