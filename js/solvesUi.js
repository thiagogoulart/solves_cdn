/**
@Author Thiago Gonçalves da Silva Goulart (SOLVES SOlUÇÕES EM SOFTWARE)
* 11/04/2019.)
**/
function SolvesUi() {
  this.solvesPluginName = 'SolvesUi';
  this.versionId = 1;
  this.version = '1.0';

  this.init = function(){
    $.Solves.addSolvesPlugin(this.solvesPluginName, $.SolvesUi);
    //TODO validações de dependencias
    $('.usuario_logado_show').hide();
  };
  this.destroy = function(){
    this.clearData();
  };
  this.showHideDiv = function(divId, show) {
    if($.Solves.isNotEmpty(divId) && $('#' + divId).length>0){
      var div = document.querySelector('#' + divId);
      if (show) {
        div.style = 'display: visible';
      } else {
        div.style = 'display: none';
      }
    }
  }
  this.doFxShowingClass = function(elmClass){
    $("."+elmClass).fadeIn(1000, function() {});
  }
  this.doFxShowing = function(elmId){
    $("#"+elmId).fadeIn(1000, function() {});
  }
  this.doFxHidingClass = function(elmClass){ 
    $("."+elmClass).fadeOut(1000, function() {});
  }
  this.doFxHiding = function(elmId){ 
    $("#"+elmId).fadeOut(1000, function() {});
  }
  this.showDialogMessage = function(msg){
    $.notify({message: msg},{type: 'info'});
  }
  this.showDialogError = function(msg){
    $.notify({message: msg},{offset: 20, spacing: 10, z_index: 1031, delay: 5000, timer: 1000,type: 'danger'});
  }
  this.showDialogSuccess = function(msg){
    $.notify({message: msg},{type: 'success'});
  }
  this.showDialogWarning = function(msg){
    $.notify({message: msg},{type: 'warning'});
  }
  this.showDialogMessageWithTitle = function(title, msg){
    $.notify({title:'<b>'+title+'</b><br/>',message: msg},{type: 'info'});
  }
  this.showDialogErrorWithTitle = function(title, msg){
    $.notify({title:'<b>'+title+'</b><br/>',message: msg},{offset: 20, spacing: 10, z_index: 1031, delay: 5000, timer: 1000,type: 'danger'});
  }
  this.showDialogSuccessWithTitle = function(title, msg){
    $.notify({title:'<b>'+title+'</b><br/>',message: msg},{type: 'success'});
  }
  this.showDialogWarningWithTitle = function(title, msg){
    $.notify({title:'<b>'+title+'</b><br/>',message: msg},{type: 'warning'});
  }
  this.loaded = function(force) {
      if($.Solves.submiting || $.Solves.isTrue(force)){
        $.Solves.submiting = false;
        if($.Solves.isLogado()){ this.preencheHtmlUsuarioLogado();}
      }
      this.closeLoading(force);
  }
  this.loading = function(showDialogProcessando) {
      if ( $.Solves.submiting) {
              if(showDialogProcessando){
                  this.showDialogMessage("Processando, aguarde!");
              }
              return true;
      } else {
              $.Solves.submiting = true;
              this.showLoading();
              return false;
      }
  }
  this.showLoading = function(){
    if($('#overlay').length==0){
      $("body").append('<div class="overlay" id="overlay" style="display:none;"></div>');
    }
    if($('#overlay_loading').length==0){
      $("body").append('<div id="overlay_loading" style="display:none;"><div class="sk-cube-grid"><div class="sk-cube sk-cube1"></div><div class="sk-cube sk-cube2"></div><div class="sk-cube sk-cube3"></div><div class="sk-cube sk-cube4"></div><div class="sk-cube sk-cube5"></div><div class="sk-cube sk-cube6"></div><div class="sk-cube sk-cube7"></div><div class="sk-cube sk-cube8"></div><div class="sk-cube sk-cube9"></div></div></div>');
    }
    if($('#overlay_loaded').length==0){
      $("body").append('<div id="overlay_loaded" style="display:none;"></div>');
    }
      $('#overlay').fadeIn(0,function(){
              $('#overlay_loading').show();
              $('#overlay_loading').fadeIn();
              $('#overlay_loaded').html('.');
      });
  }
  this.closeLoading = function(force){
    if($.Solves.isTrue(force) || !$.Solves.isTrue($('#overlay_loaded').html())){
      $('#overlay').fadeOut('fast');
      $('#overlay_loading').hide();
      $('#overlay_loaded').html('true');
    }
    document.getElementById("overlay_loading").style.display = "none";
  }

  this.clearModalSmall = function(){
      $('#modalSmall_title').html('');
      $('#modalSmall_body').html('');
      $('#modalSmall_footer').html('');  
  }
  this.showModalSmall = function(title, htmlBody, htmlFooter){
    if($('#modalSmall').length==0){
      $("body").append('<div id="modalSmall" class="modal fade" style="display: none;" aria-hidden="true">'+
          '<div class="modal-dialog modal-sm" role="document">'+
            '<div class="modal-content bd-0 tx-14">'+
              '<div class="modal-header pd-x-20">'+
               ' <h6 class="tx-14 mg-b-0 tx-uppercase tx-inverse tx-bold" id="modalSmall_title"></h6>'+
               ' <button type="button" class="close" data-dismiss="modal" aria-label="Fechar">'+
               '   <span aria-hidden="true">×</span>'+
               ' </button>'+
              '</div>'+
              '<div class="modal-body pd-20" id="modalSmall_body"></div>'+
              '<div class="modal-footer justify-content-center" id="modalSmall_footer"></div>'+
            '</div>'+
          '</div><!-- modal-dialog -->'+
       ' </div>');
    }
    this.clearModalSmall();
    $('#modalSmall_title').html(title);
    $('#modalSmall_body').html(htmlBody);
    $('#modalSmall_footer').html(htmlFooter);
    $('#modalSmall').modal('show');
    $('#modalSmall').on('shown.bs.modal ', function(event) {
        $(this).css('display', 'flex');
    });
  }
  this.closeModalSmall = function(){
      $('#modalSmall').modal('hide');
      this.clearModalSmall();
  }
  this.abrePaginaInicial = function(){
    if(isLogado()){
       var urlAtual = window.location.href.replace($.Solves.siteUrl+'/','').replace($.Solves.siteUrl,'');
       if(urlAtual!=null && urlAtual.length>0 && urlAtual!='page' && urlAtual!='/'){
          abrePagina(urlAtual);
       }else{
          abrePagina('home');
        }
    }else{
       abrePagina('index');
    }
  }
  this.verificaLogadoAbreDireto = function(isApp, modulo){
    if(isLogado()){
      window.location.href = '/home';
    }else{
      doFxHiding('public-loading');
      doFxShowing('public-wrapper');
    }
  }
  this.abrePagina = function(page){
    loading(false);
    if(!isLogado()){
    //   page = 'login';
    }
    if(page.endsWith('#')){
      page = page.replace('#','');
    }
    //refreshUrlBrowser('/'+page, null);
    $.Solves.url = page;
    window.location.href = $.Solves.siteUrl+'/'+page;
  }
  this.ajustaDadosExibicaoPagina = function(titulo, subtitulo, id_simples){
    $.Solves.telaAtualId = id_simples;
    $.Solves.telaAtualTitulo = titulo;
    $.Solves.telaAtualSubtitulo = subtitulo;
    if($.Solves.isNotEmpty($.Solves.telaAtualTitulo) && $("#page_title").length>0){
      $("#page_title").html($.Solves.telaAtualTitulo);
    }
    if($.Solves.isNotEmpty($.Solves.telaAtualSubtitulo) && $("#page_subtitle").length>0){
      $("#page_subtitle").html($.Solves.telaAtualSubtitulo);
    }
    if($('#page_content_'+$.Solves.telaAtualId+'_form').length>0){
      prepareSelect2Ajax('page_content_'+$.Solves.telaAtualId+'_form');
    }
    if($('#page_breadcrumb').length>0){
      $("#page_breadcrumb").html('<a class="breadcrumb-item" href="/">Início</a>'+
          '<span class="breadcrumb-item active">'+titulo+'</span>');
    }
  }
  this.ajustaExibicaoPagina = function(titulo, subtitulo, id_simples){
    $.Solves.telaAtualId = id_simples;
    $.Solves.telaAtualTitulo = titulo;
    $.Solves.telaAtualSubtitulo = subtitulo;
    $('.page_content').hide();
    if(isLogado()){ 
      exibeTitulo();
      doIndex(id_simples);  
      $("#page_breadcrumb").html('<a class="breadcrumb-item" href="/home">Início</a>'+
          '<span class="breadcrumb-item active">'+titulo+'</span>');
    }else{
      logoff();
    }
  }
  this.exibeTitulo = function(){
    $('#page_content_'+$.Solves.telaAtualId).show();
    $('#sl-page-title').show();
      $("#page_title").html($.Solves.telaAtualTitulo);
      if($.Solves.isNotEmpty($.Solves.telaAtualSubtitulo)){
        $("#page_subtitle").html($.Solves.telaAtualSubtitulo);
      }
    prepareSelect2Ajax('page_content_'+$.Solves.telaAtualId+'_form');
  }
  this.doNovo = function(id_simples){
    $('.page_content_'+id_simples).hide();
    $('#page_content_'+id_simples+'_form').show(); 
      $("#page_breadcrumb").html('<a class="breadcrumb-item" href="/home">Início</a>'+
          '<a class="breadcrumb-item" href="/'+id_simples+'">'+$.Solves.telaAtualTitulo+'</a>'+
          '<span class="breadcrumb-item active">Novo</span>');
    prepareSelect2Ajax('page_content_'+id_simples+'_form');
  }
  this.doIndex = function(id_simples){
    $('.sl-menu-link').removeClass('active');
    $('.page_content_'+id_simples).hide();
    $('.sl-menu-link[href*="'+id_simples+'"]').addClass('active');
    $('.nav-link[href*="'+id_simples+'"]').addClass('active');
    this.preencheHtmlUsuarioLogado();
    $('#page_content_'+id_simples+'_index').show();
  }
  this.doFormCancelar = function(id_simples){
    if($.Solves.isNotEmpty(id_simples)){
      if(id_simples[0]=='/'){
        id_simples = id_simples.substring(1,id_simples.length);
      }
      abrePagina(id_simples);
    }
  }
  this.preencheHtmlUsuarioLogado = function(){
    $.Solves.getPerfilLogado();
    if($.Solves.getPerfilLogado()==null){
      $('.usuario_logado_show').hide();
      $('.usuario_logado_hide').show(); 
      $('.usuario_logado_alerta_email_nao_confirmado').hide();
      $('.usuario_logado_nome').html('');
      $('.usuario_logado_email').html('');
      $('.usuario_logado_avatar').attr('src', '');
      $('.usuario_logado_avatar').attr('alt', '');
      $('.usuario_logado_avatar').attr('title', '');
      $('.usuario_logado_data_nascimento').html('');
      $('.usuario_logado_idade').html('');
    }else{ 
      $('.usuario_logado_show').show();
      $('.usuario_logado_hide').hide();    
      if(($.Solves.getPerfilLogado().email_confirmado==undefined || !$.Solves.isTrue($.Solves.getPerfilLogado().email_confirmado))){  
        if($('.usuario_logado_alerta_email_nao_confirmado').length>0){
          $('.usuario_logado_alerta_email_nao_confirmado').show();
         // this.addNotificationToTopPanel(linkUrl, imgUrl, title, txt, dataHora);
        }
      }
      $('.usuario_logado_nome').html($.Solves.getPerfilLogado().nome);
      $('.usuario_logado_email').html($.Solves.getPerfilLogado().email);
      $('.usuario_logado_avatar').attr('src', $.Solves.getPerfilLogado().avatar);
      $('.usuario_logado_avatar').attr('alt', $.Solves.getPerfilLogado().nome);
      $('.usuario_logado_avatar').attr('title', $.Solves.getPerfilLogado().nome);
      $('.usuario_logado_data_nascimento').html($.Solves.getPerfilLogado().data_nascimento_label);
      $('.usuario_logado_idade').html($.Solves.getPerfilLogado().idade);
    }
  }
  this.addNotificationToTopPanel = function(linkUrl, imgUrl, title, txt, dataHora){
     $('#notifications_list').prepend('<a href="'+($.Solves.isNotEmpty(linkUrl) ? linkUrl : '#')+'" class="media-list-link read"><div class="media pd-x-20 pd-y-15">'+
       ($.Solves.isNotEmpty(imgUrl) ? '<img src="'+imgUrl+'" class="wd-40 rounded-circle" alt="'+title+'">' : '')+
        '<div class="media-body"><p class="tx-13 mg-b-0 tx-gray-700">'+txt+'</p>'+
        ($.Solves.isNotEmpty(dataHora) ? '<span class="tx-12">'+dataHora+'</span>' : '')+
        '</div></div></a>');
  }
  this.doMasks = function(){
    $('.field-date').mask('99/99/9999');
    $('.field-data').mask('99/99/9999').val($.Solves.getDataAtualFormatada());
    $('.field-hora').mask('99:99');
    $('.field-fone').mask('(99) 9999-9999?9');
    $('.field-rg').mask('999.999.999');
    $('.field-cpf').mask('999.999.999-99');
    $('.field-cnpj').mask('99.999.999/9999-99');
    $('.field-cep').mask('99999-999');  
    $(".field-double").maskMoney({decimal:",",thousands:"",precision:2});
    $('.field-dolar').maskMoney({decimal:",",thousands:" ",precision:3});
    $('.field-moeda').maskMoney({symbol:"R$",decimal:",",thousands:"."});
    $('.field-euro').maskMoney({symbol:"Euro",decimal:",",thousands:" "}); 
  }
  this.getHtmlShareButtons = function(label, preText, titulo, completeUrl, img){
    var linkMsg = ($.Solves.isNotEmpty(preText)?preText : ('Olha%20o%20que%20eu%20vi%20no%20site%20'+$.Solves.siteTitulo+':%20'))+titulo;
    var linkMsgComUrl = linkMsg+'%20'+completeUrl+'';
    return '<div class="share_social_box row"><div class="col-sm-12">'+
            '<span class="share_social_box_title">'+($.Solves.isNotEmpty(label)?label:'Compartilhar: ')+'</span></div><div class="col-sm-12">'+
        '<a href="https://api.whatsapp.com/send?text='+linkMsgComUrl+'" target="_blank" title="Compartilhar no Whatsapp">'+
            '<i class="fab fa-lg fa-whatsapp"></i>'+
        '</a>'+
        '<a href="https://www.facebook.com/sharer/sharer.php?u='+completeUrl+'" target="_blank" title="Compartilhar no Facebook">'+
            '<i class="fab fa-lg fa-facebook"></i>'+
        '</a>'+
        '<a href="http://twitter.com/share?text='+linkMsg+'&amp;url='+completeUrl+'" target="_blank" data-role="shareLink" title="Compartilhar no Twitter">'+
            '<i class="fab fa-lg fa-twitter"></i>'+
        '</a>'+
        '<a href="http://pinterest.com/pin/create/button/?url='+completeUrl+($.Solves.isNotEmpty(img)?'&amp;media='+img:'')+'" target="_blank" title="Compartilhar no Pinterest">'+
            '<i class="fab fa-lg fa-pinterest"></i>'+
        '<a href="http://www.linkedin.com/shareArticle?mini=true&amp;url='+completeUrl+'" target="_blank" title="Compartilhar no LinkedIn">'+
            '<i class="fab fa-lg fa-linkedin"></i>'+
        '</a>'+
        '</div></div>';
}
  this.getAvatarImgHtml = function(avatar, title, tipo){
    var addClass = ($.Solves.isNotEmpty(tipo) ? 'avatar_img_'+tipo:''); 
    return this.getImgHtml(avatar, title, 'avatar_img '+addClass); 
  }
  this.getImgHtml = function(src, title, clsses){
    var addClass = ($.Solves.isNotEmpty(clsses) ? ' '+clsses:'');  
    return '<img src="'+src+'" alt="'+title+'" class="img-responsive'+addClass+'">';
  }
  this.getHtmlListItem = function(link, avatar, altTitle, titulo, avaliacao, summary, aditionalClasses, linkAttrs){
    var attrs = '';
    if ($.Solves.isNotEmpty(linkAttrs)){
      for(var i in linkAttrs){
        var linkAttr = linkAttrs[i];
        attrs += ' '+i+'="'+linkAttr+'"';
      }
    }
    return '<a '+($.Solves.isNotEmpty(link) ?'href="'+link+'"':'onclick="return false;"')+ 
      ' class="list-group-item list-group-item-action media '+($.Solves.isNotEmpty(aditionalClasses)?aditionalClasses:'')+'" '+attrs+'>'+
              this.getAvatarImgHtml(avatar, altTitle, null)+
              '<div class="media-body">'+
                '<div class="msg-top">'+
                  '<span>'+titulo+'</span>'+
                  ($.Solves.isNotEmpty(avaliacao)?
                  '<span class="avaliacao">'+
                    '<i class="fas fa-star"></i>'+avaliacao+''+
                  '</span>': '')+
                '</div>'+
                '<p class="msg-summary">'+summary+'</p>'+
              '</div><!-- media-body -->'+
            '</a><!-- list-group-item -->';
  }
  this.ajustarMetaTags = function(completeUrl, titulo, descr, img){
    $('link[rel="canonical"]').attr('href', completeUrl);
    $('meta[property="og:url"]').attr('content', completeUrl);
    if($.Solves.isNotEmpty(titulo) && titulo!=$.Solves.siteTitulo){ 
      $('title').html($.Solves.siteTitulo+' - '+titulo);
      $('meta[name="twitter:title"]').attr('content', $.Solves.siteTitulo+' - '+titulo);
      $('meta[property="og:title"]').attr('content', $.Solves.siteTitulo+' - '+titulo);
    }
    if($.Solves.isNotEmpty(img)){
      $('meta[property="og:image"]').attr('content', img);
      $('meta[name="twitter:image"]').attr('content', img);
    }
    if($.Solves.isNotEmpty(descr)){
      $('meta[name="description"]').attr('content', descr+$('meta[name=description]').attr('content'));
      $('meta[name="twitter:description"]').attr('content', descr+$('meta[name=description]').attr('content'));
      $('meta[property="og:description"]').attr('content', descr+$('meta[name=description]').attr('content'));
    }
  };
}
$.SolvesUi = new SolvesUi();
$.SolvesUi.init();