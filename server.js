require('dotenv').config();
global.Promise = require('bluebird');
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
  const { ChannelSid, From } = req.query;
  const channel = client
    .chat
    .services(process.env.SERVICE_SID)
    .channels(ChannelSid);
  let members = [];
  return Promise.all([
    channel.fetch(),
    channel.members.list(),
  ])
    .spread((retrievedChannel, retrievedMembers) => {
      members = retrievedMembers;
      if (retrievedChannel.friendlyName) {
        console.log(`Channel has friendlyName ${retrievedChannel.friendlyName}`);
        return Promise.resolve();
      }
      if (From !== process.env.IDENTITY) {
        console.log(`Updating channel name to ${From}`);
        return channel.update({ friendlyName: From });
      }
      const friendlyName = members
        .map(m => m.identity)
        .find(identity => identity !== process.env.IDENTITY);
      if (friendlyName) {
        console.log(`Friendly name found through members ${friendlyName}`);
        return channel.update({ friendlyName });
      }
      console.log('Cannot set channel name at this time');
      return Promise.resolve();
    })
    .then(() => {
      if (members.find(m => m.identity === process.env.IDENTITY)) {
        console.log(`${process.env.IDENTITY} already joined`);
        return res.sendStatus(200);
      }
      return channel
        .create({ identity: process.env.IDENTITY })
        .then((member) => {
          console.log(`Successfully added member ${member.sid}`);
          return res.sendStatus(200);
        })
        .catch((err) => {
          console.error(`Cannot add member ${err}`);
          return res.sendStatus(200);
        });
    })
    .catch((err) => {
      console.error(err);
      return res.sendStatus(200);
    });
});

app.get('/token', (_, res) => res.json({ token: token.toJwt() }));

app.listen(port, () => console.log(`Listening on port ${port}`));
