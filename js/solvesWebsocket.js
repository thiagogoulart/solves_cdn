/**
@Author Thiago Gonçalves da Silva Goulart (SOLVES SOlUÇÕES EM SOFTWARE)
* 07/01/2020
**/
function SolvesWebsocket() {
  this.solvesPluginName = 'SolvesWebsocket';
  this.versionId = 1;
  this.version = '1.0';
  this.debug = false;

  this.webSocketUrl = 'ws://...';
  this.webSocketRoutes = [];
  this.webSocketRoutesConnections = [];

  this.reconnection = true; // (Boolean) whether to reconnect automatically (false)
  this.reconnectionAttempts = 5; // (Number) number of reconnection attempts before giving up (Infinity),
  this.reconnectionDelay = 3000;// (Number) how long to initially wait before attempting a new (1000) 
  this.reconnectionAttemptsDone = 0;

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
  this.getConexao = function(path){
    var conn = this.getSolvesWebsocketConection(path);
    if(conn==undefined || conn==null){
      conn = this.criarConexao(path);
    }
    return (conn!==undefined && conn!=null ? conn.getConexao() : null);
  };
  this.getSolvesWebsocketConection = function(path){
    var conn = this.webSocketRoutesConnections[path];
    if(conn!=null && conn.isClosed()){
      // console.log(conn.getConexao());
      conn = this.doNewConexao(path);
    }
    return conn;
  };
  this.criarConexao = function(path){
    var conn = this.getSolvesWebsocketConection(path);
    if(conn==undefined || conn==null){
        this.doNewConexao(path);
    }else if(conn.isClosed()){
        this.webSocketRoutesConnections[path].open();
    }
    return this.webSocketRoutesConnections[path];
  };
  this.doNewConexao = function(path){
    this.webSocketRoutesConnections[path] = new SolvesWebsocketConnection(path, this.webSocketUrl+path);
    this.webSocketRoutesConnections[path].open();
  };
  this.fecharConexao = function(path){
    var conn = this.getSolvesWebsocketConection(path);
    if(conn!=undefined && conn!=null){
        conn.close();
        this.webSocketRoutesConnections[path].remove();
    }
  };
};
function SolvesWebsocketConnection(path, webSocketUrlWithPath) {
  this.path = path;
  this.webSocketUrlWithPath = webSocketUrlWithPath;
  this.IS_SOCKET_ABERTO = false;
  this.IS_SOCKET_ABRINDO = false;
  this.IS_SOCKET_FAIL = false;
  this.IS_SOCKET_FAIL_EXCEPTION = null;
  this.conn;
  this.messages = [];

  /*Socket has been created. The connection is not yet open.*/
  this.STATUS_CONNECTING =0;
  /*The connection is open and ready to communicate.*/
  this.STATUS_OPEN =1;
  /*The connection is in the process of closing.*/
  this.STATUS_CLOSING =2;
  /*  The connection is closed or couldn't be opened..*/
  this.STATUS_CLOSED =3;

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
    // console.log('this.restart');
    this.close();
    await this.open();
  };
  this.isClosed = function(){
    return (!this.IS_SOCKET_ABERTO && (this.conn==null || (this.STATUS_CLOSED==this.conn.readyState)));
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
      $.SolvesWebsocket.getSolvesWebsocketConection(this.path).IS_SOCKET_ABERTO = true;
      $.SolvesWebsocket.getSolvesWebsocketConection(this.path).IS_SOCKET_ABRINDO = false;
      // console.log("Connection established!");
  };
  this.onSocketClose = function(evt) {
    // console.log('this.onSocketClose');
    $.SolvesWebsocket.getSolvesWebsocketConection(this.path).IS_SOCKET_ABERTO = false;
    $.SolvesWebsocket.getSolvesWebsocketConection(this.path).IS_SOCKET_ABRINDO = false;
      //TODO
     // mostraRecarregar();
  };
  this.onSocketReceiveMessage = function(evt) {
      //TODO
      var json = evt.data;
      // console.log(json);
      var obj = jQuery.parseJSON(json);
      // console.log(obj);
      //closeLoading();
  };
  this.onSocketError = function(evt) {
      //TODO
      // console.log(evt.data);
     // mostraRecarregar();
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
        $.SolvesWebsocket.getSolvesWebsocketConection(this.path).conn = conn;
        if(_self.STATUS_OPEN==conn.readyState){
          conn.send(JSON.stringify(jsonMsg))
        }else{
          // console.log('Não encontrada conexão ativa');
        }
      });
    }catch(error){
      // console.log('error on sendingMessage.'+error);
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
      msgObj.token = token;
      /*var pluginGeo = $.Solves.getSolvesPlugin('SolvesGeo');
      if(pluginGeo!=null){
        if(pluginGeo.addressData!=undefined && pluginGeo.addressData!=null){
          json += (json.length>0 ? '&' : '?')+this.PARAM_NAME_ADDRESS_DATA+'='+$.Solves.escapeTextField(JSON.stringify(pluginGeo.addressData));
        }
        if(pluginGeo.geoData!=undefined && pluginGeo.geoData!=null){
        json += (json.length>0 ? '&' : '?')+this.PARAM_NAME_GEO_DATA+'='+$.Solves.escapeTextField(JSON.stringify(pluginGeo.geoData));
        }
      }*/
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
  this.getParamRequest = function(formData, successFunc, errorFunc){
    var token = null;
    var pluginStorage = this.getSolvesPlugin('SolvesStorage');
    if(pluginStorage!=null){
      token = pluginStorage.getStorageAuthToken();
    }
    return {
          type: reqMethod,
          url: url,          
          processData:false,
          contentType: false,
          cache: false,
          data: formData,
          headers: {"Authorization": token},
           success: function(data){ 
              try{                  
                successFunc(data);
                result = jQuery.parseJSON(data);
                if($.Solves.isTrue(result['logoff'])){
                  // console.log('não autorizado.');
                  $.Solves.logoff();
                }
              }catch(error){
                // console.log('error on ajax.'+error);
              }
              $.Solves.loaded();
            },
            error: function(data){ 
              try{
                errorFunc(data);
              }catch(error){
                // console.log('error on error handling ajax.'+error);
              }
              $.Solves.loaded();
            },
            complete: function(data){
              $.Solves.loaded();
            }
      };
  };
}
$.SolvesWebsocket = new SolvesWebsocket();
$.SolvesWebsocket.init();