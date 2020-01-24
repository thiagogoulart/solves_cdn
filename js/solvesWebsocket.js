/**
@Author Thiago Gonçalves da Silva Goulart (SOLVES SOlUÇÕES EM SOFTWARE)
* 07/01/2020
**/
function SolvesWebsocket() {
  this.solvesPluginName = 'SolvesWebsocket';
  this.versionId = 9;
  this.version = '1.8';
  this.debug = false;

  this.webSocketUrl = 'ws://...';
  this.webSocketRoutes = [];
  this.webSocketRoutesConnections = [];

  this.reconnection = true; // (Boolean) whether to reconnect automatically (false)
  this.reconnectionAttempts = 5; // (Number) number of reconnection attempts before giving up (Infinity),
  this.reconnectionDelay = 3000;// (Number) how long to initially wait before attempting a new (1000) 
  this.reconnectionAttemptsDone = 0;
  this.timeoutOpeningConnectionInSeconds = 10; 
  this.secondsTriedOpeningConnection = 0; 

  /*Event callbacks*/
  this.doWhenOpen;
  this.doWhenClose;
  this.doWhenReceiveMessage;
  this.doWhenError;

  this.init = function(){
    $.Solves.addSolvesPlugin(this.solvesPluginName, $.SolvesWebsocket);    
  };
  this.afterSolvesInit = function(){
    this.debug = $.Solves.debug;
  };
  this.destroy = function(){
    this.clearData();
  };
  this.clearData = function(){
    this.webSocketUrl = 'ws://...';
    this.webSocketRoutes = [];
    this.webSocketRoutesConnections = [];
  };
  this.getPathByParams = function(name, params){
    var configuredRoute = this.getConfigWebsocketRoute(name);
    var path = (configuredRoute!==undefined && configuredRoute!=null ? configuredRoute.path : null);
    if(params!==undefined && params!=null){
      if(Array.isArray(params)){
        var paramLen = params.pength
        for (i = 0; i != paramLen; i++) {
          path += (i==0?'?':'&').params[i];
        }
      }else{
        path += '?'+params;
      }
    }
    return path;
  };
  this.getConnection = async function(name, params, isRestrito){    
    var path = this.getPathByParams(name, params);
    return this.getConexao(name, path, isRestrito);
  };
  this.getConfigWebsocketRoute = function(name){
    var route = null;
    for(var i in $.SolvesWebsocket.webSocketRoutes){
      var r = $.SolvesWebsocket.webSocketRoutes[i];
      if(typeof r!="function" && $.Solves.isNotEmpty(r.name) && r.name==name){
        route = r;
        break;
      }
    }
    return route;
  };
  this.getConexao = async function(name, path, isRestrito){
    if(!$.Solves.isNotEmpty(this.webSocketUrl)){
      console.log('$.SolvesWebsocket não recebeu a definição do endpoint "webSocketUrl"');
      return null;
    }
    var isRestrito = $.Solves.isTrue(isRestrito);
    if(isRestrito){
      path = this.addUserTokenAndDataParams(path);
    }
    return await this.criarConexao(name, path);
  };
  this.getSolvesWebsocketConection = async function(name, path, doWhenOpen, doWhenClose, doWhenReceiveMessage, doWhenError){
        console.log('getSolvesWebsocketConection');   
    var conn = this.webSocketRoutesConnections[path];
    if(conn!=null){
      conn = conn.getConexao();
    }
    this.secondsTriedOpeningConnection++;
    if(conn==null){
      console.log('abrindo nova wsConn');
      this.doWhenOpen = doWhenOpen;
      this.doWhenClose = doWhenClose;
      this.doWhenReceiveMessage = doWhenReceiveMessage;
      this.doWhenError = doWhenError;
      conn = await this.doNewConexao(name, path);
    }else if(conn!=null && conn.readyState==3){
      console.log(conn);
      conn = await this.restartConnection(name, path);
    }
    console.log(conn);
    return conn;
  };
  this.criarConexao = async function(name, path){
    return await this.getSolvesWebsocketConection(name, path,this.doWhenOpen,this.doWhenClose,this.doWhenReceiveMessage,this.doWhenError);
  };
  this.doNewConexao = async function(name, path){
    this.webSocketRoutesConnections[path] = new SolvesWebsocketConnection(name, path, this.webSocketUrl+path, this.debug, this.doWhenOpen, this.doWhenClose, this.doWhenReceiveMessage, this.doWhenError);
    return await this.webSocketRoutesConnections[path].open();
  };
  this.openConnection = async function(name, params){    
    var path = this.getPathByParams(name, params);
    let conn = await this.criarConexao(name, path);
    return (conn!==undefined && conn!=null ? conn.getConexao() : null); 
  };  
  this.restartConnection = async function(name, path){ 
    console.log('restartConnection');      
    conn = await this.doNewConexao(name, path);
    return conn;
  };  
  this.closeConnection = function(name, params, isRestrito){     
    var path = this.getPathByParams(name, params);
    var isRestrito = $.Solves.isTrue(isRestrito); 
    if(isRestrito){
      path = this.addUserTokenAndDataParams(path);
    }
    var conn = this.webSocketRoutesConnections[path];
    if(conn!=undefined && conn!=null){
        conn.close();
        delete this.webSocketRoutesConnections[path];
    }
  };
  this.addUserTokenAndDataParams = function(path){
    var pluginStorage = $.Solves.getSolvesPlugin('SolvesStorage');
    if(pluginStorage!=null){
      let hasParam = (path.indexOf("?") != -1);
      var token = pluginStorage.getStorageAuthToken();
      var userData = pluginStorage.getStorageAuthUserData();
      if($.Solves.isNotEmpty(token)){
        path+=(hasParam?'&':'?')+$.Solves.PARAM_NAME_TOKEN+'='+token;
        hasParam = true;
      }
      if($.Solves.isNotEmpty(userData)){
        path+=(hasParam?'&':'?')+$.Solves.PARAM_NAME_USERDATA+'='+$.Solves.encondeUrlParam(userData);
        hasParam = true;
      }
    }
     return path;     
  };
  this.sendTxtMsg = function(connectionName, connectionParams, receiverId, msg, isRestrito) {
    this.sendTxtMsgComRestAction(connectionName, connectionParams, '', '', receiverId, msg, false, isRestrito);
  };
  this.sendObjMsg = function(connectionName, connectionParams, receiverId, objMsg) {
    this.sendObjMsgComRestAction(connectionName, connectionParams, '', '', receiverId, objMsg, false, isRestrito);
  };
  this.sendTxtMsgComRestAction = function(connectionName, connectionParams, restName, methodName, receiverId, msg, waitingAnswer, isRestrito) {
    this.getConnection(connectionName, connectionParams, isRestrito).then(conn => {
      setTimeout(function(){conn.sendTxtMsg(restName, methodName, receiverId, msg, waitingAnswer);}, 
        (conn.isOpening()?1000:0));
    });
  };
  this.sendObjMsgComRestAction = function(connectionName, connectionParams, restName, methodName, receiverId, objMsg, waitingAnswer, isRestrito) {
    this.getConnection(connectionName, connectionParams, isRestrito).then(conn => {        
      setTimeout(function(){conn.sendObjMsg(restName, methodName, receiverId, objMsg, waitingAnswer);}, 
        (conn.isOpening()?1000:0));
    });
  };
};
function SolvesWebsocketConnection(name, path, webSocketUrlWithPath, debug, doWhenOpen, doWhenClose, doWhenReceiveMessage, doWhenError) {
  this.name = name;
  this.path = path;
  this.webSocketUrlWithPath = webSocketUrlWithPath;
  this.IS_SOCKET_ABERTO = false;
  this.IS_SOCKET_ABRINDO = false;
  this.IS_SOCKET_FAIL = false;
  this.IS_SOCKET_FAIL_EXCEPTION = null;
  this.conn;
  this.messages = [];
  this.debug=debug;

  /*Socket has been created. The connection is not yet open.*/
  this.STATUS_CONNECTING =0;
  /*The connection is open and ready to communicate.*/
  this.STATUS_OPEN =1;
  /*The connection is in the process of closing.*/
  this.STATUS_CLOSING =2;
  /*  The connection is closed or couldn't be opened..*/
  this.STATUS_CLOSED =3;

  /*Event callbacks*/
  this.doWhenOpen = doWhenOpen;
  this.doWhenClose = doWhenClose;
  this.doWhenReceiveMessage = doWhenReceiveMessage;
  this.doWhenError = doWhenError;

  this.open = async function(){
    // console.log('this.open');
    this.IS_SOCKET_FAIL = false;
    this.IS_SOCKET_FAIL_EXCEPTION = null;
    this.IS_SOCKET_ABERTO = false;
    this.IS_SOCKET_ABRINDO = true;
    try{
      this.conn = new WebSocket(this.webSocketUrlWithPath);
      var _self = this;
      this.conn.onopen = function(e) {
        _self.onSocketOpen(e);
      };
      this.conn.onmessage = function(e) {
        _self.onSocketReceiveMessage(e);
      };
    }catch(exc){
      this.IS_SOCKET_FAIL = true;
      this.IS_SOCKET_FAIL_EXCEPTION = exc;
      // console.log(exc);
    }
    return this.conn;
  };
  this.close = function(){
    // console.log('this.close');
    this.conn.close();
    this.IS_SOCKET_ABERTO = false;
    this.IS_SOCKET_ABRINDO = false;
    this.conn = null;
  };
  this.restart = async function(){
    console.log('this.restart');
    this.close();
    return await this.open();
  };
  this.isClosed = function(){
    return (!this.IS_SOCKET_ABRINDO && !this.IS_SOCKET_ABERTO && (this.conn==null || this.STATUS_CLOSED==this.conn.readyState));
  };
  this.isClosing = function(){
    return (this.conn!=null && this.STATUS_CLOSING==this.conn.readyState);
  };
  this.isOpen = function(){
    return (this.IS_SOCKET_ABERTO || (this.conn!=null && this.STATUS_OPEN==this.conn.readyState));
  };
  this.isOpening = function(){
    return (this.IS_SOCKET_ABRINDO || (this.conn!=null && this.STATUS_CONNECTING==this.conn.readyState));
  };
  this.getConexao = function() {
    return this.conn;
  };
  this.getConexaoAtiva = async function() {
    if(!this.isOpen()){
      this.conn = await this.open();
    }
    return this.conn;
  };
  this.onSocketOpen = function(evt) {
     if(this.debug){console.log('onSocketOpen');}
      this.IS_SOCKET_ABERTO = true;
      this.IS_SOCKET_ABRINDO = false;
      
      try{
        if(this.doWhenOpen!==undefined && typeof this.doWhenOpen=="function"){
          this.doWhenOpen(evt);
        }else {console.log('Não encontrado callback para doWhenOpen');}
      }catch(error){
        console.log('error on error handling doWhenOpen callback.'+error);
      }
  };
  this.onSocketClose = function(evt) {
     if(this.debug){console.log('onSocketClose');}
    this.IS_SOCKET_ABERTO = false;
    this.IS_SOCKET_ABRINDO = false;
    
    try{
      if(this.doWhenClose!==undefined && typeof this.doWhenClose=="function"){
        this.doWhenClose(evt);
        }else {console.log('Não encontrado callback para doWhenClose');}
    }catch(error){
      console.log('error on error handling doWhenClose callback.'+error);
    }
  };
  this.onSocketReceiveMessage = function(evt) {
      if(this.debug){console.log('onSocketReceiveMessage');}
      var json = evt.data;
      var obj = jQuery.parseJSON(json);
      if(this.debug){console.log(obj);console.log(evt);}
      try{
        if(this.doWhenReceiveMessage!==undefined && typeof this.doWhenReceiveMessage=="function"){
          this.doWhenReceiveMessage(obj, evt);
        }else {console.log('Não encontrado callback para doWhenReceiveMessage');}
      }catch(error){
        console.log('error on error handling doWhenReceiveMessage callback.'+error);
      }
  };
  this.onSocketError = function(evt) {
     if(this.debug){console.log('onSocketError');}
     try{
        if(this.doWhenError!==undefined && typeof this.doWhenError=="function"){
          this.doWhenError(evt.data);
        }else {console.log('Não encontrado callback para doWhenError');}
      }catch(error){
        console.log('error on error handling doWhenError callback.'+error);
      }
  };
  this.sendTxtMsg = function(restName, methodName, receiverId, msg, waitingAnswer) {
    var objMsg = msg;
    if(typeof objMsg === 'string' || objMsg instanceof String){
      objMsg = {msg:msg};
    }
    this.sendObjMsg(restName, methodName, receiverId, objMsg, waitingAnswer)
  };
  this.sendObjMsg = function(restName, methodName, receiverId, objMsg, waitingAnswer) {
    var idMsg = (waitingAnswer ? (this.messages.length+1) : null);
    var jsonMsg = this.getJsonMsgData(restName, methodName, idMsg, receiverId, objMsg);
    if(waitingAnswer){
      this.messages[idMsg] = jsonMsg;
    }
    try{
      var _self = this;
      this.getConexaoAtiva().then(conn => {
        if(_self.debug){console.log(conn);}
        this.conn.send(JSON.stringify(jsonMsg));
      });
    }catch(error){
      console.log('error on sendingMessage.'+error);
      if(waitingAnswer){
        this.messages[idMsg].remove();
      }
    }
  };
  this.getJsonMsgData = function(restName, methodName, idMsg, receiverId, objMsg){
    var msgObj = {rest:restName, rest_method:methodName};
    var pluginStorage = $.Solves.getSolvesPlugin('SolvesStorage');
    if(pluginStorage!=null){
      var token = pluginStorage.getStorageAuthToken();
      var userData = pluginStorage.getStorageAuthUserData();
      msgObj.token = token;
      msgObj.userData = userData;
    }
    if(objMsg!=undefined){
      msgObj.dados = objMsg;
    }
    if(idMsg!=undefined && idMsg!=null){
      msgObj.msg_id = idMsg;
    }
    if(receiverId!=undefined && receiverId!=null){
      msgObj.receiver_id = receiverId;
    }
    return msgObj;
  };
}
$.SolvesWebsocket = new SolvesWebsocket();
$.SolvesWebsocket.init();