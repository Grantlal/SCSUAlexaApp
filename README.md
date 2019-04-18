# SCSUAlexaApp

### Introduction

This is a proof of concept to show the potential an applicaiton specialized around having an alexa application for St Cloud State University could be benificial to student and faculty life. 

### System Overview
Index: This contain the most logic, has intent handlers and some helper functions
Interaction Model: This defines the intents, and slot types in the skill. 
Dbhelper: This instantiantes an object that will assist in Dynamo Db Operations supported. 
Package and util: These files just are essentially just the requirements and modules required for the project to work. 

### How to Use

Must create a new alexa skill on amazon developer. Ensure the interaction model here is the same. 
Then go to aws lamba to create a new lambda function and link the skill with the backend. Here one can either utilize ASK cli, or utilize web 
development tools. 
From here one can either test from a virtual alexa, or a physical echo device that is attached to the same account.

### Authors
Grant LaLonde,

