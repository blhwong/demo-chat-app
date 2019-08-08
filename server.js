require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const twilio = require('twilio');
const morgan = require('morgan');

const client = twilio(process.env.ACCOUNT_SID, process.env.AUTH_TOKEN);
const port = process.env.SERVER_PORT;
const { AccessToken } = twilio.jwt;
const { ChatGrant } = AccessToken;
const chatGrant = new ChatGrant({ serviceSid: process.env.SERVICE_SID });
const token = new AccessToken(
  process.env.ACCOUNT_SID,
  process.env.TWILIO_API_KEY_SID,
  process.env.TWILIO_API_KEY_SECRET,
);
const app = express();

token.addGrant(chatGrant);
token.identity = process.env.IDENTITY;

app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.get('/post-event', (req, res) => {
  console.log(req);
  const { ChannelSid } = req.query;
  return client.chat.services(process.env.SERVICE_SID)
    .channels(ChannelSid)
    .members
    .create({ identity: process.env.IDENTITY })
    .then((member) => {
      console.log(`Successfully added member ${member.sid}`);
      res.sendStatus(200);
    })
    .catch((err) => {
      console.error(`Couldn't add member. ${err}`);
      res.sendStatus(200);
    });
});

app.get('/token', (_, res) => res.json({ token: token.toJwt() }));

app.listen(port, () => console.log(`Listening on port ${port}`));
