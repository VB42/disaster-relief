# United Politics

HackTJ 2018 project for a messenger bot that analyzes politicians and legislature and informs the user. 

Check out our project on Devpost [here.](https://devpost.com/software/united-politics)

## How it works

The app utilizes the Messenger API for the actual platform and uses Wit.ai for the natural language processing of the user's commands. Node.js is used for the server, and ngrok is used so that Facebook can have a url it can point back to. We utilized the ProPublica API for the actual retrieving of bills and politicians.

Sample commands include: 

"get rubio's latest bill" -> returns the latest bill from a senator
"whats kaines latest congressional statement" -> returns the latest congresional statement from a senator
"get me info on immigration" -> returns a relevant bill on a topic you care about that's being debated right now
"compare sanders to cruz" -> returns a percentage of how alike the two senators are


## Challenges

The other code with the HTML and CSS seen in this project are from a previous idea we were working on at this hackathon. After 9-10 hours in the hackathon, we scrapped the original project of a disaster relief crowd funding system, due to a broken API and logistical problems.


## Main code

The main code for getting the information from ProPublica can be found in "messenger-bot-samples-master/chat-extensions/routes/webhooks.js". Although there isn't that much, it shows a proof of concept of an interactive way to engage in politics and hold politicians accountable. Other code was written as a modification to the messaging, receiving, and sending code that was given from Facebook as an example project.


## Acknowledgements

We'd like to thank Phone2Action for helping with the overall project throughout the app!

