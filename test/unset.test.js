"use strict";

const unset = require("../src/unset");
const sinon = require("sinon");
const assert = require("power-assert");

const AWS = require("aws-sdk");
const docClient = new AWS.DynamoDB.DocumentClient();
const STORAGE_TABLE_NAME = "ilab-bot-storage";

describe("unset handler",()=>{
  beforeEach(()=>sinon.stub(docClient,"delete"));
  afterEach(()=>docClient.delete.restore());

  it("calls callback with no argument if deleteing the data is scucceeded",()=>{
    const testKey = "testKey";
    const callback = sinon.spy();

    const event = {key:testKey};

    const handler = unset.factory(docClient,STORAGE_TABLE_NAME);
    handler(event,null,callback);

    assert(docClient.delete.callCount === 1);
    const docClientParam = docClient.delete.getCall(0).args[0];
    const docClientCallBack = docClient.delete.getCall(0).args[1];

    assert(docClientParam.TableName === STORAGE_TABLE_NAME);
    assert(docClientParam.Key,{key:testKey});

    docClientCallBack(null);

    assert(callback.callCount === 1);
    assert(callback.getCall(0).args.length === 0);
  });

  it("calls callback with error message as first argument if key doesn't exist in event object",()=>{
    const callback = sinon.spy();

    const event = {};

    const handler = unset.factory(docClient,STORAGE_TABLE_NAME);
    handler(event,null,callback);

    assert(callback.callCount === 1);
    assert(typeof callback.getCall(0).args[0] === "string");
  });

  it("calls callback with error message as first argument if DynamoDB returns some error",()=>{
    const testKey = "testKey";
    const callback = sinon.spy();

    const event = {key:testKey};

    const handler = unset.factory(docClient,STORAGE_TABLE_NAME);
    handler(event,null,callback);

    assert(docClient.delete.callCount === 1);
    const docClientParam = docClient.delete.getCall(0).args[0];
    const docClientCallBack = docClient.delete.getCall(0).args[1];

    assert(docClientParam.TableName === STORAGE_TABLE_NAME);
    assert(docClientParam.Key,{key:testKey});

    docClientCallBack("some DynamoDB error");

    assert(callback.callCount === 1);
    assert(callback.getCall(0).args.length === 1);
    assert(typeof callback.getCall(0).args[0] === "string");
  });


});
