/**
* Authentication
* @namespace thinkster.authentication.services
*/
(function () {
  'use strict';

  angular
    .module('thinkster.authentication.services')
    .factory('Authentication', Authentication);

  Authentication.$inject = ['$cookies', '$http', '$q'];

  /**
  * @namespace Authentication
  * @returns {Factory}
  */
  function Authentication($cookies, $http, $q) {
    /**
    * @name Authentication
    * @desc The Factory to be returned
    */
    var Authentication = {
      deleteToken: deleteToken,
      deleteUsername: deleteUsername,
      getAuthenticatedAccount: getAuthenticatedAccount,
      getToken: getToken,
      getUsername:getUsername,
      isAuthenticated: isAuthenticated,
      login: login,
      logout: logout,  
      register: register,
      setAuthenticatedAccount: setAuthenticatedAccount,
      setToken: setToken,
      setUsername: setUsername,
      unauthenticate: unauthenticate
    };

    return Authentication;

    ////////////////////
    
    //JSONWebToken
    function getToken() {
      return window.localStorage.getItem('token');
    }

    function setToken(token) {
      window.localStorage.setItem('token', token);
    }

    function deleteToken() {
      window.localStorage.removeItem('token');
    }

    function getUsername(){
      return window.localStorage.getItem('username');
    }

    function setUsername(username) {
      window.localStorage.setItem('username', username);
    }

    function deleteUsername() {
      window.localStorage.removeItem('username');
    }

    /**
    * @name register
    * @desc Try to register a new user
    * @param {string} username The username entered by the user
    * @param {string} password The password entered by the user
    * @param {string} email The email entered by the user
    * @returns {Promise}
    * @memberOf thinkster.authentication.services.Authentication
    */
    function register(email, password, username) {
      return $http.post('/api/v1/accounts/', {
        username: username,
        password: password,
        email: email
      }).then(registerSuccessFn, registerErrorFn);

      /**
       * @name registerSuccessFn
       * @desc Log the new user in.
       */
      function registerSuccessFn() {
        Authentication.login(email, password);
      }

      /**
       * @name registerErrorFn
       * @desc Log 'Error en el registro!' to the console.
       */
      function registerErrorFn() {
        console.error('Error en el registro!');
      }
    }

    /**
     * @name login
     * @desc Try to log in with email `email` and password `password`
     * @param {string} email The email entered by the user
     * @param {string} password The password entered by the user
     * @returns {Promise}
     * @memberOf thinkster.authentication.services.Authentication
    **/
    function login(email, password) {
      return $http.post('/api/v1/auth/login/', {
        email: email, 
        password: password
      }).then(loginSuccessFn, loginErrorFn);

      /**
       * @name loginSuccessFn
       * @desc Set the authentiucated acvount and redirec to index
       */
      function loginSuccessFn(data, status, headers, config) {
        //Authentication.setAuthenticatedAccount(data.data);
        console.log('desde el callback de exito: ');
        console.log(data);
        if (data.data.token) {
          console.log(data);          
          Authentication.setUsername(data.data.username);
          Authentication.setToken(data.data.token);
          window.location='/';
        } else {
          console.log('en el reject')
          return $q.reject(loginErrorFn(data));
        }

        //window.location= '/';
      }

      /**
       * @name loginErrorFn
       * @desc Log 'La estas cagando!' to the console
       */
      function loginErrorFn(data, status, headers, config) {
        console.log('desde el callback de error: '); 
        console.log( data);
        //console.error('No fue posible  iniciar sesion.');
      }  
    }

    /**
     * @name logout
     * @desc Try to log the user out.
     * @returns {promise}
     * @memberOf thnkster.authentication.services.Authentication
     */
   function logout() {
     return $http.post('/api/v1/auth/logout/')
       .then(logoutSuccessFn, logoutErrorFn);

     /**
      * @name logoutSuccessFn
      * @desc Unauthenticate and redirect to indexwithpage reload
      */
     function logoutSuccessFn(data, status, headers, config) {
       Authentication.deleteToken();
       Authentication.deleteUsername();

       window.location = '/';
     }

     /**
      * @name logoutErrorFn
      * @desc Log 'Error al cerrar sesion!' to console
      */
     function logoutErrorFn(data, status, headers, config) {
       console.error('Error al cerrar sesion!');
     } 
   }
    
    /**
     * @name getAuthenticatedAccount
     * @desc Return the currently authenticated account
     * @returns {object|undefined} Account if authenticated, else `undefined`
     * @memberOf thinkster.authentication.services.Authentication
     **/
    function getAuthenticatedAccount() {
      if (!$cookies.authenticatedAccount) {
           return;
      }

      return JSON.parse($cookies.authenticatedAccount);
    }

    /**
     * @name isAuthenticated
     * @desc Check if the current user is authenticated
     * @returns {boolean} True is user is authenticated, else false.
     * @memberOf thinkster.authentication.services.Authentication
     */
    function isAuthenticated() {
      return !(window.localStorage.getItem('token')===null);
    }

    /**
     * @name setAuthenticatedAccount
     * @desc Stringify the account object and store it in a cookie
     * @param {Object} user The account object to be stored
     * @returns {undefined}
     * @memberOf thinkster.authentication.services.Authentication
     */
    function setAuthenticatedAccount(account) {
          $cookies.authenticatedAccount = JSON.stringify(account);
    }

    /**
     * @name unauthenticate
     * @desc Delete the cookie where the user object is stored
     * @returns {undefined}
     * @memberOf thinkster.authentication.services.Authentication
     */
    function unauthenticate() {
      delete $cookies.authenticatedAccount;
    }
  
  }




})();
