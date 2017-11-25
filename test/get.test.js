"use strict";

const get = require("../src/get");
const sinon = require("sinon");
const assert = require("power-assert");

const AWS = require("aws-sdk");
const docClient = new AWS.DynamoDB.DocumentClient();

describe("get handler",()=>{
  beforeEach(()=>sinon.stub(docClient,"get"));
  afterEach(()=>docClient.get.restore());

  it("calls callback with stored value of key as second argment",()=>{
    const testKey = "testKey";
    const testValue = {data:"testVal"};
    const callback = sinon.spy();

    const event = {key:testKey};

    const handler = get.factory(docClient);
    handler(event,null,callback);

    assert(docClient.get.callCount === 1);
    const docClientParam = docClient.get.getCall(0).args[0];
    const docClientCallBack = docClient.get.getCall(0).args[1];

    assert(docClientParam.TableName === "ilab-bot-storage");
    assert(docClientParam.Key,{key:testKey});

    docClientCallBack(null,{Item:{key:testKey,value:testValue}});

    assert(callback.callCount === 1);
    assert(callback.getCall(0).args[0] === null);
    assert.deepEqual(callback.getCall(0).args[1],testValue);
  });

  it("calls callback with no argument if key doesn't exist in DynamoDB",()=>{
    const testKey = "testKey";
    const callback = sinon.spy();

    const event = {key:testKey};

    const handler = get.factory(docClient);
    handler(event,null,callback);

    assert(docClient.get.callCount === 1);
    const docClientParam = docClient.get.getCall(0).args[0];
    const docClientCallBack = docClient.get.getCall(0).args[1];

    assert(docClientParam.TableName === "ilab-bot-storage");
    assert(docClientParam.Key,{key:testKey});

    docClientCallBack(null,{});

    assert(callback.callCount === 1);
    assert(callback.getCall(0).args.length === 0);
  });

  it("calls callback with error message as first argument if key doesn't exist in event object",()=>{
    const callback = sinon.spy();

    const event = {};

    const handler = get.factory(docClient);
    handler(event,null,callback);

    assert(callback.callCount === 1);
    assert(typeof callback.getCall(0).args[0] === "string");
  });

  it("calls callback with error message as first argument if DynamoDB returns some error",()=>{
    const testKey = "testKey";
    const testValue = {data:"testVal"};
    const callback = sinon.spy();

    const event = {key:testKey};

    const handler = get.factory(docClient);
    handler(event,null,callback);

    assert(docClient.get.callCount === 1);
    const docClientParam = docClient.get.getCall(0).args[0];
    const docClientCallBack = docClient.get.getCall(0).args[1];

    assert(docClientParam.TableName === "ilab-bot-storage");
    assert(docClientParam.Key,{key:testKey});

    docClientCallBack("some DynamoDB error",null);

    assert(callback.callCount === 1);
    assert(callback.getCall(0).args.length === 1);
    assert(typeof callback.getCall(0).args[0] === "string");
  });
});
