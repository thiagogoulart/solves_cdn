/**
@Author Thiago Gonçalves da Silva Goulart (SOLVES SOlUÇÕES EM SOFTWARE)
* 11/04/2019.)
**/
function SolvesStorage() {
  this.solvesPluginName = 'SolvesStorage';
  this.versionId = 3;
  this.version = '1.2';
  this.debug = false;
  /*DEFAULT KEYS*/
  this.STORAGE_KEY_PERFIL = $.Solves.siteShortName+'_'+$.Solves.PARAM_NAME_PERFIL;
  this.STORAGE_KEY_USUARIO = $.Solves.siteShortName+'_'+$.Solves.PARAM_NAME_USUARIO;
  this.STORAGE_KEY_USERDATA = $.Solves.siteShortName+'_'+$.Solves.PARAM_NAME_USERDATA;
  this.STORAGE_KEY_TOKEN = $.Solves.siteShortName+'_'+$.Solves.PARAM_NAME_TOKEN;
  this.STORAGE_KEY_FIREBASE_AUTH_USER = $.Solves.siteShortName+'_'+$.Solves.PARAM_NAME_FIREBASE_AUTH_USER;
  this.STORAGE_KEY_FIREBASE_AUTH_TOKEN = $.Solves.siteShortName+'_'+$.Solves.PARAM_NAME_FIREBASE_AUTH_TOKEN;
  this.STORAGE_KEY_FIREBASE_AUTH_RESULT = $.Solves.siteShortName+'_'+$.Solves.PARAM_NAME_FIREBASE_AUTH_RESULT;
  this.STORAGE_KEY_ADDRESS_DATA = $.Solves.PARAM_NAME_ADDRESS_DATA;
  this.STORAGE_KEY_GEO_DATA = $.Solves.PARAM_NAME_GEO_DATA;

  this.init = function(){
    $.Solves.addSolvesPlugin(this.solvesPluginName, $.SolvesStorage);
  };
  this.afterSolvesInit = function(){
    this.debug = $.Solves.debug;
    this.STORAGE_KEY_PERFIL = $.Solves.removeEspacos($.Solves.siteShortName+'_'+$.Solves.PARAM_NAME_PERFIL);
    this.STORAGE_KEY_USUARIO = $.Solves.removeEspacos($.Solves.siteShortName+'_'+$.Solves.PARAM_NAME_USUARIO);
    this.STORAGE_KEY_USERDATA = $.Solves.removeEspacos($.Solves.siteShortName+'_'+$.Solves.PARAM_NAME_USERDATA);
    this.STORAGE_KEY_TOKEN = $.Solves.removeEspacos($.Solves.siteShortName+'_'+$.Solves.PARAM_NAME_TOKEN);
    this.STORAGE_KEY_FIREBASE_AUTH_USER = $.Solves.removeEspacos($.Solves.siteShortName+'_'+$.Solves.PARAM_NAME_FIREBASE_AUTH_USER);
    this.STORAGE_KEY_FIREBASE_AUTH_TOKEN = $.Solves.removeEspacos($.Solves.siteShortName+'_'+$.Solves.PARAM_NAME_FIREBASE_AUTH_TOKEN);
    this.STORAGE_KEY_FIREBASE_AUTH_RESULT = $.Solves.removeEspacos($.Solves.siteShortName+'_'+$.Solves.PARAM_NAME_FIREBASE_AUTH_RESULT);
    this.STORAGE_KEY_ADDRESS_DATA = $.Solves.PARAM_NAME_ADDRESS_DATA;
    this.STORAGE_KEY_GEO_DATA = $.Solves.PARAM_NAME_GEO_DATA;
  };
  this.destroy = function(){
    this.clearAuthData();
    this.clearGeoData();
  };
  this.clearAuthData = function(){
    this.clearCache(this.STORAGE_KEY_USUARIO);
    this.setEmptyCache(this.STORAGE_KEY_USERDATA);
    this.setEmptyCache(this.STORAGE_KEY_TOKEN);
    this.setEmptyCache(this.STORAGE_KEY_PERFIL);
    this.setEmptyCache(this.STORAGE_KEY_FIREBASE_AUTH_USER);
    this.setEmptyCache(this.STORAGE_KEY_FIREBASE_AUTH_TOKEN);
    this.setEmptyCache(this.STORAGE_KEY_FIREBASE_AUTH_RESULT);
  };
  this.clearGeoData = function(){
    this.clearCache(this.STORAGE_KEY_ADDRESS_DATA);
    this.clearCache(this.STORAGE_KEY_GEO_DATA);
  };
  this.getStorageAuthPerfil = function(){
    return this.getCache(this.STORAGE_KEY_PERFIL, true);
  };
  this.setStorageAuthPerfil = function(p){
    return this.setCache(this.STORAGE_KEY_PERFIL, p, true);
  };
  this.getStorageAuthUsuario = function(){
    return this.getCache(this.STORAGE_KEY_USUARIO, true);
  };
  this.setStorageAuthUsuario = function(p){
    return this.setCache(this.STORAGE_KEY_USUARIO, p, true);
  };
  this.getStorageAuthUserData = function(){
    return this.getCache(this.STORAGE_KEY_USERDATA, true);
  };
  this.setStorageAuthUserData = function(p){
    return this.setCache(this.STORAGE_KEY_USERDATA, p, true);
  };
  this.getStorageFireBaseAuthUser = function(){
    return this.getCache(this.STORAGE_KEY_FIREBASE_AUTH_USER, true);
  };
  this.setStorageFireBaseAuthUser = function(p){
    return this.setCache(this.STORAGE_KEY_FIREBASE_AUTH_USER, p, true);
  };
  this.getStorageFireBaseAuthToken = function(){
    return this.getCache(this.STORAGE_KEY_FIREBASE_AUTH_TOKEN, true);
  };
  this.setStorageFireBaseAuthToken = function(p){
    return this.setCache(this.STORAGE_KEY_FIREBASE_AUTH_TOKEN, p, true);
  };
  this.getStorageFireBaseAuthResult = function(){
    return this.getCache(this.STORAGE_KEY_FIREBASE_AUTH_RESULT, true);
  };
  this.setStorageFireBaseAuthResult = function(p){
    return this.setCache(this.STORAGE_KEY_FIREBASE_AUTH_RESULT, p, true);
  };
  this.getStorageAuthToken = function(){
    return this.getCache(this.STORAGE_KEY_TOKEN, false);
  };
  this.setStorageAuthToken = function(p){
    return this.setCache(this.STORAGE_KEY_TOKEN, p, false);
  };
  this.getStorageAddressData = function(){
    return this.getCache(this.STORAGE_KEY_ADDRESS_DATA, true);
  };
  this.setStorageAddressData = function(json){
    return this.setCache(this.STORAGE_KEY_ADDRESS_DATA, json, true);
  };
  this.getStorageGeoData = function(){
    return this.getCache(this.STORAGE_KEY_GEO_DATA, true);
  };
  this.setStorageGeoData = function(json){
    return this.setCache(this.STORAGE_KEY_GEO_DATA, json, true);
  };
  this.setCookieData = function(cookieName,cookieValue,isJson){
    var daysToExpire = 2;
    var date = new Date();
    date.setTime(date.getTime()+(daysToExpire*24*60*60*1000));
    if($.Solves.isTrue(isJson) && cookieValue!==undefined && cookieValue!=null){cookieValue = $.Solves.escapeTextField(JSON.stringify(cookieValue));}
    var val = cookieName + "=" + cookieValue + "; expires=" + date.toGMTString()+"; path=/";
    document.cookie = val;
  };
  this.getCookieData = function(cookieName,isJson) {
    var result;
    var name = cookieName + "=";
    var allCookieArray = document.cookie.split(';');
    for(var i=0; i!=allCookieArray.length; i++){
      var temp = allCookieArray[i].trim();
      if (temp.indexOf(name)==0){
        result = temp.substring(name.length,temp.length);
        break;
      }
    }
    if(result!=null){
      return ($.Solves.isTrue(isJson) ? jQuery.parseJSON(unescape(result)) : result);
    }
    return null;
  };
  this.decodeExistingCookies = function(){
    //TODO
  };
  this.decodeExistingStorages = function(){
    var pluginGeo = $.Solves.getSolvesPlugin('SolvesGeo');
    if(pluginGeo!=null){
      pluginGeo.addressData = this.getStorageAddressData();
      pluginGeo.geoData = this.getStorageGeoData();
    }else{
      console.log(this.solvesPluginName+' não encontrou SolvesGeo');
    }
  };
  this.getCache = function(key,isJson){
    result = window.localStorage[key];
    if(result!=null){
      return ($.Solves.isTrue(isJson) ? jQuery.parseJSON(unescape(result)) : result);
    }
    return null;
  };
  this.setCache = function(key, value, isJson){
    if(this.debug){console.log('SolvesStorage. setCache['+key+'] actualValue['+window.localStorage[key]+'] newValue['+value+']');}
    if($.Solves.isTrue(isJson) && value!==undefined && value!=null){value = $.Solves.escapeTextField(JSON.stringify(value));}
    window.localStorage[key] = value;
  };
  this.clearCache = function(key){
    if(this.debug){console.log('SolvesStorage. clearCache['+key+'] actualValue['+window.localStorage[key]+']');}
    window.localStorage[key] = null;
  };
  this.setEmptyCache = function(key){
    this.clearCache(key);
  }
}
$.SolvesStorage = new SolvesStorage();
$.SolvesStorage.init();