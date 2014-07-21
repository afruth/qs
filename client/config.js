window.fbAsyncInit = function () {
    FB.init({
        appId: '267763216744350',
        status: true,
        xfbml: true,
        frictionlessRequests : true
    });
};

Accounts.ui.config({
    requestPermissions: {
        facebook: ['email', 'public_profile', 'user_friends','publish_actions']
    }
});
