/**
@Author Thiago Gonçalves da Silva Goulart (SOLVES SOlUÇÕES EM SOFTWARE)
* 11/04/2019.)
**/
function SolvesAuth() {
  this.solvesPluginName = 'SolvesAuth';
  this.versionId = 1;
  this.version = '1.0';
  this.urlLogadoSucesso = null;
  this.urlTermosUso = null;
  this.urlTermosPrivacidade = null;

  this.authSuccessFunc;
  this.authErrorFunc;

  /**/
  this.fireBaseAuthTypes = ['all','google','facebook','twitter','email','github','phone','anonymous'];
  this.fireBaseAuthUsedTypes = [];
  this.fireBaseAuthDivId = null;
  this.fireBaseUiAuthObject = null;
  this.fireBaseSignInPopup = true;
  this.fireBaseSignInOptions = [];
  this.fireBaseAuthUser = null;
  this.fireBaseAuthUserAccessToken = null;
  this.firebaseGoogleAuthClientId = null;
  this.firebaseRedirectOnSuccess = true;


  this.init = function(){
    $.Solves.addSolvesPlugin(this.solvesPluginName, $.SolvesAuth);
  };
  this.destroy = function(){
    this.fireBaseAuthUsedTypes = [];
    this.fireBaseUiAuthObject = null;
    this.fireBaseAuthUser = null;
    this.fireBaseAuthUserAccessToken=null;
  };
  this.getCaptchaParams = function(){
    return {type: 'image',size: 'normal',badge: 'bottomleft'};
  };
  this.setAuthSuccessFunc = function(f){
    this.authSuccessFunc = f;
  };
  this.getAuthSuccessFunc = function(){
    return this.authSuccessFunc;
  };
  this.getAuthErrorFunc = function(){
    return this.authErrorFunc;
  };
  this.setAuthErrorFunc = function(f){
    this.authErrorFunc = f;
  };
  this.getCallbacks = function(authSuccessFunc, authErrorFunc){
    return {
        signInSuccessWithAuthResult: function(authResult, redirectUrl) {
          $.SolvesStorage.setStorageAuthUserData(authResult);
        if (authSuccessFunc && (typeof authSuccessFunc == "function")) {
          console.log('authSuccessFunc');
          console.log($.SolvesStorage.getStorageAuthUserData());
          authSuccessFunc(authResult);
        }
          return this.firebaseRedirectOnSuccess;
        },
        uiShown: function() {
          
        },
        signInFailure: function(error) {
          if (authErrorFunc && (typeof authErrorFunc == "function")) {authErrorFunc(error);}
          if (error.code != 'firebaseui/anonymous-upgrade-merge-conflict') {
            return Promise.resolve();
          }
          var cred = error.credential;
          return firebase.auth().signInWithCredential(cred);
        }
      };
  };
  this.getFireBaseUiConfig = function(){
    // FirebaseUI config.
    var config = {
      signInSuccessUrl: this.urlLogadoSucesso,
      signInOptions: this.fireBaseSignInOptions,
      callbacks: this.getCallbacks(this.getAuthSuccessFunc(), this.getAuthErrorFunc())
    };
    if(this.fireBaseSignInPopup){
      config.signInFlow = 'popup';
    }
    if(this.urlTermosUso!==undefined && this.urlTermosUso!=null){
      config.tosUrl = this.urlTermosUso;
    }
    if(this.urlTermosPrivacidade!==undefined && this.urlTermosPrivacidade!=null){
      config.privacyPolicyUrl = this.urlTermosPrivacidade;
    }
    return config;
  }
  this.addFireBaseAuthusedTypes = function(type){
    if(this.fireBaseAuthTypes.indexOf(type)){
      this.fireBaseAuthUsedTypes.push(type);
    }
  }
  this.isFireBaseAuthType = function(type){
    return (this.fireBaseAuthUsedTypes.indexOf(this.fireBaseAuthTypes[this.fireBaseAuthTypes.indexOf(type)])>=0);
  }
  this.initFireBaseConfig = function(){    
    if(firebase.auth!==undefined){
      var all = this.isFireBaseAuthType('all');
      if(all || this.isFireBaseAuthType('google')){
        this.fireBaseSignInOptions.push({provider: firebase.auth.GoogleAuthProvider.PROVIDER_ID, scopes: [],clientId: this.firebaseGoogleAuthClientId, authMethod: 'https://accounts.google.com',customParameters: {prompt: 'select_account'}}); 
      }
      if(all || this.isFireBaseAuthType('facebook')){
        this.fireBaseSignInOptions.push({provider: firebase.auth.FacebookAuthProvider.PROVIDER_ID, scopes: ['public_profile','email'],customParameters: {auth_type: 'reauthenticate'} });
      }
      if(all || this.isFireBaseAuthType('twitter')){
        this.fireBaseSignInOptions.push(firebase.auth.TwitterAuthProvider.PROVIDER_ID);
      }
      if(all || this.isFireBaseAuthType('email')){
        this.fireBaseSignInOptions.push(firebase.auth.EmailAuthProvider.PROVIDER_ID);
      }
      if(all || this.isFireBaseAuthType('github')){
        this.fireBaseSignInOptions.push(firebase.auth.GithubAuthProvider.PROVIDER_ID);
      }
      if(all || this.isFireBaseAuthType('phone')){
        this.fireBaseSignInOptions.push({provider: firebase.auth.PhoneAuthProvider.PROVIDER_ID,recaptchaParameters: this.getCaptchaParams(),defaultCountry: 'BR', defaultNationalNumber: '55',loginHint: '+55 (99) 99999-9999'});
      }
    }
    if(firebase.auth!==undefined){
      if(this.isFireBaseAuthType('anonymous')){
        this.fireBaseSignInOptions.push(firebaseui.auth.AnonymousAuthProvider.PROVIDER_ID);
      }
    }
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
          this.fireBaseAuthUser = user;
          this.fireBaseAuthUser.getIdToken().then(function(accessToken) {
            this.fireBaseAuthUserAccessToken = accessToken;
          });
        } else {
          this.fireBaseAuthUser=null;
          this.fireBaseAuthUserAccessToken=null;
        }
        $.SolvesStorage.setStorageAuthUsuario(this.fireBaseAuthUser);
        $.SolvesStorage.setStorageAuthToken(this.fireBaseAuthUserAccessToken);
        var perfil = {};
        if($.Solves.isNotEmpty($.SolvesStorage.getStorageAuthUserData())){ 
          if($.SolvesStorage.getStorageAuthUserData().credential.providerId==firebase.auth.FacebookAuthProvider.PROVIDER_ID){
            perfil.data_nascimento = null;
            perfil.email_confirmado = true;
            perfil.email = $.SolvesStorage.getStorageAuthUserData().additionalUserInfo.profile.email;
            perfil.nome = $.SolvesStorage.getStorageAuthUserData().additionalUserInfo.profile.name;
            perfil.avatar = $.SolvesStorage.getStorageAuthUserData().additionalUserInfo.profile.picture;
          }
        }
        $.Solves.atualizaPerfilLogado(perfil);

      }, function(error) {
        console.log(error);
      });
    firebase.auth().languageCode =  'pt';
  }
  this.showAuthScreen = function(){
    // Initialize the FirebaseUI Widget using Firebase.
    this.fireBaseUiAuthObject = firebaseui.auth.AuthUI.getInstance() || new firebaseui.auth.AuthUI(firebase.auth());
    if($.Solves.isNotEmpty(this.fireBaseAuthDivId)){
      if($('#'+this.fireBaseAuthDivId).length>0){
        this.fireBaseUiAuthObject.start('#'+this.fireBaseAuthDivId, this.getFireBaseUiConfig());
      }else{
        console.log('Não foi encontrado um elemento com o ID:'+this.fireBaseAuthDivId);
      }
    }
  };
  this.logoff = function(){
    firebase.auth().signOut().then(function() {
        $.Solves.logoff();
        $.Solves.atualizaPerfilLogado(null);
    }).catch(function(error) {
      console.log(error);
    });
    return true;
  };
  this.openUrlTermosPrivacidade = function(){
    if($.Solves.isNotEmpty(this.urlTermosPrivacidade)){
      window.location.assign(this.urlTermosPrivacidade);
    }
  }
  this.openUrlTermosUso = function(){
    if($.Solves.isNotEmpty(this.urlTermosUso)){
      window.location.assign(this.urlTermosUso);
    }
  }
}
$.SolvesAuth = new SolvesAuth();
$.SolvesAuth.init();