/**
@Author Thiago Gonçalves da Silva Goulart (SOLVES SOlUÇÕES EM SOFTWARE)
* 11/04/2019.)
**/
function SolvesGeo() {
  this.solvesPluginName = 'SolvesGeo';
  this.versionId = 1;
  this.version = '1.0';
  this.addressData = null;
  this.geoData = null;
  this.gotUserPosition = false;
  this.lat = null;
  this.long = null;
  this.emailOrigin = null;

  this.init = function(){
    $.Solves.addSolvesPlugin(this.solvesPluginName, $.SolvesGeo);
  };
  this.destroy = function(){

  };
  this.setEmailOrigin = function(e){
    this.emailOrigin = e;
  }
  this.getGpsLocation = function (force,sucFuntion,errorFunc){
    if(!this.gotUserPosition || force){     
      if (navigator.geolocation) {
        //Check if browser supports W3C Geolocation API
          navigator.geolocation.getCurrentPosition(geoSuccessFunction, geoErrorFunction);
      } 
      //Get latitude and longitude;
      function geoSuccessFunction(position) {
        this.gotUserPosition = true;
        this.lat = position.coords.latitude;
        this.long = position.coords.longitude;
        this.getGpsDetails(sucFuntion,errorFunc);
      }
      function geoErrorFunction(){errorFunc();}
    }
  }    
  this.getGpsDetails = function(sucFuntion,errorFunc){
    $.getJSON('https://nominatim.openstreetmap.org/reverse?'+($.Solves.isNotEmpty(this.emailOrigin)?'email='+this.emailOrigin+'&':'')+
      'format=jsonv2&lat='+this.lat+'&lon='+this.long+'&polygon_svg=1&addressdetails=1', 
      function(data) {setGeoData(data); sucFuntion(data);});
  }
  this.setAddressDataByGeoData = function(p_numero, p_complemento){
    var p_uf_id;
    var p_cidade_id;
    var p_cep = this.geoData.address.postcode;
    var p_country = this.geoData.address.country;
    var p_country_code= this.geoData.address.country_code;
    var p_uf = this.geoData.address.state;
    var p_uf_distrito = this.geoData.address.state_district;
    var p_cidade = this.geoData.address.city;
    var p_cidade_distrito = this.geoData.address.city_district;
    var p_cidade_microregiao = this.geoData.address.county;
    var p_bairro = this.geoData.address.neighbourhood;
    var p_suburb = this.geoData.address.suburb;
    var p_logradouro = this.geoData.address.road;
    if(!isNotEmpty(p_logradouro)){
      p_logradouro = this.geoData.address.footway;
    }
    var p_universidade = this.geoData.address.university;
    var p_lat = this.geoData.lat;
    var p_long = this.geoData.lon;
    var p_name = this.geoData.name;
    var p_display_name = this.geoData.display_name;
    var p_place_id = this.geoData.place_id;
    var p_type = this.geoData.type;
    var p_osm_id = this.geoData.osm_id;
    var p_osm_type = this.geoData.osm_type;
    this.addressData = {cep:p_cep, country:p_country, country_code:p_country_code, uf_id:p_uf_id, uf:p_uf, uf_distrito:p_uf_distrito, 
      cidade_id:p_cidade_id, cidade_distrito: p_cidade_distrito, cidade_microregiao: p_cidade_microregiao, cidade: p_cidade, 
      bairro:p_bairro, suburb:p_suburb, logradouro:p_logradouro, universidade:p_universidade, 
      numero:p_numero, complemento:p_complemento, latitude:p_lat, longitude:p_long, name:p_name, display_name:p_display_name, place_id:p_place_id, type:p_type,
      osm_id:p_osm_id, osm_type:p_osm_type};
    this.storeAddressData();
  }
  this.storeAddressData = function(){
    var pluginStorage = $.Solves.getSolvesPlugin('SolvesStorage');
    if(pluginStorage!=null){
      pluginStorage.setStorageAddressData(this.addressData);
    }else{
      console.log(this.solvesPluginName+' não encontrou SolvesStorage');
    }
  }
  this.setAddressData = function(p_cep, p_uf_id, p_uf, p_cidade_id, p_cidade, p_logradouro, p_numero, p_complemento){
    this.addressData = {cep:p_cep, uf_id:p_uf_id, uf:p_uf, cidade_id:p_cidade_id, cidade: p_cidade, logradouro:p_logradouro, numero:p_numero, complemento:p_complemento};
    this.storeAddressData();
  }
  this.setGeoData = function(data){
    this.geoData = data;
    this.storeGeoData();
  }
  this.storeGeoData = function(){
    var pluginStorage = $.Solves.getSolvesPlugin('SolvesStorage');
    if(pluginStorage!=null){
      pluginStorage.setStorageGeoData(this.geoData);
    }else{
      console.log(this.solvesPluginName+' não encontrou SolvesStorage');
    }
  }
}
$.SolvesGeo = new SolvesGeo();
$.SolvesGeo.init();