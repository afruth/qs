Meteor.subscribe('allUsers');

Template.mainLayout.events = {
    'click #login-large': function(e) {
        e.preventDefault();
        Meteor.loginWithFacebook({
            requestPermissions: ['email', 'public_profile', 'user_friends']
        });
    },
    'click #askAQ': function (e) {
        Session.set('action', 'ask');
        Router.go('ask');
    },
    'click #logout': function (e) {
        e.preventDefault();
        Meteor.logout();
    },
    'click .submitSearch': function (e) {
        e.preventDefault();

        if ($('#search').val() != '')
            Router.go('search', {
                _id: encodeURIComponent($('#search').val())
            })
    },
    'click .delSearch': function (e) {
        e.preventDefault();
        e.stopPropagation();
        var search = $(e.currentTarget).data('qid');
        Meteor.users.update({
            _id: Meteor.userId()
        }, {
            $pull: {
                'profile.savedSearches': search
            }
        })
    },
    'click #toggleNav': function (e) {
        e.preventDefault();
        $('.row-offcanvas').toggleClass('active')
    }
};

Template.mainLayout.helpers({
    coins: function () {
        if (Meteor.user() && !Meteor.loggingIn())
            return Meteor.user().coins;

        return false;
    },
    user: function () {
        return Meteor.user();
    },
    safeUrl: function (text) {
        return encodeURIComponent(text);
    }
})

Template.mainLayout.rendered = function() {
            /* off-canvas sidebar toggle */
$('[data-toggle=offcanvas]').click(function() {
  	$(this).toggleClass('visible-xs text-center');
    $(this).find('i').toggleClass('glyphicon-chevron-left');
    $('.row-offcanvas').toggleClass('active');
    $('#lg-menu').toggleClass('hidden-xs').toggleClass('visible-xs');
    $('#xs-menu').toggleClass('visible-xs').toggleClass('hidden-xs');
    $('#btnShow').toggle();
});

}

//needed to show picture

Template._loginButtonsLoggedInDropdown.user_profile_picture = function () {
    return Meteor.user().profile.avatar;
};


Template._loginButtonsLoggedInDropdown.events({
    'click #login-buttons-edit-profile': function (event) {
        event.stopPropagation();
        Template._loginButtons.toggleDropdown();
        Router.go('/profile/me');
    }
});
