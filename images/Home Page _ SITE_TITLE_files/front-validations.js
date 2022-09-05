"use strict";
//setLanguage
function setLanguage(language_slug){
    jQuery.ajax({
        type : "POST",
        dataType : "html",
        url : BASEURL+'/backoffice/lang_loader/setLanguage',
        data : {'language_slug':language_slug},
        beforeSend: function(){
            $('#quotes-main-loader').show();
        },
        success: function(response) {
            location.reload();
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            alert(errorThrown);
        }
    });
}
//logout
function logout(){
  jQuery.ajax({
        type : "POST",
        url : BASEURL+'home/logout',
        beforeSend: function(){
            $('#quotes-main-loader').show();
        },
        success: function(response) {
            location.reload();
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            alert(errorThrown);
        }
    });
}
// click on notification icon
$(".notification-btn").on("click", function(e){
  jQuery.ajax({
    type : "POST",
    dataType : "html",
    url : BASEURL+'home/unreadNotifications',
    success: function(response) {
      //$('.notification_count').html(0);
    },
    error: function(XMLHttpRequest, textStatus, errorThrown) {
        alert(errorThrown);
    }
  });
});
// submit forgot password form
$("#form_front_forgotpass").on("submit", function(event) { 
  event.preventDefault();
  $(this).validate();
  if($(this).valid()){
    jQuery.ajax({
      type : "POST",
      dataType :"json",
      url : BASEURL+'home/forgot_password',
      data : {'email_forgot':$('#email_forgot').val(), 'forgot_submit_page':$('#forgot_submit_page').val() },
      beforeSend: function(){
          $('#quotes-main-loader').show();
      },
      success: function(response) { 
        $('#forgot_error').hide();
        $('#forgot_success').hide();
        $('#quotes-main-loader').hide();
        if (response) {
          if (response.forgot_error != '') { 
            $('#forgot_error').html(response.forgot_error);
            $('#forgot_success').hide();
            $('#forgot_error').show();
          }
          if (response.forgot_success != '') { 
            $('#forgot_success').html(response.forgot_success);
            $('#forgot_error').hide();
            $('#forgot_success').show();
            $('#forgot_password_section').hide();
          }
        }
      },
      error: function(XMLHttpRequest, textStatus, errorThrown) {           
        alert(errorThrown);
      }
    });
  }
});
// submit forgot password form hidden
$('#forgot-pass-modal').on('hidden.bs.modal', function (e) {
  $(this).find("input[type=number]").val('').end();
  $('#form_front_forgotpass').validate().resetForm();
  $('#forgot_success').text('');
  $('#forgot_error').text('');
  $('#forgot_success').hide();
  $('#forgot_error').hide();
  $('#forgot_password_section').show();
  $('#email_forgot').val('');
});

// menu filter function
function menuFilter(content_id,value,food_type='no',availability='no')
{  
  var food = '';
  var price = '';
  //New code add for availability :: Start
  var availabilityval = '';
  if(availability=='yes')
  {
    availabilityval = value;
  }
  else
  {
    if ($('input[name="filter_availibility"]:checked').val())
    {
      availabilityval = $('input[name="filter_availibility"]:checked').val();
    }        
  }
  if(availabilityval=='all')
  {
    availabilityval = '';
  } 
  //New code add for availability :: End
  
  var searchDish = $('#search_dish').val();
  if(food_type=='yes')
  {
    food = value;
  }
  else
  {
    if ($('input[name="filter_food"]:checked').val() == "all") {
      food = "";
    } 
    else{
      food = $('input[name="filter_food"]:checked').val();
    }    
  }

  if ($('input[name="filter_price"]:checked').val() == "filter_high_price") {
      price = "high";
  }
  if ($('input[name="filter_price"]:checked').val() == "filter_low_price") {
    price = "low";
  }

  jQuery.ajax({
    type : "POST",
    url : BASEURL+'restaurant/ajax_restaurant_details',
    data : {"content_id":content_id,"food":food,"availability":availabilityval,"price":price,"searchDish":$.trim(searchDish)},
    beforeSend: function(){
        $('#quotes-main-loader').show();
    },
    success: function(response) { 
      $('#quotes-main-loader').hide();
      $('#res_detail_content').html(response);
      $('#search_dish').val($.trim(searchDish))
    },
    error: function(XMLHttpRequest, textStatus, errorThrown) {
      alert(errorThrown);
    }
    });
}
// decrease the menu quantity
function minusQuantity(restaurant_id,menu_id,cart_key){
  customItemCount(menu_id,restaurant_id,'minus',cart_key);
}
// increase the menu quantity
function plusQuantity(restaurant_id,menu_id,cart_key){
  customItemCount(menu_id,restaurant_id,'plus',cart_key);
}
// custom item count
function customItemCount(entity_id,restaurant_id,action,cart_key,recipe_page){
  jQuery.ajax({
    type : "POST",
    dataType : "json",
    url : BASEURL+'cart/customItemCount',
    data : {"entity_id":entity_id,"restaurant_id":restaurant_id,"action":action,"cart_key":cart_key,'is_main_cart':'no'},
    beforeSend: function(){
        $('#quotes-main-loader').show();
    },
    success: function(response) {
      $('#your_cart').html(response.cart);
      if (response.added == 0) {
        $('.addtocart-'+entity_id).html(ADD);
        $('.addtocart-'+entity_id).removeClass('added');
        $('.addtocart-'+entity_id).addClass('add');
      }
      if (recipe_page=='recipe'){
            window.location.replace(BASEURL+'cart');
      }
      $('#quotes-main-loader').hide();
    },
    error: function(XMLHttpRequest, textStatus, errorThrown) {
      alert(errorThrown);
    }
    });
}

function EditcustomItemCount(customQuantity1,entity_id,restaurant_id,cart_key){
  if(customQuantity1!='')
  {
    var customQuantity=(customQuantity1=='0')?'1':customQuantity1;
    jQuery.ajax({
    type : "POST",
    dataType : "json",
    url : BASEURL+'cart/customItemCount',
    data : {"customQuantity":customQuantity,"entity_id":entity_id,"restaurant_id":restaurant_id,"cart_key":cart_key,'is_main_cart':'no'},
    beforeSend: function(){
        $('#quotes-main-loader').show();
    },
    success: function(response) {
      $('#your_cart').html(response.cart);
      if (response.added == 0) {
        $('.addtocart-'+entity_id).html(ADD);
        $('.addtocart-'+entity_id).removeClass('added');
        $('.addtocart-'+entity_id).addClass('add');

      }
      //location.reload(true);
      $('#quotes-main-loader').hide();
      $( "#QtyNumberval" ).focus();
    },
    error: function(XMLHttpRequest, textStatus, errorThrown) {
      alert(errorThrown);
    }
    });
  }  
}
// check cart restaurant before adding menu item
function checkCartRestaurant(entity_id,restaurant_id,is_addon,item_id,check_reload='') {
  jQuery.ajax({
    type : "POST",
    url : BASEURL+'cart/checkCartRestaurant',
    data : {"restaurant_id":restaurant_id},
    beforeSend: function(){
        $('#quotes-main-loader').show();
    },
    success: function(response) {
      $('#quotes-main-loader').hide();
      if (response == 0) {
        // another restaurant
        $('#rest_entity_id').val(entity_id);
        $('#rest_restaurant_id').val(restaurant_id);
        $('#rest_is_addon').val(is_addon);
        $('#item_id').val(item_id);
        $('#anotherRestModal').modal('show');
      }
      if (response == 1) {
        // same restaurant
        if (is_addon == '') {
          AddToCart(entity_id,restaurant_id,item_id,check_reload);
        }
        else
        {
          checkMenuItem(entity_id,restaurant_id,item_id,check_reload);
        }
      }
    },
    error: function(XMLHttpRequest, textStatus, errorThrown) {
      alert(errorThrown);
    }
    });
}
// confirm to add menu item
function ConfirmCartRestaurant(recipe_page){
  var entity_id = $('#rest_entity_id').val();
  var restaurant_id = $('#rest_restaurant_id').val();
  var is_addon = $('#rest_is_addon').val();
  var item_id = $('#item_id').val();
  var restaurant = $('input[name="addNewRestaurant"]:checked').val();
  $('#anotherRestModal').modal('hide');
  if (restaurant == "discardOld") {
    jQuery.ajax({
      type : "POST",
      url : BASEURL+'cart/emptyCart',
      data : {"entity_id":entity_id,'restaurant_id':restaurant_id},
      success: function(response) { 
        if (is_addon == '') {
          AddToCart(entity_id,restaurant_id,item_id,recipe_page);
        }
        else
        {
          $('.addtocart-'+entity_id).click();
          checkMenuItem(entity_id,restaurant_id,item_id,recipe_page);
        }
      },
      error: function(XMLHttpRequest, textStatus, errorThrown) {
        alert(errorThrown);
      }
      });
  }
  return false;
}
// add to cart
function AddToCart(entity_id,restaurant_id,item_id,recipe_page){  
  var action;
  if ($("#addpackage-"+entity_id).hasClass('inpackage')) {
    action = "remove";
  }
  else
  {
    action = "add";
  }

  jQuery.ajax({
    type : "POST",
    url : BASEURL+'cart/addToCart',
    data : {"menu_item_id":entity_id,'restaurant_id':restaurant_id},
    beforeSend: function(){
        $('#quotes-main-loader').show();
    },
    success: function(response) { 
      if (recipe_page=='recipe'){
            window.location.replace(BASEURL+'cart');
      }else if (recipe_page=='checkout'){
          //Added to load checkout cart item
          checkoutItem_reload(entity_id,restaurant_id);
      } else if (recipe_page=='checkout_as_guest'){
          //window.location.replace(BASEURL+'checkout/checkout_as_guest');
          //Added to load checkout cart item
          checkoutItem_reload(entity_id,restaurant_id);
      }
      $('#quotes-main-loader').hide();
      $('#menuDetailModal').modal('hide');
      $('#your_cart').html(response);
      $('.'+item_id).html(ADDED);
      $('.'+item_id).removeClass('add');
      $('.'+item_id).addClass('added');
    },
    error: function(XMLHttpRequest, textStatus, errorThrown) {
      alert(errorThrown);
    }
    });
  return false;
}
//Code for reload the item detail on checkout page :: Start
function checkoutItem_reload(entity_id,restaurant_id)
{
  jQuery.ajax({
    type : "POST",
    dataType : 'json',
    url : BASEURL+'checkout/checkoutItem_reload' ,
    data : {"entity_id":entity_id,"restaurant_id":restaurant_id},
    beforeSend: function(){
        $('#quotes-main-loader').show();
    },
    success: function(response) {
      $('#quotes-main-loader').hide();       
      $('#ajax_your_items').html(response.ajax_your_items);      
      $('#ajax_your_suggestion').html(response.ajax_your_suggestion);
      $('#ajax_order_summary').html(response.ajax_order_summary);
      $('#subtotal').val(response.cart_total);
      if($("input[name='choose_order']:checked").val() == 'delivery') {
        if(($("#is_guest_checkout").val() == 'yes' && $(".add_new_address").val() == 'add_new_address') || $("input[name='add_new_address']:checked").val() == 'add_new_address'){
          if($("#add_address").val() != '' && $("#add_latitude").val() != '' && $("#add_longitude").val() != '') {
            getDeliveryCharges($("#add_latitude").val(),$("#add_longitude").val(),'get',response.cart_total);
          }
        }
        else if($("input[name='add_new_address']:checked").val() == 'add_your_address' && $('#your_address').val() != ''){
          getAddLatLong($('#your_address').val(),response.cart_total)
        }
      }
    },
    error: function(XMLHttpRequest, textStatus, errorThrown) {
      alert(errorThrown);
    }
    });
}
//Code for reload the item detail on checkout page :: End

// check menu item availability
function checkMenuItem(entity_id,restaurant_id,item_id,recipe_page){
  // check the item in cart if it's already added
  jQuery.ajax({
    type : "POST",
    url : BASEURL+'cart/checkMenuItem' ,
    data : {"entity_id":entity_id,"restaurant_id":restaurant_id,'reload_page':recipe_page},
    beforeSend: function(){
        $('#quotes-main-loader').show();
    },
    success: function(response) {
      $('#quotes-main-loader').hide();
      if (response == 1) {
        $('#con_entity_id').val(entity_id);
        $('#con_restaurant_id').val(restaurant_id);
        $('#con_item_id').val(item_id);
        $('#myconfirmModal').modal('show');
      }
      else
      {
        customMenu(entity_id,restaurant_id,item_id,recipe_page);
      }
    },
    error: function(XMLHttpRequest, textStatus, errorThrown) {
      alert(errorThrown);
    }
    });
}
// confirm to add to cart
function ConfirmCartAdd(){
  var entity_id = $('#con_entity_id').val();
  var restaurant_id = $('#con_restaurant_id').val();
  var item_id = $('#con_item_id').val();
  var cart = $('input[name="addedToCart"]:checked').val();
  $('#myconfirmModal').modal('hide');
  if (cart == "increaseitem") {
    customItemCount(entity_id,restaurant_id,'plus','');
  }
  else
  {
    customMenu(entity_id,restaurant_id,item_id);
  }
  return false;
}
// custom menu page
function customMenu(entity_id,restaurant_id,item_id,recipe_page){
  jQuery.ajax({
    type : "POST",
    url : BASEURL+'restaurant/getCustomAddOns',
    data : {"entity_id":entity_id,"restaurant_id":restaurant_id,'reload_page':recipe_page},
    beforeSend: function(){
        $('#quotes-main-loader').show();
    },
    success: function(response) {
      $('#myModal').html(response);
      $('#myModal').modal('show');
      if (recipe_page=='recipe'){
            window.location.replace(BASEURL+'cart');
      }
      $('#quotes-main-loader').hide();
    },
    error: function(XMLHttpRequest, textStatus, errorThrown) {
      alert(errorThrown);
    }
    });
}

$("#search_dish").keyup(function() {
  var restaurant_id = $('#srestaurant_id').val();
  searchMenuDishes(restaurant_id);
});

// search the users dishes
function searchMenuDishes(restaurant_id) {
  var searchDish = $('#search_dish').val();
  var food = '';
  var price = '';

  //New code add for availability :: Start
  var availabilityval = '';  
  if ($('input[name="filter_availibility"]:checked').val())
  {
    availabilityval = $('input[name="filter_availibility"]:checked').val();
  }
  if(availabilityval=='all')
  {
    availabilityval = '';
  } 
  //New code add for availability :: End

  if ($('input[name="filter_food"]:checked').val() == "filter_veg") {
    food = "veg";
  }
  if ($('input[name="filter_food"]:checked').val() == "filter_non_veg") {
    food = "non_veg";
  }
  if ($('input[name="filter_price"]:checked').val() == "filter_high_price") {
    price = "high";
  }
  if ($('input[name="filter_price"]:checked').val() == "filter_low_price") {
    price = "low";
  }
  if ($('input[name="filter_food"]:checked').val() == "all") {
    food = "";
  } 
  else{
    food = $('input[name="filter_food"]:checked').val();
  }
  jQuery.ajax({
    type : "POST",
    dataType :"html",
    url : BASEURL+'restaurant/getResturantsDish',
    data : {'restaurant_id':restaurant_id,'searchDish':$.trim(searchDish),"food":food,"price":price,"availability":availabilityval},
    beforeSend: function(){
        // $('#quotes-main-loader').show();
    },
    success: function(response) {
      //$('#details_content').html(response);
      $('#res_detail_content').html(response);
      // $('#quotes-main-loader').hide();
      // $('#search_dish').val($.trim(searchDish));
    },
    error: function(XMLHttpRequest, textStatus, errorThrown) {
      alert(errorThrown);
    }
  });
}
// get address from lat long
function getAddress(latitude,longitude,page){
  jQuery.ajax({
    type : "POST",
    dataType :"json",
    url : BASEURL+'home/getUserAddress',
    data : {'latitude':latitude,'longitude':longitude,'page':page},
    beforeSend: function(){
        $('#quotes-main-loader').show();
    },
    success: function(response) { 
      if (page == 'restaurant_details') {
        $('#delivery_address').val(response);
      }
      else if (page == 'my_profile') {
        //$('#address_field').val(response);
      }
      else if (page == 'checkout') {
        $('#add_latitude').val(latitude);
        $('#add_longitude').val(longitude);
        $('#add_address').val(response);
        var cart_total=$('#subtotal').val();
        getDeliveryCharges(latitude,longitude,'get',cart_total);
      }
      else
      {
        $('#address').val(response);
      }
      $('#quotes-main-loader').hide();
    },
    error: function(XMLHttpRequest, textStatus, errorThrown) {
      alert(errorThrown);
    }
    });
}
// search restaurant menu
function menuSearch(category_id){
  if ($('#checkbox-option-'+category_id+'').is(':checked')) {
    $('.check-menu').prop("checked", false);
    $('#checkbox-option-'+category_id+'').prop("checked", true);
    if ( $(window).width() < 1199) { //Set here window width accourding to your need

      jQuery('html, body').animate({
        scrollTop: $('#category-'+category_id+'').offset().top - 120
      }, 500);
      
  }
else{
    jQuery('html, body').animate({
      scrollTop: $('#category-'+category_id+'').offset().top - 150
      }, 500);
}
  }
}
function scrollToPopularItems(){
  if ($('#checkbox-option-0').is(':checked')) {
    $('.check-menu').prop("checked", false);
    $('#checkbox-option-0').prop("checked", true);
    $('html, body').animate({
          scrollTop: $('#popular_menu_item').offset().top - 150
      }, 2000);
  }
}
// autocomplete function
var autocomplete;
function initAutocomplete(id) {
    autocomplete = new google.maps.places.Autocomplete(
    document.getElementById(id), {
        fields: ["formatted_address", "geometry", "name"],
        types: ['address'] //'geocode','address','establishment','regions','cities'
    });
    autocomplete.setFields(['address_component']);
    autocomplete.addListener('place_changed', setAddress);
}
// place changed after auto complete
function setAddress(){
    var place = autocomplete.getPlace();
    //console.log(place.geometry.location.lat());
    var geocoder = new google.maps.Geocoder();
    var address = place.formatted_address;    
    var cart_total = $('#subtotal').val();
    geocoder.geocode( { 'address': address}, function(results, status) {
    //console.log(results[0].geometry.location.lat())
    if (status == google.maps.GeocoderStatus.OK) {

      if(current_pagejs == 'OrderFood'){
        $('#distance_filter').show();
        $('#latitude').val(results[0].geometry.location.lat());
        $('#longitude').val(results[0].geometry.location.lng());
         getFavouriteResturants('');
      }else{
        //get delivery charges
        getDeliveryCharges(results[0].geometry.location.lat(),results[0].geometry.location.lng(),"get",cart_total);
        $('#add_latitude').val(results[0].geometry.location.lat());
        $('#add_longitude').val(results[0].geometry.location.lng());
      }
    } 
    });
}

//get restaurant location function 
function geolocate(page) {
  //initAutocomplete('address_field');
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
    var geolocation = {
      lat: position.coords.latitude,
      lng: position.coords.longitude
    };
    var circle = new google.maps.Circle({
      center: geolocation, radius: position.coords.accuracy
    });
    autocomplete.setBounds(circle.getBounds());
    if (page == "order_food" || current_pagejs == 'OrderFood') {
      $('#latitude').val(position.coords.latitude); 
      $('#longitude').val(position.coords.longitude); 
    }
    });
  }
}
// get location for every page from id
function getLocation(page) {
  if (navigator.geolocation) {
    if (page == 'restaurant_details') {
      navigator.geolocation.getCurrentPosition(showPosition,locationFail);
    }
    else if (page == 'home_page') {
      navigator.geolocation.getCurrentPosition(showPositionHome,locationFailHome);
    }
    else if (page == 'order_food') {
      navigator.geolocation.getCurrentPosition(showPositionFood,locationFailFood);
    }
    else if (page == 'my_profile') {
      navigator.geolocation.getCurrentPosition(showPositionProfile,locationFailProfile);
    }
    else if (page == 'checkout') {
      navigator.geolocation.getCurrentPosition(showPositionCheckout,locationFailCheckout);
    }
  }
}
function getSearchedLocation(searched_lat,searched_long,searched_address,page){
  if (page == "home_page") { 
    $('#address').val(searched_address);
    getAddress(searched_lat,searched_long,'');
    getPopularResturants(searched_lat,searched_long,'');
  }
  else if (page == "order_food") { 
    $('#distance_filter').show();
    $('#latitude').val(searched_lat); 
    $('#longitude').val(searched_long);  
    $('#address').val(searched_address);
    getAddress(searched_lat,searched_long,'');
    getFavouriteResturants('');
  }
  else if (page == "my_profile") {
    setMarker(searched_lat,searched_long);
  }
  else if (page == "checkout") { 
    $('#add_latitude').val(searched_lat); 
    $('#add_longitude').val(searched_long);  
    $('#add_address').val(searched_address);
    getAddress(searched_lat,searched_long,'checkout');
  }
}
// restaurant details functions
function showPosition(position) {
  getAddress(position.coords.latitude,position.coords.longitude,'restaurant_details');
}
function locationFail() {
  //getAddress(23.0751887,72.52568870000005,'restaurant_details');
}
// home page functions
function showPositionHome(position) { 
  getAddress(position.coords.latitude,position.coords.longitude,'');
  getPopularResturants(position.coords.latitude,position.coords.longitude,'');
}
function locationFailHome() {
  //getAddress(23.0751887,72.52568870000005,'');
  getPopularResturants('','','');
}
// js location function for order Food page
function showPositionFood(position) {
  $('#latitude').val(position.coords.latitude); 
  $('#longitude').val(position.coords.longitude); 
  getAddress(position.coords.latitude,position.coords.longitude,'');
    getFavouriteResturants('');
  $('#distance_filter').show();
}
function locationFailFood() {
  //$('#latitude').val(23.0751887); 
  //$('#longitude').val(72.52568870000005); 
  //getAddress(23.0751887,72.52568870000005,'');
  getFavouriteResturants('');
  $('#distance_filter').hide();
}
// my profile 
function showPositionProfile(position) {
    setMarker(position.coords.latitude,position.coords.longitude);
}
function locationFailProfile() {
    setMarker(23.0751887,72.52568870000005);
}
// home page js functions
function fillInAddress(page,err_msg,oktext) {  
  // Get the place details from the autocomplete object.
    var place = autocomplete.getPlace();
    var geocoder = new google.maps.Geocoder();
    var order_mode = $('#order_mode').val();
    var address = document.getElementById("address").value;
    geocoder.geocode( { 'address': address}, function(results, status) {
    if (status == google.maps.GeocoderStatus.OK) {
      if (page == "home_page") {
        getPopularResturants(results[0].geometry.location.lat(),results[0].geometry.location.lng(),'scroll');
      }
      else if (page == "order_food") {
        $('#distance_filter').show();
        $('#latitude').val(results[0].geometry.location.lat()); 
        $('#longitude').val(results[0].geometry.location.lng()); 
        getFavouriteResturants('scroll');
      }
      addLatLong(results[0].geometry.location.lat(),results[0].geometry.location.lng(),address);
    }else if(order_mode!=""){
      if (page == "home_page") {
        getPopularResturants("","",'scroll');
      }
      else if (page == "order_food") {
        getFavouriteResturants('scroll');
      }
    }else{
      var box = bootbox.alert({
        message: err_msg,
        buttons: {
            ok: {
                label: oktext,
            }
        }
      });
      setTimeout(function() {
        box.modal('hide');
      }, 10000);
    }
    });
}
// store the lat long in session
function addLatLong(lat,long,address){
  jQuery.ajax({
    type : "POST",
    dataType :"html",
    url : BASEURL+'home/addLatLong',
    data : {'lat':lat,'long':long,'address':address},
    success: function(response) {
      // console.log('addlatlongres',response);
    },
    error: function(XMLHttpRequest, textStatus, errorThrown) {           
      alert(errorThrown);
    }
  });
} 
// quick search menu items
function quickSearch(value){
  jQuery.ajax({
    type : "POST",
    dataType :"html",
    url : BASEURL+'home/quickCategorySearch',
    data : {'category_id':value},
    beforeSend: function(){
        $('#quotes-main-loader').show();
    },
    success: function(response) {
      $('#popular-restaurants').html(response);
      $('html, body').animate({
            scrollTop: $("#popular-restaurants").offset().top
        }, 2000);
      $('#quotes-main-loader').hide();
    },
    error: function(XMLHttpRequest, textStatus, errorThrown) {           
      alert(errorThrown);
    }
    });
}
// get the popular restaurants
function getPopularResturants(latitude,longitude,scroll){ 
  var order_mode = $('#order_mode').val();
  jQuery.ajax({
    type : "POST",
    dataType :"html",
    url : BASEURL+'home/getPopularResturants',
    data : {'latitude':latitude,'longitude':longitude,'order_mode':order_mode},
    beforeSend: function(){
        $('#quotes-main-loader').show();
    },
    success: function(response) {
      $('#popular-restaurants').html(response);
      if (scroll == "scroll") {
        $('html, body').animate({
              scrollTop: $("#popular-restaurants").offset().top
          }, 2000);
      }
      $('#quotes-main-loader').hide();

    },
    error: function(XMLHttpRequest, textStatus, errorThrown) {           
      //alert(errorThrown);
    }
    });
}
// get the favourite restaurants
function getFavouriteResturants(scroll){  
  var food_veg = ($('#food_veg').is(":checked"))?1:0;
  var food_non_veg = ($('#food_non_veg').is(":checked"))?1:0;
  var resdishes = $('#resdishes').val();
  var order_mode = $('#order_mode').val();
  var latitude = $('#latitude').val();
  var longitude = $('#longitude').val();
  var minimum_range = $('#minimum_range').val();
  var maximum_range = $('#maximum_range').val();
  var sort_by_ratings = ($('#restaurant_ratings').is(":checked"))?1:0;
  var page = page ? page : 0;
  var food_type = [];
    $('.food_typecls:checked').each(function(i, e) {
        food_type.push($(this).val());
    });
  var queries = {};
  $.each(document.location.search.substr(1).split('?'),function(c,q){
    var i = q.split('=');
    queries[i[0].toString()] = (i[0] != '') ? i[1].toString() : '';
  });
  var coupon_id = (typeof queries['coupon'] === 'undefined' ||  queries['coupon'] === '') ? '' : queries['coupon'];
  jQuery.ajax({
    type : "POST",
    dataType :"html",
    url: BASEURL+'restaurant/ajax_restaurants/'+page,
    data : {'latitude':latitude,'longitude':longitude,'resdishes':$.trim(resdishes),'page':page,'minimum_range':minimum_range,'maximum_range':maximum_range,'food_veg':food_veg,'food_non_veg':food_non_veg,'food_type': food_type.join(),'sort_by_ratings': sort_by_ratings,'order_mode':order_mode,'coupon_id':coupon_id},
    beforeSend: function(){
        $('#quotes-main-loader').show();
    },
    success: function(response) { 
      $('#order_from_restaurants').html(response);
      $('#resdishes').val($.trim(resdishes));
      if (scroll == "scroll") {
        $('html, body').animate({
              scrollTop: $("#order_from_restaurants").offset().top
          }, 2000);
      }
      $('#quotes-main-loader').hide();
    },
    error: function(XMLHttpRequest, textStatus, errorThrown) {           
      alert(errorThrown);
    }
    });
}
// recipe page
function searchRecipes(page,err_msg,oktext)
{
  var recipe = $('#recipe').val();
  if ($.trim(recipe) == '' || recipe == undefined) {
  {
    var box = bootbox.alert({
          message: err_msg,
          buttons: {
              ok: {
                  label: oktext,
              }
          }
        });
        setTimeout(function() {
          box.modal('hide');
        }, 10000);
    }
  }
  else
  {
      jQuery.ajax({
      type : "POST",
      dataType :"html",
      url : BASEURL+'recipe/ajax_recipies',
      data : {'recipe':recipe,'page':''},
      beforeSend: function(){
          $('#quotes-main-loader').show();
      },
      success: function(response) {
        $('#sort_recipies').html(response);
        $('#quotes-main-loader').hide();
      },
      error: function(XMLHttpRequest, textStatus, errorThrown) {           
        alert(errorThrown);
      }
      });        
  }
  
}
$('#recipe').keypress(function(event){
    var keycode = (event.keyCode ? event.keyCode : event.which);
    if(keycode == '13'){
        event.preventDefault();
    }
});
// my profile page js functions
function geocodePosition(pos) {
  geocoder.geocode({
    latLng: pos
  }, function(responses) {
    if (responses && responses.length > 0) {
      marker.formatted_address = responses[0].formatted_address;
    } else {
      marker.formatted_address = 'Cannot determine address at this location.';
    }
    infowindow.setContent(marker.formatted_address + "<br>coordinates: " + marker.getPosition().toUrlValue(6));
    infowindow.open(map, marker);
    $('#address_field').val(marker.formatted_address);
  });
}
function clearAddressArea(){
  $('#add_address').val('');
  // $('#add_address_area').val('');
  $('#address_field').val('');
}
// get the marker for the map
function getMarker(address_value){
    // console.log(address_value);
    initAutocomplete('address_field');
    var place = autocomplete.getPlace();
    var geocoder = new google.maps.Geocoder();
    if (address_value != '') {
        var address = address_value;
    }
    // else
    // {
    //     var address = document.getElementById("add_address_area").value;
    // }

    geocoder.geocode( { 'address': address}, function(results, status) {
        // $('#address_field').val(document.getElementById("add_address_area").value);
        if (status == google.maps.GeocoderStatus.OK) {
            //set the map's marker
            var myLatlng = new google.maps.LatLng(results[0].geometry.location.lat(),results[0].geometry.location.lng());
            marker.setPosition(myLatlng);
            map.setCenter(myLatlng);
            if (address_value != '') {
                $('#latitude').val(results[0].geometry.location.lat());
                $('#longitude').val(results[0].geometry.location.lng());
            }
        }
    });
    return false;
}
// set marker on the map
function setMarker(latitude,longitude){
    var myLatlng = new google.maps.LatLng(latitude,longitude);
    marker.setPosition(myLatlng);
    map.setCenter(myLatlng);
    $('#latitude').val(latitude);
    $('#longitude').val(longitude);
    getAddress(latitude,longitude,'my_profile');
}
// add active class
function addActiveClass(value){
    $('.tabs').removeClass('active');
    $('#'+value).addClass('active');
}
// check email validation
function isEmail(email) {
    var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    return regex.test(email);
}
// check password validation
function customPassword(password) {
    var regex = /^(?=.*[0-9])(?=.*[!@#$%^&*)(])(?=.*[A-Z])[a-zA-Z0-9!@#$%^&*)(]{8,}$/;
    return regex.test(password);
}
// check digits validation
function digitCheck(string) {
    // /^([0-9]{10})|(\([0-9]{3}\)\s+[0-9]{3}\-[0-9]{4})$/
    var regex = /^\d{6,15}$/;
    return regex.test(string);
}
// form my profile validation on submit
$( "#form_my_profile" ).on("submit", function( event ) {  
  if($( "#form_my_profile" ).valid()){ 
    if ($('#first_name').val() != '' && $('#email').val() != '' && isEmail($('#email').val()) && $('#phone_number').val() != '' && digitCheck($('#phone_number').val()) && (($('#password').val() != '' && $('#confirm_password').val() != '' && $('#password').val() == $('#confirm_password').val()) || ($('#password').val() == '' && $('#confirm_password').val() == ''))) 
    {  
        var formData = new FormData($("#form_my_profile")[0]);
        formData.append('submit_profile', 'Save');
        jQuery.ajax({
            type : "POST",
            url : BASEURL+'myprofile',
            data : formData,
            cache: false,
            processData: false,
            contentType: false,
            beforeSend: function(){
                $('#quotes-main-loader').show();
            },
            success: function(response) {
                location.reload();
                /*if (response == "success") {
                    location.reload();
                }
                else
                {
                    $('#quotes-main-loader').hide();
                    $('#error-msg').html(response);
                    $('#error-msg').show();
                }*/
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                $('#quotes-main-loader').hide();
                alert(errorThrown);
            }
        });
    }
    event.preventDefault(); 
  }
  else{
    return false;
  }
});
// form my address validation on submit
$( "#form_add_address" ).on("submit", function( event ) { 
    event.preventDefault();
    if ($('#address_field').val() != '' && $('#landmark').val() != '' && $('#city').val() != '')  // && $('#zipcode').val() != ''
    {
        var formData = new FormData($("#form_add_address")[0]);
        jQuery.ajax({
            type : "POST",
            url : BASEURL+'myprofile/addAddress',
            data : formData,
            cache: false,
            processData: false,
            contentType: false,
            beforeSend: function(){
                $('#quotes-main-loader').show();
            },
            success: function(response) {
                if (response == "success") {
                    window.location.href = BASEURL+"myprofile/view-my-addresses";
                }
                else
                {
                    $('#quotes-main-loader').hide();
                    $('#add-error-msg').html(response);
                    $('#add-error-msg').show();
                }
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                $('#quotes-main-loader').hide();
                alert(errorThrown);
            }
        });
    }
});
// form my addresses on hidden
$('#add-address').on('hidden.bs.modal', function (e) {
    $('#add_entity_id').val('');
    $('#address_field').val('');
    $('#landmark').val('');
    $('#form_add_address').validate().resetForm();
    $('#add-error-msg').text('');
    $('#submit_address').val(ADD);
    $('#address-form-title').html(ADD);
    getLocation('my_profile');
});
// form my profile on hidden
$('#edit-profile').on('hidden.bs.modal', function (e) {
    $('#form_my_profile').validate().resetForm();
    $('#error-msg').text('');
    $('#error-msg').hide();
    $("#form_my_profile")[0].reset();
    $('#image').val('');
    $("#old").show();
});
// get more orders
function moreOrders(order_flag)
{
    /*if (order_flag == "process") {
        $('#all_current_orders').show();
        $('#more_in_process_orders').hide();
    }
    if (order_flag == "past") {
        $('#all_past_orders').show();
        $('#more_past_orders').hide();
    }*/
    if (order_flag == "past"){
      var page_no = $('#pord_page_no').val();
    }
    else
    {
      var page_no = $('#cord_page_no').val();
    }
    jQuery.ajax({
      type : "POST",
      dataType: 'json',
      url : BASEURL+'myprofile/getOrderPagination',
      data : {'page_no':page_no,'order_flag':order_flag},
      beforeSend: function(){
          $('#quotes-main-loader').show();
      },
      success: function(response) {
        $('#quotes-main-loader').hide();
        if (response.review_html != '') {
          var page_count = parseInt(page_no) + 1;
          if(order_flag == "past")
          {
              $("#all_past_orders").append(response.order_html);
              $('#all_past_orders').show();
              if(response.next_page_count == 0){
                $('#more_past_orders').hide();                
              }
              $('#pord_page_no').val(page_count);
          }
          else
          {
              $("#all_current_orders").append(response.order_html);
              $('#all_current_orders').show();
              if(response.next_page_count == 0){
                $('#more_in_process_orders').hide();
              }
              $('#cord_page_no').val(page_count);
          }
        }
      },
      error: function(XMLHttpRequest, textStatus, errorThrown) {           
        alert(errorThrown);
      }
    });
}
// get more events
function moreEvents(order_flag){
    if (order_flag == "upcoming") {
        $('#all_upcoming_events').show();
        $('#more_upcoming_events').hide();
    }
    if (order_flag == "past") {
        $('#all_past_events').show();
        $('#more_past_events').hide();
    }
}
// get orders details
function order_details(order_id){
    if (order_id) {
        jQuery.ajax({
            type : "POST",
            dataType : "html",
            url : BASEURL+'myprofile/getOrderDetails',
            data : {"order_id":order_id},
            beforeSend: function(){
                $('#quotes-main-loader').show();
            },
            success: function(response) {
                $('#quotes-main-loader').hide();
                $('#order-details').html(response);
                $('#order-details').modal('show');
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                alert(errorThrown);
            }
        });
    }
}
// track orders
function track_order(order_id){
    if (order_id) {
        jQuery.ajax({
            type : "POST",
            url : BASEURL+'order',
            data : {"order_id":order_id},
            beforeSend: function(){
                $('#quotes-main-loader').show();
            },
            success: function(response) {
                $('#quotes-main-loader').hide();
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                alert(errorThrown);
            }
        });
    }
}
// get booking details
function booking_details(event_id){
    if (event_id) {
        jQuery.ajax({
            type : "POST",
            dataType : "html",
            url : BASEURL+ 'myprofile/getBookingDetails',
            data : {"event_id":event_id},
            beforeSend: function(){
                $('#quotes-main-loader').show();
            },
            success: function(response) {
                $('#quotes-main-loader').hide();
                $('#booking-details').html(response);
                $('#booking-details').modal('show');
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                alert(errorThrown);
            }
        });
    }
}
// edit address
function editAddress(address_id){
    jQuery.ajax({
        type : "POST",
        dataType : "html",
        url : BASEURL+'myprofile/getEditAddress',
        data : {"address_id":address_id},
        beforeSend: function(){
            $('#quotes-main-loader').show();
        },
        success: function(response) {
            var address = JSON.parse(response);
            //console.log(address);
            $('#user_entity_id').val(address.user_entity_id);
            $('#add_entity_id').val(address.address_id);
            $('#address_field').val(address.address);
            $('#add_address_area').val(address.search_area);
            $('#latitude').val(address.latitude);
            $('#longitude').val(address.longitude);
            $('#landmark').val(address.landmark);
            $('#submit_address').val(EDIT);
            $('#city').val(address.city);
            $('#state').val(address.state);
            $('#country').val(address.country);
            $('#address-form-title').html(EDIT);
            setMarker(address.latitude,address.longitude);
            $('#quotes-main-loader').hide();
            $('#add-address').modal('show');
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            alert(errorThrown);
        }
    });
}
// show delete address popup
function showDeleteAddress(address_id){
    $('#delete_address_id').val(address_id);
    $('#delete-address').modal('show');
}
// delete address
function deleteAddress(){
    var address_id = $('#delete_address_id').val();
    jQuery.ajax({
        type : "POST",
        dataType : "html",
        url : BASEURL+ 'myprofile/ajaxDeleteAddress' ,
        data : {'address_id':address_id},
        beforeSend: function(){
            $('#quotes-main-loader').show();
        },
        success: function(response) {
            window.location.href = BASEURL+"myprofile/view-my-addresses";
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            $('#quotes-main-loader').hide();
            alert(errorThrown);
        }
    });
}
// show set main address popup
function showMainAddress(address_id){
    $('#main_address_id').val(address_id);
    $('#main-address').modal('show');
}
// set main address 
function setMainAddress(){
    var address_id = $('#main_address_id').val();
    jQuery.ajax({
        type : "POST",
        dataType : "html",
        url : BASEURL+'myprofile/ajaxSetAddress',
        data : {'address_id':address_id},
        beforeSend: function(){
            $('#quotes-main-loader').show();
        },
        success: function(response) {
            window.location.href = BASEURL+"myprofile/view-my-addresses";
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            $('#quotes-main-loader').hide();
            alert(errorThrown);
        }
    });
}
/*event booking details*/
// get people value
/*function getPeople(value){ 
  var min_capacity = $('#min_people').val();
  var max_capacity = $('#max_people').val();
  var people = (parseInt(value) > 0)?parseInt(value):1; 
  if(people <= max_capacity && people >= min_capacity){
    $('#peepid').html('<strong>'+people+' People</strong>');
    $('#no_of_people').valid();
  }
  if(people > max_capacity){
    if(SELECTED_LANG == 'en') {
      bootbox.alert({
          message: "Maximum capacity allowed for restaurant is "+ max_capacity +".",
          buttons: {
              ok: {
                  label: "Ok",
              }
          }
      });
    } else if(SELECTED_LANG == 'fr') {
      bootbox.alert({
        message: "La capacité maximale autorisée pour le restaurant est"+" "+max_capacity +".",
        buttons: {
          ok: {
              label: "D'accord",
          }
        }
      });
    } else {
      bootbox.alert({
        message: "الحد الأقصى للسعة المسموح بها للمطعم هو" +" "+max_capacity+".",
        buttons: {
          ok: {
              label: "نعم",
          }
        }
      });
    }
  }
  if(people < min_capacity){
    if(SELECTED_LANG == 'en') {
      bootbox.alert({
          message: "Minimum capacity allowed for restaurant is "+ min_capacity +".",
          buttons: {
              ok: {
                  label: "Ok",
              }
          }
      });
    } else if(SELECTED_LANG == 'fr') {
      bootbox.alert({
        message: "La capacité minimale autorisée pour le restaurant est"+" "+min_capacity +".",
        buttons: {
          ok: {
              label: "D'accord",
          }
        }
      });
    } else {
      bootbox.alert({
        message: "الحد الأدنى للسعة المسموح بها للمطعم هو" +" "+min_capacity+".",
        buttons: {
          ok: {
              label: "نعم",
          }
        }
      });
    }
  }
  //$('#no_of_people').val(people);
}*/

$("#check_event_availability #no_of_people").on('keyup',function(e) {
    var people = (parseInt($(this).val()) > 0)?parseInt($(this).val()):1;
    $('#peepid').html('<strong>'+people+' People</strong>');
    if(e.which == 9) {
      var min_capacity = $('#min_people').val();
      var max_capacity = $('#max_people').val();
      // var people = (parseInt($(this).val()) > 0)?parseInt($(this).val()):1; 
      if(people <= max_capacity && people >= min_capacity){
        // $('#peepid').html('<strong>'+people+' People</strong>');
        $('#no_of_people').valid();
      }
      if(people > max_capacity){
        if(SELECTED_LANG == 'en') {
          bootbox.alert({
              message: "Maximum capacity allowed for restaurant is "+ max_capacity +".",
              buttons: {
                  ok: {
                      label: "Ok",
                  }
              }
          });
        } else if(SELECTED_LANG == 'fr') {
          bootbox.alert({
            message: "La capacité maximale autorisée pour le restaurant est"+" "+max_capacity +".",
            buttons: {
              ok: {
                  label: "D'accord",
              }
            }
          });
        } else {
          bootbox.alert({
            message: "الحد الأقصى للسعة المسموح بها للمطعم هو" +" "+max_capacity+".",
            buttons: {
              ok: {
                  label: "نعم",
              }
            }
          });
        }
      }
      if(people < min_capacity){
        if(SELECTED_LANG == 'en') {
          bootbox.alert({
              message: "Minimum capacity allowed for restaurant is "+ min_capacity +".",
              buttons: {
                  ok: {
                      label: "Ok",
                  }
              }
          });
        } else if(SELECTED_LANG == 'fr') {
          bootbox.alert({
            message: "La capacité minimale autorisée pour le restaurant est"+" "+min_capacity +".",
            buttons: {
              ok: {
                  label: "D'accord",
              }
            }
          });
        } else {
          bootbox.alert({
            message: "الحد الأدنى للسعة المسموح بها للمطعم هو" +" "+min_capacity+".",
            buttons: {
              ok: {
                  label: "نعم",
              }
            }
          });
        }
      }
    }
});

// show all the reviews
function showAllReviewsold(){
  $('#quotes-main-loader').show();
  setTimeout(function() {
    $('#quotes-main-loader').hide();
  }, 1000);
  $('#all_reviews').show();
  $('#review_button').hide();
}
function showAllReviews(){
  var page_no = $('#page_no').val();
  var res_content_id_val = $('#res_content_id_val').val();
  jQuery.ajax({
    type : "POST",
    dataType: 'json',
    url : BASEURL+'restaurant/getReviewsPagination',
    data : {'page_no':page_no,'restaurant_content_id':res_content_id_val},
    beforeSend: function(){
        $('#quotes-main-loader').show();
    },
    success: function(response) {
      $('#quotes-main-loader').hide();
      if (response.review_html != '') {
        $("#all_reviews").append(response.review_html);
        $('#all_reviews').show();
        
        var page_count = parseInt(page_no) + 1;
        $('#page_no').val(page_count);

        if(response.next_page_count == 0){
          $('#review_button').hide();
        }
      }
    },
    error: function(XMLHttpRequest, textStatus, errorThrown) {           
      alert(errorThrown);
    }
  });
}
// form check availability submit
$("#check_event_availability").on("submit", function(event) {
  if ($("#check_event_availability").valid()) {
    var validator = $("#check_event_availability").validate();
    event.preventDefault();
    var no_of_people = $('#no_of_people').val();
    var date_time = $('#datetimepicker1').val();
    var restaurant_id = $('#event_restaurant_id').val();
    var user_comment = $('#user_comment').val();
    if (restaurant_id != '' && date_time != '' && no_of_people != '') {
      jQuery.ajax({
        type : "POST",
        url : BASEURL+'restaurant/checkEventAvailability',
        data : $('#check_event_availability').serialize(),
        beforeSend: function(){
            $('#quotes-main-loader').show();
        },
        success: function(response) {
          var response = JSON.parse(response);
          if (response.hasOwnProperty('incorrect_info')) {
            var box = bootbox.alert({
              message: response.show_message,
              buttons: {
                  ok: {
                      label: response.oktxt,
                  }
              },
            });
            setTimeout(function() {
              box.modal('hide');
            }, 10000);
          }
          if (response.hasOwnProperty('allow_event_booking')) {
            bootbox.confirm({ 
              message: response.allow_event_booking_text,
              buttons: {
                confirm: {
                  label: response.oktxt
                },
                cancel: {
                  label: response.canceltxt
                }
              },
              callback: function(result){
                if (result === true) {
                  location.reload();
                }
              }
            })
          }
          if(!response.hasOwnProperty('result') && response.hasOwnProperty('less_capacity') && response.hasOwnProperty('restaurant_capacity')){
            $('#booking-not-available-capicity').modal('show');
            $('#less').removeClass('display-yes');
            $('#less').addClass('display-no');
            $('#more').addClass('display-yes');
            $('#more').removeClass('display-no');
            $('#booking-not-available-capicity span').text(response['restaurant_capacity']);
          }
          if(!response.hasOwnProperty('result') && response.hasOwnProperty('more_capacity') && response.hasOwnProperty('restaurant_capacity')){
            $('#booking-not-available-capicity').modal('show');
            $('#more').removeClass('display-yes');
            $('#more').addClass('display-no');
            $('#less').removeClass('display-no');
            $('#less').addClass('display-yes');
            $('#booking-not-available-capicity span').text(response['restaurant_capacity']);
          }
          if (response.hasOwnProperty('result')) {
            if(response['result'] == "success"){
              $('#booking-available').modal('show');
            }
            if(response['result'] == "fail"){
              $('#booking-not-available').modal('show');
            }
          }
          $('#quotes-main-loader').hide();
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {           
          alert(errorThrown);
        }
        }); 
      }
      return false;
    }
});


// add package for event booking
function AddPackage(entity_id){  
  var action;
  if ($("#addpackage-"+entity_id).hasClass('inpackage')) {
    action = "remove";
  }
  else
  {
    action = "add";
  }
  jQuery.ajax({
    type : "POST",
    url : BASEURL+'restaurant/add_package',
    data : {"entity_id":entity_id,"action":action},
    beforeSend: function(){
        $('#quotes-main-loader').show();
    },
    success: function(response) {
      $('#quotes-main-loader').hide();
      if (response == "success") {
        if ($("#addpackage-"+entity_id).hasClass('inpackage')) {
          $("#addpackage-"+entity_id).removeClass("inpackage");
          $(".addpackage").html(ADD);
          $("#addpackage-"+entity_id).html(ADD);
        }
        else
        {
          $(".addpackage").removeClass("inpackage");
          $("#addpackage-"+entity_id).addClass("inpackage");
          $(".addpackage").html(ADD);
          $("#addpackage-"+entity_id).html(ADDED);
        }
      }
    },
    error: function(XMLHttpRequest, textStatus, errorThrown) {           
      alert(errorThrown);
    }
    }); 
  return false;
}
// confirm event booking
function confirmBooking(){
  jQuery.ajax({
    type : "POST",
    url : BASEURL+'restaurant/bookEvent',
    data : $('#check_event_availability').serialize(),
    beforeSend: function(){
        $('#quotes-main-loader').show();
    },
    success: function(response) {
      $('#quotes-main-loader').hide();
      var response = JSON.parse(response);
      if (response.hasOwnProperty('incorrect_info')) {
        $('#booking-available').modal('hide');
        var box = bootbox.alert({
          message: response.show_message,
          buttons: {
              ok: {
                  label: response.oktxt,
              }
          },
        });
        setTimeout(function() {
          box.modal('hide');
        }, 10000);
      }
      if (response.hasOwnProperty('allow_event_booking')) {
        $('#booking-available').modal('hide');
        bootbox.confirm({ 
          message: response.allow_event_booking_text,
          buttons: {
            confirm: {
              label: response.oktxt
            },
            cancel: {
              label: response.canceltxt
            }
          },
          callback: function(result){
            if (result === true) {
              location.reload();
            }
          }
        })
      }
      if (response.hasOwnProperty('result')) {
        if(response['result'] == "success"){
          $('#booking-confirmation').modal('show');
        }
        if(response['result'] == "fail"){
          $('#booking-not-available').modal('show');  
        }
      }
    },
    error: function(XMLHttpRequest, textStatus, errorThrown) {           
      alert(errorThrown);
    }
    }); 
    return false;
}
/*event booking details js end*/

/*event booking page js*/
function searchEvents(page,err_msg,oktext){
    var searchEvent = $('#searchEvent').val();
    if ($.trim(searchEvent) == '' || searchEvent == undefined) {
    {
      var box = bootbox.alert({
            message: err_msg,
            buttons: {
                ok: {
                    label: oktext,
                }
            }
          });
          setTimeout(function() {
            box.modal('hide');
          }, 10000);
      }
    }
    else{
      jQuery.ajax({
      type : "POST",
      dataType :"html",
      url : BASEURL+"restaurant/ajax_events",
      data : {'searchEvent':searchEvent,'page':''},
      beforeSend: function(){
          $('#quotes-main-loader').show();
      },
      success: function(response) {
        $('#sort_events').html(response);
        $('#quotes-main-loader').hide();
      },
      error: function(XMLHttpRequest, textStatus, errorThrown) {           
        alert(errorThrown);
      }
      });
    }
  }
  $('#searchEvent').keypress(function(event){
      var keycode = (event.keyCode ? event.keyCode : event.which);
      if(keycode == '13'){
          event.preventDefault();
      }
  });
/*event booking page js ends*/

/*checkout page*/
//get lat long
function getLatLong(cart_total)
{  
  var place = autocomplete.getPlace();
    /*var geocoder = new google.maps.Geocoder();
    var address = document.getElementById("add_address").value;    
    geocoder.geocode( { 'address': address}, function(results, status) {
      console.log("statu="+status);
      console.log("google="+google.maps.GeocoderStatus.OK);

    if (status == google.maps.GeocoderStatus.OK) {
      //get delivery charges
      getDeliveryCharges(results[0].geometry.location.lat(),results[0].geometry.location.lng(),"get",cart_total);
      $('#add_latitude').val(results[0].geometry.location.lat());
      $('#add_longitude').val(results[0].geometry.location.lng());
    } 
    });*/
}
// get delivery charges from the address
function getAddLatLong(address_id,cart_total){
  var cart_total = $('#subtotal').val();
  jQuery.ajax({
    type : "POST",
    dataType : "json",
    url : BASEURL+'checkout/getAddressLatLng',
    data : {"entity_id":address_id},
    success: function(response) {
      getDeliveryCharges(response.latitude,response.longitude,"get",cart_total);
    },
    error: function(XMLHttpRequest, textStatus, errorThrown) {           
      alert(errorThrown);
    }
    });
}
// get delivery charges
function getDeliveryCharges(latitude,longitude,action,cart_total){
  jQuery.ajax({
    type : "POST",
    dataType : "json",
    url : BASEURL+'checkout/getDeliveryCharges',
    data : {"latitude":latitude,"longitude":longitude,"action":action,'cart_total':cart_total},
    beforeSend: function(){
        $('#quotes-main-loader').show();
    },
    success: function(response) {
      $('#ajax_order_summary').html(response.ajax_order_summary);
      if (action == "get") {
        if (response.check != '' && response.check != null) {
          $("#submit_order").attr("disabled", false);
        }
        else
        {
          $('#delivery-not-avaliable').modal('show');
          $("#submit_order").attr("disabled", true);
        }
      }
      $('#quotes-main-loader').hide();
      getCoupons(cart_total,'delivery','','');
    },
    error: function(XMLHttpRequest, textStatus, errorThrown) {           
      alert(errorThrown);
    }
    });
}
// show delivery options
function showDelivery(cart_total_price,coupon_applied){  
  if (IS_USER_LOGIN == 1 || IS_GUEST_CHECKOUT==1){
    initAutocomplete('add_address');
    // auto detect location if even searched once.
    if (SEARCHED_LAT == '' && SEARCHED_LONG == '' && SEARCHED_ADDRESS == '') {
      getLocation('checkout');
    }
    else
    {
      getSearchedLocation(SEARCHED_LAT,SEARCHED_LONG,SEARCHED_ADDRESS,'checkout');
    }
    document.getElementById('delivery-form').style.display ='block';
    document.getElementById('driver-tip-form').style.display ='block';
  }  
  // initAutocomplete('add_address_area');
  // initAutocomplete('add_address');
  jQuery( ".add_new_address" ).prop('required',true);
  if(coupon_applied!='yes')
  {
    getCoupons(cart_total_price,'delivery','');
  }  
  $('#checkout_form').validate().resetForm();
  $('#checkout_form')[0].reset();
  $("#submit_order").attr("disabled", false);
  $("#delivery").prop("checked", true);
  $('.delivery-instructions').show();
  var add_new_address = '';
  var is_guest_checkout = $("#is_guest_checkout").val();
  
  if(is_guest_checkout == 'yes'){
    document.getElementById('add_address_content').style.display ='block';
    jQuery("#add_address").prop('required',true);
    jQuery("#landmark").prop('required',true);
    add_new_address = $(".add_new_address").val();
  } else {
    $('#add_address_content').hide();
    $('#your_address_content').hide();
    add_new_address = $("input[name='add_new_address']:checked").val();
  }
  if(add_new_address!=''){
    $("input[name='add_new_address']").prop("checked", true);
    $('input[name="add_new_address"]:radio:first' ).click();
  }
}
// show pickup options
function showPickup(cart_total_price){  
  document.getElementById('delivery-form').style.display = 'none';
  document.getElementById('driver-tip-form').style.display ='none';
  getCoupons(cart_total_price,'pickup','','');
  $('#driver_tip').val('');
  $('#checkout_form').validate().resetForm();
  $('#checkout_form')[0].reset();
  $("#submit_order").attr("disabled", false);
  $("#pickup").prop("checked", true);
  $('.delivery-instructions').hide();
}
function showsearchcoupon(cart_total_price,err_msg,oktext,is_search)
{
  var coupon_searchval = $('#coupon_searchval').val(); 
  if (($.trim(coupon_searchval) == '' || coupon_searchval == undefined) && is_search=='yes') {
  {
    var box = bootbox.alert({
          message: err_msg,
          buttons: {
              ok: {
                  label: oktext,
              }
          }
        });
        setTimeout(function() {
          box.modal('hide');
        }, 10000);
    }
  }else{
    var choose_order = $("input[name='choose_order']:checked").val();
    getCoupons(cart_total_price,choose_order,coupon_searchval,'yes');
  }
}
// remove delivery options
function removeDeliveryOptions(){
  jQuery.ajax({
    type : "POST",
    dataType : "html",
    url : BASEURL+'checkout/removeDeliveryOptions',
    beforeSend: function(){
        $('#quotes-main-loader').show();
    },
    success: function(response) {
      $('#ajax_order_summary').html(response);
      $('#quotes-main-loader').hide();
    },
    error: function(XMLHttpRequest, textStatus, errorThrown) {           
      alert(errorThrown);
    }
    });
}
// get Coupons
function getCoupons(subtotal,order_mode,coupon_searchval,frmcoupon)
{
  $(".card_dtl").hide();
  jQuery.ajax({
    type : "POST",
    dataType : 'json',
    url : BASEURL+'checkout/getCoupons',
    data : {"subtotal":subtotal,"order_mode":order_mode,"coupon_searchval":coupon_searchval,"frmcoupon":frmcoupon},
    beforeSend: function(){
        $('#quotes-main-loader').show();
    },
    success: function(response) {
      $('#ajax_order_summary').html(response.ajax_order_summary);
      $('#coupon_detailid').html(response.html);
      $('#quotes-main-loader').hide();
      $('#coupon_searchval').val(coupon_searchval);
      if (order_mode == "pickup") {
         removeDeliveryOptions();
      }
      //Code for togle coupon detail :: Start
      $('.show-hidden-menu').click(function() {        
        $('.hidden-menu').hide("slow");
        $('.hhshow-hidden-menu').hide(0); //spnshow-hidden-menu
        $('.spnshow-hidden-menu').show(0);

        $('.show-hidden-menu').show(0); 
        if($('#sub'+this.id).is(":visible")){
          $('#sub'+this.id).hide(0);          
        }
        else
        {
          $('#sub'+this.id).show(0);          
        }
       if($('#sub'+this.id).is(":visible")){
          $('#'+this.id).hide(0);
          $('#hh'+this.id).show(0); //spnshow-hidden-menu
          $('#spn'+this.id).hide(0);
          
        }
        else
        {
          $('#'+this.id).show(0);
          $('#hh'+this.id).hide(0); //spnshow-hidden-menu
          $('#spn'+this.id).show(0);
        }        
      });
      $('.hhshow-hidden-menu').click(function()
      {
          $('.hidden-menu').hide(0);
          var dataval = $(this).attr("dataval");
          $('#'+dataval).show(0); 
          $('#spn'+dataval).show(0);         
          $('#'+this.id).hide(0);        
      });
      //Code for togle coupon detail :: End

    },
    error: function(XMLHttpRequest, textStatus, errorThrown) {           
      alert(errorThrown);
    }
    });
}
// get Coupon details
function getCouponDetails(coupon_id,subtotal,order_mode){
  jQuery.ajax({
    type : "POST",
    dataType : 'html',
    url : BASEURL+'checkout/addCoupon',
    data : {"coupon_id":coupon_id,"subtotal":subtotal,"order_mode":order_mode},
    beforeSend: function(){
        $('#quotes-main-loader').show();
    },
    success: function(response) {
      $('#coupon_modal').modal('hide');
      $('#ajax_order_summary').html(response);
      $('#quotes-main-loader').hide();
    },
    error: function(XMLHttpRequest, textStatus, errorThrown) {           
      alert(errorThrown);
    }
    });
}
function removeCouponOptions(){
  jQuery.ajax({
    type : "POST",
    dataType : "html",
    url : BASEURL+'checkout/removeCouponOptions',
    beforeSend: function(){
        $('#quotes-main-loader').show();
    },
    success: function(response) {
      $('#ajax_order_summary').html(response);
      $('#quotes-main-loader').hide();
    },
    error: function(XMLHttpRequest, textStatus, errorThrown) {           
      alert(errorThrown);
    }
    });
}
// show address
function showAddAdress(){ 
    initAutocomplete('add_address');
    // auto detect location if even searched once.
    if (SEARCHED_LAT == '' && SEARCHED_LONG == '' && SEARCHED_ADDRESS == '') {
      getLocation('checkout');
    }
    else
    {
      getSearchedLocation(SEARCHED_LAT,SEARCHED_LONG,SEARCHED_ADDRESS,'checkout');
    }
    document.getElementById('add_address_content').style.display ='block';
    jQuery("#add_address").prop('required',true);
    jQuery("#landmark").prop('required',true);
    // jQuery( "#add_address_area" ).prop('required',true);
    //jQuery( "#zipcode" ).prop('required',true);    
    //jQuery( "#city" ).prop('required',true);  
    if($('#your_address_content').length){
      document.getElementById('your_address_content').style.display ='none';
    }
}
// show your already added address
function showYourAdress(){  
  document.getElementById('add_address_content').style.display ='none';
  document.getElementById('your_address_content').style.display = 'block';    
  jQuery( "#your_address" ).prop('required',true);
}
// show registration form
function showregister(){
  $('#form_front_login_checkout').validate().resetForm();
  $('#form_front_registration_checkout').validate().resetForm();
  $('.login-validations').html('');
  $('#login_form').hide();
  $('#signup_form').show();
}
//show login form
function showlogin(){
  $('#form_front_login_checkout').validate().resetForm();
  $('#form_front_registration_checkout').validate().resetForm();
  $('.register-validations').html('');
  $('#signup_form').hide();
  $('#login_form').show();
}
$( "#guest_checkout_form" ).on("submit", function( event ) { 
  event.preventDefault();
});
// submit checkout form
$( "#checkout_form" ).on("submit", function( event ) { 
  var guest_checkout_form_valid = 'yes';
  if($('#is_guest_checkout').val()=='yes'){
    $('#guest_checkout_form').submit();
    if($('#guest_checkout_form').valid()){
      guest_checkout_form_valid = 'yes';
      //$('#guest_checkout_form').submit(); 
    } else {
      guest_checkout_form_valid = 'no';
    }
  } else {
    guest_checkout_form_valid = 'yes';
  }
  event.preventDefault();
  var choose_order = $("input[name='choose_order']:checked").val();
  var payment_option = $("input[name='payment_option']:checked").val(); 
  if($('#is_guest_checkout').val()=='yes'){
    var add_new_address = $(".add_new_address").val();
  } else {
    var add_new_address = $("input[name='add_new_address']:checked").val();
  }
  // Validate Google Address for lat - long
  if($('#add_address').val() != '' && choose_order == "delivery" && add_new_address=="add_new_address" && guest_checkout_form_valid=='yes'){    
    if($('#add_latitude').val() == '' || $('#add_longitude').val() == ''){      
      $("#add_address").focus();
      $("#add_address_error").show();
      event.preventDefault();
      return false;
    } else {
      $("#add_address_error").hide();
    }
  }else if($('#add_address').val() != '' && choose_order == "delivery" && add_new_address=="add_new_address"){
    if($('#add_latitude').val() == '' || $('#add_longitude').val() == ''){      
      $("#add_address_error").show();      
      return false;
    } else {
      $("#add_address_error").hide();
    }
  }  
  if (guest_checkout_form_valid == 'yes' && ((choose_order == "delivery" && ((add_new_address == "add_your_address" && $('#your_address').val() != '') || (add_new_address == "add_new_address" && $('#add_address').val() != '' && $('#landmark').val() != ''))) || choose_order == "pickup") && payment_option != '' && payment_option != undefined) 
  {
    /*if(payment_option == 'CardOnline')
    {
       var emailval = $('#email').val();
       var mobile_phoneval = $('#mobile_phone').val();
       if($.trim(emailval)!='' && $.trim(mobile_phoneval)!='')
       {
        $('#order-confirmation').modal('hide');
        var dataString = $("#checkout_form").serialize();
        addOrder(dataString);                
       }
    }
    else
    {
      $('#order-confirmation').modal('hide');
      var dataString = $("#checkout_form").serialize();
      addOrder(dataString);                
    }*/
    var restaurant_id = $('#cart_restaurant').val();
    jQuery.ajax({
      type : "POST",
      dataType : "json",
      url : BASEURL+'cart/checkResStat',
      data : {'restaurant_id':restaurant_id},
      beforeSend: function(){
          $('#quotes-main-loader').show();
      },
      success: function(response) {
          $('#quotes-main-loader').hide();
          if(response.status == 'res_unavailable') {
            var box = bootbox.alert({
              message: response.show_message,
              buttons: {
                  ok: {
                      label: response.oktxt,
                  }
              },
            });
            setTimeout(function() {
              box.modal('hide');
            }, 10000);
          } else {
            if(payment_option == 'stripe'){ //stripe
              $('#order-confirmation').modal('hide');
              $('#user_details').modal('show');
            } else { //cod and paypal
              $('#order-confirmation').modal('hide');
              $('#user_details').modal('hide');
              if($('#is_guest_checkout').val()=='yes'){
                var dataString = new FormData($("#checkout_form")[0]);
                stripeAddOrder(dataString);
              }
              else{
                var dataString = $("#checkout_form").serialize();
                addOrder(dataString);
              }
              //var dataString = $("#checkout_form").serialize();
            }
          }
      },
      error: function(XMLHttpRequest, textStatus, errorThrown) {
          alert(errorThrown);
      }
    });
  }
});
function stripeAddOrder(dataString) {
  if($('#is_guest_checkout').val()=='yes'){
    var formData = $('#guest_checkout_form').serialize();
    dataString.append('guest_form', formData);
  }
  jQuery.ajax({
      type : "POST",
      dataType: 'json',
      url : BASEURL+'checkout/addOrder',
      data : dataString,
      cache: false, 
      processData: false,
      contentType: false,
      beforeSend: function(){
        $('#quotes-main-loader').show();
      },   
      success: function(response) {
        $('#quotes-main-loader').hide();
        $('#user_details').modal('hide');
        $('#track_order').html(response.order_id);
        $('#earned_points').html(response.earned_points);
        $('#order-confirmation').modal('show');
        $('#order-not-placed').modal('hide');
      },
      error: function(XMLHttpRequest, textStatus, errorThrown) {           
        alert(errorThrown);
      }
    });
}
/* mobilPay payment integration : start */
function addOrder(dataString){
  jQuery.ajax({
      type : "POST",
      dataType: 'json',
      url : BASEURL+'checkout/addOrder',
      data : dataString,
      cache: false, 
      beforeSend: function(){
        $('#quotes-main-loader').show();
      },   
      success: function(response) {
              $('#quotes-main-loader').hide();
              if(response.payment_option == 'paypal'){
                $("#stripe_cod_btn").hide();
                $("#paypal-button").show();
                $('#earned_points').html(response.earned_points);
              } 
              else if (response.result == "success" &&  response.payment_status === '' &&  response.payment_option == 'cod') { //cod
                $('#track_order').html(response.order_id);
                $('#earned_points').html(response.earned_points);
                $('#order-confirmation').modal('show');
                $('#order-not-placed').modal('hide');
                window.stop();
              }
              window.stop();
              /*if(response.payment_option == 'CardOnline'){ //mobilpay
                $('#order-confirmation').modal('hide');
                //hide on 13-04-2021
                //window.location = BASEURL+"mobilpay";
                //New code add on 13-04-2021 :: Start
                var emailval = $('#email').val();
                var mobile_phoneval = $('#mobile_phone').val();
                $('#billing_email').val(emailval);
                $('#billing_mobile_phone').val(mobile_phoneval);
                $('form[name=mobilpay_form]').submit();                
                //New code add on 13-04-2021 :: End
              }else if (response.result == "success") {
                $('#track_order').html(response.order_id);
                $('#earned_points').html(response.earned_points);
                $('#order-confirmation').modal('show');
                setTimeout(location.reload.bind(location), 300000);
              }*/
      },
      error: function(XMLHttpRequest, textStatus, errorThrown) {           
        alert(errorThrown);
      }
      });
}
/* mobilPay payment integration : end */
// check custom checkout item 
function EditCheckoutItemCount(customQuantity1,entity_id,restaurant_id,cart_key){
  if(customQuantity1!='')
  {
    var customQuantity=(customQuantity1=='0')?'1':customQuantity1;
     var choose_order = $("input[name='choose_order']:checked").val();  
      jQuery.ajax({
      type : "POST",
      dataType : 'json',
      url : BASEURL+'checkout/ajax_checkout',
      data : {"customQuantity":customQuantity,"entity_id":entity_id,"restaurant_id":restaurant_id,"cart_key":cart_key,'is_main_cart':'checkout'},
      beforeSend: function(){
          $('#quotes-main-loader').show();
      },
      success: function(response) {
        //$("#order_mode_btn").load(" #order_mode_btn > *");
        //$("#coupon_select").load(" #coupon_select > *");
        $('#ajax_your_items').html(response.ajax_your_items);
        $('#ajax_your_suggestion').html(response.ajax_your_suggestion);
        $('#ajax_order_summary').html(response.ajax_order_summary);
        $('#subtotal').val(response.cart_total);
        getCouponDetails('',$('#subtotal').val(),choose_order);
        if($("input[name='choose_order']:checked").val() == 'delivery') {
          if(($("#is_guest_checkout").val() == 'yes' && $(".add_new_address").val() == 'add_new_address') || $("input[name='add_new_address']:checked").val() == 'add_new_address'){
            if($("#add_address").val() != '' && $("#add_latitude").val() != '' && $("#add_longitude").val() != '') {
              getDeliveryCharges($("#add_latitude").val(),$("#add_longitude").val(),'get',response.cart_total);
            }
          }
          else if($("input[name='add_new_address']:checked").val() == 'add_your_address' && $('#your_address').val() != ''){
            getAddLatLong($('#your_address').val(),response.cart_total)
          }
        }
        //$('#quotes-main-loader').hide();
        if ($('#total_cart_items').val() == null) { 
          $('#order_mode_method').hide();
        }
        else if ($('#total_cart_items').val() == null && $("input[name=item_count_check]").val() == null) { 
          $('#order_mode_method').hide();
        }
        else
        {
          if (IS_USER_LOGIN == 1 ){
            //document.getElementById('delivery-form').style.display ='block';
          }
        }
        $('#quotes-main-loader').hide();
      },
      error: function(XMLHttpRequest, textStatus, errorThrown) {           
        alert(errorThrown);
      }
    });
  }
  
}
function customCheckoutItemCount(entity_id,restaurant_id,action,cart_key,delete_module,ok,cancel){
  //New code add to reset the delivery address code :: Start
  /*if(document.getElementById('delivery-form')){
    document.getElementById('delivery-form').style.display = 'none';
  }  
  if(document.getElementById('driver-tip-form')){
    document.getElementById('driver-tip-form').style.display ='none';
  }

  $('#driver_tip').val('');
  $('#checkout_form').validate().resetForm();
  $('#checkout_form')[0].reset();
  $("#submit_order").attr("disabled", false);
  $("#delivery").prop("checked", true);
  $('#add_address_content').hide();
  $('#your_address_content').hide();
  if(document.getElementById('delivery-form')){
    document.getElementById('delivery-form').style.display ='block';
  }  
  if(document.getElementById('driver-tip-form')){
    document.getElementById('driver-tip-form').style.display ='block';
  }*/
  //New code add to reset the delivery address code :: End 
  if(action == 'remove')
  {
      bootbox.confirm({
        message: delete_module,
        buttons: {
            confirm: {
                label: ok,
            },
            cancel: {
                label: cancel,
            }
        },
        callback: function (removeitem) {         
          if (removeitem) {
            jQuery.ajax({
            type : "POST",
            dataType : 'json',
            url : BASEURL+'checkout/ajax_checkout',
            data : {"entity_id":entity_id,"restaurant_id":restaurant_id,"action":action,"cart_key":cart_key,'is_main_cart':'checkout'},
            beforeSend: function(){
                $('#quotes-main-loader').show();
            },
            success: function(response) {
              $("#order_mode_btn").load(" #order_mode_btn > *");
              //$("#coupon_select").load(" #coupon_select > *");
              $('#ajax_your_items').html(response.ajax_your_items);
              $('#ajax_your_suggestion').html(response.ajax_your_suggestion);
              $('#ajax_order_summary').html(response.ajax_order_summary);
              $('#subtotal').val(response.cart_total);
              if($("input[name='choose_order']:checked").val() == 'delivery') {
                if(($("#is_guest_checkout").val() == 'yes' && $(".add_new_address").val() == 'add_new_address') || $("input[name='add_new_address']:checked").val() == 'add_new_address'){
                  if($("#add_address").val() != '' && $("#add_latitude").val() != '' && $("#add_longitude").val() != '') {
                    getDeliveryCharges($("#add_latitude").val(),$("#add_longitude").val(),'get',response.cart_total);
                  }
                }
                else if($("input[name='add_new_address']:checked").val() == 'add_your_address' && $('#your_address').val() != ''){
                  getAddLatLong($('#your_address').val(),response.cart_total)
                }
              }
              if (action == "remove" && $('#total_cart_items').val() == null) { 
                $('#order_mode_method').hide();
              }
              else
              {
                if (IS_USER_LOGIN == 1 ){
                  //document.getElementById('delivery-form').style.display ='block';
                }
              }
              $('#quotes-main-loader').hide();
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {           
              alert(errorThrown);
            }
            });
        }
      }
    });
  }
  else
  {
    var choose_order = $("input[name='choose_order']:checked").val();  
    jQuery.ajax({
    type : "POST",
    dataType : 'json',
    url : BASEURL+'checkout/ajax_checkout',
    data : {"entity_id":entity_id,"restaurant_id":restaurant_id,"action":action,"cart_key":cart_key,'is_main_cart':'checkout'},
    beforeSend: function(){
        $('#quotes-main-loader').show();
    },
    success: function(response) {
      //$("#order_mode_btn").load(" #order_mode_btn > *");
      //$("#coupon_select").load(" #coupon_select > *");
      $('#ajax_your_items').html(response.ajax_your_items);
      $('#ajax_your_suggestion').html(response.ajax_your_suggestion);
      $('#ajax_order_summary').html(response.ajax_order_summary);
      $('#subtotal').val(response.cart_total);
      if($("input[name='choose_order']:checked").val() == 'delivery') {
        if(($("#is_guest_checkout").val() == 'yes' && $(".add_new_address").val() == 'add_new_address') || $("input[name='add_new_address']:checked").val() == 'add_new_address'){
          if($("#add_address").val() != '' && $("#add_latitude").val() != '' && $("#add_longitude").val() != '') {
            getDeliveryCharges($("#add_latitude").val(),$("#add_longitude").val(),'get',response.cart_total);
          }
        }
        else if($("input[name='add_new_address']:checked").val() == 'add_your_address' && $('#your_address').val() != ''){
          getAddLatLong($('#your_address').val(),response.cart_total)
        }
      }
      if (action == "remove" && $('#total_cart_items').val() == null) { 
        $('#order_mode_method').hide();
      }
      else if (action == "minus" && $('#total_cart_items').val() == null && $("input[name=item_count_check]").val() == null) {
        //getCouponDetails('',$('#subtotal').val(),choose_order)
        $('#order_mode_method').hide();
      }
      else
      {
        //getCouponDetails('',$('#subtotal').val(),choose_order)
        if (IS_USER_LOGIN == 1 ){
          //document.getElementById('delivery-form').style.display ='block';
        }
      }
      $('#quotes-main-loader').hide();
    },
    error: function(XMLHttpRequest, textStatus, errorThrown) {           
      alert(errorThrown);
    }
    });
  }
}
function redeemPoints(temp_total){
  var redeem = $('#submit_redeem').val();
  jQuery.ajax({
      type : "POST",
      dataType: 'json',
      url : BASEURL+'checkout/redeemPoints',
      data : {'redeem':redeem,'temp_total':temp_total},
      beforeSend: function(){
          $('#quotes-main-loader').show();
      },
      success: function(response) {
        $('#ajax_order_summary').html(response.ajax_order_summary);
        $('#quotes-main-loader').hide();
        $("#submit_redeem").attr('value', response.redeem_submit);
        if(response.min_redeem_point_alert !=''){
          var box = bootbox.alert({
            message: response.min_redeem_point_alert,
            buttons: {
                ok: {
                    label: response.oktxt,
                }
            },
          });
          setTimeout(function() {
            box.modal('hide');
          }, 10000);
        }
      },
      error: function(XMLHttpRequest, textStatus, errorThrown) {           
        alert(errorThrown);
      }
    });   
}
/*checkout page js ends*/
//get item price
var totalPrice = 0;
var radiototalPrice = 0;
var checktotalPrice = 0;
function getItemPrice(id,price,is_multiple){ 
    
    if (is_multiple != 1) {
      radiototalPrice = 0;
      //$("#custom_items_form input[type=radio]:checked").each(function() { 
      $("input:radio.radio_addons:checked").each(function() {  
        var sThisVal = (this.checked ? $(this).attr("amount") : 0);
        radiototalPrice = parseFloat(radiototalPrice) + parseFloat(sThisVal);
      });
    }
    else
    {
      checktotalPrice = 0;
      $('.check_addons:checkbox:checked').each(function () { 
        var sThisVal = (this.checked ? $(this).attr("amount") : 0);
        checktotalPrice = parseFloat(checktotalPrice) + parseFloat(sThisVal);        
      });
    }
    totalPrice = radiototalPrice + checktotalPrice;
    var total_display = $('#subTotal_for_cal').val();
    totalPrice = totalPrice + parseFloat(total_display);
    $('#totalPrice').html(totalPrice.toFixed(2));
    $('#subTotal').val(totalPrice.toFixed(2));
}
// get the addons to cart
function AddAddonsToCart(menu_id,item_id,mandatory,mandatory_arr,reload){ 
  var restaurant_id = $("#restaurant_id").val();
  var user_id = $("#user_id").val();
  //var totalPrice = $('#subTotal').val();
  var totalPrice = ($('#subTotal').val()=='0')? $('#subTotal_for_cal').val() : $('#subTotal').val();
  //addons category mandatory changes :: start
  var addons_mandatory = JSON.parse(mandatory_arr);
  var checked_mandatory = 'yes';
  var cat_name_str = '';
  if(addons_mandatory) {
    for(let i=0; i<addons_mandatory.length; i++){
      var id_val = addons_mandatory[i];
      var get_category_elements = document.querySelectorAll('[addons_category_id="'+id_val+'"]');
      
      if(get_category_elements[0].type == 'radio') { //for radio
          var radioValue = $("input[name='"+get_category_elements[0].name+"']:checked").val(); 
          if(!radioValue){
            checked_mandatory = 'no';
            cat_name_str = document.getElementsByName(get_category_elements[0].name)[0].getAttribute("addons_category");
            break;
          }
      } else { //for checkbox
          checked_mandatory = 'no';
          for (let j = 0; j < get_category_elements.length; j++) {
            if(get_category_elements[j].checked){
              checked_mandatory = 'yes';
            }
          }
          if(checked_mandatory == 'no'){
            cat_name_str = document.getElementsByName(get_category_elements[0].name)[0].getAttribute("addons_category");
            break;
          }
      }
    }
  }
  //addons category mandatory changes :: end
    var valueArray = new Array();
    $('.check_addons:checkbox:checked').each(function () { 
      var addonValue = jQuery.parseJSON($(this).attr("addonValue"));
      var addons_category = $(this).attr("addons_category");
      var addons_category_id = $(this).attr("addons_category_id");    
      if (valueArray.length > 0) {
        jQuery.each( valueArray, function( key, value ) { 
          var new_addons_list = new Array();
          if (value.addons_category_id == addons_category_id) {
            var addonslist = value.addons_list;
            if (Array.isArray(value.addons_list) == false) {
              new_addons_list.push({
                "add_ons_id": value.addons_list.add_ons_id, 
                "add_ons_name": value.addons_list.add_ons_name,
                "add_ons_price": value.addons_list.add_ons_price
              });
            }
            else
            { 
              if (addonslist.length > 0) {
                jQuery.each(addonslist, function( key, value ) { 
                  new_addons_list.push(value);
                });
              } 
            }
            
            new_addons_list.push(addonValue);
            value.addons_list = new_addons_list;
          }
          else
          {
            valueArray.push({
              'addons_category_id':addons_category_id,
              'addons_category':addons_category,
              'addons_list':addonValue
            });
          }
        });
      }
      else
      {
        valueArray.push({
              'addons_category_id':addons_category_id,
              'addons_category':addons_category,
              'addons_list':addonValue
        });
      }
    });
    $("#custom_items_form input[type=radio][class='radio_addons']:checked").each(function() { 
      var addonValue = jQuery.parseJSON($(this).attr("addonValue"));
      var addons_category = $(this).attr("addons_category");
      var addons_category_id = $(this).attr("addons_category_id");
      var new_addons_list = new Array();
      if (valueArray.length > 0) { 
        jQuery.each( valueArray, function( key, value ) {
          if (value.addons_category_id == addons_category_id) {
            new_addons_list.push(value.addons_list);
            new_addons_list.push(addonValue);
            valueArray.splice(key, 1);
          }
        });
      }
      if (new_addons_list.length > 0) {
        addonValue = new_addons_list;
      }
      valueArray.push({
            'addons_category_id':addons_category_id,
            'addons_category':addons_category,
            'addons_list':addonValue
      });
    });
    var arr = [];
    var addons_category_id_arr = [];
      if (valueArray.length > 0) { 
        jQuery.each( valueArray, function( key, value ) { 
          var addons = value.addons_list;
          var addons_count = addons.length;
          addons_category_id_arr.push(value.addons_category_id);
          arr.push({
            'addons_category_id':value.addons_category_id,
            'key':key,
            'addons_count':(addons_count)?addons_count:0
          });
        });
      }
      var unique_addons_category = [];
      $.each(addons_category_id_arr, function(i, el){
          if($.inArray(el, unique_addons_category) === -1) unique_addons_category.push(el);
      });
      var maxval = [];
      var arrkeys = [];
      if (unique_addons_category.length > 0) {
        jQuery.each( unique_addons_category, function( key, value ) {
          var max = 0;
          var keyvalue = '';
          if (arr.length > 0) {
            jQuery.each( arr, function( arrkey, arrvalue ) {
              if (arrvalue.addons_category_id == value) {
                if(max <= arrvalue.addons_count){
                  max = arrvalue.addons_count;
                  keyvalue = arrvalue.key;
                }
              }
            });
            maxval.push({ 
              'id':value,
              'addons_count': max,
              'key': keyvalue
            });
            arrkeys.push(keyvalue);
          }
        });
      }
      var finalValueArray = [];
      // to unset the duplicate keys
      if (valueArray.length > 0) {
        jQuery.each( valueArray, function( key, value ) {
          if (arrkeys.length > 0) {
            if(jQuery.inArray(key, arrkeys) !== -1) { 
              finalValueArray.push(value);
            }
          }
          else
          {
            finalValueArray = valueArray;
          }
        });
      }
    // send addons array to cart
    if (mandatory==0 || (mandatory==1 && checked_mandatory=='yes' && finalValueArray.length > 0)) {
      //(finalValueArray.length > 0) { 
      jQuery.ajax({
        type : "POST",
        url : BASEURL+'cart/addToCart',
        data : {'menu_id':menu_id,'user_id':user_id,'restaurant_id':restaurant_id,'totalPrice':totalPrice,'add_ons_array':finalValueArray},
        beforeSend: function(){
            $('#quotes-main-loader').show();
        },
        success: function(response) {
          if(reload=='checkout'){
              //window.location.replace(BASEURL+'checkout');
              //Added to load checkout cart item
              checkoutItem_reload(menu_id,restaurant_id)
          }else if(reload=='checkout_as_guest'){
              //window.location.replace(BASEURL+'checkout/checkout_as_guest');
              //Added to load checkout cart item
              checkoutItem_reload(menu_id,restaurant_id)
          }
          $('#quotes-main-loader').hide();
          $('#myModal').modal('hide');
          $('#your_cart').html(response);
          $('.'+item_id).html(ADDED);
          $('.'+item_id).removeClass('add');
          $('.'+item_id).addClass('added');
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {           
          alert(errorThrown);
        }
        });
    } else {
      if(mandatory == 1){
        if(SELECTED_LANG == 'en') {
          bootbox.alert({
              message: "Please select atleast one item from "+ cat_name_str +".",
              buttons: {
                  ok: {
                      label: "Ok",
                  }
              }
          });
        } else if(SELECTED_LANG == 'fr') {
          bootbox.alert({
            message: "Veuillez sélectionner au moins un élément de "+ cat_name_str +".",
            buttons: {
              ok: {
                  label: "D'accord",
              }
            }
          });
        } else {
          bootbox.alert({
            message: "يرجى تحديد عنصر واحد على الأقل من " +" "+cat_name_str+".",
            buttons: {
              ok: {
                  label: "نعم",
              }
            }
          });
        }
      }
    }
}
function addReview(restaurant_id,res_content_id,order_id){  
  $('#review_restaurant_id').val(restaurant_id);
  $('#review_res_content_id').val(res_content_id);
  $('#review_order_id').val(order_id);
  $('#reviewModal').modal('show');
}
// form check availability submit
$("#review_form").on("submit", function(event) {
  event.preventDefault();
  if ($("input[name=rating]:checked").val() != '' && $('#review_text').val() != '') {
    jQuery.ajax({
      type : "POST", 
      dataType: "html",
      url : BASEURL+'restaurant/addReview',  
      data : $('#review_form').serialize(),
      beforeSend: function(){
          $('#quotes-main-loader').show();
      },
      success: function(response) {
        $('#quotes-main-loader').hide();
        if (response == 'success') {
          location.reload();
        }
      },
      error: function(XMLHttpRequest, textStatus, errorThrown) {           
        alert(errorThrown);
      }
    });
  }
  else
  {
    return false;
  }
});
function all_couponShow(cart_total){
  showsearchcoupon(cart_total,'','','no');
  $('#coupon_modal').modal('show');
}
//new changes for menu details on image click :: start
function checkCartRestaurantDetails(entity_id,restaurant_id,is_closed,is_addon,item_id,recipe,recipe_page) {
  if(is_addon == '') {
    jQuery.ajax({
      type : "POST",
      url : BASEURL+'cart/checkCartRestaurantDetails',
      data : {"entity_id":entity_id,"restaurant_id":restaurant_id,"is_closed":is_closed,"recipe":recipe,"recipe_page":recipe_page},
      beforeSend: function(){
          $('#quotes-main-loader').show();
      },
      success: function(response) {
        $('#quotes-main-loader').hide();
        $('#menuDetailModal').html(response);
        $('#menuDetailModal').modal('show');
      },
      error: function(XMLHttpRequest, textStatus, errorThrown) {
        alert(errorThrown);
      }
    });
  } else {
    jQuery.ajax({
      type : "POST",
      url : BASEURL+'restaurant/getCustomAddOnsDetails',
      data : {"entity_id":entity_id,"restaurant_id":restaurant_id,"is_closed":is_closed,"recipe":recipe,"recipe_page":recipe_page},
      beforeSend: function(){
        $('#quotes-main-loader').show();
      },
      success: function(response) {
        $('#addonsMenuDetailModal').html(response);
        $('#addonsMenuDetailModal').modal('show');
        $('#quotes-main-loader').hide();   
      },
      error: function(XMLHttpRequest, textStatus, errorThrown) {
        alert(errorThrown);
      }
    });
  }
}
function checkRestaurantinCart(entity_id,restaurant_id,is_addon,item_id,is_closed,recipe_page) {
  jQuery.ajax({
    type : "POST",
    url : BASEURL+'cart/checkCartRestaurant',
    data : {"restaurant_id":restaurant_id},
    beforeSend: function(){
        $('#quotes-main-loader').show();
    },
    success: function(response) {
      $('#quotes-main-loader').hide();
      if (response == 0) {
        // another restaurant
        $('#menuDetailModal').modal('hide');
        $('#addonsMenuDetailModal').modal('hide');
        $('#rest_entity_id').val(entity_id);
        $('#rest_restaurant_id').val(restaurant_id);
        $('#rest_is_addon').val(is_addon);
        $('#item_id').val(item_id);
        $('#is_closed1').val(is_closed);
        $('#anotherRestModal').modal('show');
      }
      if (response == 1) {
        // same restaurant
        AddToCart(entity_id,restaurant_id,item_id,recipe_page);
      }
    },
    error: function(XMLHttpRequest, textStatus, errorThrown) {
      alert(errorThrown);
    }
  });
}
//for customized items
function checkaddonsRestaurantinCart(entity_id,is_addon,item_id,is_closed="",mandatory,mandatory_arr,recipe_page) {
  var restaurant_id = $("#restaurant_id").val();
  var user_id = $("#user_id").val();
  var totalPrice = $('#subTotal1').val();
  //addons category mandatory changes :: start
  var addons_mandatory = JSON.parse(mandatory_arr);
  var checked_mandatory = 'no';
  var cat_name_str = '';
  if(addons_mandatory) {
    for(let i=0; i<addons_mandatory.length; i++){
      var id_val = addons_mandatory[i];
      var get_category_elements = document.querySelectorAll('[addons_category_id1="'+id_val+'"]');
      
      if(get_category_elements[0].type == 'radio') { //for radio
          var radioValue = $("input[name='"+get_category_elements[0].name+"']:checked").val(); 
          if(radioValue){
            checked_mandatory = 'yes';
          } else {
            checked_mandatory = 'no';
          }
      } else { //for checkbox
          checked_mandatory = 'no';
          for (let j = 0; j < get_category_elements.length; j++) {
            if(get_category_elements[j].checked){
              checked_mandatory = 'yes';
            }
          }
      }
      if(checked_mandatory == 'no'){
        cat_name_str = document.getElementsByName(get_category_elements[0].name)[0].getAttribute("addons_category");
        break;
      }
    }
  }
  //addons category mandatory changes :: end
  if(mandatory==0 || (mandatory==1 && checked_mandatory=='yes' && totalPrice>0))
  { 
    jQuery.ajax({
      type : "POST",
      url : BASEURL+'cart/checkCartRestaurant',
      data : {"restaurant_id":restaurant_id},
      beforeSend: function(){
          $('#quotes-main-loader').show();
      },
      success: function(response) {
        $('#quotes-main-loader').hide();
        if (response == 0) {
          // another restaurant
          $('#menuDetailModal').modal('hide');
          $('#addonsMenuDetailModal').modal('hide');
          $('#rest_entity_id').val(entity_id);
          $('#rest_restaurant_id').val(restaurant_id);
          $('#rest_is_addon').val(is_addon);
          $('#item_id').val(item_id);
          $('#is_closed1').val(is_closed);
          $('#anotherRestModal').modal('show');
        }
        if (response == 1) {
          customMenuDetails(entity_id,restaurant_id,item_id,is_closed,mandatory,recipe_page);
        }
      },
      error: function(XMLHttpRequest, textStatus, errorThrown) {
        alert(errorThrown);
      }
    });
  } else {
    if(mandatory == 1){
      if(SELECTED_LANG == 'en') {
        bootbox.alert({
            message: "Please select atleast one item from "+ cat_name_str +".",
            buttons: {
                ok: {
                    label: "Ok",
                }
            }
        });
      } else if(SELECTED_LANG == 'fr') {
        bootbox.alert({
          message: "Veuillez sélectionner au moins un élément de "+ cat_name_str +".",
          buttons: {
            ok: {
                label: "D'accord",
            }
          }
        });
      } else {
        bootbox.alert({
          message: "يرجى تحديد عنصر واحد على الأقل من " +" "+cat_name_str+".",
          buttons: {
            ok: {
                label: "نعم",
            }
          }
        });
      }
    }
  }
}
//get item price on addons menu details popup
var totalPrice_addons = 0;
var radiototalPrice_addons = 0;
var checktotalPrice_addons = 0;
function getaddonsItemPrice(id,price,is_multiple){ 
    
    if (is_multiple != 1) {
      radiototalPrice_addons = 0;
      //$("#custom_items_form1 input[type=radio]:checked").each(function() { 
      $("input:radio.radio_addons1:checked").each(function() {  
        var sThisVal = (this.checked ? $(this).attr("amount1") : 0);
        radiototalPrice_addons = parseFloat(radiototalPrice_addons) + parseFloat(sThisVal);
      });
    }
    else
    {
      checktotalPrice_addons = 0;
      $('.check_addons1:checkbox:checked').each(function () { 
        var sThisVal = (this.checked ? $(this).attr("amount1") : 0);
        checktotalPrice_addons = parseFloat(checktotalPrice_addons) + parseFloat(sThisVal);        
      });
    }
    totalPrice_addons = radiototalPrice_addons + checktotalPrice_addons;
    var total_display = $('#subTotal_for_cal').val();
    totalPrice_addons = totalPrice_addons + parseFloat(total_display);
    $('#totalPrice1').html(totalPrice_addons.toFixed(2));
    $('#subTotal1').val(totalPrice_addons.toFixed(2));
}
// check the item in cart if it's already added : only for addons items
function customMenuDetails(entity_id,restaurant_id,item_id,is_closed="",mandatory,recipe_page){
  jQuery.ajax({
    type : "POST",
    url : BASEURL+'cart/checkMenuItem' ,
    data : {"entity_id":entity_id,"restaurant_id":restaurant_id},
    beforeSend: function(){
        $('#quotes-main-loader').show();
    },
    success: function(response) {
      $('#quotes-main-loader').hide();
      if (response == 1) {
        $('#con_entity_id1').val(entity_id);
        $('#con_restaurant_id1').val(restaurant_id);
        $('#con_item_id1').val(item_id);
        $('#is_closed1').val(is_closed);
        $('#con_item_mandatory').val(mandatory);
        $('#addonsMenuDetailModal').modal('hide');
        $('#myconfirmModalDetails').modal('show');
      }
      else
      {
        AddAddonsToCartDetails(entity_id,item_id,mandatory,recipe_page);
      }
    },
    error: function(XMLHttpRequest, textStatus, errorThrown) {
      alert(errorThrown);
    }
  });
}
function AddAddonsToCartDetails(menu_id,item_id,mandatory,recipe_page){ 
    var restaurant_id = $("#restaurant_id").val();
    var user_id = $("#user_id").val();
    var totalPrice1 = ($('#subTotal1').val()=='0')? $('#subTotal_for_cal').val() : $('#subTotal1').val();
    var valueArray = new Array();
    $('.check_addons1:checkbox:checked').each(function () { 
      var addonValue = jQuery.parseJSON($(this).attr("addonValue"));
      var addons_category = $(this).attr("addons_category");
      var addons_category_id = $(this).attr("addons_category_id1");    
      if (valueArray.length > 0) {
        jQuery.each( valueArray, function( key, value ) { 
          var new_addons_list = new Array();
          if (value.addons_category_id == addons_category_id) {
            var addonslist = value.addons_list;
            if (Array.isArray(value.addons_list) == false) {
              new_addons_list.push({
                "add_ons_id": value.addons_list.add_ons_id, 
                "add_ons_name": value.addons_list.add_ons_name,
                "add_ons_price": value.addons_list.add_ons_price
              });
            }
            else
            { 
              if (addonslist.length > 0) {
                jQuery.each(addonslist, function( key, value ) { 
                  new_addons_list.push(value);
                });
              } 
            }
            new_addons_list.push(addonValue);
            value.addons_list = new_addons_list;
          }
          else
          {
            valueArray.push({
              'addons_category_id':addons_category_id,
              'addons_category':addons_category,
              'addons_list':addonValue
            });
          }
        });
      }
      else
      {
        valueArray.push({
              'addons_category_id':addons_category_id,
              'addons_category':addons_category,
              'addons_list':addonValue
        });
      }
    });
    $("#custom_items_form1 input[type=radio][class='radio_addons1']:checked").each(function() { 
      var addonValue = jQuery.parseJSON($(this).attr("addonValue"));
      var addons_category = $(this).attr("addons_category");
      var addons_category_id = $(this).attr("addons_category_id1");
      var new_addons_list = new Array();
      if (valueArray.length > 0) { 
        jQuery.each( valueArray, function( key, value ) {
          if (value.addons_category_id == addons_category_id) {
            new_addons_list.push(value.addons_list);
            new_addons_list.push(addonValue);
            valueArray.splice(key, 1);
          }
        });
      }
      if (new_addons_list.length > 0) {
        addonValue = new_addons_list;
      }
      valueArray.push({
            'addons_category_id':addons_category_id,
            'addons_category':addons_category,
            'addons_list':addonValue
      });
    });
    var arr = [];
    var addons_category_id_arr = [];
    if (valueArray.length > 0) { 
      jQuery.each( valueArray, function( key, value ) { 
        var addons = value.addons_list;
        var addons_count = addons.length;
        addons_category_id_arr.push(value.addons_category_id);
        arr.push({
          'addons_category_id':value.addons_category_id,
          'key':key,
          'addons_count':(addons_count)?addons_count:0
        });
      });
    }
    var unique_addons_category = [];
    $.each(addons_category_id_arr, function(i, el){
        if($.inArray(el, unique_addons_category) === -1) unique_addons_category.push(el);
    });
    var maxval = [];
    var arrkeys = [];
    if (unique_addons_category.length > 0) {
      jQuery.each( unique_addons_category, function( key, value ) {
        var max = 0;
        var keyvalue = '';
        if (arr.length > 0) {
          jQuery.each( arr, function( arrkey, arrvalue ) {
            if (arrvalue.addons_category_id == value) {
              if(max <= arrvalue.addons_count){
                max = arrvalue.addons_count;
                keyvalue = arrvalue.key;
              }
            }
          });
          maxval.push({ 
            'id':value,
            'addons_count': max,
            'key': keyvalue
          });
          arrkeys.push(keyvalue);
        }
      });
    }
    var finalValueArray = [];
    // to unset the duplicate keys
    if (valueArray.length > 0) {
      jQuery.each( valueArray, function( key, value ) {
        if (arrkeys.length > 0) {
          if(jQuery.inArray(key, arrkeys) !== -1) { 
            finalValueArray.push(value);
          }
        }
        else
        {
          finalValueArray = valueArray;
        }
      });
    }
    if (mandatory==0 || (mandatory==1 && finalValueArray.length > 0)) {
      jQuery.ajax({
        type : "POST",
        url : BASEURL+'cart/addToCart',
        data : {'menu_id_m':menu_id,'user_id':user_id,'restaurant_id':restaurant_id,'totalPrice':totalPrice1,'add_ons_array':finalValueArray},
        beforeSend: function(){
            $('#quotes-main-loader').show();
        },
        success: function(response) {
          /*$("body").load('#cart >*',function(){
            $('#quotes-main-loader').hide();
          });*/
          if (recipe_page=='recipe'){
            window.location.replace(BASEURL+'cart');
          }else if (recipe_page=='checkout_as_guest'){
            window.location.replace(BASEURL+'checkout/checkout_as_guest');
          }
          $('#quotes-main-loader').hide();
          $('#myModal').modal('hide');
          $('#addonsMenuDetailModal').modal('hide');
          
          $('#your_cart').html(response);
          $('.'+item_id).html(ADDED);
          $('.'+item_id).removeClass('add');
          $('.'+item_id).addClass('added');
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {           
          alert(errorThrown);
        }
      });
   } else {
      if(mandatory==1) {
        if(SELECTED_LANG == 'en') {
          bootbox.alert({
              message: "Please select atleast one item.",
              buttons: {
                  ok: {
                      label: "Ok",
                  }
              }
          });
        } else if(SELECTED_LANG == 'fr') {
          bootbox.alert({
            message: "Veuillez sélectionner au moins un élément.",
            buttons: {
              ok: {
                  label: "D'accord",
              }
            }
          });
        } else {
          bootbox.alert({
            message: "الرجاء تحديد عنصر واحد على الأقل.",
            buttons: {
              ok: {
                  label: "نعم",
              }
            }
          });
        }
      }
    }
}
function ConfirmCartAddDetails(recipe_page){
  var entity_id = $('#con_entity_id1').val();
  var restaurant_id = $('#con_restaurant_id1').val();
  var item_id = $('#con_item_id1').val();
  var mandatory = $('#con_item_mandatory').val();
  var cart = $('input[name="addedToCart1"]:checked').val();
  $('#myconfirmModalDetails').modal('hide');
  if (cart == "increaseitem1") {
    customItemCount(entity_id,restaurant_id,'plus','',recipe_page);
  }
  else
  {
    AddAddonsToCartDetails(entity_id,item_id,mandatory,recipe_page);
  }
  return false;
}
//new changes for menu details on image click :: end
function ViewRecipe(menu_item_id){
  jQuery.ajax({
    type : "POST",
    url : BASEURL+'restaurant/viewRecipe',
    data : {"menu_item_id":menu_item_id},
    beforeSend: function(){
        //$('#quotes-main-loader').show();
    },
    success: function(response) {
      $('#quotes-main-loader').hide();
    window.open(BASEURL+'recipe/recipe-detail/'+response,"_self");
    },
    error: function(XMLHttpRequest, textStatus, errorThrown) {
      alert(errorThrown);
    }
    });
}
//driver tip changes :: start
function applyTip(action) {
  var tip_amount = $('#driver_tip').val();
  if(tip_amount){
    jQuery.ajax({
      type : "POST",
      dataType : 'html',
      url : BASEURL+'checkout/applyTip',
      data : {"tip_amount":tip_amount,"action":action},
      beforeSend: function(){
          $('#quotes-main-loader').show();
      },
      success: function(response) {
        $('#quotes-main-loader').hide();
        $('#ajax_order_summary').html(response);
        if(action=='apply'){
          $('#tip_submit_btn').attr('disabled',false);
          $("#tip_clear_btn").attr("disabled", false);
        } else {
          $('#tip_submit_btn').attr('disabled',true);
          $("#tip_clear_btn").attr("disabled", true);
          $("#custom_tip").val(null);
          $(".tip_row a").removeClass("tip_selected");
        }
      },
      error: function(XMLHttpRequest, textStatus, errorThrown) {           
        alert(errorThrown);
      }
    });
  }
}
function tip_selected(tip_amount,id_selected) {
 $("#custom_tip_error").hide();
  if(id_selected=='custom_tip'){
    if($("#"+id_selected).val() !=""){
      //if (/^\d{0,4}(\.\d{1,2})?$/.test($("#"+id_selected).val())) {
      // it allow 2 decimal points only
      if (/^(?:\d*\.\d{1,2}|\d+)$/.test($("#"+id_selected).val())) {
        $('#driver_tip').val(tip_amount);
        $(".tip_row a").removeClass("tip_selected");
        if(id_selected!='custom_tip'){
          $('#'+id_selected).addClass('tip_selected');
          $("#custom_tip").val('');
        } else {
          $("#custom_tip").val(parseFloat(tip_amount));
        }
      
        $('#tip_submit_btn').attr('disabled',false);
        $("#tip_clear_btn").attr("disabled", false);
      }
      else {
        $("#custom_tip_error").show();
        $('#tip_submit_btn').attr('disabled',true);
        $("#tip_clear_btn").attr("disabled", true);
      }
    }
  }  
  else {
    //console.log(tip_amount);
    if(tip_amount){
      $('#driver_tip').val(tip_amount);
      $(".tip_row a").removeClass("tip_selected");
      if(id_selected!='custom_tip'){
        $('#'+id_selected).addClass('tip_selected');
        $("#custom_tip").val('');
      } else {
        $("#custom_tip").val(parseFloat(tip_amount));
      }
    
      $('#tip_submit_btn').attr('disabled',false);
      $("#tip_clear_btn").attr("disabled", false);
    } else {
      $('#tip_submit_btn').attr('disabled',true);
      $("#tip_clear_btn").attr("disabled", true);
    }
  }
}
//driver tip changes :: end
//re-order changes :: start
function reorder_details(order_id){
  if (order_id) {
    jQuery.ajax({
      type : "POST",
      dataType : "html",
      url : BASEURL+'myprofile/getReOrderDetails',
      data : {"order_id":order_id},
      beforeSend: function(){
        $('#quotes-main-loader').show();
      },
      success: function(response) {
        $('#quotes-main-loader').hide();
        $('#reorder-details').html(response);
        $('#reorder-details').modal('show');
      },
      error: function(XMLHttpRequest, textStatus, errorThrown) {
        alert(errorThrown);
      }
    });
  }
}
//check if cart has items
function checkCartOnReorder(restaurant_id, menu_arr){
  jQuery.ajax({
    type : "POST",
    url : BASEURL+'cart/checkCartOnReorder',
    beforeSend: function(){
      $('#quotes-main-loader').show();
    },
    success: function(response) {
      $('#quotes-main-loader').hide();
      var user_id = $("#user_id").val();
      var menuDetailsArray = new Array();
      if(menu_arr.length>0){
        for (var i = 0; i < menu_arr.length; i++) {
          var itemTotal = jQuery.parseJSON(menu_arr[i].itemTotal);
          var menu_id = jQuery.parseJSON(menu_arr[i].menu_id);
          if(menu_arr[i].addonValue !=''){
            var addonValue = jQuery.parseJSON(menu_arr[i].addonValue);
          } else {
            var addonValue = '';
          }
          menuDetailsArray.push({
            'menu_id':menu_id,
            'menu_qty':menu_arr[i].menu_qty,
            'itemTotal':itemTotal,
            'is_addon': menu_arr[i].is_addon,
            'addons_category_list':addonValue
          });
        }
      }
      if (response == 0) {
        //cart empty : proceed with addToCart
        addReorderItemsToCart(menuDetailsArray,restaurant_id,user_id);
      }else if (response == 1) {
        //cart not empty :: display modal
        $('#menuDetailsArray').val(JSON.stringify(menuDetailsArray));
        $('#rest_restaurant_id').val(restaurant_id);
        $('#rest_user_id').val(user_id);
        $('#reorder-details').modal('hide');
        $('#cartNotEmpty').modal('show');
      }
    },
    error: function(XMLHttpRequest, textStatus, errorThrown) {
      alert(errorThrown);
    }
  });
}
function ConfirmCartItemsOnReorder(){
  var menuDetailsArray = JSON.parse($('#menuDetailsArray').val());
  var restaurant_id = $('#rest_restaurant_id').val();
  var user_id = $('#rest_user_id').val();
  var items = $('input[name="addNewItems"]:checked').val();
  $('#cartNotEmpty').modal('hide');
  if (items == "discardOld") {
    jQuery.ajax({
      type : "POST",
      url : BASEURL+'cart/emptyCart',
      success: function(response) { 
        addReorderItemsToCart(menuDetailsArray,restaurant_id,user_id);
      },
      error: function(XMLHttpRequest, textStatus, errorThrown) {
        alert(errorThrown);
      }
    });
  }
  return false;
}
function addReorderItemsToCart(menuDetailsArray,restaurant_id,user_id) {
  jQuery.ajax({
    type : "POST",
    dataType :"json",
    url : BASEURL+'cart/addReorderItemsToCart',
    data : {'menuDetailsArray':menuDetailsArray,'user_id':user_id,'restaurant_id':restaurant_id},
    beforeSend: function(){
        $('#quotes-main-loader').show();
    },
    success: function(response) {
      $('#quotes-main-loader').hide();
      $('#reorder-details').modal('hide');
      $('#cart_count').html(response.cart_count);
      if(response.show_message != ''){
        var box = bootbox.alert({
          message: response.show_message,
          buttons: {
              ok: {
                  label: response.oktxt,
              }
          },
          callback: function () {
            if(response.cart_count>0) {
              window.location.href = BASEURL+"cart";
            }
          }
        });
        setTimeout(function() {
          box.modal('hide');
          if(response.cart_count>0) {
            window.location.href = BASEURL+"cart";
          }
        }, 10000);
      } else {
        if(response.cart_count>0) {
          window.location.href = BASEURL+"cart";
        }
      }
    },
    error: function(XMLHttpRequest, textStatus, errorThrown) {           
      alert(errorThrown);
    }
  });
}
//re-order changes :: end
//cancel order changes :: start
function cancel_order(order_id){
    if (order_id) {
        jQuery.ajax({
            type : "POST",
            dataType : "html",
            url : BASEURL+'myprofile/getCancelOrderReasons',
            data : {"order_id":order_id},
            beforeSend: function(){
                $('#quotes-main-loader').show();
            },
            success: function(response) {
                $('#quotes-main-loader').hide();
                $('#cancel-order').html(response);
                $('#cancel-order').modal('show');
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                alert(errorThrown);
            }
        });
    }
}
function cancel_order_reason(order_id,entity_id){
  var reason_id ="";
  var reason = "";
  var element = $("input[name='filter_reason']:checked").val(); 
  if(element != 'all'){
    var reason = element;
  }else{
    var reason = $('#other_reason').val();
  }
  if($('#all').is(':checked')){
    $("#cancel_reason_form").validate({
      rules: { 
          other_reason: {
          required: true,
          maxlength:255
          },
      } ,
      errorElement : 'div',
      errorPlacement: function(error, element) {
      var placement = $(element).data('error');
      if (placement) {
        $(placement).append(error);
      } else {
        error.insertAfter(element);
        }
      }  
  });
  }
  if(($('#all').is(':checked') && $("#other_reason").valid()==true) || ($('#all').is(':checked')==false)){
    if (order_id) {
        jQuery.ajax({
            type : "POST",
            dataType : "json",
            url : BASEURL+'myprofile/OrderCancel',
            data : {"order_id":order_id,"reason":reason,"user_id":entity_id},
            beforeSend: function(){
                $('#quotes-main-loader').show();
            },
            success: function(response) {
              $('#quotes-main-loader').hide();
              $('#cancel-order').modal('hide');
              if(response.is_cancel_order == 'yes'){
                var cancel_box = bootbox.alert({
                  message: ORDER_CANCELED,
                  buttons: {
                    ok: {
                        label: OK_TEXT,
                    },
                  },
                  callback: function(result){
                    location.href = BASEURL+'myprofile';
                  }
                });
                setTimeout(function() {
                  cancel_box.modal('hide');
                  location.href = BASEURL+'myprofile';
                }, 80000);
              } else {
                var cancel_box = bootbox.alert({
                  message: response.cancel_msg,
                  buttons: {
                    ok: {
                        label: response.oktxt,
                    }
                  },
                  callback: function(result){
                    location.href = BASEURL+'myprofile';
                  }
                });
                setTimeout(function() {
                  cancel_box.modal('hide');
                  location.href = BASEURL+'myprofile';
                }, 10000);
              }
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                alert(errorThrown);
            }
        });
    }
   } 
}
//cancel order changes :: end
// get more notifications
function moreNotifications(){
  $('#all_notifications').show();
  $('#load_more_notifications').hide();
}
/*table booking page js*/
function searchTables(page,err_msg,oktext){
    var searchTable = $('#searchTable').val();
    if ($.trim(searchTable) == '' || searchTable == undefined) {
    {
      var box = bootbox.alert({
            message: err_msg,
            buttons: {
                ok: {
                    label: oktext,
                }
            }
          });
          setTimeout(function() {
            box.modal('hide');
          }, 10000);
      }
    }
    else{
      jQuery.ajax({
      type : "POST",
      dataType :"html",
      url : BASEURL+"restaurant/ajax_table_booking",
      data : {'searchTable':searchTable,'page':''},
      beforeSend: function(){
          $('#quotes-main-loader').show();
      },
      success: function(response) {
        $('#sort_tables').html(response);
        $('#quotes-main-loader').hide();
      },
      error: function(XMLHttpRequest, textStatus, errorThrown) {           
        alert(errorThrown);
      }
      });
    }
  }
  $('#searchEvent').keypress(function(event){
      var keycode = (event.keyCode ? event.keyCode : event.which);
      if(keycode == '13'){
          event.preventDefault();
      }
  });
/*table booking page js ends*/
// table check availability submit
$("#check_table_availability").on("submit", function(event) {
  if ($("#check_table_availability").valid()) {
    var validator = $("#check_table_availability").validate();
    event.preventDefault();
      jQuery.ajax({
        type : "POST",
        url : BASEURL+'restaurant/checkTableAvailability',
        data : $('#check_table_availability').serialize(),
        beforeSend: function(){
            $('#quotes-main-loader').show();
        },
        success: function(response) {
          var response = JSON.parse(response);
          if (response.hasOwnProperty('incorrect_info')) {
            var box = bootbox.alert({
              message: response.show_message,
              buttons: {
                  ok: {
                      label: response.oktxt,
                  }
              },
            });
            setTimeout(function() {
              box.modal('hide');
            }, 10000);
          }
          if (response.hasOwnProperty('allow_table_booking')) {
            bootbox.confirm({ 
              message: response.allow_table_booking_text,
              buttons: {
                confirm: {
                  label: response.oktxt
                },
                cancel: {
                  label: response.canceltxt
                }
              },
              callback: function(result){
                if (result === true) {
                  location.reload();
                }
              }
            })
          }
          if(!response.hasOwnProperty('result') && (response.hasOwnProperty('more_capacity')) && response.hasOwnProperty('restaurant_capacity')){
            $('#booking-not-available-capicity').modal('show');
            $('#less').removeClass('display-yes');
            $('#less').addClass('display-no');
            $('#more').addClass('display-yes');
            $('#more').removeClass('display-no');
            $('#booking-not-available-capicity span').text(response['restaurant_capacity']);
          }
          if(!response.hasOwnProperty('result') && (response.hasOwnProperty('less_capacity')) && response.hasOwnProperty('restaurant_capacity')){
            $('#booking-not-available-capicity').modal('show');
            $('#more').removeClass('display-yes');
            $('#more').addClass('display-no');
            $('#less').removeClass('display-no');
            $('#less').addClass('display-yes');
            $('#booking-not-available-capicity span').text(response['restaurant_capacity']);
          }
          if (response.hasOwnProperty('result')) {
            if(response['result'] == "success"){
              $('#table-booking-available').modal('show');
            }
            if(response['result'] == "fail"){
              $('#booking-not-available').modal('show');
            }
          }
          if(response.hasOwnProperty('start_time_less') && response.hasOwnProperty('start_time_less_html')) {
            $('#start_time_less').html(response['start_time_less_html']);
            $('#booking-not-available-capicity').modal('show');
            $('#less').removeClass('display-yes');
            $('#less').addClass('display-no');
            $('#more').removeClass('display-yes');
            $('#more').addClass('display-no');
          }
          $('#quotes-main-loader').hide();
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {           
          alert(errorThrown);
        }
        }); 
      return false;
    }
});
// confirm table booking
function confirmTableBooking(){
  jQuery.ajax({
    type : "POST",
    url : BASEURL+'restaurant/bookTable',
    data : $('#check_table_availability').serialize(),
    beforeSend: function(){
        $('#quotes-main-loader').show();
    },
    success: function(response) {
      $('#quotes-main-loader').hide();
      var response = JSON.parse(response);
      if (response.hasOwnProperty('incorrect_info')) {
        $('#booking-available').modal('hide');
        var box = bootbox.alert({
          message: response.show_message,
          buttons: {
              ok: {
                  label: response.oktxt,
              }
          },
        });
        setTimeout(function() {
          box.modal('hide');
        }, 10000);
      }
      if (response.hasOwnProperty('allow_table_booking')) {
        $('#booking-available').modal('hide');
        bootbox.confirm({ 
          message: response.allow_table_booking_text,
          buttons: {
            confirm: {
              label: response.oktxt
            },
            cancel: {
              label: response.canceltxt
            }
          },
          callback: function(result){
            if (result === true) {
              location.reload();
            }
          }
        })
      }
      if (response.hasOwnProperty('result')) {
        if(response['result'] == "success"){
          $('#table-booking-confirmation').modal('show');
        }
        if(response['result'] == "fail"){
          $('#booking-not-available').modal('show');
        }
      }
    },
    error: function(XMLHttpRequest, textStatus, errorThrown) {           
      alert(errorThrown);
    }
    }); 
    return false;
}
// get table booking details
function table_booking_details(table_id){
    if (table_id) {
        jQuery.ajax({
            type : "POST",
            dataType : "html",
            url : BASEURL+ 'myprofile/getTableBookingDetails',
            data : {"table_id":table_id},
            beforeSend: function(){
                $('#quotes-main-loader').show();
            },
            success: function(response) {
                $('#quotes-main-loader').hide();
                $('#table-booking-details').html(response);
                $('#table-booking-details').modal('show');
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                alert(errorThrown);
            }
        });
    }
}
// get more table bookings
function moreTables(order_flag){
    if (order_flag == "upcoming") {
        $('#all_upcoming_tables').show();
        $('#more_upcoming_tables').hide();
    }
    if (order_flag == "past") {
        $('#all_past_tables').show();
        $('#more_past_tables').hide();
    }
}
// get more bookmarks
function moreBookmarkedRes(){
  $('#all_bookmarks').show();
  $('#load_more_bookmarks').hide();
}
function removeBookmark(restaurant_id){
    jQuery.ajax({
        type : "POST",
        url : BASEURL+'myprofile/removeBookmark',
        data : {'restaurant_id':restaurant_id},
        beforeSend: function(){
            $('#quotes-main-loader').show();
        },
        success: function(response) {
            $('#bookmarks').load(' #bookmarks >* ');
            $('#quotes-main-loader').hide();
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            alert(errorThrown);
        }
    });
}
//add bookmark restaurant
function addBookmark(restaurant_id){
  jQuery.ajax({
        type : "POST",
        url : BASEURL+'restaurant/addBookmark',
        data : {'restaurant_id':restaurant_id},
        beforeSend: function(){
            $('#quotes-main-loader').show();
        },
        success: function(response){
          $('.rest-detail-content > ul').load(' .rest-detail-content > ul >*');
          $('#quotes-main-loader').hide();
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            alert(errorThrown);
        }
    });
}
function showPositionCheckout(position) {
  getAddress(position.coords.latitude,position.coords.longitude,'checkout');
}
function locationFailCheckout() {
  /*getFavouriteResturants('');
  $('#distance_filter').hide();
  $('#distance_sort').hide();*/
}
$('#coupon_modal').on('hidden.bs.modal', function (e) {
  $('#coupon_searchval').val('');
});