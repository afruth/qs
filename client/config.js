window.fbAsyncInit = function() {
    FB.init({
      appId      : '636219033141500',
      status     : true,
      xfbml      : true
    });
  };

Meteor.subscribe('allUsers');



Accounts.ui.config({
  requestPermissions: {
    facebook: ['user_likes','public_profile']
  }
});
