const express = require('express');
const app = express();
const cors = require('cors');
const csrf = require('csurf');
const session = require('express-session');
const SessionFileStore = require('session-file-store')(session);
const sequelize = require('./util/database');
const MongoClient = require('mongodb').MongoClient
const MongoDBStore = require('connect-mongodb-session')(session);
const cookieParser = require('cookie-parser');

const DictionaryModel = require('./models/DictionaryModel');
const LogModel = require('./models/LogModel');
const SettingModel = require('./models/SettingModel');
const UserModel = require('./models/UserModel');
const RoleModel = require('./models/RoleModel');
const FansModel = require('./models/FansModel');
const VotingOptionsModel = require('./models/VotingOptionsModel');
const FileDownloaderModel = require('./models/FileDownloaderModel');

const errorController = require('./controllers/errorController');
const commonRoutes = require('./routers/commonRoutes');
const fansRoutes = require('./routers/fansRoutes');
const fileDownloaderRoutes = require('./routers/fileDownloaderRoutes');
const roleRoutes = require('./routers/roleRoutes');
const settingsRoutes = require('./routers/settingsRoutes');
const dictionaryRoutes = require('./routers/dictionary');
const userRoutes = require('./routers/userRoutes');

const csrfProtection = csrf({
  cookie: true
});

const secret = '123456';

app.use(
  cors((req, callback) => {
    callback(null, {
      origin: true,
      credentials: true
    });
  })
);

app.use(cookieParser(secret));

app.use(
  session({
    secret: secret, // 用来对session id相关的cookie进行签名
    // store: new SessionFileStore(), // 本地存储session（文本文件，也可以选择其他store，比如redis或者mongodb）
    saveUninitialized: true, // 是否自动保存未初始化的会话，一定是true
    resave: false, // 是否每次都重新保存会话，建议false
    cookie: {
      maxAge: 3600 * 1000 // 有效期，单位是毫秒
    },
    name: 'aaa', // 默认connect.sid
    // 会话存储实例，默认为new MemoryStore 实例。
    store: new MemoryStore(),
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
  // console.log('session++++++', req.session);
  // console.log('cookies++++++', req.cookies);
  // console.log('req++++++', req);
  console.log('res++++++', res);

  const sessionId = req.sessionID;
  const signedCookies = req.signedCookies;
  const currentCookie = Object.values(signedCookies)[0];

  if (req.path === '/user/login' || req.path === '/user/register') {
    debugger

    next();
    return;
  }

  if (sessionId === currentCookie) {
    debugger

    next();
  } else {
    console.log(req)
    debugger

    res.status(401).json({
      message: '登录已失效'
    });
  }
});

app.use('/settings', settingsRoutes);
app.use('/fans', fansRoutes);
app.use('/fileDownloader', fileDownloaderRoutes);
app.use('/dictionary', dictionaryRoutes);
app.use('/common', commonRoutes);
app.use('/user', userRoutes);
app.use('/role', roleRoutes);

// app.use('*', errorController.get404);

sequelize
  .sync()
  .then((result) => {
    app.listen(3002);
  })
  .catch((error) => {
    console.log(error);
  });
