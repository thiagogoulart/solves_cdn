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

  /**/
  this.fireBaseAuthTypes = ['all','google','facebook','twitter','email','github','phone','anonymous'];
  this.fireBaseAuthUsedTypes = [];
  this.fireBaseAuthDivId = null;
  this.fireBaseUiAuthObject = null;
  this.fireBaseSignInOptions = [];
  this.fireBaseAuthUser = null;
  this.fireBaseAuthUserAccessToken = null;


  this.init = function(){
    $.Solves.addSolvesPlugin(this.solvesPluginName, $.SolvesAuth);
  };
  this.destroy = function(){
    this.fireBaseAuthUsedTypes = [];
    this.fireBaseUiAuthObject = null;
    this.fireBaseAuthUser = null;
    this.fireBaseAuthUserAccessToken=null;
  };
  this.getFireBaseUiConfig = function(){
    // FirebaseUI config.
    return {
      signInSuccessUrl: this.urlLogadoSucesso,
      signInOptions: this.fireBaseSignInOptions
    };
  }
  this.addFireBaseAuthusedTypes = function(type){
    if(fireBaseAuthTypes.indexOf(type)){
      this.fireBaseAuthUsedTypes.push(type);
    }
  }
  this.isFireBaseAuthType = function(type){
    return (this.fireBaseAuthUsedTypes.indexOf[this.fireBaseAuthTypes[this.fireBaseAuthTypes.indexOf(type)]]>=0);
  }
  this.initFireBaseConfig = function(){    
    if(firebase.auth){
      var all = this.isFireBaseAuthType('all');
      if(all || this.isFireBaseAuthType('google')){
        this.fireBaseSignInOptions.push(firebase.auth.GoogleAuthProvider.PROVIDER_ID); 
      }
      if(all || this.isFireBaseAuthType('facebook')){
        this.fireBaseSignInOptions.push(firebase.auth.FacebookAuthProvider.PROVIDER_ID);
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
        this.fireBaseSignInOptions.push(firebase.auth.PhoneAuthProvider.PROVIDER_ID);
      }
    }
    if(firebaseui.auth){
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
        }, function(error) {
          console.log(error);
        });
  }
  this.showAuthScreen = function(){
    // Initialize the FirebaseUI Widget using Firebase.
    this.fireBaseUiAuthObject = new firebaseui.auth.AuthUI(firebase.auth());
    if($.Solves.isNotEmpty(this.fireBaseAuthDivId)){
      // The start method will wait until the DOM is loaded.
      this.fireBaseUiAuthObject.start('#'+this.fireBaseAuthDivId, this.getFireBaseUiConfig());
    }
  }
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