const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken'); // Import jsonwebtoken library
const { connectToDb, getDb } = require('./db');
const crypto = require('crypto');
const secretKey = crypto.randomBytes(32).toString('hex');

const app = express();
const port = 1000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('./public'));

let db;

connectToDb((err) => {
  if (!err) {
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
    db = getDb();
  }
});

app.post('/api/user', (req, res) => {
  const postData = req.body;

  // Check if a user with the provided email already exists
  db.collection('users')
    .findOne({ email: postData.email })
    .then((existingUser) => {
      if (existingUser) {
        // User with the same email already exists
        res.status(400).json({ error: 'User with this email already exists' });
      } else {
        // User does not exist, proceed with inserting the new user
        db.collection('users')
          .insertOne(postData)
          .then((result) => {
            res.status(201).json({ message: 'Data received successfully!' });
          })
          .catch((err) => {
            res.status(500).json({ error: "Couldn't add the document" });
          });
      }
    })
    .catch((err) => {
      res.status(500).json({ error: 'Internal Server Error' });
    });
});

// Endpoint to handle GET requests for user data and generate JWT token
app.post('/api/auth/user', (req, res) => {
  const { email, password } = req.body;

  db.collection('users')
    .findOne({ email: email, password: password }) // Check both email and password
    .then((result) => {
      if (result) {
        const token = jwt.sign({ email: result.email }, secretKey, { expiresIn: '1h' });

        res.status(200).json({
          message: 'User found',
          token: token, // Send the generated token
        });
      } else {
        res.status(404).json({ error: 'User not found' });
      }
    })
    .catch((err) => {
      res.status(500).json({ error: 'Internal Server Error' });
    });
});

// ... (existing code)

// Endpoint to handle GET requests for user data
app.get('/api/user', (req, res) => {
  // Retrieve the token from the Authorization header
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token.split(' ')[1], secretKey);

    // Use the decoded email to find the user
    const email = decoded.email;

    db.collection('users')
      .findOne({ email: email })
      .then((result) => {
        if (result) {
          res.status(200).json({ user: result });
        } else {
          res.status(404).json({ error: 'User not found' });
        }
      })
      .catch((err) => {
        res.status(500).json({ error: 'Internal Server Error' });
      });
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
});
app.get("/api/questions", (req, res) => {
  db.collection('questions').find().toArray()  // Use toArray() to convert the cursor to an array
    .then(result => {
      res.status(200).json({ questions: result });
    })
    .catch(error => {
      res.status(404).json({ error: "failed to fetch" });
    });
});
