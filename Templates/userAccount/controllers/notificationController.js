(function () {
    "use strict";

    angular.module(APPNAME)
        .controller('notificationController', NotificationController);

    NotificationController.$inject = ['$scope', '$baseController', '$userPageService'];

    function NotificationController(
        $scope
        , $baseController
        , $userPageService) {

        var vm = this;

        $baseController.merge(vm, $baseController);
        vm.$userPageService = $userPageService;
        vm.$scope = $scope;
        vm.notify = vm.$userPageService.getNotifier($scope);
        
        
        vm.eventType = null;
        vm.notificationType = null;
        vm.eventTypeArray = [];
        vm.notificationTypeArray = [];
        vm.controllerForm;
        vm.selectedNotificationObjArray = [];

        vm.createArray = _createArray;
        vm.createNotificationTypeArray = _createNotificationTypeArray;
        vm.updateNotification = _updateNotification;
        vm.eventTypeClicked = _eventTypeClicked;
        vm.saved = _saved;
        vm.ajaxErr = _ajaxErr;
        vm.preferenceLoaded = _preferenceLoaded;
        vm.selectPreviousPreference = _selectPreviousPreference;

        render();

        function render() {
            vm.eventType = JSON.parse($("#eventType").html());
            vm.notificationType = JSON.parse($("#notficationType").html());
            //console.log(" event types are ", vm.eventType);
            //console.log(" noti types are ", vm.notificationType);
            vm.createArray(vm.eventType, vm.eventTypeArray);
            vm.createArray(vm.notificationType, vm.notificationTypeArray);

            vm.createNotificationTypeArray(vm.eventTypeArray, vm.notificationTypeArray);
            //$("[name='my-checkbox']").bootstrapSwitch();

            //load previous preference
            vm.$userPageService.getUserNotificationPreference(vm.preferenceLoaded, vm.ajaxErr)
        }

        function _preferenceLoaded(data) {
           
            vm.selectPreviousPreference(data.items);
        };

        function _selectPreviousPreference(PreviousPreference){
            //console.log("loaded preferences are ", PreviousPreference);

            for (var a = 0; a < PreviousPreference.length; a++) {

                for (var i = 0; i < vm.eventTypeArray.length; i++) {

                    for (var x = 0; x < vm.eventTypeArray[i].notifications.length; x++) {
                        var notification = vm.eventTypeArray[i].notifications[x];
                        if (notification.id == PreviousPreference[a].notificationTypeEnum) {
                            //console.log("match found");
                            vm.eventTypeArray[i].selected = true;
                            notification.selected = true;
                        }
                    }
                }
            }
        };

        function _createArray(item, targetArray) {
            var titleKey = 1;

            for (var key in item) {
                var obj = {};
                obj.id = key;
                obj.name = item[key];
                if (item == vm.eventType) {
                    obj.selected = false;
                    switch (titleKey) {
                        case 1:
                            obj.title = "New registration notification";
                            break;
                        case 2:
                            obj.title = "User upgraded to dealer notification";
                            break;
                        case 3:
                            obj.title = "New inventory added notification";
                            break;
                        case 4:
                            obj.title = "New blog added notification";
                            break;
                        case 5:
                            obj.title = "New comment added notification";
                            break;
                        case 6:
                            obj.title = "New follower notification";
                            break;
                    }
                }
                titleKey++;
                
                targetArray.push(obj);
            };
            
            //console.log("target array is ", targetArray);
        };

        function _createNotificationTypeArray(eventArray, notiArray) {

            var startP = 0;
            var endP = 2

            for (var i = 0; i < eventArray.length; i++) {
               
                var narray = [];
                var titleKey = 1
                for (var x = startP; x <= endP; x++) {
      
                    switch (titleKey) {
                        case 1:
                            notiArray[x].title = "Inbox";
                            break;
                        case 2:
                            notiArray[x].title = "Text Message";
                            break;
                        case 3:
                            notiArray[x].title = "Email";
                            break;
                    }
                    notiArray[x].selected = false;
                    titleKey++;

                    narray.push(notiArray[x]);
                }

                eventArray[i].notifications = narray;
                startP = startP + 3;
                endP = endP + 3;

                //console.log("vm eventArray data ", vm.eventTypeArray[i]);
            }
        };       

        function _eventTypeClicked(event) {
            console.log("event selected ", event);
            if(event.selected == false){
                // remove obj from final obj array
                for (var i = 0; i < event.notifications.length; i++) {

                    event.notifications[i].selected = false;

                }
            }
            console.log("notification type ids ", vm.selectedNotificationObjArray);
        };

        function _updateNotification() {
            vm.selectedNotificationObjArray = {};
            vm.selectedNotificationObjArray.notificationType = [];
            var event = vm.eventTypeArray;

            console.log("eventTypeArray is ", vm.eventTypeArray);

            for (var i = 0; i < event.length; i++) {

                for (var x = 0; x < event[i].notifications.length; x++) {
                    if (event[i].notifications[x].selected == true) {
                        vm.selectedNotificationObjArray.notificationType.push(event[i].notifications[x].id);
                    }
                }
            }

            if (vm.selectedNotificationObjArray.notificationType.length < 1) {
                vm.selectedNotificationObjArray.notificationType = [0];
            }

            vm.$userPageService.updateUserNotificationPreference(vm.selectedNotificationObjArray, vm.saved, vm.ajaxErr);

            console.log("notification type ids ", vm.selectedNotificationObjArray);
        };

        function _saved() {
            console.log("saved")
            vm.$alertService.success("Notification preference updated.");

        };

        function _ajaxErr() {
            vm.$alertService.error("Something went wrong, please contact admin.");
        };
  

       
    }

})();
