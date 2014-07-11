Qs = new Meteor.Collection("qs", {search: true, autoindex: true});

var Schemas = {};

Schemas.Q = new SimpleSchema({
    text: {
        type: String,
        label: 'Q',
        max: 500,
        index: 1
    },
    answers: {
        type: [Object],
        label: "Answers"
    },
    'answers.$.answer': {
        type: String,
        label: "Answer"
    },
    'answers.$.number': {
        type: Number,
        label:""
    },
    givenAnswers: {
        type: [Object],
        optional: true
    },
    'givenAnswers.$.answererId': {
        type: String
    },
    'givenAnswers.$.answer': {
        type: String
    },
    ownerId: {
        type: String,
        label: "Author ID"
    },
    coins: {
        type: Number,
        label: "Invested coins"
    },
    praises: {
        type: [String],
        label: "Number of praises",
        optional: true
    },
    bombs: {
        type: [String],
        label: "Number of reports",
        optional: true
    },
    createdAt: {
        type: Date,
        label: "Date of creation",
        autoValue: function() {
           if (this.isInsert) {
              return new Date;
            } else if (this.isUpsert) {
              return {$setOnInsert: new Date};
            } else {
              this.unset();
            }
        }
    }
});

Qs.attachSchema(Schemas.Q);

As = new Meteor.Collection("as");

Schemas.A = new SimpleSchema({
    qid: {
        type: String,
        label: 'Question ID'
    },
    userId: {
        type: String,
        label: 'Answer author'
    }
});

As.attachSchema(Schemas.A);
