const express = require('express');
const app = express();
app.set('view engine', 'ejs');
app.use(express.static('views'));
app.use(express.static('public'));
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt'); // Для хеширования паролей
app.use(bodyParser.urlencoded({ jsonLimit: '10mb', extended: false }));
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');
const flash = require('express-flash');
app.use(bodyParser.json());
app.use(flash());
require('dotenv').config();

const FOREST_ENV_SECRET = process.env.FOREST_ENV_SECRET;
const FOREST_AUTH_SECRET = process.env.FOREST_AUTH_SECRET;
const DATABASE_URL = process.env.DATABASE_URL;

app.use(session({
  secret: 'bebroid', // Замените на свой секретный ключ
  resave: false,
  saveUninitialized: true
}));



require('dotenv').config();

const { createAgent } = require('@forestadmin/agent');
const { createSqlDataSource } = require('@forestadmin/datasource-sql');

// Create your Forest Admin agent
// This must be called BEFORE all other middleware on the app
createAgent({
  authSecret: FOREST_AUTH_SECRET,
  envSecret: FOREST_ENV_SECRET,
  isProduction: process.env.NODE_ENV === 'production',
})
  // Create your SQL datasource
  .addDataSource(createSqlDataSource(DATABASE_URL))
  // Mount on Express app
  .mountOnExpress(app) // Замените "myExpressApp" на "app"
  .start();



app.listen(3000, () => {
  console.log('Server started on port 3000');
});

const connection = require('./db.js');




  
  app.get('/register', (req, res) => {
    res.render('register'); // Создайте EJS-шаблон "register.ejs" для этой страницы
  });
  
  const User = require('./user'); // Подключите модель пользователя

  passport.use(new LocalStrategy(
    (username, password, done) => {
      // Поиск пользователя в базе данных по имени пользователя
      connection.query('SELECT * FROM users WHERE username = ?', [username], (error, results) => {
        if (error) {
          return done(error);
        }
  
        if (results.length === 0) {
          // Пользователь с таким именем не найден
          return done(null, false, { message: 'Пользователь не найден' });
        }
  
        const user = results[0];
  
        // Здесь вы должны сравнить хэшированный пароль из базы данных с введенным паролем
        bcrypt.compare(password, user.password_hash, (hashError, isValid) => {
          if (hashError || !isValid) {
            // Ошибка хэширования или пароль недействителен
            return done(null, false, { message: 'Неправильное имя пользователя или пароль' });
          }
  
          return done(null, user);
        });
      });
    }
  ));


  app.post('/login', passport.authenticate('local', {
    successRedirect: '/lk', // При успешной аутентификации перенаправление на "Личный кабинет"
    failureRedirect: '/', // При неудачной аутентификации перенаправление на страницу входа
    failureFlash: true, // Включить флеш-сообщения для вывода ошибок
  }));



  app.post('/register', (req, res) => {
    const { username, password } = req.body;
  
    // Хешируйте пароль перед сохранением
    bcrypt.hash(password, 10, (hashError, hashedPassword) => {
      if (hashError) {
        // Обработайте ошибку хеширования пароля
        console.error('Ошибка хеширования пароля:', hashError);
        res.render('register', { error: 'Ошибка регистрации' });
      } else {
        // Создайте нового пользователя с хешированным паролем
        const newUser = new User(username, hashedPassword);
  
        newUser.save((saveError, result) => {
          if (saveError) {
            // Обработайте ошибку сохранения
            console.error('Ошибка при регистрации:', saveError);
            res.render('register', { error: 'Ошибка регистрации' });
          } else {
            // Пользователь успешно зарегистрирован
            res.redirect('/');
          }
        });
      }
    });
  });

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  // Здесь вы можете извлечь пользователя из вашей базы данных по id
  done(null, { id: id, username: 'user' });
});

app.use(passport.initialize());
app.use(passport.session());
  
app.get('/lk', (req, res) => {
  // Проверка аутентификации пользователя
  if (req.isAuthenticated()) {
    const userId = req.user.id; // Получить id залогиненного пользователя

    // Выполнить SQL-запросы для получения данных
    connection.query('SELECT * FROM users', (err, userRows) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Ошибка сервера');
      }

      connection.query('SELECT * FROM news', (err, newsRows) => {
        if (err) {
          console.error(err);
          return res.status(500).send('Ошибка сервера');
        }

        connection.query('SELECT * FROM vuzi', (err, vuziRows) => {
          if (err) {
            console.error(err);
            return res.status(500).send('Ошибка сервера');
          }

          connection.query('SELECT * FROM subscriptions', (err, subscriptionsRows) => {
            if (err) {
              console.error(err);
              return res.status(500).send('Ошибка сервера');
            }

            connection.query('SELECT * FROM reminders', (err, remindersRows) => {
              if (err) {
                console.error(err);
                return res.status(500).send('Ошибка сервера');
              }

            // Отобразите страницу "Личный кабинет" и передайте данные и id пользователя
            res.render('lk', { users: userRows, news: newsRows, vuzi: vuziRows, userId, subscriptions: subscriptionsRows,reminders: remindersRows });
          });
        });
      });
    });
  });
  } else {
    // Если пользователь не аутентифицирован, перенаправьте его на страницу входа
    res.redirect('/');
  }
});




app.get('/messages', (req, res) => {
  // Проверка аутентификации пользователя
  if (req.isAuthenticated()) {
    const userId = req.user.id; // Получить id залогиненного пользователя

    // Выполнить SQL-запросы для получения данных
    connection.query('SELECT * FROM users', (err, userRows) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Ошибка сервера');
      }

      connection.query('SELECT * FROM news', (err, newsRows) => {
        if (err) {
          console.error(err);
          return res.status(500).send('Ошибка сервера');
        }

        connection.query('SELECT * FROM vuzi', (err, vuziRows) => {
          if (err) {
            console.error(err);
            return res.status(500).send('Ошибка сервера');
          }

          connection.query('SELECT * FROM subscriptions', (err, subscriptionsRows) => {
            if (err) {
              console.error(err);
              return res.status(500).send('Ошибка сервера');
            }

            connection.query('SELECT * FROM reminders', (err, remindersRows) => {
              if (err) {
                console.error(err);
                return res.status(500).send('Ошибка сервера');
              }

            // Отобразите страницу "Личный кабинет" и передайте данные и id пользователя
            res.render('messages', { users: userRows, news: newsRows, vuzi: vuziRows, userId, subscriptions: subscriptionsRows,reminders: remindersRows });
          });
        });
      });
    });
  });
  } else {
    // Если пользователь не аутентифицирован, перенаправьте его на страницу входа
    res.redirect('/');
  }
});



app.get('/obuch', (req, res) => {
  // Проверка аутентификации пользователя
  if (req.isAuthenticated()) {
    const userId = req.user.id; // Получить id залогиненного пользователя

    // Выполнить SQL-запросы для получения данных
    connection.query('SELECT * FROM users', (err, userRows) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Ошибка сервера');
      }

      connection.query('SELECT * FROM news', (err, newsRows) => {
        if (err) {
          console.error(err);
          return res.status(500).send('Ошибка сервера');
        }

        connection.query('SELECT * FROM vuzi', (err, vuziRows) => {
          if (err) {
            console.error(err);
            return res.status(500).send('Ошибка сервера');
          }

          connection.query('SELECT * FROM subscriptions', (err, subscriptionsRows) => {
            if (err) {
              console.error(err);
              return res.status(500).send('Ошибка сервера');
            }

            connection.query('SELECT * FROM reminders', (err, remindersRows) => {
              if (err) {
                console.error(err);
                return res.status(500).send('Ошибка сервера');
              }

            // Отобразите страницу "Личный кабинет" и передайте данные и id пользователя
            res.render('obuch', { users: userRows, news: newsRows, vuzi: vuziRows, userId, subscriptions: subscriptionsRows,reminders: remindersRows });
          });
        });
      });
    });
  });
  } else {
    // Если пользователь не аутентифицирован, перенаправьте его на страницу входа
    res.redirect('/');
  }
});


// Обработка POST-запроса с результатами теста
app.post('/saveTestResults', (req, res) => {
  const userAnswers = req.body.answers;
  const correctAnswers = [/* массив с правильными ответами, например [0, 2, 1, ...] */];

  // Подсчет правильных ответов
  const score = userAnswers.filter(answer => correctAnswers.includes(answer)).length;

  // Сохранение результата в базу данных
  const query = 'INSERT INTO results (user_id, test_name, score) VALUES (?, ?, ?)';
  connection.query(query, [userId, 'russian', score], (err, results) => {
      if (err) {
          console.error('Error saving test results:', err);
          res.status(500).json({ message: 'Internal Server Error' });
      } else {
          res.status(200).json({ message: `Тест завершен! Ваш результат: ${score}/${russianQuestions.length} правильных заданий.` });
      }
  });
});

app.get('/messages/:userId/:otherUserId', (req, res) => {
  const userId = req.params.userId;
  const otherUserId = req.params.otherUserId;

  const query = `
      SELECT * FROM messages
      WHERE (user1 = ? AND user2 = ?) OR (user1 = ? AND user2 = ?)
      ORDER BY timestamp ASC;
  `;

  db.query(query, [userId, otherUserId, otherUserId, userId], (error, results) => {
      if (error) throw error;

      res.json(results);
  });
});
  

// Route to handle sending a message
app.post('/send-message', (req, res) => {
  const { userId, otherUserId, text } = req.body;

  const query = 'INSERT INTO messages (user1, user2, text) VALUES (?, ?, ?)';
  db.query(query, [userId, otherUserId, text], (error, results) => {
      if (error) throw error;

      res.json({ success: true });
  });
});
  
  app.post('/login', passport.authenticate('local', {
    successRedirect: '/lk', // После успешного входа перенаправление на "Личный кабинет"
    failureRedirect: '/', // При неудачной аутентификации перенаправление на страницу входа
  }));

  app.get('/admin', (req, res) => {
    res.redirect('https://app.forestadmin.com/SmartPath');
  });
  
passport.deserializeUser((id, done) => {
  // Здесь вы можете извлечь пользователя из вашей базы данных по id
  // Пример:
  connection.query('SELECT * FROM users WHERE id = ?', [id], (error, results) => {
    if (error) {
      return done(error);
    }

    if (results.length === 0) {
      return done(null, false);
    }

    const user = results[0];
    return done(null, user);
  });
});






app.get('/', (req, res) => {
  // Получите флеш-сообщения из сессии
  const messages = req.flash('info'); // 'info' здесь - это тип флеш-сообщения

  // Запрос данных из базы данных для таблицы 'vuzi'
  connection.query('SELECT * FROM vuzi', (vuziError, vuziResults, vuziFields) => {
    if (vuziError) {
      console.log(vuziError);
      res.send('Error fetching vuzi');
    } else {
      // Теперь выполните запрос данных из базы данных для таблицы 'news'
      connection.query('SELECT * FROM news', (newsError, newsResults, newsFields) => {
        if (newsError) {
          console.log(newsError);
          res.send('Error fetching news');
        } else {
          // Создайте объект, объединяя информацию о пользователе, флеш-сообщения, vuzi и news
          const data = {
            user: req.user,
            vuziData: vuziResults,
            newsData: newsResults, // Добавляем данные о новостях
            messages: messages
          };

          // Рендеринг страницы 'news' и передача объединенного объекта
          res.render('news', data);
        }
      });
    }
  });
});






app.post('/add-reminder', (req, res) => {
  const reminderName = req.body.reminderName;
  const startDate = req.body.startDate; // Исправьте опечатку в переменной
  const endDate = req.body.endDate;

  const userId = req.user.id; // Предполагается, что у вас есть объект пользователя в req

  // Здесь выполните SQL-запрос для добавления напоминания в базу данных
  const sql = 'INSERT INTO reminders (user_id, title, start_time, end_time) VALUES (?, ?, ?, ?)';
  const values = [userId, reminderName, startDate, endDate];

  connection.query(sql, values, (err, result) => {
      if (err) {
          console.error(err);
          console.log(reminderName);
          res.status(500).json({ error: 'Ошибка при добавлении напоминания' });
      } else {
          res.status(201).json({ message: 'Напоминание успешно добавлено' });
      }
  });
});

// Маршрут для обновления аватара пользователя по URL
// Обработчик POST-запроса
app.post('/update-avatar', (req, res) => {
  const userId = req.user.id; // Предполагается, что у вас есть req.user, содержащий информацию о пользователе
  const avatarURL = req.body.url;

  if (avatarURL) {
    const sql = 'UPDATE users SET image = ? WHERE id = ?';
    const values = [avatarURL, userId];

    connection.query(sql, values, (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: 'Ошибка сервера' });
      }

      res.redirect('/lk');
    });
  } else {
    res.status(400).json({ message: 'Пустой URL аватара' });
  }
});



app.post('/logout', (req, res) => {
  req.logout(()=>{
    res.status(200).send('OK');
  } ); // Разрушает текущую сессию
});

  

  