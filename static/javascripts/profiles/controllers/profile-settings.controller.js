/**
 * ProfileS3ettingsController
 * @namespace thinkster.profiles.controllers
 */
(function () {
  'use strict';

  angular
    .module('thinkster.profiles.controllers')
    .controller('ProfileSettingsController', ProfileSettingsController);

  ProfileSettingsController.$inject= [
    '$location', '$routeParams', 'Authentication', 'Profile', 'Snackbar'  
  ];

  /**
   * @namesapce ProfileSettingsController
   */
  function ProfileSettingsController($location, $routeParams, Authentication, Profile, Snackbar) {
    var vm = this;

    vm.destroy = destroy;
    vm.update = update;
   
    activate();

    function activate() {
      var token = Authentication.getToken();
      var username_url = $routeParams.username.substr(1);
      var username = Authentication.getUsername();

      //redirect if not logged in
      if (!token) {
        $location.url('/');
        Snackbar.error('Pelas! no estas autorizado para ver esta pagina.');
      } else {
        //reditect if looged in, but not the ownerof this profile.
        if (username !== username_url) {
          $location.url('/');
          Snackbar.error('Pelas! no eres el propietario de este perfil.');
        }
      }

      Profile.get(username).then(profileSuccessFn, profileErrorFn);

      /**
       * @name profileSuccessFn
       * @desc Update 'profile' for view
       */
      function profileSuccessFn(data, status, headers, config) {
        vm.profile = data.data
      }

      /**
       * @name profileErrorFn
       * @desc redirct to index
       */
      function profileErrorFn(data, status, heasers,  config) {
        $location.url('/');
        Snackbar.error('Ese usuario to existe!');
      }
    }


    /**
     * @name destroy
     * @desc desctro this user's profile
     * @memberOf thinkster.profiles.controllers.ProfileSettingsController
     */
    function destroy() {
      Profile.destroy(vm.profile.username).then(profiloeSuccessFn, profileErrorFn);

      /**
       * qname profileSuccessFn
       * @desc redirectto indexand display succes snackbar
       */
      function profileSuccessFn(data, status, headers, config) {
        Authentication.deleteToken();
	Authentication.deleteUsername();
        $location.url('/');

        Snackbar.show('Tu cuenta ha sido eliminada.')
      }


      /**
       * @name profileErrorFn
       * qdesc dispĺay error snackbar
       */
      function profileErrorFn(data, status, headers, config) {
        Snackbar.error(data.error);
      }      
    }


    /**
     * @name update
     * @desc update this user's profile
     * @memberOf thinkster.profiles.controllers.ProfileSettins Controller
     */
    function update() {
      Profile.update(vm.profile).then(profileSuccessFn, profileErrorFn);

      /*
       * @name profileSuccessFn
       * @desc Show success snackbar
       */
      function profileSuccessFn(data, status, headers, config) {
        Snackbar.show('Su perfil se ha actualizado correctamente.');
      }

      /**
       * @nameprofileErrorFn
       * @desc Show error snackbar
       */
      function profileErrorFn(data, status, headers, config) {
        Snackbar.error(data.error);
      }
    }    
  }  
})();
