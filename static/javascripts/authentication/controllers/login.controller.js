/**
 * LoginController
 * @namespace thinkster.authentication.controllers
 */
(function () {
  'use strict';

  angular
    .module('thinkster.authentication.controllers')
    .controller('LoginController', LoginController);

  LoginController.$inject = ['$location', '$scope', 'Authentication'];

  /**
   * @namespace LoginController
   */
  function LoginController($location, $scope, Authentication) {
    var vm = this;

    vm.login = login;

    activate();

    /**
     * @name activate
     * @desc Actions to be performed when this controller is instantiated
     * @memberof thinkster. authentication.contrololers.LoginController
     */
    function activate() {
      //if the user is authenticated thy should not be here, fuera, fuera!  
      if (Authentication.isAuthenticated()) {
        $location.url('/');
      }
    }

    /**
     * @name login
     * @desc Log the user in
     * @memberof thinkster.auntehntication.controllers.LoginController
     */
    function login() {
      Authentication.login(vm.email, vm.password);
    }
  }
})();
