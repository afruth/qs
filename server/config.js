
    var connectHandler = WebApp.connectHandlers; // get meteor-core's connect-implementation

    // attach connect-style middleware for response header injection
    Meteor.startup(function () {
      connectHandler.use(function (req, res, next) {
        res.setHeader('Strict-Transport-Security', 'max-age=2592000; includeSubDomains'); // 2592000s / 30 days
        //res.setHeader('Access-Control-Allow-Origin','*.facebook.com')
        return next();
      })
      ServiceConfiguration.configurations.remove({
        service: "facebook"
    });

       ServiceConfiguration.configurations.insert({
            service: "facebook",
            appId: '267763216744350',
            secret: '9d51f2c4b2f523b53a3d40fa2722d751'
        });

    })




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
        if (user.services.facebook) {
            picUrl = 'https://graph.facebook.com/' + user.services.facebook.id + '/picture';
        }
    }


    if (options.profile)
        user.profile = options.profile;
        user.profile.avatar = picUrl;
        user.coins = 500;
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
        data.image = siteUrl+'/qme.png' //'http://placekitten.com/' + randomW + '/' + randomH; // we can run db-access code in the headly callback
        data.title = 'Q, your gazilion useless assistants!'
        //checking if the url is a single question
        if (parts[1] === 'q') {
            var q = Qs.findOne(parts[2]);
            data.title = q.text;
            ansArray = _.map(q.answers, function(i){
                return i.answer;
            })
            data.content = ansArray.join(' | ');

            data.text = '<meta property="fb:app_id" content="267763216744350" /> \n' +
              '<meta property="og:type"   content="ro_questions:question" /> \n' +
              '<meta property="og:url"    content="'+ siteUrl + data.url + '" /> \n' +
              '<meta property="og:title"  content="' + data.title + '" /> \n' +
              '<meta property="og:image"  content="' + data.image + '" />\n' +
              '<meta property="og:description" content="' + data.content + '" />\n';

        } else if (parts[1] === 'search') {
            data.title = 'See questions containing ' + parts[2] + ' on Q';
            data.content = "It's super easy to answer them and ask your own questions."
            data.text = '<meta property="og:title" content="' + data.title + '" />\n'
                        + '<meta property="og:image" content="' + data.image + '" />\n'
                        + '<meta property="og:description" content="' + data.content + '" />\n'
                        + '<meta property="og:url" content="'+ siteUrl + data.url + '" />\n';
        } else if (parts[1] === 'profile') {
            uname = Meteor.users.findOne(parts[2]).profile.name
            data.title = 'See questions asked by ' + uname + ' on Q';
            data.content = "It's super easy to answer them and ask your own questions."
            data.text = '<meta property="og:title" content="' + data.title + '" />\n'
                        + '<meta property="og:image" content="' + data.image + '" />\n'
                        + '<meta property="og:description" content="' + data.content + '" />\n'
                        + '<meta property="og:url" content="'+ siteUrl + data.url + '" />\n';
        } else {
            data.content = "It's super easy to answer Q's and ask your own."
            data.url = '/'
            data.text = '<meta property="og:title" content="' + data.title + '" />\n'
                        + '<meta property="og:image" content="' + data.image + '" />\n'
                        + '<meta property="og:description" content="' + data.content + '" />\n'
                        + '<meta property="og:url" content="'+ siteUrl + data.url + '" />\n';
        }

        return data;

    },
    facebook: function (data) {
        return data.text;

    }
});
