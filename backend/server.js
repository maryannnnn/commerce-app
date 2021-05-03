import express from 'express';
import mongoose from 'mongoose';
import config from 'config';
import dotenv from 'dotenv';
import path from 'path';
import productRouter from './routers/productRouter.js';
import userRouter from './routers/userRouter.js';
import orderRouter from './routers/orderRouter.js';
import uploadRouter from './routers/uploadRouter.js';

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// mongoose.connect(process.env.MONGODB_URL || 'mongodb+srv://marian:marian737marian@cluster0.jmsg0.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', {
//  useNewUrlParser: true,
//  useUnifiedTopology: true,
//  useCreateIndex: true,
// });

app.use('/api/uploads', uploadRouter);

app.use('/api/users', userRouter);

app.use('/api/products', productRouter);

app.use('/api/orders', orderRouter);

app.get('/api/config/paypal', (req, res) => {
  res.send(config.get('paypalClientId') || 'sb');
});

app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

const __dirname = path.resolve();

if (process.env.NODE_ENV === 'production') {
  app.use('/', express.static(path.join(__dirname, 'frontend', 'build')))

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'))
  })
}


// app.use(express.static(path.join(__dirname, '/frontend/build')));
// app.get('*', (req, res) =>
//  res.sendFile(path.join(__dirname, '/frontend/build/index.html'))
// );
// app.get('/', (req, res) => {
//   res.send('Server is ready');
// });

app.use((err, req, res, next) => {
  res.status(500).send({ message: err.message });
});

const port = config.get('port') || 5000

// app.listen(port, () => {
//  console.log(`Serve at http://localhost:${port}`);
// });

async function start() {
  try {
    await mongoose.connect(config.get('mongoUri'), {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    })
    app.listen(port, () => console.log(`App has been started on port ${port}...`))
  } catch (e) {
    console.log('Server Error', e.message)
    process.exit(1)
  }
}

start()