import express from 'express';

import { connectToIMAP } from './services/imapService';
import { connect } from 'http2';
import emailRoutes from './routes/emailRoutes';

import cors from 'cors';

const app = express();
app.use(express.json());
app.use(cors());
app.use('/api', emailRoutes);

app.get('/', (req, res) => {
  res.send('API Running...');
});


connectToIMAP();


const PORT = process.env.PORT || 3000;


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});




