"use strict";

const AWS = require("aws-sdk");
const docClient = new AWS.DynamoDB.DocumentClient();

function factory(docClient){
  return function(event,context,callback){
    const key = event.key;

    if(!key){
      callback("invalid param. 'key' is required");
    }else{
      const param = {
        TableName:"ilab-bot-storage",
        Key:{key:key}
      };

      docClient.delete(param,function(err){
        if(err){
          callback(err)
        }else{
          callback();
        }
      });
    }
  }
}

exports.factory = factory;

exports.handler = factory(docClient);
