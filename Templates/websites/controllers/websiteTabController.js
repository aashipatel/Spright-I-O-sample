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

        vm.currentRequestLabel = "Current Request:";
        vm.websiteId = vm.$routeParams.websiteId;
        //vm.adminBlogId = vm.$routeParams.adminBlogId;

        vm.tabs = [
          { link: '#/details/' + vm.websiteId, label: 'Details', controller: ['detailsController'] },
          { link: '#/blog/' + vm.websiteId, label: 'Blog', controller: ['blogController', 'adminBlogsContentController', 'adminBlogsMediaController'] },
          { link: '#/content/' + vm.websiteId, label: 'Content', controller: ['contentController'] },
          { link: '#/inventory/' + vm.websiteId, label: 'Inventory', controller: ['inventoryController'] },
          { link: '#/navigation/' + vm.websiteId, label: 'Navigation', controller: ['navigationController'] },
          { link: '#/schema/' + vm.websiteId, label: 'Schema', controller: ['schemaController'] },
          { link: '#/records/' + vm.websiteId, label: 'Records', controller: ['recordsIndexController', 'recordsEntityController', 'recordsManageController'] },
          { link: '#/categories/' + vm.websiteId, label: 'Categories', controller: ['categoryTreeController'] }
        ];

    //  this is a handy utility function in baseController which gives you info about the current request
        vm.setUpCurrentRequest(vm);

    //  default selection in case we don't find a match somehow
        vm.selectedTab = vm.tabs[0];

    //  loop through each tab
        for(var x = 0; x< vm.tabs.length; x++)
        {
        //  check the controller property of each tab to see if it matches the current reaquest
            if (vm.tabs[x].controller && vm.tabs[x].controller.indexOf(vm.currentRequest.$$route.controller) > -1)
            {
                //  if it matches: set that tab as selected (override line 36)
                vm.selectedTab = vm.tabs[x];
                break;
            }
        }      

        vm.tabClass = _tabClass;
        vm.setSelectedTab = _setSelectedTab;

        render();

        function render() {
            
            //vm.websiteId = vm.$routeParams.websiteId;
            }

        function _tabClass(tab) {
            if (vm.selectedTab == tab) {

                return "active";
            } else {
                return "";
            }
        }

        function _setSelectedTab(tab) {
            

            vm.selectedTab = tab;
        }
    }
})();