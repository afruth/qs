RegExp.escape = function (s) {
    return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&amp;');
};

AccountsTemplates.init();

siteUrl = 'https://qme.meteor.com';
qHref = function(q) {
    console.log(siteUrl + '/q/' + q._id + '/' + _.slugify(_(q.text).prune(60)))
    return (siteUrl + '/q/' + q._id + '/' + _.slugify(_(q.text).prune(60)));
};
