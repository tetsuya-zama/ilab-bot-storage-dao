"use strict";

const AWS = require("aws-sdk");
const docClient = new AWS.DynamoDB.DocumentClient();

const STORAGE_TABLE_NAME = process.env.STORAGE_TABLE_NAME;

function factory(docClient,STORAGE_TABLE_NAME){
  return function(event,context,callback){
    const key = event.key;
    const value = event.value;

    const validMessage = validationMessage(key,value);

    if(validMessage){
      callback(validMessage);
    }else{
      const param = {
        TableName:STORAGE_TABLE_NAME,
        Item:{
          key:key,
          value:value
        }
      };

      docClient.put(param,function(err){
        if(err){
          callback(err)
        }else{
          callback();
        }
      });
    }
  }
}

function validationMessage(key,value){
  if(!key){
    return "invalid param. 'key' is required";
  }else if(key.trim().length === 0){
    return "invalid param. 'key' should not be empty";
  }else if(!value){
    return "invalid param. 'value' is required";
  }else{
    return null;
  }
}

exports.factory = factory;

exports.handler = factory(docClient,STORAGE_TABLE_NAME);
