/**
@Author Thiago Gonçalves da Silva Goulart (SOLVES SOlUÇÕES EM SOFTWARE)
* 11/04/2019.)
**/
function SolvesNotifications() {
  this.solvesPluginName = 'SolvesNotifications';
  this.versionId = 1;
  this.version = '1.0';
  this.icon = null;
  this.permission = Notification.permission;
  this.actions = [];
  this.fireBaseConfig =null; 
  this.fireBaseMessaging=null;
  this.fireBasePublicVapidKey=null;
  this.fireBaseTokenDivId = null;
  this.fireBasePermissionDivId = null;
  this.fireBaseMessagesDivId = null;

  this.init = function(){
    $.Solves.addSolvesPlugin(this.solvesPluginName, $.SolvesNotifications);
  };
  this.destroy = function(){
    this.clearData();
  };
  this.clearData = function(){
    this.actions = [];
  }
  this.initFireBaseConfig = function(){
    if($.Solves.fireBaseInitialized){
      // Retrieve Firebase Messaging object.
      this.fireBaseMessaging = firebase.messaging();
      if($.Solves.isNotEmpty(this.fireBasePublicVapidKey)){
        this.fireBaseMessaging.usePublicVapidKey(this.fireBasePublicVapidKey);
        this.fireBaseMonitoreTokenAtual();
        this.fireBaseOnMessage();
      }
    }else{
      console.log(this.solvesPluginName+' não encontrou firebaseConfig válida.');
    }
  }
  this.setPublicVapidKey = function(key){
    this.fireBasePublicVapidKey = key;
  }
  this.setFireBaseTokenDivId = function(elmId){
    this.fireBaseTokenDivId = elmId;
  }
  this.setFireBasePermissionDivId = function(elmId){
    this.fireBasePermissionDivId = elmId;
  }
  this.setFireBaseMessagesDivId = function(elmId){
    this.fireBaseMessagesDivId = elmId;
  }
  this.setIcon = function(p){
    this.icon = p;
  }
  this.getIcon = function(){
    if($.Solves.isNotEmpty(this.icon)){ 
      return this.icon;
    }
    return $.Solves.icon;
  }
  this.addAction = function(actionType, title, icon){
    var act = {action: actionType, title: title};
    if($.Solves.isNotEmpty(icon)){
      act['icon'] = icon;
    }
    this.actions.push(act);
  }
  this.notificar = function(idNotification, title, body, image){    
    var json = this.mountJsonMessaging(idNotification, title, body, image);
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
    console.log("mostraPwaNotification = function("+title+", json){"); console.log(json);
    navigator.serviceWorker.getRegistration().then(function(reg) {
        console.log(reg);
        console.log("r3mostraPwaNotification = function("+title+", json){"); console.log(json);
        reg.showNotification(title, json);
    });
  }
  this.mountJsonMessaging = function(idNotification, title, body, image){
    if(!$.Solves.isNotEmpty(idNotification)){
        idNotification = $.Solves.siteShortName+'_'+$.Solves.getDataAtualFormatada()+'_'+Math.random();
    }
    var json = {title:title, body:body, tag:idNotification, icon: this.getIcon()}
    if($.Solves.isNotEmpty(image)){
      json["image"] = image;
    }
    if(this.actions && this.actions.length>0){
      json["actions"] = this.actions;
    }
    return json;
  }
  this.fireBaseNotificar = function(idNotification, title, body, image){
    var json = this.mountJsonMessaging(idNotification, title, body, image);
    console.log(this.fireBaseMessaging);
    console.log(this.fireBaseMessaging.permission);
    if (!("Notification" in window)) {
        console.log("This browser does not support desktop notification");
        return;
    }else if (this.fireBaseMessaging.permission === "granted"){
        console.log("Notification permission granted");
        this.mostraPwaNotification(title, json);
    }else if (this.fireBaseMessaging.permission !== "denied") {
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
  this.fireBaseRequestPermission = function() {
    console.log('Requesting permission...');
    // [START request_permission]
    this.fireBaseMessaging.requestPermission().then(function() {
      console.log('Notification permission granted.');
      console.log(this.fireBaseMessaging);
      console.log(this.fireBaseMessaging.permission);
      // TODO(developer): Retrieve an Instance ID token for use with FCM.
      // [START_EXCLUDE]
      // In many cases once an app has been granted notification permission, it
      // should update its UI reflecting this.
      resetUI();
      // [END_EXCLUDE]
    }).catch(function(err) {
      console.log('Unable to get permission to notify.', err);
    });
    // [END request_permission]
  }
  this.fireBaseGetTokenAtual = function(){
    // Get Instance ID token. Initially this makes a network call, once retrieved
    // subsequent calls to getToken will return from cache.
    this.fireBaseMessaging.getToken().then(function(currentToken) {
      if (currentToken) {
        this.fireBaseSendTokenToServer(currentToken);
        this.fireBaseUpdateUIForPushEnabled(currentToken);
      } else {
        // Show permission request.
        console.log('No Instance ID token available. Request permission to generate one.');
        // Show permission UI.
        this.fireBaseUpdateUIForPushPermissionRequired();
        this.fireBaseSetTokenSentToServer(false);
      }
    }).catch(function(err) {
      console.log('An error occurred while retrieving token. ', err);
      this.fireBaseShowToken('Error retrieving Instance ID token. ', err);
      this.fireBaseSetTokenSentToServer(false);
    });
  }
  this.fireBaseMonitoreTokenAtual = function(){
    // Callback fired if Instance ID token is updated.
    this.fireBaseMessaging.onTokenRefresh(function() {
      this.fireBaseMessaging.getToken().then(function(refreshedToken) {
        console.log('Token refreshed.');
        // Indicate that the new Instance ID token has not yet been sent to the
        // app server.
        this.fireBaseSetTokenSentToServer(false);
        // Send Instance ID token to app server.
        this.fireBaseSendTokenToServer(refreshedToken);
        // ...
      }).catch(function(err) {
        console.log('Unable to retrieve refreshed token ', err);
        this.fireBaseShowToken('Unable to retrieve refreshed token ', err);
      });
    });
  }
  this.fireBaseSendTokenToServer = function(currentToken) {
    if (!this.fireBaseIsTokenSentToServer()) {
      console.log('Sending token to server...');
      // TODO(developer): Send the current token to your server.
      this.fireBaseSetTokenSentToServer(true);
    } else {
      console.log('Token already sent to server so won\'t send it again ' +
          'unless it changes');
    }
  }
  this.fireBaseIsTokenSentToServer = function() {
    return window.localStorage.getItem('sentToServer') === '1';
  }
  this.fireBaseSetTokenSentToServer = function(sent) {
    window.localStorage.setItem('sentToServer', sent ? '1' : '0');
  }
  this.fireBaseDeleteToken = function() {
    // Delete Instance ID token.
    // [START delete_token]
    this.fireBaseMessaging.getToken().then(function(currentToken) {
      this.fireBaseMessaging.deleteToken(currentToken).then(function() {
        console.log('Token deleted.');
        this.fireBaseSetTokenSentToServer(false);
        // [START_EXCLUDE]
        // Once token is deleted update UI.
        this.fireBaseResetUI();
        // [END_EXCLUDE]
      }).catch(function(err) {
        console.log('Unable to delete token. ', err);
      });
      // [END delete_token]
    }).catch(function(err) {
      console.log('Error retrieving Instance ID token. ', err);
      this.fireBaseShowToken('Error retrieving Instance ID token. ', err);
    });
  }
  this.fireBaseOnMessage = function(){
    this.fireBaseMessaging.onMessage(function(payload) {
      console.log('Message received. ', payload);
      // [START_EXCLUDE]
      // Update the UI to include the received message.
      this.fireBaseAppendMessage(payload);
      // [END_EXCLUDE]
    });
  }
  this.fireBaseAppendMessage = function(payload) {
   // Add a message to the messages element.
    if($.Solves.isNotEmpty(this.fireBaseMessagesDivId)){
      const messagesElement = document.querySelector('#'+this.fireBaseMessagesDivId);
      const dataHeaderELement = document.createElement('h5');
      const dataElement = document.createElement('pre');
      dataElement.style = 'overflow-x:hidden;';
      dataHeaderELement.textContent = 'Received message:';
      dataElement.textContent = JSON.stringify(payload, null, 2);
      messagesElement.appendChild(dataHeaderELement);
      messagesElement.appendChild(dataElement);
    }
  }
  this.fireBaseClearMessages = function() {
  // Clear the messages element of all children.
    if($.Solves.isNotEmpty(this.fireBaseMessagesDivId)){
      const messagesElement = document.querySelector('#'+this.fireBaseMessagesDivId);
      while (messagesElement.hasChildNodes()) {
        messagesElement.removeChild(messagesElement.lastChild);
      }
    }
  }
  function updateUIForPushEnabled(currentToken) {
    if($.Solves.isNotEmpty(this.fireBaseTokenDivId)){
      this.showHideDiv(this.fireBaseTokenDivId, true);
    }    
    if($.Solves.isNotEmpty(this.fireBasePermissionDivId)){
      this.showHideDiv(this.fireBasePermissionDivId, false);
    }    
    this.fireBaseShowToken(currentToken);
  }
  function updateUIForPushPermissionRequired() {
    if($.Solves.isNotEmpty(this.fireBaseTokenDivId)){
      this.showHideDiv(this.fireBaseTokenDivId, false);
    }    
    if($.Solves.isNotEmpty(this.fireBasePermissionDivId)){
      this.showHideDiv(this.fireBasePermissionDivId, true);
    } 
  };
  function resetUI() {
    this.fireBaseClearMessages();
    this.fireBaseShowToken('loading...');
    // [START get_token]
    // Get Instance ID token. Initially this makes a network call, once retrieved
    // subsequent calls to getToken will return from cache.
    this.fireBaseMessaging.getToken().then(function(currentToken) {
      if (currentToken) {
        this.fireBaseSendTokenToServer(currentToken);
        this.fireBaseUpdateUIForPushEnabled(currentToken);
      } else {
        // Show permission request.
        console.log('No Instance ID token available. Request permission to generate one.');
        // Show permission UI.
        this.fireBaseUpdateUIForPushPermissionRequired();
        this.fireBaseSetTokenSentToServer(false);
      }
    }).catch(function(err) {
      console.log('An error occurred while retrieving token. ', err);
      this.fireBaseShowToken('Error retrieving Instance ID token. ', err);
      this.fireBaseSetTokenSentToServer(false);
    });
    // [END get_token]
  };
  this.fireBaseShowToken = function(currentToken) {
    // Show token in console and UI.
    if($.Solves.isNotEmpty(this.fireBaseTokenDivId)){
      var tokenElement = document.querySelector('#'+this.fireBaseTokenDivId);
      tokenElement.textContent = currentToken;
    }
  }
  this.showHideDiv = function(divId, show){
    var pluginUi = $.Solves.getSolvesPlugin('SolvesUi');
    if(pluginUi!=null){
      pluginUi.showHideDiv(divId, show);
    }else{
      console.log(this.solvesPluginName+' não encontrou SolvesUi');
    }    
  }
}
$.SolvesNotifications = new SolvesNotifications();
$.SolvesNotifications.init();