Meteor.publish("userData", function (userId) {
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
Meteor.publish("profileData", function (userId) {
        return Meteor.users.find({
            _id: userId
        });
})


Meteor.publish('qUser', function(qid) {
   var uid = Qs.findOne({
        _id: qid
    }, {
        fields: {
            ownerId: 1
        }
    }).ownerId;

    return Meteor.users.find({
        _id: uid
    }, {
        fields: {
            services: 0,
            coins: 0,
            createdAt: 0
        }
    });
});
Meteor.publish("qlistUsers", function (limit) {
    var qius = Qs.find({}, {
        sort: {
            createdAt: -1
        },
        limit: limit + 20,
        fields: {
            givenAnswers: 0
        }
    }).fetch();
    var mappedQius = _.map(qius, function(i) {
        return i.ownerId;
    });

    return Meteor.users.find({
        _id: {
            $in: mappedQius
        }
    }, {
        fields: {
            services: 0,
            coins: 0,
            createdAt: 0
        }
    });
})

Meteor.publish("searchUsers", function (query,limit) {
    var qius = Qs.search(query, {
        limit: limit + 20,
        sort: [['createdAt', 'desc']],
        fields: {
            givenAnswers: false
        }
    }).fetch();
    var mappedQius = _.map(qius, function(i) {
        return i.ownerId;
    });

    return Meteor.users.find({
        _id: {
            $in: mappedQius
        }
    }, {
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
        limit: limit + 20,
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
        limit: limit + 20,
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
        limit: limit + 20,
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
        limit: limit + 20,
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
