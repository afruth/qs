Qs.allow({
    insert: function (doc) {
        return true;
    },
    update: function (doc) {
        return true;
    },
    remove: function (doc) {
        return false;
    }
})


Accounts.onCreateUser(function (options, user) {
    if (user.services) {
        //we have services configured, let's see which one
        if (user.services.facebook)
            picUrl = 'https://graph.facebook.com/' + user.services.facebook.id + '/picture';

        if (user.services.twitter)
            picUrl = user.services.twitter.profile_image_url;

        if (user.services.google)
            picUrl = user.services.google.picture;
    } else if (user.emails && user.emails[0] && user.emails[0].address) {
        picUrl = Gravatar.imageUrl(user.emails[0].address);
    } else {
        picUrl = 'https://contulmeu.reginamaria.ro/Poze/Uploads/no.jpg';
    }


    if (options.profile)
        user.profile = options.profile;
    user.profile.avatar = picUrl;
    user.coins = 5000;
    return user;
})





Meteor.headly.config({
    data: function (req) {
        var url = Npm.require('url');
        var parts = url.parse(req.url).pathname.split('/'); //using url to determine og:title
        var randomW = Math.floor(Random.fraction() * 100) + 500;
        var randomH = Math.floor(Random.fraction() * 100) + 500
        var data = {}
        data.url = req.url;
        data.image = 'http://placekitten.com/' + randomW + '/' + randomH; // we can run db-access code in the headly callback
        data.title = 'Q, your gazilion useless assistants!'
        //checking if the url is a single question
        if (parts[1] === 'q') {
            data.title = Qs.findOne(parts[2]).text;
            data.content = 'Please help me by answering this question on Q.'
        } else if (parts[1] === 'search') {
            data.title = 'See questions containing ' + parts[2] + ' on Q';
            data.content = "It's super easy to answer them and ask your own questions."
        } else if (parts[1] === 'profile') {
            uname = Meteor.users.findOne(parts[2]).profile.name
            data.title = 'See questions asked by ' + uname + ' on Q';
            data.content = "It's super easy to answer them and ask your own questions."
        } else {
            data.content = "It's super easy to answer Q's and ask your own."
            data.url = '/'
        }

        return data;

    },
    facebook: function (data) {
        console.log('hello facebook')
        return '<meta property="og:title" content="' + data.title + '" />\n' + '<meta property="og:image" content="' + data.image + '" />\n' + '<meta property="og:description" content="' + data.content + '" />\n' + '<meta property="og:url" content="http://qme.meteor.com' + data.url + '" />\n';

    },
    twitter: function (data) {
        console.log('hello twitter')


        return '<meta name="twitter:card" content="summary_large_image">\n' + '<meta name="twitter:site" content="@andreasfruth">\n' + '<meta name="twitter:title" content="' + data.title + '">\n' + '<meta name="twitter:description" content="Asked with Q">\n' + '<meta name="twitter:image:src" content="' + data.image + '">\n'
    }
});
