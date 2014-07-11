window.fbAsyncInit = function() {
    FB.init({
      appId      : '636219033141500',
      status     : true,
      xfbml      : true
    });
  };

Meteor.subscribe('allUsers');

Router.configure({
  layoutTemplate: 'mainLayout',
  trackPageView: true
});


Router.onBeforeAction(AccountsTemplates.ensureSignedIn, {
    except: ['qlist','question','search','profile']
});

Router.onRun(function(){
    $('.mainNav li').removeClass('active');
    Session.set('lastDate', new Date);

    _.each($('.mainNav li a'), function(item){
        if($(item).attr('href') === window.location.pathname)
            $(item).parent().addClass('active');
    })

    $('#search').val('');
})

Accounts.ui.config({
  requestPermissions: {
    facebook: ['user_likes','public_profile']
  }
});

//main routes

Router.map(function() {
  this.route('question', {
      path: '/q/:_id/*',
      waitOn: function() {
          return [Meteor.subscribe('specificQuestion',this.params._id),Meteor.subscribe('userData', Meteor.userId()), Meteor.subscribe('answers')]
      },
      action: function() {
        Session.set('questionId',this.params._id);
          this.render()
      },
      fastRender: true
  });
  this.route('answered', {
      path: '/answered',
     waitOn: function() {
          return [Meteor.subscribe('answeredQuestions',20),Meteor.subscribe('userData', Meteor.userId()), Meteor.subscribe('answers')]
      },
      fastRender: true
  });
  this.route('qlist', {
      path: '/',
      waitOn: function() {
          return [Meteor.subscribe('allQuestions',20),Meteor.subscribe('userData', Meteor.userId()), Meteor.subscribe('answers')]
      },
      fastRender: true
  });
  this.route('unanswered', {
      path: '/ulist',
      waitOn: function() {
          return [Meteor.subscribe('unansQuestions',20),Meteor.subscribe('userData', Meteor.userId()), Meteor.subscribe('answers')]
      },
      fastRender: true
  });
  this.route('favorites', {
      path: '/flist',
      waitOn: function() {
          return [Meteor.subscribe('favQuestions',20),Meteor.subscribe('userData', Meteor.userId()), Meteor.subscribe('answers')]
      },
      fastRender: true
  });
  this.route('mylist', {
      path: '/mylist',
      waitOn: function() {
          return [Meteor.subscribe('myQuestions',20),Meteor.subscribe('userData', Meteor.userId()), Meteor.subscribe('answers')]
      },
      fastRender: true
  });
  this.route('search', {
      path: '/search/:_id',
      waitOn: function() {
          return [Meteor.subscribe('searchQuestions',20,this.params._id), Meteor.subscribe('userData', Meteor.userId()), Meteor.subscribe('answers')]
      },
      action: function() {
        Session.set('searchText',decodeURIComponent(this.params._id));
          this.render();
      },
      fastRender: true
  });
  this.route('profile', {
      path: '/profile/:_id/*',
      waitOn: function() {
          if (this.params._id === 'me')
          {
              userDataId = Meteor.userId()
          } else {
              userDataId = this.params._id
          }
          Session.set('userProfile',userDataId);
          return [Meteor.subscribe('myQuestions', 20,userDataId),Meteor.subscribe('userData', Meteor.userId()), Meteor.subscribe('answers')]
      },
      fastRender: true
  });
  this.route('ask', {
      path: '/ask',
      waitOn: function() {
          return [Meteor.subscribe('userData', Meteor.userId())]
      },
      fastRender: true
  });
});

Template.mainLayout.events = {
    'click #askAQ': function(e) {
        Session.set('action','ask');
        Router.go('ask');
    },
    'click #logout': function(e) {
        e.preventDefault();
        Meteor.logout();
    },
    'click .submitSearch': function(e) {
        e.preventDefault();

        if ($('#search').val() != '')
            Router.go('search',{_id: encodeURIComponent($('#search').val())})
    },
    'click .delSearch': function(e) {
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
    'click #toggleNav': function(e) {
        e.preventDefault();
        $('.row-offcanvas').toggleClass('active')
    }
};

Template.mainLayout.helpers({
    coins: function() {
        if (Meteor.user() && !Meteor.loggingIn())
            return Meteor.user().coins;

        return false;
    },
    user: function() {
        return Meteor.user();
    },
    safeUrl: function(text) {
        return encodeURIComponent(text);
    }
})


//needed to show picture

Template._loginButtonsLoggedInDropdown.user_profile_picture = function() {
    return Meteor.user().profile.avatar;
	};


Template._loginButtonsLoggedInDropdown.events({
    'click #login-buttons-edit-profile': function(event) {
        event.stopPropagation();
        Template._loginButtons.toggleDropdown();
        Router.go('/profile/me');
    }
});
