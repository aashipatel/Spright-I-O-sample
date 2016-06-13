//Tab Controller for Blog Manage Page
(function () {
    "use strict";

    angular.module(APPNAME)
        .controller('adminBlogsTabController', adminBlogsTabController);

    adminBlogsTabController.$inject = ['$scope', '$baseController', '$routeParams'];

    function adminBlogsTabController(
        $scope
        , $baseController
        , $routeParams) {

        var vm = this;
        //vm.adminBlogId;

        $baseController.merge(vm, $baseController);

        vm.$scope = $scope;
        vm.$routeParams = $routeParams;

        vm.currentRequestLabel = "Current Request:";
        vm.adminBlogId = vm.$routeParams.adminBlogId;
        vm.websiteId = vm.$routeParams.websiteId;
        //console.log("BlogId is", vm.adminBlogId, "WebsiteId is", vm.websiteId);
        

        vm.tabs = [
          { link: '#/blog/' + vm.websiteId + '/edit/' + vm.adminBlogId, label: 'Blog', controller: 'adminBlogsContentController' },
          { link: '#/blog/' + vm.websiteId + '/media/' + vm.adminBlogId, label: 'Media', controller: 'adminBlogsMediaController' },
        ];

        //  this is a handy utility function in baseController which gives you info about the current request
        vm.setUpCurrentRequest(vm);

        //  default selection in case we don't find a match somehow
        vm.selectedTab = vm.tabs[0];

        //loop through each tab
        for (var x = 0; x <= vm.tabs.length; x++) {
            //  check the controller property of each tab to see if it matches the current reaquest
            if (vm.currentRequest.$$route.controller == vm.tabs[x].controller) {
                //  if it matches: set that tab as selected (override line 36)
                vm.selectedTab = vm.tabs[x];
                break;
            }
        };

        vm.tabClass = _tabClass;
        vm.setSelectedTab = _setSelectedTab;

        render();

        function render() {

        };

        function _tabClass(tab) {
            if (vm.selectedTab == tab) {
                return "active";
            } else {
                return "";
            }
        };

        function _setSelectedTab(tab) {
            console.log("set selected tab", tab);
            vm.selectedTab = tab;
        };
    }
})();