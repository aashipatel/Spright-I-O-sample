// Blog Angular mediaController
(function () {
    "use strict";

    angular.module(APPNAME)
        .controller('adminBlogsMediaController', adminBlogsMediaController);

    adminBlogsMediaController.$inject = ['$scope', '$baseController', '$blogService', '$mediaUploaderService'];

    function adminBlogsMediaController(
        $scope
        , $baseController
        , $blogService
        , $mediaUploaderService) {

        //  controllerAs with vm syntax: https://github.com/johnpapa/angular-styleguide#style-y032
        var vm = this;//this points to a new {}
        vm.blog = null;
        vm.dropzone = null;
        vm.mediaId = null;
        vm.adminBlogId = null;
        vm.onUpdateBlogImageSubmit = null;
        vm.payload = null;
        vm.dzConfig = {
            autoProcessQueue: true,
            uploadMultiple: false,
            parallelUploads: 1,
            maxFiles: 1,
            maxFileSize: 5,
            url: "/api/MediaUploader/UploadWithData"
        };

        vm.$blogService = $blogService;
        vm.$mediaUploaderService = $mediaUploaderService;
        vm.$scope = $scope;

        // *HOISTING* Bindable members (functions) always go up top while the "meat" of the functions go below: https://github.com/johnpapa/angular-styleguide#style-y033
        vm.blogMediaPayload;
        vm.onPostBlogMediaSuccess = _onPostBlogMediaSuccess;
        vm.onGetMediabyBlogIdSuccess = _onGetMediabyBlogIdSuccess;
        vm.setMain = _setMain;
        vm.setMainOnSuccess = _setMainOnSuccess;

        // Current avatar + update functions
        vm.onUpdateImage = _onUpdateImage;
        vm.OnAnySuccess = _OnAnySuccess;
        vm.OnAnyError = _OnAnyError;

        // Dropzone event handler functions
        vm.dzAddedFile = _dzAddedFile;
        vm.dzError = _dzError;
        vm.dzOnSending = _dzOnSending;
        vm.dzOnSuccess = _dzOnSuccess;

        //-- this line to simulate inheritance
        $baseController.merge(vm, $baseController);

        //this is a wrapper for our small dependency on $scope
        vm.notify = vm.$blogService.getNotifier($scope);
        vm.notify = vm.$mediaUploaderService.getNotifier($scope);

        //this is like the sabio.startUp function
        render();

        function render() {
            vm.adminBlogId = vm.$routeParams.adminBlogId;
            _loadBlogMedia();
        };

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
            console.log("formdata is " + formData.mediaId)
        };

        function _dzOnSuccess(file, response) {
            console.log("mediaId is " + response.item);
            vm.mediaId = response.item;
            vm.adminBlogId = vm.$routeParams.adminBlogId;
            vm.onUpdateImage(vm.mediaId);
            vm.dropzone.removeFile(file);
            vm.blogMediaPayload = {
                blogId: vm.adminBlogId,
                MediaId: vm.mediaId,
                IsCoverPhoto: 0
            }
            //Update media base on vehicleID
            vm.$mediaUploaderService.postBlogMedia(vm.blogMediaPayload, vm.onPostBlogMediaSuccess, vm.OnAnyError)
            console.log("BlogMediaPayload Data", vm.blogMediaPayload)
        };
        function _onPostBlogMediaSuccess(object) {
            console.log("onPostBlogMediaSuccess", object)
            _loadBlogMedia();
            console.log("onGetMediabyBlogIdSuccess", object)
        }
        function _loadBlogMedia() {
            // Called this function in two places. Render it when you the page first load and the after upload the images
            vm.$mediaUploaderService.getBlogMedia(vm.adminBlogId, vm.onGetMediabyBlogIdSuccess)
        }

        function _onGetMediabyBlogIdSuccess(data) {
            console.log("Blog Image Data", data);
            vm.notify(function () {

                vm.blogMedia = data.items;
                //console.log("text image", vm.blogMedia)

            });

        }

        function _OnAnySuccess(response) {
            vm.$alertService.success();

        };

        function _OnAnyError(response) {
            vm.$alertService.error();
        };

        // PUT: update mediaId (avatar)
        function _onUpdateImage(mediaId) {
            console.log("this works", mediaId);
            vm.payload = {
                MediaId: mediaId
            }
        };

        function _onBlogImageSubmitError() {
            vm.$alertService.error();
        };

        function _setMain(mediaId) { 
            vm.setMainPayload = {
                blogId: vm.adminBlogId,
                MediaId: mediaId
            }

            vm.$mediaUploaderService.CoverPhoto(vm.setMainPayload, vm.setMainOnSuccess, vm.OnAnyError);

            console.log("New Cover Photo Set", vm.setMainPayload);
        }

        function _setMainOnSuccess() {
            _loadBlogMedia()
            console.log("MainPhoto HAS changed!")
            //setMain function is calling by button in html, after click the button fire up ajax, and in the ajax success handler call teh loadVehicleMedia again!
            //this kind like refresh the page, but only the image part not the whole page
        }
    }
})();