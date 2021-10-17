const express = require('express');
const app = express();
const cors = require('cors');
const csrf = require('csurf');
const session = require('express-session');
const cookieSession = require('cookie-session');
// const observe = require('object.observe');
const sequelize = require('./util/database');
const cookieParser = require('cookie-parser');
const crypto = require('crypto');

const DictionaryModel = require('./models/DictionaryModel');
const LogModel = require('./models/LogModel');
const SettingModel = require('./models/SettingModel');
const UserModel = require('./models/UserModel');
const RoleModel = require('./models/RoleModel');
const FansModel = require('./models/FansModel');
const VotingOptionsModel = require('./models/VotingOptionsModel');

const errorController = require('./controllers/errorController');
const commonRoutes = require('./routers/commonRoutes');
const fansRoutes = require('./routers/fansRoutes');
const roleRoutes = require('./routers/roleRoutes');
const settingsRoutes = require('./routers/settingsRoutes');
const dictionaryRoutes = require('./routers/dictionary');
const userRoutes = require('./routers/userRoutes');

const csrfProtection = csrf({
  cookie: true
});

app.use(
  cors((req, callback) => {
    console.log('cors+++++++', req);
    callback(null, {
      origin: req.headers.origin,
      credentials: true
    });
  })
);

app.use(cookieParser('123456'));

app.use(
  cookieSession({
    name: 'mycookie',
    keys: ['aa', 'bb', 'cc'],
    maxAge: 1000 * 50
  })
);

app.use(express.static(__dirname));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.raw());
app.use(express.text());

app.use((err, req, res, next) => {
  let { origin } = req.headers;
  console.log('app start......');
  console.log(cookie);
  const cookie = req.cookies.name;

  next();
});

app.all('/*', (req, res, next) => {
  req.headers.origin = req.headers.origin || req.headers.host;
  console.log('session++++++', req.session);
  console.log('cookies++++++', req.cookies);
  console.log('req++++++', req);
  console.log('res++++++', res);

  const sessionId = req.cookies.sessionId;
  const loginName = req.cookies.loginName;
  const cookiesStr = req.headers.cookie;
  const cookieName = 'connect.sid';
  //   debugger;
  if (req.path === '/user/login' || req.path === '/user/register') {
    next();
    return;
  }
  if (cookiesStr) {
    const getCookie = (cookiesStr) => {
      const result = {};
      cookiesStr.split(';').forEach((item) => {
        if (!item) return;
        const arr = item.split('=');
        const key = arr[0].trim();
        const val = arr[1];
        result[key] = val;
      });

      return result;
    };
    const cookieObj = getCookie(cookiesStr);

    console.log('sessionId+++++++', sessionId);
    console.log('cookieObj[cookieName]+++++++', cookieObj[cookieName]);
    // my secret
    // let left = 's:' + sessionId + '.' + crypto.createHash('SHA256').update('my secret').digest('hex').base64();
    // left = crypto.createHash('SHA256').update('my secret').digest('hex').base64();

    // let right = connect.sid.split('.')[1];
    if (sessionId === cookieObj['sessionId']) {
      next();
    } else {
      res.status(401).json({
        data: 401
      });
    }
  } else {
    res.status(401).json({
      data: 401
    });
  }
});

app.use('/settings', settingsRoutes);
app.use('/fans', fansRoutes);
app.use('/dictionary', dictionaryRoutes);
app.use('/common', commonRoutes);
app.use('/user', userRoutes);
app.use('/role', roleRoutes);

// app.use('*', errorController.get404);

sequelize
  .sync()
  .then((result) => {
    app.listen(3000);
  })
  .catch((error) => {
    console.log(error);
  });
