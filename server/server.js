const express = require('express');
const passport = require('passport');
const session = require('express-session');
const cors = require('cors');
const DiscordStrategy = require('passport-discord').Strategy;

const app = express();

app.use(cors({
  origin: 'http://127.0.0.1:3000',
  credentials: true
}));

app.use(session({
  secret: 'your-session-secret',
  resave: false,
  saveUninitialized: true
}));

passport.use(new DiscordStrategy({
  clientID: '1347271954964545556',
  clientSecret: 'SZpLFUj7LEDdZbFcDU25SSukDs0-50CV',
  callbackURL: 'http://localhost:5000/auth/discord/callback',
  scope: ['identify', 'email']
}, (accessToken, refreshToken, profile, done) => {
  const user = {
    id: profile.id,
    username: profile.username,
    avatar: profile.avatar,
    email: profile.email,
    verified: profile.verified,
    global_name: profile.global_name,
    banner_color: profile.banner_color,
    accessToken: accessToken,
    createdAt: 'XX/XX/XXXX'
  };
  return done(null, user);
}));

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));

app.use(passport.initialize());
app.use(passport.session());

app.get('/auth/discord', passport.authenticate('discord'));

app.get('/auth/discord/callback', passport.authenticate('discord', {
  failureRedirect: 'http://127.0.0.1:3000/login'
}), (req, res) => {
  res.redirect('http://127.0.0.1:3000/main');
});

app.get('/profile', (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: 'Not authenticated' });
  }
  res.json(req.user);
});

app.get('/logout', (req, res) => {
  req.logout(err => {
    if (err) return res.status(500).json({ message: 'Logout error' });
    res.redirect('http://127.0.0.1:3000');
  });
});

app.listen(5000, () => console.log('Server running on http://localhost:5000'));
