Template.search.created = function() {
    Session.set('qlimit',20);
    Deps.autorun(function(){
        Meteor.subscribe('searchQuestions',Session.get('qlimit'),Session.get('searchText'));
    })
}

Template.search.helpers({
   searchQuery: function() {
     return Session.get('searchText');
   },
   question: function() {
       return Qs.search(Session.get('searchText'));
   },
   isAvailable: function(qid) {
        //we check if the user can vote
        //not logged in
        if (!Meteor.user() && !Meteor.loggingIn())
            return false;

       //already answered
        var hasAnswered = As.findOne({
            qid: qid._id,
            userId: Meteor.userId()
        });

        if (hasAnswered)
            return false;

        //his question
        if (qid.ownerId === Meteor.userId())
            return false;

        //out of coins
        if (qid.coins <= 0)
            return false;

        if (qid._id === Session.get('flipped'))
            return false;

        return true;

    },
    isSaved: function() {
        var us = Meteor.users.findOne({
            _id: Meteor.userId(),
            'profile.savedSearches': Session.get('searchText')
        })

        if (us)
            return 'disabled';

        return null;
    }
});

Template.search.events = {
    'click #loadMore': function(e) {
        e.preventDefault();

        Session.set('qlimit',Session.get('qlimit') + 20);
    },
    'click #saveSearch': function(e) {
        Meteor.users.update(Meteor.userId(),{
            $addToSet: {
                'profile.savedSearches': Session.get('searchText')
            }
        })
    }
}
