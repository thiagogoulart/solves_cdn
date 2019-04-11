/**
@Author Thiago Gonçalves da Silva Goulart (SOLVES SOlUÇÕES EM SOFTWARE)
* 11/04/2019.)
**/
function SolvesNotifications() {
  this.solvesPluginName = 'SolvesNotifications';
  this.versionId = 1;
  this.version = '1.0';
  this.icon = $.Solves.icon;
  this.permission = Notification.permission;
  this.actions = [];
  this.fireBaseConfig =null; 

  this.init = function(){
    $.Solves.addSolvesPlugin(this.solvesPluginName, $.SolvesNotifications);
  };
  this.destroy = function(){
    this.clearData();
  };
  this.clearData = function(){
    this.actions = [];
  }
  this.setFireBaseConfig = function(config){
    if(config!==undefined && $.Solves.isNotEmpty(config.apiKey) && $.Solves.isNotEmpty(config.authDomain) && $.Solves.isNotEmpty(config.projectId) 
      && $.Solves.isNotEmpty(config.messagingSenderId) && $.Solves.isNotEmpty(config.databaseURL) && $.Solves.isNotEmpty(config.storageBucket)){
      this.fireBaseConfig = config;
      this.initFirebase();
    }else{
      console.log(this.solvesPluginName+' não encontrou firebaseConfig válida.');
    }
  }
  this.setIcon = function(p){
    this.icon = p;
  }
  this.addAction = function(actionType, title, icon){
    this.actions[this.actions.length] = {type: actionType, title: title, icon: icon};
  }
  this.initFirebase = function(){
    console.log('initFirebase');
    if (!firebase.apps.length) {
      // Initialize Firebase      
      firebase.initializeApp(this.fireBaseConfig);
    }
  };
  this.notificar = function(title, body, image){
    var json = {title:title, body:body, tag:null, icon: this.icon, image:image};
    if (!("Notification" in window)) {
        console.log("This browser does not support desktop notification");
        return;
    }else if (Notification.permission === "granted"){
        console.log("Notification permission granted");
        this.mostraPwaNotification(title, json);
    }else if (Notification.permission !== "denied") {
        console.log("Notification permission IS NOT denied");
        Notification.requestPermission().then(function (permission) {
          $.SolvesNotifications.permission = permission;
        console.log("Notification permission request: "+permission);
          if (permission === "granted") {
            this.mostraPwaNotification(title, json);
          }
        });
    }
    this.clearData();
  };
  this.mostraPwaNotification = function(title, json){
    //console.log("mostraPwaNotification = function("+title+", json){"); console.log(json);
    navigator.serviceWorker.getRegistration().then(function(reg) {
    //console.log("r3mostraPwaNotification = function("+title+", json){"); console.log(json);
        reg.showNotification(title, json);
    });
  }
}
$.SolvesNotifications = new SolvesNotifications();
$.SolvesNotifications.init();