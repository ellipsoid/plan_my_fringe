plan_my_fringe
==============

To visit the live site, please go to http://plan-my-fringe.herokuapp.com/

### Purpose

Plan my fringe was designed to help attendees of a large performance 
festival choose when to their selected shows. Keeping track of time conflicts between 
shows can be a burden for attendees planning their schedule, and this app aims 
to alleviate that burden.

### Use

On the first tab, users select the shows they would like to see. On the second tab, 
users select the times they are available to see shows. And on the third tab, the user 
selects the performances they would like to see.

On the third tab, the app filters the performances to hide shows and times that the user 
doesn't care about, and also filters out any performances that would cause a time 
conflict with performances the user has already selected.

### Technology

The site is built with an AngularJS frontend on top of a Sinatra backend, and uses 
OAuth (omniauth) for authentication.
