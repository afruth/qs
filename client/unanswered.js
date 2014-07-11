Template.unanswered.created = function() {
    Session.set('qlimit',20);
    Deps.autorun(function(){
        Meteor.subscribe('unansQuestions',Session.get('qlimit'));
    })
}

Template.unanswered.helpers({
   question: function() {
        return Qs.find({
        'givenAnswers.answererId': {
            $ne: Meteor.userId()
        },
        ownerId : {
            $ne: Meteor.userId()
        }
    }, {
        sort: {
            createdAt: -1
        }
    })
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

        /*
        var hasAnswered = _.find(qid.givenAnswers, function(item){
            return item.answererId === Meteor.userId();
        });*/

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

    }
});

Template.unanswered.events = {
    'click #loadMore': function(e) {
        e.preventDefault();

        Session.set('qlimit',Session.get('qlimit') + 20);
    }
}
