#The Meteor Mutual Testing Fund design document

##General informations

###Versions:

|Date modified|Version. No|Author             | Modifications                             |
|:-----------:|:---------:|:------------------|-------------------------------------------|
|11 Aug 2014|0.0.1|Fruth Andreas|Initial version|
|12 Aug 2014|0.0.2|Fruth Andreas|Added page structure proposal, base packages|
|13 Aug 2014|0.0.3|Fruth Andreas|Started a discussion about the economy system|
|14 Aug 2014|0.0.4|Fruth Andreas|Ported document to Github|

###Purpose of this document
To provide a base for the future development of the MMTF application. To summarise ideas exposed so far on the MMTF Trello board and the MMTF Hackpad. To serve as a point of discussion between those involved.

##The Meteor Mutual Testing Fund (MMTF)
###About MMTF
The initial blog post found at http://lemur.ro/the-meteor-mutual-testing-fund/

####What if:
We could test other peoples apps and get tokens for that
We could pay tokens to other interested people and they test our app

###The app
Make a Meteor app, that allows all this process to happen. Users make accounts using the meteor developer oauth in order to ensure that it’s a Meteor user, and then it all starts.
###The testing request
In order to keep a balance, a request must cover a part of an app and should take somewhere around 5 minutes to test. The requester should try to describe what he wants as detailed as possible, with clear steps. 
The tester accepts a request, reads the instructions, goes to the site and does what is asked, then comes back to the MTTF app and gives feedback as detailed as possible.
The requester reads the answer and accepts it, and the tester gets the number of tokens set by the requester.
###Crossing the street
Then the tester, who has amassed a large amount of token wealth, becomes the requester and uses those tokens to get testers for it’s own app. That way everybody wins, nobody pays (cash) and the overall quality of the Meteor apps increases.
###A rating system
This would require a rating system to prevent or reduce abuse. People should rate the requesters for the quality and the level of detail of the requests and the testers for the quality and level of detail of the responses.+

##The database structure
The following collections are proposed as a starting point:

####UserAttributes
This collection will hold user attributes (for now the tokens). Can be extended in the future to build a full fledged profile (bio, access to testing devices etc.). 
###UserRatings
This collection will hold user ratings.

####Requests
This collection holds the requests. A request is open as long as the deadline is set and not met and has available tokens and not all undertaken tests are finished.

####Responses
A request can have multiple responses linked by requestId. A response can have multiple files attached.

####Comments
Comments can be posted on requests, responses, files linked by docId.

####Notifications
Notifications will be received when something that an user wants to follow has happened (ex: requester accepted your test, your request is out of tokens, has expired etc.).

####Files
Should have docId that links to the request / response this file is attached to, createdAt, modifiedAt. Owner is set through parent document.
Limits should be set for the files uploaded (proposed limits are 5 files, 5mb each max)

##The page structure
There will be a top menu containing the following elements (this menu is present on all pages):

####The login / signup widget (accounts-ui)
Will allow login or sign-up through Meteor developer account. For logged-in users should show an avatar

####The notifications widget
Notifications will be inline (in the top menu like LinkedIn). There will be a Notifications button, showing number of unread notifications.

###Pages / routes:

####Landing page / login / signup page
The landing page will act as a call to action area, also explaining what the app is about. 
The login / signup actions will be available here

####List of Requests page
Will load as default a list of latest requests. Can be filtered to show requests ordered by: token value, expiring date, author rating?, own requests, requests completed by current user, requests in progress for current user.
Contains: 
Post request button

####Request details page
This page will allow a overview of the request: All the request details (title, instructions, files attached, available tokens etc),  files attached to the request by the author, comments on this particular request (could also bring here comments on each file attached if we could devise a nice ui for it).
Also on this page, the author of the request should see responses in progress and finished responses.

####File details page
For start this page should show a file icon, file details (size etc) and a download button. In the future maybe we could integrate viewers, at least for jpg, png, pdf (pdf.js).
Also the comments on this file should be shown.

####Response detail page
This page should have two states: in progress and finished (includes cancelled).
Should show for in progress the name of the tester, and the timer until completion date if set. For finished should show the text entered by the tester, and any files attached by him.
Also comments are enabled for each request and for each file attached to it similar to requests.

####The profile page 
This page should show the selected user's profile, with ratings, latest completed tests / latest posted requests, bio if completed, twitter account maybe if set etc.

####The add a request page
A simple form to add a request, with validation and helpers like datetime picker, drag&drop uploads etc. Can be also used for editing a request.

####The add a response page
Same as above but for responses.

###Other UI elements:

####The rating widget
After each completed response, both parties should get a memo to rate the other party. This should be mandatory and nagging for both parties :). The rating will be done inline / in a popover in order to cut down on unnecessary routes.

##The workflows
This part should be a textual description of the workflows
 I should complete this part after we agree on the general ideas proposed.

####Registering
An unregistered user is presented with the front page and a call to action to register. Upon pressing register, the accounts-meteor login page opens and creates an user with respective credentials. The user is redirected to List of Requests page. On user account creation, the user will be awarded 500 tokens.

####Logging in
The user will press the login button and the same workflow as above will be followed. Upon logging in, the user will be redirected to the List of Requests page

####Posting a request
From the List of Request page, the user will be able to press a Post request button (proeminent)

##The economy
1. There will be an open economy. Tokens will be given at registration. We could set the number of tokens like that: initial tokens should be enough to pay 5 testers. There should be a minimum token value of 100 per test. Therefore initial token amount should be 500.
2. In the first round no regulating methods will be in place (except the self regulating part). In the second round, we'll devise a tax, that is calculated based on an algorithm in order to provide stable output.
3. In order to keep the flow going, we could add in the second round, an incentive to invite other users - refferral fee that should be payed in tokens. This way, people that really need to test their apps but don't have tokens can get some by promoting the app

##The packages
The following packages will be used as a starting point:
####iron-router
No need to justify here
####bootstrap-3
Same, we decided we'd go with bootstrap not semantic
####jquery
I believe it's still built-in
####underscore
Very useful with collection manipulation
####underscore-string
Very useful with string manipulation (prune, urlfy etc)
####collection2
Brings some order into collections (also validation)
####collection-helpers
Very nice package, allows us to create helpers directly on the collection, and use them in templates and code.
####accounts-ui
For login / sign-up logic.
####accounts-meteor-developer 
