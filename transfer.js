/**
 * 
 */

var https = require('https');
var queryString = require('querystring');

// Assemble the request message headers
var requestHeaders = {
  'Authorization': 'Bearer 84b2d1f04c524be32630921e989e1954c',
  'Accept': 'application/json;v=0'
}

// Assemble the calling options for the request message
var options = {
  method: 'GET', 
  hostname: 'api-sandbox.capitalone.com', 
  port: 443, // https
  path: '/money-movement/accounts',
  headers: requestHeaders
}

// Create the request and handle the response
var retrieveEligibleAccounts = https.request(options, function(response) {

  // Accumulate the response data
  var responseData = "";
  response.on('data', function(data) {
    responseData += data;
  });

  // Process the response data
  response.on('end', function() {
    // Do something with responseData
  });
});

// Finish sending the request
retrieveEligibleAccounts.end();