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
