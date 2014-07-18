Meteor.publish("userData", function (userId) {

    if (!userId)
        return Meteor.users.find({}, {
            fields: {
                services: 0,
                coins: 0,
                createdAt: 0
            }
        });


    if (userId === this.userId) {
        return Meteor.users.find({
            _id: this.userId
        }, {
            fields: {
                services: 1,
                coins: 1,
                createdAt: 1,
                privateProfile: 1
            }
        });
    }
})
Meteor.publish("allUsers", function () {
    return Meteor.users.find({}, {
        fields: {
            services: 0,
            coins: 0,
            createdAt: 0
        }
    });
})

Meteor.publish("myQuestions", function (limit, userId) {
    return Qs.find({
        ownerId: userId
    }, {
        sort: {
            createdAt: -1
        },
        limit: limit,
        fields: {
            givenAnswers: 0
        }
    })
});
Meteor.publish("favQuestions", function (limit) {

    if (this.userId)
        var favoriteQ = Meteor.users.findOne(this.userId).profile.favorites;

    if (!favoriteQ)
        favoriteQ = [];

    return Qs.find({
        _id: {
            $in: favoriteQ
        }
    }, {
        sort: {
            createdAt: -1
        },
        limit: limit,
        fields: {
            givenAnswers: 0
        }
    })
});

Meteor.publish("allQuestions", function (limit) {
    return Qs.find({}, {
        sort: {
            createdAt: -1
        },
        limit: limit,
        fields: {
            givenAnswers: 0
        }
    })
});

Meteor.publish("specificQuestion", function (qid) {
    return Qs.find({
        _id: qid
    }, {
        fields: {
            givenAnswers: 0
        }
    })
});

Meteor.publish("searchQuestions", function (limit, query) {
    return Qs.search(query, {
        limit: limit,
        sort: [['createdAt', 'desc']],
        fields: {
            givenAnswers: false
        }
    })
});

Meteor.publish('answers', function () {
    return As.find({
        userId: this.userId
    });
})
