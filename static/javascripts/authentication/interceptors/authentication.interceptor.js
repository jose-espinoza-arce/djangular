(function () {
  'use strict';

  angular
    .module('thinkster.authentication.interceptors')
    .factory('AuthInterceptor', AuthInterceptor);

  AuthInterceptor.$inject = ['$injector', '$location'];

  /**
   * @namespace AuthInterceptor
   * @returns {Factory}
   */
  function AuthInterceptor($injector, $location) {
    /**
     * @name AuthInterceptor
     * @desc The Factory to be returned
    */
    var AuthInterceptor = {
      request: request,
      responseError: responseError
    };

    return AuthInterceptor;

    
    function request(config) {
      var Auth = $injector.get('Authentication');
      var token = Auth.getToken();

      if (token) {
        config.headers['Authorization'] = 'JWT ' + token;
      }

      return config;
    }


    function responseError(response) {
      if (response.status == 403) {
        $location.path('/login');
      }

      return response;
    }
  }
})();
