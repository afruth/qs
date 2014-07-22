Router.configure({
    layoutTemplate: 'mainLayout',
    trackPageView: true
});


Router.onBeforeAction(AccountsTemplates.ensureSignedIn, {
    except: ['qlist', 'question', 'search', 'profile']
});

Router.onRun(function () {
    $('.mainNav li').removeClass('active');
    Session.set('lastDate', new Date);

    _.each($('.mainNav li a'), function (item) {
        if ($(item).attr('href') === window.location.pathname)
            $(item).parent().addClass('active');
    })

    $('#search').val('');
})

//main routes

Router.map(function () {
    this.route('question', {
        path: '/q/:_id/*:text',
        waitOn: function () {
            return [Meteor.subscribe('specificQuestion', this.params._id), Meteor.subscribe('userData', Meteor.userId()), Meteor.subscribe('answers')]
        },
        action: function () {
            Session.set('questionId', this.params._id);
            this.render()
        },
        fastRender: true
    });
    this.route('answered', {
        path: '/answered',
        waitOn: function () {
            return [Meteor.subscribe('answeredQuestions', 20), Meteor.subscribe('userData', Meteor.userId()), Meteor.subscribe('answers')]
        },
        fastRender: true
    });
    this.route('qlist', {
        path: '/',
        waitOn: function () {
            return [Meteor.subscribe('allQuestions', 20), Meteor.subscribe('userData', Meteor.userId()), Meteor.subscribe('answers')]
        },
        fastRender: true
    });
    this.route('unanswered', {
        path: '/ulist',
        waitOn: function () {
            return [Meteor.subscribe('unansQuestions', 20), Meteor.subscribe('userData', Meteor.userId()), Meteor.subscribe('answers')]
        },
        fastRender: true
    });
    this.route('favorites', {
        path: '/flist',
        waitOn: function () {
            return [Meteor.subscribe('favQuestions', 20), Meteor.subscribe('userData', Meteor.userId()), Meteor.subscribe('answers')]
        },
        fastRender: true
    });
    this.route('mylist', {
        path: '/mylist',
        waitOn: function () {
            return [Meteor.subscribe('myQuestions', 20), Meteor.subscribe('userData', Meteor.userId()), Meteor.subscribe('answers')]
        },
        fastRender: true
    });
    this.route('search', {
        path: '/search/:_id',
        waitOn: function () {
            return [Meteor.subscribe('searchQuestions', 20, this.params._id), Meteor.subscribe('userData', Meteor.userId()), Meteor.subscribe('answers')]
        },
        action: function () {
            Session.set('searchText', decodeURIComponent(this.params._id));
            this.render();
        },
        fastRender: true
    });
    this.route('profile', {
        path: '/profile/:_id/*:text',
        waitOn: function () {
            if (this.params._id === 'me') {
                userDataId = Meteor.userId()
            } else {
                userDataId = this.params._id
            }
            Session.set('userProfile', userDataId);
            return [Meteor.subscribe('myQuestions', 20, userDataId), Meteor.subscribe('userData', Meteor.userId()), Meteor.subscribe('answers')]
        },
        fastRender: true
    });
    this.route('ask', {
        path: '/ask',
        waitOn: function () {
            return [Meteor.subscribe('userData', Meteor.userId()), Meteor.subscribe('answers')]
        },
        fastRender: true
    });
    this.route('privacy', {
        path: '/privacy',
        fastRender: true
    })
});
