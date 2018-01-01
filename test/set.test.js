"use strict";

const set = require("../src/set");
const sinon = require("sinon");
const assert = require("power-assert");

const AWS = require("aws-sdk");
const docClient = new AWS.DynamoDB.DocumentClient();
const STORAGE_TABLE_NAME = "ilab-bot-storage";

describe("set handler",()=>{
  beforeEach(()=>sinon.stub(docClient,"put"));
  afterEach(()=>docClient.put.restore());

  it("calls callback with no argument if saving the value is scucceeded",()=>{
    const testKey = "testKey";
    const testValue = {data:"testVal"};
    const callback = sinon.spy();

    const event = {
      key:testKey,
      value:testValue
    };

    const handler = set.factory(docClient,STORAGE_TABLE_NAME);
    handler(event,null,callback);

    assert(docClient.put.callCount === 1);
    const docClientParam = docClient.put.getCall(0).args[0];
    const docClientCallBack = docClient.put.getCall(0).args[1];

    assert(docClientParam.TableName === STORAGE_TABLE_NAME);
    assert(docClientParam.Item.key === testKey);
    assert(docClientParam.Item.value === testValue);

    docClientCallBack(null);

    assert(callback.callCount === 1);
    assert(callback.getCall(0).args.length === 0);
  });

  it("calls callback with error message as first argument if key doesn't exist in event object",()=>{
    const callback = sinon.spy();

    const event = {
      value:"somevalue"
    };

    const handler = set.factory(docClient,STORAGE_TABLE_NAME);
    handler(event,null,callback);

    assert(callback.callCount === 1);
    assert(typeof callback.getCall(0).args[0] === "string");
  });

  it("calls callback with error message as first argument if key in event object is empty",()=>{
    const callback = sinon.spy();

    const event = {
      key:"",
      value:"somevalue"
    };

    const handler = set.factory(docClient,STORAGE_TABLE_NAME);
    handler(event,null,callback);

    assert(callback.callCount === 1);
    assert(typeof callback.getCall(0).args[0] === "string");
  });

  it("calls callback with error message as first argument if value doesn't exist in event object",()=>{
    const callback = sinon.spy();

    const event = {
      key:"testKey"
    };

    const handler = set.factory(docClient,STORAGE_TABLE_NAME);
    handler(event,null,callback);

    assert(callback.callCount === 1);
    assert(typeof callback.getCall(0).args[0] === "string");
  });

  it("calls callback with error message as first argument if DynamoDB returns some error",()=>{
    const testKey = "testKey";
    const testValue = {data:"testVal"};
    const callback = sinon.spy();

    const event = {
      key:testKey,
      value:testValue
    };

    const handler = set.factory(docClient,STORAGE_TABLE_NAME);
    handler(event,null,callback);

    assert(docClient.put.callCount === 1);
    const docClientParam = docClient.put.getCall(0).args[0];
    const docClientCallBack = docClient.put.getCall(0).args[1];

    assert(docClientParam.TableName === STORAGE_TABLE_NAME);
    assert(docClientParam.Item.key === testKey);
    assert(docClientParam.Item.value === testValue);

    docClientCallBack("some DynamoDB error");

    assert(callback.callCount === 1);
    assert(typeof callback.getCall(0).args[0] === "string");
  });
});
