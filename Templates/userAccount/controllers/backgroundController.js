(function () {
    "use strict";

    angular.module(APPNAME)
        .controller('backgroundController', BackgroundController);

    BackgroundController.$inject = ['$scope', '$baseController','$userPageService', '$mediaUploaderService'];

    function BackgroundController(
        $scope
        , $baseController
        , $userPageService
        , $mediaUploaderService) {

        var vm = this;
        vm.dropzone = null;
        vm.mediaId = null;
        vm.currentUser = null;
        vm.GetCurrentUserId = null;
        vm.onUpdateAvatarSubmit = null;
        vm.payload = null;
        vm.dzConfig = {
            autoProcessQueue: true,
            uploadMultiple: false,
            parallelUploads: 1,
            maxFiles: 1,
            maxFileSize: 5,
            url: "/api/MediaUploader/UploadWithData"
        };

        // Hoisting
        vm.$userPageService = $userPageService;
        vm.$mediaUploaderService = $mediaUploaderService;
        vm.$scope = $scope;

        // Current avatar + update functions
        vm.onUpdateImage = _onUpdateImage;
        vm.onuserBackgroundAjaxSuccess = _onuserBackgroundAjaxSuccess;
        vm.CurrentUserIdSuccess = _CurrentUserIdSuccess;

        // Dropzone event handler functions
        vm.dzAddedFile = _dzAddedFile;
        vm.dzError = _dzError;
        vm.dzOnSending = _dzOnSending;
        vm.dzOnSuccess = _dzOnSuccess;


        // DROPZONE
        function _dzAddedFile(file, response) {
            console.log("dzAddedFile works");
        };

        function _dzError(file, errorMessage) {
            console.log(errorMessage);
        };

        function _dzOnSending(file, xhr, formData) {
            //console.log("photo sent to database");
            formData.append("Title", $('#Title').val());
            formData.append("Description", $('#Description').val());
            console.log("formdata is " + formData.Title)
        };

        function _dzOnSuccess(file, response) {
            console.log("mediaId is " + response.item);

            vm.mediaId = response.item;
            vm.onUpdateImage(vm.mediaId);
            vm.dropzone.removeFile(file);
        };


        //-- this line to simulate inheritance
        $baseController.merge(vm, $baseController);

        //this is a wrapper for our small dependency on $scope
        vm.notify = vm.$userPageService.getNotifier($scope);
        vm.notify = vm.$mediaUploaderService.getNotifier($scope);

        //this is like the sabio.startUp function
        render();

        // Initialize dropzone file + pull in current Avatar to the view
        function render() {

             _onuserBackgroundAjaxSuccess();
        };

        //GET: current ID logged in

        function _onuserBackgroundAjaxSuccess(mediaId) {

            vm.$userPageService.GetCurrentUserId(_CurrentUserIdSuccess, _CurrentUserIdAjaxError);
           
        };

        function _CurrentUserIdSuccess(response) {

            vm.notify(function () {
                vm.currentUser = response.item;
                console.log("current user", vm.currentUser);
            });
        };

        function _CurrentUserIdAjaxError() {
            vm.$alertService.error();
        };

        // PUT: update mediaId (avatar)
        function _onUpdateImage(mediaId) {
            console.log("this works", mediaId);

            vm.payload = {
                MediaId: mediaId
            }

            vm.$userPageService.onUpdateBackgroundImage(vm.payload, _onuserBackgroundAjaxSuccess, _onuserBackgroundAjaxError);
            console.log("this is the payload", vm.payload);
        };

        function _onuserBackgroundAjaxError() {
            vm.$alertService.error();
        };
  

    }
})();
