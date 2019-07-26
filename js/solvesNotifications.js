/**
@Author Thiago Gonçalves da Silva Goulart (SOLVES SOlUÇÕES EM SOFTWARE)
* 11/04/2019.)
**/
function SolvesNotifications() {
  this.solvesPluginName = 'SolvesNotifications';
  this.versionId = 2;
  this.version = '1.1';
  this.debug = false;
  this.icon = null;
  this.permission = null;
  this.actions = [];
  this.fireBaseConfig =null; 
  this.fireBaseMessaging=null;
  this.fireBasePublicVapidKey=null;
  this.fireBaseTokenDivId = null;
  this.fireBasePermissionDivId = null;
  this.fireBaseMessagesDivId = null;

  this.serverUrlNotifications =null; 
  this.applicationServerKey = null;

  this.init = function(){
    $.Solves.addSolvesPlugin(this.solvesPluginName, $.SolvesNotifications);
  };
  this.afterSolvesInit = function(){
    this.debug = $.Solves.debug;
    this.push_subscribe();
  }
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
  this.getServerUrlNotifications = function(){
    return this.serverUrlNotifications;
  };
  this.getApplicationServerKey = function(){
    return this.applicationServerKey;
  };
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
    }else{
      this.permission = Notification.permission;
      if (Notification.permission === "granted"){
          console.log("Notification permission granted");
          this.mostraPwaNotification(title, json);
      }else if (Notification.permission !== "denied") {
          console.log("Notification permission IS NOT denied");
          var _self = this;
          Notification.requestPermission().then(function (permission) {
            $.SolvesNotifications.permission = permission;
          console.log("Notification permission request: "+permission);
            if (permission === "granted") {
              _self.mostraPwaNotification(title, json);
            }
          });
      }
    }
    this.clearData();
  };
  this.mostraPwaNotification = function(title, json){
    console.log("mostraPwaNotification = function("+title+", json){"); console.log(json);
    navigator.serviceWorker.getRegistration().then(function(reg) {
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
    }else{
      this.permission = Notification.permission;
      if (this.fireBaseMessaging.permission === "granted"){
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
      fireBaseResetUI();
      // [END_EXCLUDE]
    }).catch(function(err) {
      console.log('Unable to get permission to notify.', err);
    });
    // [END request_permission]
  }
  this.fireBaseGetTokenAtual = function(){
    // Get Instance ID token. Initially this makes a network call, once retrieved
    // subsequent calls to getToken will return from cache.
    var self = this;
    this.fireBaseMessaging.getToken().then(function(currentToken) {
      if (currentToken) {
        self.fireBaseSendTokenToServer(currentToken);
        self.fireBaseUpdateUIForPushEnabled(currentToken);
      } else {
        // Show permission request.
        console.log('No Instance ID token available. Request permission to generate one.');
        // Show permission UI.
        self.fireBaseUpdateUIForPushPermissionRequired();
        self.fireBaseSetTokenSentToServer(false);
      }
    }).catch(function(err) {
      console.log('An error occurred while retrieving token. ', err);
      self.fireBaseShowToken('Error retrieving Instance ID token. ', err);
      self.fireBaseSetTokenSentToServer(false);
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
      var messagesElement = document.querySelector('#'+this.fireBaseMessagesDivId);
      var dataHeaderELement = document.createElement('h5');
      var dataElement = document.createElement('pre');
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
      var messagesElement = document.querySelector('#'+this.fireBaseMessagesDivId);
      while (messagesElement.hasChildNodes()) {
        messagesElement.removeChild(messagesElement.lastChild);
      }
    }
  }
  this.fireBaseUpdateUIForPushEnabled = function(currentToken) {
    if($.Solves.isNotEmpty(this.fireBaseTokenDivId)){
      this.showHideDiv(this.fireBaseTokenDivId, true);
    }    
    if($.Solves.isNotEmpty(this.fireBasePermissionDivId)){
      this.showHideDiv(this.fireBasePermissionDivId, false);
    }    
    this.fireBaseShowToken(currentToken);
  }
  this.fireBaseUpdateUIForPushPermissionRequired = function() {
    if($.Solves.isNotEmpty(this.fireBaseTokenDivId)){
      this.showHideDiv(this.fireBaseTokenDivId, false);
    }    
    if($.Solves.isNotEmpty(this.fireBasePermissionDivId)){
      this.showHideDiv(this.fireBasePermissionDivId, true);
    } 
  };
  this.fireBaseResetUI = function() {
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
  this.fireBaseShowToken = function(currentToken, error) {
    // Show token in console and UI.
    if($.Solves.isNotEmpty(this.fireBaseTokenDivId) && $('#'+this.fireBaseTokenDivId).length>0){
      var tokenElement = document.querySelector('#'+this.fireBaseTokenDivId);
      tokenElement.textContent = currentToken;
    }else{
      console.log(currentToken);
    }
  }
  this.showHideDiv = function(divId, show){
    var pluginUi = $.Solves.getSolvesPlugin('SolvesUi');
    if(pluginUi!=null){
      pluginUi.showHideDiv(divId, show);
    }else{
      console.log(this.solvesPluginName+' não encontrou SolvesUi');
    }    
  };
  this.push_sendSubscriptionToServer = function(subscription, p_method) {
    const key = subscription.getKey('p256dh');
    const token = subscription.getKey('auth');
    const contentEncoding = (PushManager.supportedContentEncodings || ['aesgcm'])[0];

    return fetch(this.getServerUrlNotifications(), {
      method: p_method,
      body: JSON.stringify({
        endpoint: subscription.endpoint,
        publicKey: key ? btoa(String.fromCharCode.apply(null, new Uint8Array(key))) : null,
        authToken: token ? btoa(String.fromCharCode.apply(null, new Uint8Array(token))) : null,
        contentEncoding: contentEncoding
      })
    }).then(() => subscription);
  };
  this.push_subscribe = function() {
    if(!$.Solves.isNotEmpty(this.getApplicationServerKey())){
      return;
    }
    //changePushButtonState('computing');
    var _self = this;
    return this.checkNotificationPermission()
      .then(() => navigator.serviceWorker.ready)
      .then(serviceWorkerRegistration =>
        serviceWorkerRegistration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: _self.urlBase64ToUint8Array(this.getApplicationServerKey()),
        })
      )
      .then(subscription => {
        // Subscription was successful
        // create subscription on your server
        return _self.push_sendSubscriptionToServer(subscription, 'POST');
      })
      .catch(e => {
        if (Notification.permission === 'denied') {
          // The user denied the notification permission which
          // means we failed to subscribe and the user will need
          // to manually change the notification permission to
          // subscribe to push messages
          console.warn('Notifications are denied by the user.');
          //changePushButtonState('incompatible');
        } else {
          // A problem occurred with the subscription; common reasons
          // include network errors or the user skipped the permission
          console.error('Impossible to subscribe to push notifications', e);
         // changePushButtonState('disabled');
        }
      });
  };
  this.push_updateSubscription = function() {
    var _self = this;
    navigator.serviceWorker.ready
      .then(serviceWorkerRegistration => serviceWorkerRegistration.pushManager.getSubscription())
      .then(subscription => {
     //  changePushButtonState('disabled');

        if (!subscription) {
          // We aren't subscribed to push, so set UI to allow the user to enable push
          return;
        }

        // Keep your server in sync with the latest endpoint
        return _self.push_sendSubscriptionToServer(subscription, 'PUT');
      })
      .then(subscription => subscription) // Set your UI to show they have subscribed for push messages
      .catch(e => {
        console.error('Error when updating the subscription', e);
      });
  };
  this.checkNotificationPermission = function() {
    return new Promise((resolve, reject) => {
      if (Notification.permission === 'denied') {
        return reject(new Error('Push messages are blocked.'));
      }

      if (Notification.permission === 'granted') {
        return resolve();
      }

      if (Notification.permission === 'default') {
        return Notification.requestPermission().then(result => {
          if (result !== 'granted') {
            reject(new Error('Bad permission result'));
          }

          resolve();
        });
      }
    });
  };
  this.push_unsubscribe = function() {
    var _self = this;
    //changePushButtonState('computing');

    // To unsubscribe from push messaging, you need to get the subscription object
    navigator.serviceWorker.ready
      .then(serviceWorkerRegistration => serviceWorkerRegistration.pushManager.getSubscription())
      .then(subscription => {
        // Check that we have a subscription to unsubscribe
        if (!subscription) {
          // No subscription object, so set the state
          // to allow the user to subscribe to push
          //changePushButtonState('disabled');
          return;
        }

        // We have a subscription, unsubscribe
        // Remove push subscription from server
        return _self.push_sendSubscriptionToServer(subscription, 'DELETE');
      })
      .then(subscription => subscription.unsubscribe())
      .then(() => changePushButtonState('disabled'))
      .catch(e => {
        // We failed to unsubscribe, this can lead to
        // an unusual state, so  it may be best to remove
        // the users data from your data store and
        // inform the user that you have done so
        console.error('Error when unsubscribing the user', e);
        //changePushButtonState('disabled');
      });
  };
  this.urlBase64ToUint8Array = function(base64String) {
    if(!$.Solves.isNotEmpty(base64String)){
      return null;
    }
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  };
}
$.SolvesNotifications = new SolvesNotifications();
$.SolvesNotifications.init();