//AdminBlog Index Angular Controller
(function () {
    "use strict";

    angular.module(APPNAME)
        .controller('indexController', IndexController);

    IndexController.$inject = ['$scope', '$baseController', "$blogService"];

    function IndexController(
        $scope
        , $baseController
        , $blogService) {

        //  controllerAs with vm syntax: https://github.com/johnpapa/angular-styleguide#style-y032
        var vm = this;//this points to a new {}
        vm.adminBlogs = null;
        vm.selectedBlog = null;

        vm.$blogService = $blogService;
        vm.$scope = $scope;

        //  bindable members (functions) always go up top while the "meat" of the functions go below: https://github.com/johnpapa/angular-styleguide#style-y033
        //vm.selectBlog = _selectBlog;
        vm.listBlogs = _listBlogs;
        vm.deleteBlogsById = _deleteBlogsById;
        vm.blogDeleteSuccess = _blogDeleteSuccess;


        //-- this line to simulate inheritance
        $baseController.merge(vm, $baseController);

        //this is a wrapper for our small dependency on $scope
        vm.notify = vm.$blogService.getNotifier($scope);

        //this is like the sabio.startUp function
        render();

        function render() {
            //  defer data operations into an external service: https://github.com/johnpapa/angular-styleguide#style-y035
            vm.$blogService.blogslistJson(vm.listBlogs, _onBlogError);
            //window.location.replace('websites#/list');
        }

        function _listBlogs(data) {
            //this receives the data and calls the special
            //notify method that will trigger ng to refresh UI
            vm.notify(function () {
                vm.blogs = data.items;
            });
        }

        function _onBlogError(jqXhr, error) {
            console.error(error);
            vm.$alertService.error();
        };

        //Delete category
        function _deleteBlogsById(id) {
            console.log("Attempting to Delete Blog", id);
            if (confirm("Are you sure you want to delete this Blog?")) {
                vm.$blogService.deleteBlogsById(id, _blogDeleteSuccess, _blogDeleteError);
            }
        };

        function _blogDeleteSuccess() {
            vm.$alertService.success();
            render();
        };

        function _blogDeleteError() {
            vm.$alertService.error();
        };
    }
})();