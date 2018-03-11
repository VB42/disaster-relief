/**
 * Copyright 2017-present, Facebook, Inc. All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 */

// ===== MODULES ===============================================================
import express from 'express';


// ===== MESSENGER =============================================================
import receiveApi from '../messenger-api-helpers/receive';
import sendApi from '../messenger-api-helpers/send';


const router = express.Router();
  

/**
 * This is used so that Facebook can verify that they have
 * the correct Webhook location for your app.
 *
 * The Webhook api must be set in your app's configuration page
 * as well as in your servers environment.
 */


router.get('/', (req, res) => {
  //console.log(req);

  if (req.query['hub.verify_token'] === "yjbujn") {
    res.send(req.query['hub.challenge']);
  } else {
    res.send('Error, wrong token');
  }
});

var dictid = {}

var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

var xhr = new XMLHttpRequest();


xhr.open("GET", "https://api.propublica.org/congress/v1/115/senate/members.json", false);
xhr.setRequestHeader("X-API-Key", "iNjfHXFfsKjig0ujma5m5aooz2td8yyb3WJA00H5");
xhr.send();

var parse = JSON.parse(xhr.responseText)["results"][0]["members"];

for(var i = 0; i < parse.length; i++){
  var last = parse[i]["last_name"].toLowerCase(), id = parse[i]["id"];
  dictid[last] = id;

} 


/**
 * Once your Webhook is verified this is where you will receive
 * all interactions from the users of you Messenger Application.
 *
 * You can subscribe to many different types of messages.
 * However for this demo we've only handled what is necessary:
 * 1. Regular messages
 * 2. Postbacks
 */


router.post('/', (req, res) => {
    /*
    You must send back a status of 200(success) within 20 seconds
    to let us know you've successfully received the callback.
    Otherwise, the request will time out.

    When a request times out from Facebook the service attempts
    to resend the message.

    This is why it is good to send a response immediately so you
    don't get duplicate messages in the event that a request takes
    awhile to process.
  */
  res.sendStatus(200);


  const data = req.body;
  //console.log('Webhook POST', JSON.stringify(data));
  //console.log(data.entry[0].messaging[0].message.nlp.entities);

  var entities = data.entry[0].messaging[0].message.nlp.entities;



  function getRecentBill(query){

    var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

    var xhr = new XMLHttpRequest();


    xhr.open("GET", "https://api.propublica.org/congress/v1/bills/search.json?query=" + query, false);
    xhr.setRequestHeader("X-API-Key", "iNjfHXFfsKjig0ujma5m5aooz2td8yyb3WJA00H5");
    xhr.send();

    //console.log(JSON.parse(xhr.responseText)["results"][0]["bills"]);
    return JSON.parse(xhr.responseText)["results"][0]["bills"][1]["govtrack_url"];

  }

  function getLatestCongressionalIdea(person){

    person = dictid[person.toLowerCase()];

    var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

    var xhr = new XMLHttpRequest();

    xhr.open("GET", "https://api.propublica.org/congress/v1/members/"+ person +"/statements/115.json", false);


    xhr.setRequestHeader("X-API-Key", "iNjfHXFfsKjig0ujma5m5aooz2td8yyb3WJA00H5");
    xhr.send();

    return JSON.parse(xhr.responseText)["results"][0]["url"];

  }

  function comparePoliticians(person1, person2){

    person1 = dictid[person1.toLowerCase()];
    person2 = dictid[person2.toLowerCase()];
    var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

    var xhr = new XMLHttpRequest();



      xhr.open("GET", "https://api.propublica.org/congress/v1/members/"+ person1 + "/votes/"+ person2 + "/115/senate.json", false);


    xhr.setRequestHeader("X-API-Key", "iNjfHXFfsKjig0ujma5m5aooz2td8yyb3WJA00H5");
    xhr.send();
    console.log(JSON.parse(xhr.responseText))
    return JSON.parse(xhr.responseText)["results"][0]["agree_percent"];


}

  function getSenatorBill(person){
    person = dictid[person.toLowerCase()];

    var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

    var xhr = new XMLHttpRequest();



    xhr.open("GET", "https://api.propublica.org/congress/v1/members/"+ person +"/bills/introduced.json", false);


    xhr.setRequestHeader("X-API-Key", "iNjfHXFfsKjig0ujma5m5aooz2td8yyb3WJA00H5");
    xhr.send();
    console.log(JSON.parse(xhr.responseText))
    return JSON.parse(xhr.responseText)["results"][0]["bills"][0];

  }




  // Make sure this is a page subscription
  if (data.object === 'page') {
    // Iterate over each entry
    // There may be multiple if batched
    data.entry.forEach((pageEntry) => {
      if (!pageEntry.messaging) {
        return;
      }
      // Iterate over each messaging event and handle accordingly
      pageEntry.messaging.forEach((messagingEvent) => {
        //console.log({messagingEvent});

        
      if(Object.keys(entities)[0] == "addInterest"){
        var interest = entities["addInterest"][0]["entities"];
        // console.log(interest);
        var value = interest["interest"][0]["value"];
        // console.log(interest);
        // console.log("______________")
        // console.log(getRecentBill(value));

 
        receiveApi.handleReceiveMessage(messagingEvent, "Check out this recent bill: " + getRecentBill(value));
              

        }

      else if(Object.keys(entities)[0] == "getSenatorStatement"){
        var interest = entities["getSenatorStatement"][0]["entities"];
        // console.log(interest);
        var value = interest["person"][0]["value"];
        // console.log(interest);
        // console.log("______________")
        // console.log(getRecentBill(value));


        receiveApi.handleReceiveMessage(messagingEvent, "Check out this recent statement from your senator: " + getLatestCongressionalIdea(value));

      }


      else if(Object.keys(entities)[1] == "comparePoliticians"){
              
              console.log(entities);
              var value = entities["person"][0]["value"];
              console.log(entities["comparePoliticians"][0]["entities"]);
              var value2 = entities["comparePoliticians"][0]["entities"]["person"][0]["value"];
              // console.log(interest);
              // console.log("______________")
              // console.log(getRecentBill(value));


              receiveApi.handleReceiveMessage(messagingEvent, "These two senators are " + comparePoliticians(value, value2) + " percent alike in what they vote.");

            }

      else if(Object.keys(entities)[0] == "person" && Object.keys(entities)[1] == "getSenatorBill"){
              
        var interest = entities["getSenatorBill"][0]["entities"];
        // console.log(interest);
        var value = entities["person"][0]["value"];
        // console.log(interest);
        // console.log("______________")
        // console.log(getRecentBill(value));


        receiveApi.handleReceiveMessage(messagingEvent, "Your senator recently initiated " + getSenatorBill(value)["short_title"] + " The purposes of this were " + getSenatorBill(value)["title"]);

            }
      else{
        receiveApi.handleReceiveMessage(messagingEvent, "Sorry I don't understand, can you try again?");
      }


      });
    });
  }
});

export default router;
