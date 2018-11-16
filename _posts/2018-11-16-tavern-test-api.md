---
layout: post
title: "How to test a RESTful API"
date: 2018-11-15
excerpt: "Tavern is a tool to test API. The strengths of this tool is that you have not to write a code to call the API but you have just to describe it. A very simple syntax is used (YAML) and you can start to test your API in 5 minute."
tag:
 - chaos
 - testing
comments: true
feature: /assets/img/post-image/tavern.png
showFeature: false
---

Recently, for my master thesis, I've started to deploy a RESTful service. Since my service simulates another system, I needed some tests that are able to show if my service replies as the original system. Then I started to search for a tool to test API and I've found a perfect tool to test my APIs, here I'll explain how to use it and I'll cover some parts that the documentation not discuss.

# [Tavern](https://taverntesting.github.io)
Tavern is a tool to test API. The strength of this tool is that you have not to write a code to call the API but you have just to describe it. A very simple syntax is used (YAML) and you can start to test your API in 5 minutes.

## How YAML works?
The fastest way to describe how YAML works is to show you an example:

```yaml
test_name: Get some fake data from the JSON placeholder API

stages:
  - name: Make sure we have the right ID
    request:
      url: https://jsonplaceholder.typicode.com/posts/1
      method: GET
    response:
      status_code: 200
      body:
        id: 1
      save:
        body:
          returned_id: id
```
You have some fields composed by `name: values`. Subfields are identified by the spaces at the starting of the line (like Python-syntax).

Each request is composed by a `test_name` and a list of `stages`. The *stages* are steps that have to be computed to perform the test. In my APIs, for example, before to do a request, I need to login in the system, the system returns a token that has to be used in the following requests. Then, I can create several stages, one for login request, one for the interesting request, one for the logout request.

Of course, through the stages, you can save some variable, like my *login_token_id* and then you can use it in your next requests.

## Install Tavern
In order to install it, you can simply type
```bash
pip install tavern[pytest]
```

And then run your test as
```bash
py.test test_minimal.tavern.yaml
```

# Problems
Ok, I don't want to show here all the features, you can find them in the [documentation page](https://taverntesting.github.io/documentation). I would like to present you some problems that I have found and how I solved it. I suggest you see the documentation before to proceed in this page since I'll assume you know the basics of Tavern.

## Array of dictionary checking
The YAML syntax is very clear, simple and effective. The problem is that it is not clear how to define how to compare a dictionary values from an array of dictionaries. 
Suppose you have a response like
```json
{"data":[
    {"deviceId": 0, "deviceValue": 1},
    {"deviceId": 2, "deviceValue": 3},
    {"deviceId": 4, "deviceValue": 5}
]}
```
and you would like to check if the *data* array contains your device *(deviceId, deviceValue)*. Then your test will be like
```yaml
  - name: getting devices
    request:
      url: "localhost/api/getDevice"
      method: GET
      headers:
        content-type: application/text
    response:
      status_code: 200
      headers: 
        content-type: application/json
      body:
        data:
          - deviceValue: 4
            deviceId: 5
```

## External function
In Tavern, if you have to validate a response to complex to be represented in YAML, you can define a Python function and then you can call it from YAML. An example can be:
```yaml
  - name: getting device
    request:
      url: "{host:s}/api/v1/appmgr/devices?searchByAny=10.10.20.51"
      method: GET
    response:
      status_code: 200
      headers: 
        content-type: application/json
      body:
        data:
          - ipAddress: 10.10.20.51
            username: cisco
      save:
        $ext:
          function: utils:getdeviceid
```
where we can save the *deviceId* value. 

If you run this test, you have to remember to add the folder of your module (*utils* in the example) to your PYTHONPATH. In my case, my folder structure was like
```
projectName
 | test
    | utils.py
 | src
```
Then, I start the test from the `projectName` folder, typing
```bash
PYTHONPATH=$(pwd):$(PWD)/test  pytest test/test_device.tavern.yaml 
```

## GET and JSON
When I was invoking a GET request from Tavern to my RESTful server, the server (written in Flask) thrown an error: 
```json
{"message": "Failed to decode JSON object: Expecting value: line 1 column 1 (char 0)"}
```
I don't know if it is a Tavern or Flask problem. The solution is explicit that this API invocation hasn't a `content-type` of `application/json` that I assume is the default value of Tavern for each unspecified `content-type` value. So, when I execute this test, I pass `application/text` as `content-type`. Example:

```yaml
- name: getting device
    request:
      url: "{host:s}/api/v1/appmgr/devices?searchByAny=10.10.20.51"
      method: GET
      headers:
        content-type: application/text
    response:
      status_code: 200
      headers: 
        content-type: application/json
```

## SSL problems
When you test something, probably your SSL certificate is autogenerated and self-signed. In order to bypass Tavern controls over the SSL certificate, specify `verify:false` as request field. Example:
```yaml
- name: getting device
    request:
      verify: false
      url: "{host:s}/api/v1/appmgr/devices?searchByAny=10.10.20.51"
      method: GET
```

## Some other problems, not already fixed
When there is a successful the output is very pretty:
```bash
========================================== test session starts ==========================================
platform darwin -- Python 2.7.15, pytest-3.9.3, py-1.7.0, pluggy-0.8.0
rootdir: /Volumes/MacintoshHD/GitHub/FogDirSimulator, inifile:
plugins: tavern-0.19.1
collected 3 items                                                                                       

test/test_device.tavern.yaml ...                                                                  [100%]

======================================= 3 passed in 0.65 seconds ========================================
```

When there is an error, good luck. For example, changing a value in the test above, more than 500 lines are printed and the output is very cryptic.
```
========================================== test session starts ==========================================
platform darwin -- Python 2.7.15, pytest-3.9.3, py-1.7.0, pluggy-0.8.0
rootdir: /Volumes/MacintoshHD/GitHub/FogDirSimulator, inifile:
plugins: tavern-0.19.1
collected 3 items                                                                                       

test/test_device.tavern.yaml ..F                                                                  [100%]

=============================================== FAILURES ================================================
[...]
        if self.errors:
>           raise TestFailError("Test '{:s}' failed:\n{:s}".format(self.name, self._str_errors()), failures=self.errors)
E           TestFailError: Test 'getting device' failed:
E           - Status code was 400, expected 200:
E               {"message": "Failed to decode JSON object: Expecting value: line 1 column 1 (char 0)"}
E           - Error calling save function '<function getdeviceid at 0x10e34c2a8>':
E               Traceback (most recent call last):
E                 File "/usr/local/lib/python2.7/site-packages/tavern/_plugins/rest/response.py", line 190, in verify
E                   to_save = wrapped(response)
E                 File "/usr/local/lib/python2.7/site-packages/tavern/schemas/extensions.py", line 82, in inner
E                   return func(response, *args, **kwargs)
E                 File "/Volumes/MacintoshHD/GitHub/FogDirSimulator/test/utils.py", line 27, in getdeviceid
E                   devices = data["data"]
E               KeyError: 'data'
E           
E           - Value mismatch in body: Structure of returned data was different than expected  - Extra keys in response: set([u'message']) - Keys missing from response: set(['data']) (expected = '{'data': [{'username': 'cisco', 'ipAddress': '10.10.20.51'}]}', actual = '{u'message': u'Failed to decode JSON object: Expecting value: line 1 column 1 (char 0)'}')

/usr/local/lib/python2.7/site-packages/tavern/_plugins/rest/response.py:207: TestFailError
------------------------------------------- Captured log call -------------------------------------------
dict_util.py               292 WARNING  Structure of returned data was different than expected  - Extra keys in response: set(['date', 'content-length', 'server']) (expected = '{'content-type': 'application/json'}', actual = '{'date': 'Fri, 16 Nov 2018 09:23:03 GMT', 'content-length': '119', 'content-type': 'application/json', 'server': 'Werkzeug/0.14.1 Python/2.7.15'}')
Traceback (most recent call last):
  File "/usr/local/lib/python2.7/site-packages/tavern/util/dict_util.py", line 259, in check_keys_match_recursive
    assert actual_val == expected_val
AssertionError: assert {'content-len...ython/2.7.15'} == {'content-type...ication/json'}
  Omitting 1 identical items, use -vv to show
  Left contains more items:
  {'content-length': '119',
   'date': 'Fri, 16 Nov 2018 09:23:03 GMT',
   'server': 'Werkzeug/0.14.1 Python/2.7.15'}
  Use -v to get the full diff
base.py                     37 ERROR    Status code was 400, expected 200:
    {"message": "Failed to decode JSON object: Expecting value: line 1 column 1 (char 0)"}
base.py                     35 ERROR    Error calling save function '<function getdeviceid at 0x10e34c2a8>':
    Traceback (most recent call last):
      File "/usr/local/lib/python2.7/site-packages/tavern/_plugins/rest/response.py", line 190, in verify
        to_save = wrapped(response)
      File "/usr/local/lib/python2.7/site-packages/tavern/schemas/extensions.py", line 82, in inner
        return func(response, *args, **kwargs)
      File "/Volumes/MacintoshHD/GitHub/FogDirSimulator/test/utils.py", line 27, in getdeviceid
        devices = data["data"]
    KeyError: 'data'
Traceback (most recent call last):
  File "/usr/local/lib/python2.7/site-packages/tavern/_plugins/rest/response.py", line 190, in verify
    to_save = wrapped(response)
  File "/usr/local/lib/python2.7/site-packages/tavern/schemas/extensions.py", line 82, in inner
    return func(response, *args, **kwargs)
  File "/Volumes/MacintoshHD/GitHub/FogDirSimulator/test/utils.py", line 27, in getdeviceid
    devices = data["data"]
KeyError: 'data'
base.py                     37 ERROR    Value mismatch in body: Structure of returned data was different than expected  - Extra keys in response: set([u'message']) - Keys missing from response: set(['data']) (expected = '{'data': [{'username': 'cisco', 'ipAddress': '10.10.20.51'}]}', actual = '{u'message': u'Failed to decode JSON object: Expecting value: line 1 column 1 (char 0)'}')
dict_util.py               292 WARNING  Structure of returned data was different than expected  - Extra keys in response: set(['date', 'content-length', 'server']) (expected = '{'content-type': 'application/json'}', actual = '{'date': 'Fri, 16 Nov 2018 09:23:03 GMT', 'content-length': '93', 'content-type': 'application/json', 'server': 'Werkzeug/0.14.1 Python/2.7.15'}')
Traceback (most recent call last):
  File "/usr/local/lib/python2.7/site-packages/tavern/util/dict_util.py", line 259, in check_keys_match_recursive
    assert actual_val == expected_val
AssertionError: assert {'content-len...ython/2.7.15'} == {'content-type...ication/json'}
  Omitting 1 identical items, use -vv to show
  Left contains more items:
  {'content-length': '93',
   'date': 'Fri, 16 Nov 2018 09:23:03 GMT',
   'server': 'Werkzeug/0.14.1 Python/2.7.15'}
  Use -v to get the full diff
================================== 1 failed, 2 passed in 1.56 seconds ===================================
```

Maybe the best format can be chosen to show the errors.

Go to [Tavern Website](https://taverntesting.github.io)