//the ask template

//CREATED
Template.ask.created = function () {
    Session.set('action', 'ask');
    Session.set('qid',false);
    answerArray = [
        {
            id: Random.id(),
            value: ''
        },
        {
            id: Random.id(),
            value: ''
        }
    ];
    Session.set('answerArr', answerArray);
}

//EVENTS
Template.ask.events = {
    'click #addButon': function () {
        var answerArray = Session.get('answerArr');
        answerArray.push({
            id: Random.id()
        });
        Session.set('answerArr', answerArray);
    },
    'click #saveQ': function (e) {
        e.preventDefault();
        var arr = [];
        _.each($('.answer'), function (item) {
            if ($(item).val() != '')
                arr.push({
                    answer: $(item).val(),
                    number: 0
                })
        });

        var question = $('#question').val();

        if (question == '') {
            Errors.throw("You need to ask a question!");
            return;
        }

        if (_.isEmpty(arr)) {
            Errors.throw("You need to add at least two answers!");
            return;
        }

        var coins = $('#coins').val();

        if (coins != '') {
            totalCoins = Number(coins) + 50;
        } else {
            totalCoins = 50;
        }

        qobj = {
            text: question,
            answers: arr,
            ownerId: Meteor.userId(),
            coins: totalCoins,
        }


        Meteor.call('askQuestion', qobj, function (e, r) {
            if (e) {
                Errors.throw(e.reason);

                return;
            }

            console.log('R is',e,r);
            Session.set('action', 'answer');
            Meteor.subscribe('specificQuestion', r._id);

            Session.set('qid',r);

            //var q = Qs.findOne({_id:r});
            //console.log(q)
            if(r) {

                FB.login(function (e) {
                    if (!e.error) {
                        FB.api(
                          'me/ro_questions:ask',
                          'post',
                          {
                            access_token: Meteor.user().services.facebook.accessToken,
                            question: qHref(r)
                          },
                          function(response) {
                            console.log('Ask',response)
                          }
                        )
                    } else {
                        console.log('Question',e)
                    }

                }, {scope: 'publish_actions'});

            }

        });


    }
}


//HELPERS
Template.ask.helpers({
    coins: function () {
        return Meteor.user().coins;
    },
    noOfChars: function () {
        if (!Session.get("noOfCharsLeft"))
            Session.set("noOfCharsLeft", 500);


        return Session.get("noOfCharsLeft");
    },
    answerArray: function () {
        var answerArray = Session.get("answerArr")

        while (answerArray.length < 2) {
            answerArray.push({
                id: Random.id()
            })
        }
        while (answerArray.length > 6) {
            answerArray.pop();
        }
        Session.set('answerArr', answerArray);
        return answerArray;
    },
    leftAnswers: function () {
        var leftAnswers = 6 - Session.get("answerArr").length;
        return (leftAnswers > 0) ? leftAnswers : false;
    },
    isAsk: function () {
        return Session.get('action') === 'ask';
    }
});

//answer template

//EVENTS
Template.answer.events = {
    'click .delButton': function (e) {
        var thisId = $(e.target).attr("id");

        var answerArray = Session.get('answerArr');

        var filteredArray = _.filter(answerArray, function (item) {
            return item.id != thisId;
        });

        Session.set('answerArr', filteredArray);
    }
}

Template.shareOnFacebook.rendered = function() {
     try {
        FB.XFBML.parse();
    } catch (e) {}
}

Template.shareOnFacebook.helpers({
    share: function() {
        return qHref(Session.get('qid'));
    }
})
