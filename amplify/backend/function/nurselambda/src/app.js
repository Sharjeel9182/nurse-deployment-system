const express = require('express');
const bodyParser = require('body-parser');
const awsServerlessExpressMiddleware = require('aws-serverless-express/middleware');
const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');

// declare a new express app
const app = express();
app.use(bodyParser.json());
app.use(awsServerlessExpressMiddleware.eventContext());

// Enable CORS for all methods
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  next();
});

const dynamoDB = new AWS.DynamoDB.DocumentClient();
const USERS_TABLE = 'Users';

// Create a new user
app.post('/users', async function(req, res) {
  const { email, role, firstName, lastName, phoneNumber, specialization, licenseNumber } = req.body;
  
  const params = {
    TableName: USERS_TABLE,
    Item: {
      userId: uuidv4(),
      email,
      role,
      firstName,
      lastName,
      phoneNumber,
      specialization,
      licenseNumber,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  };

  try {
    await dynamoDB.put(params).promise();
    res.json({ success: true, user: params.Item });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a user by ID
app.get('/users/:userId', async function(req, res) {
  const { userId } = req.params;
  
  const params = {
    TableName: USERS_TABLE,
    Key: { userId }
  };

  try {
    const result = await dynamoDB.get(params).promise();
    if (!result.Item) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(result.Item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a user
app.put('/users/:userId', async function(req, res) {
  const { userId } = req.params;
  const { firstName, lastName, phoneNumber, specialization, licenseNumber } = req.body;
  
  const params = {
    TableName: USERS_TABLE,
    Key: { userId },
    UpdateExpression: 'set firstName = :fn, lastName = :ln, phoneNumber = :pn, specialization = :sp, licenseNumber = :ln, updatedAt = :ua',
    ExpressionAttributeValues: {
      ':fn': firstName,
      ':ln': lastName,
      ':pn': phoneNumber,
      ':sp': specialization,
      ':ln': licenseNumber,
      ':ua': new Date().toISOString()
    },
    ReturnValues: 'ALL_NEW'
  };

  try {
    const result = await dynamoDB.update(params).promise();
    res.json(result.Attributes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a user
app.delete('/users/:userId', async function(req, res) {
  const { userId } = req.params;
  
  const params = {
    TableName: USERS_TABLE,
    Key: { userId }
  };

  try {
    await dynamoDB.delete(params).promise();
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(3000, function() {
  console.log("App started");
});

module.exports = app; 