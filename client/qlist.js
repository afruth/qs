Template.qlist.helpers({
   question: function() {
       return Qs.find({
           createdAt: {
                $lte: Session.get('lastDate')
            }
       },{
        sort: {
            createdAt: -1
        }
       });
    },
    slug: function(q) {
        return _.slugify( _(q.text).prune(60) );
    },
    newQuestion: function() {
        return Qs.find({
            createdAt: {
                $gt: Session.get('lastDate')
            }
        },{
        sort: {
            createdAt: -1
        }
       });
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

Template.qlist.created = function() {
    Session.set('qlimit',20);
    Deps.autorun(function(){
        Meteor.subscribe('allQuestions',Session.get('qlimit'));
    })
}

Template.loadMore.events = {
        'click #loadMore': function(e) {
        e.preventDefault();
        Session.set('qlimit',Session.get('qlimit') + 20);
    }
}

Template.loadMore.helpers({
    hasMore: function(count) {
        if (count < Session.get('qlimit'))
            return true;

        return false;
    }
})

Template.qtemplate.rendered = function() {
    loadAddThis();
};
Template.qtemplateown.rendered = function() {
    loadAddThis();
};


Template.qtemplate.events = {
    'click .answerButton': function(e) {
        e.preventDefault();
        var question = $(e.target).data("qid");
        var answer = $(e.target).attr("id");
        Meteor.call('vote',question,answer, function(e,s) {
            if(e)
                Errors.throw(e.reason);
        });
    }
}

Template.qtemplateown.events = {

}

Template.qtemplateown.rendered = function() {
    var that = this;
    Deps.autorun(function() {

        var que = Qs.findOne(that.data._id);
        q = que.answers;
        var preppedAnswer = [];
        var totalA = 0;
        _.each(q, function(item) {

                preppedAnswer.push([item.answer,item.number]);

                totalA = totalA + item.number;
            })

        var chartOpt = {
                chart: {
                    plotBackgroundColor: null,
                    plotBorderWidth: null,
                    plotShadow: false
                },
                title: {
                    text: totalA + ' answers'
                },
                tooltip: {
                    pointFormat: '<b>{point.percentage:.1f}%</b>'
                },
                plotOptions: {
                    pie: {
                        allowPointSelect: true,
                        cursor: 'pointer',
                        dataLabels: {
                            enabled: false
                        },
                        showInLegend: true
                    }
                },
                series: [{
                    type: 'pie',
                    name: 'Answers',
                    data: preppedAnswer
                }],
                exporting: {
                    enabled: false
                    }
            }

        $("#"+que._id).highcharts(chartOpt);

    })

}
Template.qtemplateown.helpers({
    preppedAnswers: function() {
        //we need to do stats on these answers
        q = this;
        var preppedAnswer = [];

        var totalA = 0;
        _.each(q.answers, function(item) {
            var answer = {};
            answer.text = item.answer;

            answer.count = item.number;

            preppedAnswer.push(answer);

            totalA = totalA + item.number;


        })

        var preppedA = _.sortBy(preppedAnswer, function(item) {
                return -item.count;
            })

        //var totalA = (ansArr)?ansArr.length:0;
        _.each(preppedA, function(item) {
            item.width = (item.count>0)?(item.count / totalA) * 100:0;
        })
        return preppedA;
    },
    totalAnswers: function() {
        q=this;
        var totalA = 0;
        _.each(q.answers, function(item) {

            totalA = totalA + item.number;


        })

        return totalA;
    },
    username: function() {
        owner = this.ownerId;
        var user = Meteor.users.findOne({_id:owner});
        user.slug = _.slugify(user.profile.name);
        return user;
    },
    notInFav: function() {
        that = this;
        var inFav = _.find(Meteor.user().profile.favorites, function(item) {
            return item === that._id;
        })

        if (inFav)
            return false;

        return true;
    },
    flipped: function() {
        return Session.get('flipped') === this._id;
    },
    slug: function(q) {
        return _.slugify( _(q.text).prune(60) );
    }
})
Template.qtemplate.helpers({
    username: function() {
        owner = this.ownerId;
        var user = Meteor.users.findOne({_id:owner});
        user.slug = _.slugify(user.profile.name);
        return user;
    },
    slug: function(q) {
        return _.slugify( _(q.text).prune(60) );
    }
})

Template.actionButtons.events = {
    'click .star': function(e) {
        Meteor.call('addToFavorites', $(e.currentTarget).data("qid"));
    },
    'click .bomb': function(e) {
        Meteor.call('bombQ', $(e.currentTarget).data("qid"));
    },
    'click .praise': function(e) {
        Meteor.call('praiseQ', $(e.currentTarget).data("qid"));
    },
    'click .increase': function(e) {
        Session.set('isIncreasing', $(e.currentTarget).data("qid"))
    },
    'click .addCoins': function(e) {
        var coins = $('#increaseCoins').val();
        if (coins != '' && coins > 0 && coins <= Meteor.user().coins) {

            Meteor.call("addToQuestion",$(e.currentTarget).data("qid"),Number(coins));
        }
        Session.set('isIncreasing', null)
    }
}

Template.actionButtons.rendered = function() {
    $('.actionButtons button').tooltip();
};

Template.actionButtons.helpers({
    notInFav: function() {
        that = this;
        var inFav = _.find(Meteor.user().profile.favorites, function(item) {
            return item === that._id;
        })

        if (inFav)
            return false;

        return true;
    },
    isPraised: function() {
        that = this;
        var hasBeen = _.find(that.praises, function(item) {
            return item === Meteor.userId();
        });

        if(hasBeen)
            return 'disabled';

        return null;
    },
    isBombed: function() {
        that = this;
        var hasBeen = _.find(that.bombs, function(item) {
            return item === Meteor.userId();
        });

        if(hasBeen)
            return 'disabled';

        return null;
    },
    isOwner: function() {
        return this.ownerId === Meteor.userId()
    },
    isIncreasing: function() {
        return Session.get('isIncreasing') === this._id;
    },
    coins: function() {
        return Meteor.user().coins;
    }
})

Template.flipButton.events= {
    'click .flip-off': function(e) {
        Session.set('flipped', $(e.currentTarget).data('qid'))
    },
    'click .flip-on': function(e) {
        Session.set('flipped', '')
    }
}

Template.flipButton.helpers({
    flipped: function() {
        return Session.get('flipped') === this._id;
    }
})

Template.shareButtons.helpers({
    location: function() {
        return window.location.origin;
    },
    config: function() {
        return {
            href: window.location.origin + '/q/' + this._id + '/' + _.slugify( _(this.text).prune(60) ),
            type: 'button_count'
        }
    }
})

Template.shareButtons.rendered = function() {
    try {
        FB.XFBML.parse();
        twttr.widgets.load();
    }catch(e) {}
}

Template.newQ.events = {
    'click .loadMore': function(e) {
        e.preventDefault();
        Session.set('lastDate',new Date);
    }
}
