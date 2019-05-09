/**
@Author Thiago Gonçalves da Silva Goulart (SOLVES SOlUÇÕES EM SOFTWARE)
* 14/04/2019.)
**/
function SolvesVideo() {
  this.solvesPluginName = 'SolvesVideo';
  this.versionId = 1;
  this.version = '1.0';

  this.urlPublicVideos = null;
  this.urlVideos = null;
  this.urlCanais = null;
  this.youtubeApiKey = null;
  this.youtubeChannelUrl = null;
  this.youtubePlayer = null;
  this.youtubeRestUrlSearchChannel = null;
  this.videoDone = false;
  this.videoPause = false;
  this.initialSecondsToWatch = 45;
  this.secondsToWatch = 45;
  this.timeoutContagemWatch = null;
  /*Operations that must be logged in*/
  this.loggedInToWatchNextVideo = true;
  /*Element Identificators*/
  this.selectFieldClass = 'select_youtube_videos';
  this.containerWatchPlayerElmId = 'watch_player';
  this.containerWatchPlayerDescElmId = 'watch_player_desc';
  this.containerWatchChannelDescElmId = 'watch_channel_desc';
  this.containerWatchChannelDescNameElmId = 'watch_channel_desc_name';
  this.containerWatchCounterElmId = 'watch_counter';
  this.containerWatchCounterNumberElmId = 'watch_counter_number';
  this.containerWatchCounterSecsElmId = 'watch_counter_secs';
  this.containerWatchNextElmId = 'watch_next';
  /* PADRÃO DE NOMES DE PARAMETROS  */
  this.PARAM_NAME_VIDEOS = 'videos';

  this.init = function(){
    $.Solves.addSolvesPlugin(this.solvesPluginName, $.SolvesVideo);
    //TODO validações de dependencias
    /*Depende de select2 e api youtube*/
  };
  this.destroy = function(){

  };

  this.setYoutubeApiKey = function(key){
    this.youtubeApiKey = key;
  };
  this.setInitialSecondsToWatch = function(secs){
    this.initialSecondsToWatch = secs;
    this.secondsToWatch = this.initialSecondsToWatch;
  };
  this.restartSecondsToWatch = function(){
    this.secondsToWatch = this.initialSecondsToWatch;
  };
  this.getYoutubeUrlApiDados = function(){
    if($.Solves.isNotEmpty(this.youtubeApiKey)){
        return "https://www.googleapis.com/youtube/v3/channels?part=snippet&maxResults=1&key="+this.youtubeApiKey+"&";
    }
    return null;
  }
  this.getYoutubeUrlApiDadosQuery = function(){
    if($.Solves.isNotEmpty(this.youtubeApiKey)){
        return "https://www.googleapis.com/youtube/v3/search?part=snippet&type=channel&maxResults=1&key="+this.youtubeApiKey+"&";
    }
    return null;
  }
  this.youtubeUrlApiEstatisticas = function(){
    if($.Solves.isNotEmpty(this.youtubeApiKey)){
        return "https://www.googleapis.com/youtube/v3/channels?part=statistics&key="+this.youtubeApiKey+"&";
    }
    return null;
  }   
  this.getUrlPublicVideos = function(videoKeyUrl){
    return this.urlPublicVideos+'?url='+videoKeyUrl;
  }
  this.getUrlVideos = function(videoKeyUrl){
    return this.urlVideos+'?url='+videoKeyUrl;
  }
  this.showModalPublicWatchVideo = function(videoNome, videoUrl){
    this.youtubePlayer=undefined;
    var pluginUi = $.Solves.getSolvesPlugin('SolvesUi');
    if(pluginUi!=null){
      pluginUi.showModalSmall(videoNome, '<div id="modal_player_container" class="modal_player_container">CARREGANDO VÍDEO...</div>', '<a href="javascript:$.SolveUi.closeModalSmall();">Fechar</a>');   
      this.onYouTubeIframeAPIReady("modal_player_container", videoUrl);
    }else{
      console.log(this.solvesPluginName+' não encontrou SolvesUi');
    }
  }
  this.listPublicWatchVideo = function(elmContainerId){
    var pluginStorage = $.Solves.getSolvesPlugin('SolvesStorage');
    if(pluginStorage!=null){
      var lista = pluginStorage.getCache(this.PARAM_NAME_VIDEOS)[0];
      $('#'+elmContainerId).html('');
      for(var i in lista){
        var obj = lista[i];
        this.appendHtmlItemListPublicWatchVideo(elmContainerId, i, obj);
      }
      lista = null;
    }else{
      console.log(this.solvesPluginName+' não encontrou SolvesStorage');
    }
  }
  this.appendHtmlItemListPublicWatchVideo = function(elmContainerId, i, video){
    var urlVideoDetails = this.getUrlPublicVideos(video['url']);
     $('#'+elmContainerId).prepend('<div class="col-lg-3 col-md-3 col-sm-3 col-xl-3 col-6 bg-white mg-b-10 list_'+elmContainerId+'" id="v_'+i+'" data-qtd_list="'+elmContainerId+'" data-item_list="'+i+'">'+
          '<div class="thumb-img" align="center">'+
          '<a target="_blank" rel="noopener" href="javascript:$.SolvesVideo.createContainerPublicWatchVideo('+i+');" alt="'+video['nome']+'" title="'+video['nome']+'">'+
            '<img src="'+video['avatar']+'" style="width: 100%;" class="img-responsive" title="'+video['nome']+'" /></a>'+
            '</div>'+
              '<div class="caption" style="padding:4px">                            '+
              '<a class="text-danger" href="'+urlVideoDetails+'" alt="Ver detalhes do vídeo" title="Ver detalhes do vídeo"><b style="font-size: 12px;">'+video['nome']+'</b></a>'+
              '<div><i class="fa fa-tag"></i> <!--a href="/?cat='+video['categoria_video_id']+'" alt="Ver detalhes da Categoria" title="Ver detalhes da Categoria"-->'+video['categoria_video_id_label']+'<!--/a--></div>'+
            '</div>'+
            '</div>');
  }
  this.getHtmlVideoDesc = function(obj){
    var urlVideoDetails = this.getUrlVideos(obj.url);
    return '<h4 style="text-align: center;"><strong>VÍDEO: </strong> '+
                          '<a href="'+urlVideoDetails+'"  style="text-align: center;" '+
                            'alt="Ver detalhes do Vídeo" title="Ver detalhes do Vídeo">'+obj.nome+'</a></h4>'+
                            '<div>'+obj.description+'</div>';
  }
  this.getPublicHtmlVideoDesc = function(obj){
  var urlVideoDetails = this.getUrlPublicVideos(obj.url);
    return '<h4 style="text-align: center;"><strong>VÍDEO: </strong> '+
                          '<a href="'+urlVideoDetails+'"  style="text-align: center;" '+
                            'alt="Ver detalhes do Vídeo" title="Ver detalhes do Vídeo">'+obj.nome+'</a></h4>'+
                            '<div>'+obj.description+'</div>';
  }
this.createContainerPublicWatchVideo = function(id){
  var pluginStorage = $.Solves.getSolvesPlugin('SolvesStorage');
  if(pluginStorage!=null){
    $.Solves.objeto = pluginStorage.getCache(this.PARAM_NAME_VIDEOS)[0][id];
    $('#'+elmContainerId).html('');
    for(var i in lista){
      var obj = lista[i];
      this.appendHtmlItemListPublicWatchVideo(elmContainerId, i, obj);
    }
    lista = null;
  }else{
    console.log(this.solvesPluginName+' não encontrou SolvesStorage');
  }
  this.youtubePlayer=undefined;
  $('#v_'+id+'_player_container').remove();
  $('.player_container').remove();
  var qtd = $('#v_'+id).attr('data-qtd_list');
  var it = $('#v_'+id).attr('data-item_list');

   $('#v_'+id).after('<div class="player_container col-12 mt-2 mb-3" id="v_'+id+'_player_container">'+
      '<div class="card overflow-hidden">'+
        '<div class="card-body pd-0 bd-color-gray-lighter">'+
          '<center>'+
            '<div class="row" style="padding: 8px; background: rgb(85, 85, 85); color: #FFFFFF;">'+
              '<div class="col-lg-6 col-md-6 col-sm-12 col-xl-12" style="text-align:left;">'+
                '<div><strong>CANAL: </strong><span id="watch_channel_desc_name"></span></div>'+
              '</div>'+
              '<div class="col-lg-6 col-md-6 col-sm-12 col-xl-12" style="text-align:right">'+
                  '<div id="watch_channel_desc">'+this.getSubscribeButton($.Solves.objeto.channel_id_url, true)+'</div>'+
              '</div>'+
            '</div>'+
            '<div id="watch_player">CARREGANDO VÍDEO...<!-- VIDEO WILL BE EMBEDED HERE--></div>'+
            '<div id="watch_player_desc" style="padding: 8px;background: rgb(192, 192, 192); color:#000000;">'+this.getPublicHtmlVideoDesc($.Solves.objeto)+'</div>'+
          '</center>'+
        '</div><!-- card-body -->              '+
      '</div><!-- card -->'+
    '</div>').focus();
   this.onYouTubeIframeAPIReady('watch_player', $.Solves.objeto.url);
}
this.contagem_tempo = function(counterNumberElmId, counterSecondsTextElmId, unblockBtnId, counterContainerId){  
//console.log('contagem_tempo:'+this.secondsToWatch);
    if (this.secondsToWatch == 0) {
      this.restartSecondsToWatch();
      $('#'+counterContainerId).hide();
      $('#'+counterNumberElmId).html(0);
      $('#'+counterSecondsTextElmId).html('segundo');
      this.unblockNextButtonVideo(unblockBtnId);
    }  else{
      if(!this.videoPause){
        $('#'+counterContainerId).show();
        this.blockNextButtonVideo(unblockBtnId);
        $('#'+counterNumberElmId).html(this.secondsToWatch);
        $('#'+counterSecondsTextElmId).html('segundo'+(this.secondsToWatch>1 ? 's': ''));
        var secs = (this.secondsToWatch==this.initialSecondsToWatch ? 4000 : 1000);
        this.secondsToWatch = this.secondsToWatch - 1;
      }
      this.timeoutContagemWatch = setTimeout("$.SolvesVideo.contagem_tempo('"+counterNumberElmId+"', '"+counterSecondsTextElmId+"', '"+unblockBtnId+"', '"+counterContainerId+"')", secs);
    }                            
}   
this.blockNextButtonVideo = function(unblockBtnId){
  $('#'+unblockBtnId).removeClass('btn-success').addClass('btn-dark').attr('aria-disabled', 'true').attr('disabled', 'true').addClass('disabled').attr('href','return false');
}
this.unblockNextButtonVideo = function(unblockBtnId){
  $('#'+unblockBtnId).removeClass('btn-dark').addClass('btn-success').removeAttr('aria-disabled').removeAttr('disabled').removeClass('disabled').attr('href','javascript:$.SolvesVideo.watchNextVideo()');
}
this.watchNextVideo = function(){
  if(!this.loggedInToWatchNextVideo || $.Solves.isLogado()){ 
    //TODO function
    this.doAjaxVideoFindToWatch(this.containerWatchPlayerElmId, this.containerWatchPlayerDescElmId, this.containerWatchChannelDescElmId, this.containerWatchChannelDescNameElmId);
  }else{
    this.stopAndClosePlayer();
    var pluginUi = $.Solves.getSolvesPlugin('SolvesUi');
    if(pluginUi!=null){
      pluginUi.closeModalSmall();
    }
  }
}
this.likeVideo = function(videoId){
   $.ajax({
        type: "POST",
        url: 'https://www.googleapis.com/youtube/v3/videos/rate',          
        processData:false,
        contentType: false,
        cache: false,
        data: {id: videoId, rating:'like'},
         success: function(data){ 
            console.log(data);
          },
          error: function(data){ 
            console.log(data);
          }
    });
  
}
this.getSubscribeButton = function(channel_url, isFull){
  return '<script src="https://apis.google.com/js/platform.js"></script><div class="g-ytsubscribe" data-channelid="'+channel_url+'" '+(isFull?'data-layout="full"':'')+' data-theme="dark" data-count="default"></div>';
}
this.stopAndClosePlayer = function(){
  if(this.youtubePlayer!=undefined && this.youtubePlayer!=null){ this.youtubePlayer.stopVideo();this.youtubePlayer.clearVideo();}
}
this.getPlayerDuration = function(){
  return (this.youtubePlayer!==undefined && this.youtubePlayer!=null ? Math.round(this.youtubePlayer.getDuration()) : 0);
}
this.showNoVideoPlayer = function(idContainerVideo, idContainerVideoDesc, idContainerChannelDesc, idElmChannelName){
  this.blockNextButtonVideo('watch_next');
  var msg = '<h2>Aguarde novos vídeos!</h2>Parece que todos os vídeos foram assistidos conforme a quantidade de pontos.';
  if( $('#'+idContainerVideo+'_msg').length>0){
    $('#'+idContainerVideo+'_msg').remove();
  }
  $('#'+idContainerVideo).hide();
  $('#'+idContainerChannelDesc).hide();
  $( '<div id="'+idContainerVideo+'_msg" class="mg-b-50 mg-t-50">'+msg+'</div>').insertAfter( '#'+idContainerVideo );
}
this.onYouTubeIframeAPIReady = function(idContainerVideo, videoYoutubeId) {
  if($('#'+idContainerVideo).length==0){
    return;
  }
  $.Atual.videoDone = false;
  if(this.youtubePlayer==undefined || this.youtubePlayer==null){
    var w = 320;
    if(window.innerWidth!==undefined &&  window.innerWidth!=null){
       w = window.innerWidth;
       if(w>992){w=w-418}else{w=w-40}
        if(w>711){w=711;}
    }
    var h = w * 56.25 /100;
    this.youtubePlayer = new YT.Player(idContainerVideo, {
      height: h,
      width: w,
      videoId: videoYoutubeId,
      events: {
        'onReady': onPlayerReady,
        'onStateChange': onPlayerStateChange
      }
    });
  }else{
    this.youtubePlayer.loadVideoById({videoId:videoYoutubeId,startSeconds:0});
    startContadorTempoMinimoVideo();
  }
}
this.onPlayerReady = function(event) {
  event.target.playVideo();
  this.startContadorTempoMinimoVideo();
}
this.startContadorTempoMinimoVideo = function(){ 
  if(!this.loggedInToWatchNextVideo || $.Solves.isLogado()){ 
    this.restartSecondsToWatch();
    this.contagem_tempo(this.containerWatchCounterNumberElmId, this.containerWatchCounterSecsElmId, this.containerWatchNextElmId, this.containerWatchCounterElmId);
  }
}
this.onPlayerStateChange = function(event) {
  if(this.youtubePlayer.getPlayerState()==YT.PlayerState.ENDED){
    this.watchNextVideo();
  }else if(this.youtubePlayer.getPlayerState()==YT.PlayerState.PLAYING){
    //console.log('playing');
     this.videoPause = false;
     $.Solves.loaded();
     if(this.secondsToWatch==0){
      this.restartSecondsToWatch();
     }
  }else if(this.youtubePlayer.getPlayerState()==YT.PlayerState.UNSTARTED && getPlayerDuration()==0){
    //console.log('noPlayerDuration');
     this.videoPause = false;
     this.secondsToWatch = 0;
  }else{
    //console.log('player.else');
     this.videoPause = true;
  }
}
this.stopVideo = function() {
  this.youtubePlayer.stopVideo();
}
this.getVideoIdYoutubeByUrl = function(url){
    url = $.Solves.removeEspacos(url);
    url = url.replace("https://www.youtube.com/watch?v=", "");
    url = url.replace("http://www.youtube.com/watch?v=", "");
    url = url.replace("http://m.youtube.com/watch?v=", "");
    url = url.replace("https://m.youtube.com/watch?v=", "");
    url = url.replace("https://youtu.be/", "");
    url = url.replace("http://youtu.be/", "");
    url = url.replace("https://www.youtube.com/", "");
    /*try{                
        $arr_url = explode("&", $url);
        $url = $arr_url[0];

        $arr_url2 = explode("?", $url);
        $url = $arr_url2[0];            
    } catch (Exception $e){
        echo "ERRO: " . $e->getMessage();
    }*/
   return url;
}
this.getChannelIdYoutubeByUrl = function(url){
    url = $.Solves.removeEspacos(url);
    url = url.replace("https://www.youtube.com/channel/", "");
   return url;
}   
this.getStatisticsYoutubeChannel = function(channel_url){
  $.Solves.doAjaxExternal(URL_API_ESTATISTICAS + "id=" + channel_url, 'GET', {id:channel_url}, 
    function(data){ 
        result = jQuery.parseJSON(data);
    }, 
    function(data){

    }
  );
}
this.configSelect2Channels = function(dropParentId, p_selectFieldClass){
    this.selectFieldClass = p_selectFieldClass;
    if($('.'+this.selectFieldClass).length>0){ 
        $('.'+this.selectFieldClass).select2({
          "language": "pt-BR",
          dropdownParent: $("#"+dropParentId),
          ajax: {
              type: "POST",   
              processData:false,
              contentType: false,
              cache: false,
              url: this.youtubeRestUrlSearchChannel,
             headers: {"Authorization": ''},
              data: function (params) {
                return getFormData({term:params.term});
              },
              processResults: function (data) {
                if(data==null || data==undefined){
                  return;
                }
                result = jQuery.parseJSON(data);
                var items = [];
                if(result!==undefined){
                  for(var i in result){
                    var obj = result[i];
                    if(obj==undefined || obj.id==undefined || obj.nome==undefined){
                      continue;
                    }
                    var inner_html = '<div class="list_item_canal_container">'+
                    '<div class="item_canal_image_container"><img class="item_canal_image img-responsive" src="' + obj.avatar + '"></div>'+
                    '<div class="item_canal_nome">' + obj.nome + '</div>'+
                   '</div>';
                    items.push({id:obj.id, text: obj.nome, html: inner_html, avatar: obj.avatar, nome: obj.nome});
                  }
                }
                //console.log(items);
                // Tranforms the top-level key of the response object from 'items' to 'results'
                return {
                  results: items
                };
              },
              success: function(data){  },
              error: function(data){   }
          },
          placeholder: 'Selecione seu canal no Youtube',
          minimumInputLength: 3,
          templateResult: function(obj){return $(obj.html);},
          templateSelection: function(obj){return obj.nome || obj.url;}
        }).on('select2:select', function (e) {
            var data = e.params.data;
           var url = "https://www.youtube.com/channel/" +data.id;
            if($("#user_avatar").length>0)$("#user_avatar").val( data.avatar);
            if($("#user_avatar_prev").length>0)$("#user_avatar_prev").attr("src",data.avatar);

            if($("#channel_avatar").length>0)$("#channel_avatar").val( data.avatar);
            if($("#channel_avatar_prev").length>0)$("#channel_avatar_prev").attr("src",data.avatar);

            $("#channel_nome").val(data.nome);
            $("#label_channel_nome").html(data.nome);
            $("#channel_url").val(url);
            $("#label_channel_url").html(url);
        });
    }
  }
}
$.SolvesVideo = new SolvesVideo();
$.SolvesVideo.init();