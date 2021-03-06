const router = require('express').Router();

const Users = require('./users-model.js');
const restricted = require('../auth/restricted-middleware.js');
const messageWare = require('../auth/message-middleware');
router.get('/', (req, res) => {
  Users.find()
    .then(users => {
      res.json(users);
    })
    .catch(err => res.send(err));
});

//get user by ID
router.get('/:id', async (req, res) => {
  const user = await Users.findById(req.params.id);

  res.status(200).json(user);
});

/// Check messages

router.get('/:id/messages', messageWare, async (req, res) => {
  const user = await Users.findById(req.params.id);
  console.log(user);
  // console.log({message:  user.messages, from: req.session.user.username})

  // res.status(200).json({message: user.messages, from: req.session.user.username})
  res
    .status(200)
    .json({ messages: user.messages, from: req.session.user.username });
});

//Send message to user with this ID
router.put('/:id', async (req, res) => {
  console.log(req.body.username);
  const { id } = req.params;
  console.log('ID', id);

  try {
    const user = await Users.update(id, { messages: req.body.messages });
    // const sender = req.session.user.username;
    console.log('USERS=>', user);
    console.log('777', req.session.user.username);
    console.log(req.body.messages);
    res.status(201).json({ message: `message sent to ${req.body.username} ` });
    // res.json(req.session.user.username)
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'cannot update.' });
  }
});

module.exports = router;
