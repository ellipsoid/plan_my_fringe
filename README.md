plan_my_fringe
==============

To visit the live site, please go to http://plan-my-fringe.herokuapp.com/ (If the dyno
 is sleeping, this make take a few seconds.)

### Purpose

plan_my_fringe is designed to help attendees of a large performance 
festival choose when to see their selected shows. Keeping track of time conflicts between 
shows can be a burden, and this app aims to alleviate that burden.

### Use

Users select the shows and times they are interested in, and then begin selecting 
their performances. In the performance-selecton tab, the app filters out any performances 
that
+ do not match the chosen shows and/or times, or 
+ conflict with a performance already selected

### Technology

The site is built with an AngularJS frontend on top of a Sinatra backend, and uses 
OAuth (omniauth) for authentication.
