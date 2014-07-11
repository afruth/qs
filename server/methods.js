Meteor.methods({
    vote: function (question, answer) {
        check(question, String);
        check(answer, String);

        var uid = this.userId

        //validating posibility to answer

        if (!uid)
            throw new Meteor.Error(401, 'User not allowed to answer.');

        //checking in question exists
        var q = Qs.findOne(question);

        if (!q)
            throw new Meteor.Error(404, 'Question not found.');


        //checking if answer is valid
        var a = _.find(q.answers, function (item) {
            if (item.answer === answer)
                return true;


            return false;
        });

        if (!a)
            throw new Meteor.Error(404, 'Not a possible answer.');

        //checking if not already answered
        var u = As.findOne({
            qid: question,
            userId: uid
        })

        if (u)
            throw new Meteor.Error(403, 'Already voted!');
        /*
        var u = _.find(q.givenAnswers, function(item) {
            if (item.answererId === uid)
                throw new Meteor.Error(403,'Already voted!');
        });
        */

        //everything ok. Let's do the voting
        Qs.update({
            _id: question,
            'answers.answer': answer
        }, {
            $push: {
                givenAnswers: {
                    answer: answer,
                    answererId: uid
                }
            },
            $inc: {
                coins: -1,
                'answers.$.number': 1
            }
        }, function (e) {
            if (e)
                throw new Meteor.Error(500, 'Server problems');

            As.insert({
                qid: question,
                userId: uid
            });

            Meteor.users.update(uid, {
                $inc: {
                    coins: 1
                }
            }, function (e) {
                if (e)
                    throw new Meteor.Error(500, 'Server problems');

                return true;
            })
        });
    },
    askQuestion: function (question) {

        check(question, Object);
        check(question.coins, Number);

        uid = this.userId;


        //validating on server
        if (!question.text)
            throw new Meteor.Error(500, 'Question required');

        if (!question.answers || question.answers.length < 2 || question.answers.length > 6)
            throw new Meteor.Error(500, 'Answers not proper');

        if (!this.userId)
            throw new Meteor.Error(401, 'You must be logged in!');

        if (Meteor.users.findOne(this.userId).coins - question.coins < -50)
            throw new Meteor.Error(403, "You don't have enough coins");


        var id = Qs.insert({
            text: question.text,
            answers: question.answers,
            ownerId: this.userId,
            coins: question.coins
        }, function (e, s) {
            if (e) {
                throw new Meteor.Error(500, "Server error");
            } else {
                Meteor.users.update({
                    _id: uid
                }, {
                    $inc: {
                        coins: -(question.coins - 50)
                    }
                }, function (e, s) {
                    if (e)
                        throw new Meteor.Error(500, "Server error");

                    return true;
                })
            }
        });

        return (null, id)
    },
    addCoins: function () {
        Meteor.users.update({}, {
            $set: {
                coins: 1000
            }
        }, {
            multi: true
        })
    },
    addToFavorites: function (qid) {
        check(qid, String);

        //add or remove from favorites the question
        //we first check if it exists

        var itIs = _.find(Meteor.users.findOne(this.userId).profile.favorites, function (item) {
            return item === qid;
        })

        if (itIs) { //we have to remove then
            Meteor.users.update(this.userId, {
                $pull: {
                    'profile.favorites': qid
                }
            })
            return true;
        }

        Meteor.users.update(this.userId, {
            $addToSet: {
                'profile.favorites': qid
            }
        })
        return true;

    },
    bombQ: function (qid) {
        check(qid, String);
        that = this;
        //add or remove from favorites the question
        //we first check if it exists

        var itIs = _.find(Qs.findOne(qid).bombs, function (item) {
            return item === that.userId;
        })

        if (itIs)
            return false;

        Qs.update(qid, {
            $addToSet: {
                'bombs': that.userId
            }
        })
        return true;

    },
    praiseQ: function (qid) {
        check(qid, String);
        that = this;
        //add or remove from favorites the question
        //we first check if it exists

        var itIs = _.find(Qs.findOne(qid).praises, function (item) {
            return item === that.userId;
        });
        if (itIs) {
            return false;
        } else {
            Qs.update(qid, {
                $addToSet: {
                    'praises': that.userId
                },
                $inc: {
                    coins: 1
                }
            })
            return true;
        }
    },
    randomAnswers: function (qid, number) {
        check(qid, String);
        check(number, Number);


        for (i = 0; i <= number; i++) {
            ansArr = Qs.findOne(qid).answers;

            Qs.update(qid, {
                $addToSet: {
                    givenAnswers: {
                        answer: Random.choice(ansArr),
                        answererId: Random.id()
                    }
                }
            })
        }
    },
    addToQuestion: function (qid, amount) {
        check(qid, String);
        check(amount, Number);

        if (!this.userId)
            throw new Meteor.Error(401, "Not logged in!");


        var user = Meteor.users.findOne(this.userId);

        if (amount < 0 && amount > user.coins)
            throw new Meteor.Error(404, "Not enough coins!");

        Qs.update(qid, {
            $inc: {
                coins: amount
            }
        }, function (e) {
            if (!e)
                Meteor.users.update(user._id, {
                    $inc: {
                        coins: -amount
                    }
                })
        })

    },
    indexQs: function () {
        var qs = Qs.find({}).fetch();

        _.each(qs, function (i) {
            console.log(i._id);
            Qs.index(i._id, function (e, s) {
                if (e) {
                    console.log(e);
                } else {
                    console.log('OK')
                }

            });
        })
    }
})
