import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

const host = process.env.HOST ?? 'localhost';
const port = process.env.PORT ? Number(process.env.PORT) : 3000;

const app = express();
app.use(express.json());
app.use(cors());

const mongoUrl =
  process.env.MONGO_URL ?? 'mongodb://127.0.0.1:27017/mydatabase';

mongoose
  .connect(mongoUrl)
  .then(() => {
    console.log('MongoDB connected');
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  });

/**
 * Схема + transform:
 * - поле "number" хранится в базе как уникальный номер,
 *   а наружу отдаём его как "id"
 * - скрываем "_id" и "__v"
 */
const participantSchema = new mongoose.Schema(
  {
    number: {
      type: Number,
      required: true,
      unique: true,
    },
    status: {
      type: String,
      enum: ['active', 'disabled'],
      default: 'active',
    },
  },
  {
    // Переопределяем, как документ превращается в JSON
    toJSON: {
      transform(doc, ret) {
        // ret — это объект, который пойдёт в JSON
        // Меняем "number" → "id"
        ret.id = ret.number;
        delete ret.number;

        // Удаляем служебные поля
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);

const Participant = mongoose.model('Participant', participantSchema);

/**
 * 1) Получить список всех участников
 *    GET /api/participants/list
 *
 *    Каждый участник вернётся в виде:
 *    {
 *      "id": 1,
 *      "status": "active"
 *    }
 */
app.get('/api/participants/list', async (req, res) => {
  try {
    const participants = await Participant.find().sort({ number: 1 });
    // Mongoose автоматически применит toJSON.transform при res.json(...)
    res.json(participants);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

/**
 * 2) Добавить N участников
 *    POST /api/participants/add
 *    Тело: { "count": 5 }
 */
app.post('/api/participants/add', async (req, res) => {
  try {
    const { count } = req.body;

    // Проверяем, что count – число и что оно положительное
    if (typeof count !== 'number' || count <= 0) {
      return res
        .status(400)
        .json({ error: 'Field "count" must be a positive number' });
    }

    // Находим текущий максимальный number среди участников
    const lastParticipant = await Participant.findOne().sort({ number: -1 });
    const startNumber = lastParticipant ? lastParticipant.number + 1 : 1;
    const endNumber = startNumber + count - 1;

    // Формируем массив новых участников
    const newParticipants = [];
    for (let i = startNumber; i <= endNumber; i++) {
      newParticipants.push({ number: i }); // status = "active" по умолчанию
    }

    // Сохраняем в базу разом
    const inserted = await Participant.insertMany(newParticipants);

    // При отдаче ответа Mongoose к каждому элементу применит toJSON.transform
    res.json({
      message: `Успешно добавлено ${count} участников`,
      range: `from ${startNumber} to ${endNumber}`,
      inserted,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ error: 'Duplicate number error' });
    }
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

/**
 * 3) Переключить статус участника по "id"
 *    PATCH /api/participants/:id/toggle-status
 *
 *    Обратите внимание, что ":id" — это наш "number",
 *    а не Mongo _id. Поэтому ищем участника через findOne().
 */
app.patch('/api/participants/:id/toggle-status', async (req, res) => {
  try {
    // id у нас хранится в поле "number"
    const { id } = req.params;
    // id — строка, поэтому приводим к числу
    const numericId = Number(id);

    // Ищем участника по "number"
    const participant = await Participant.findOne({ number: numericId });
    if (!participant) {
      return res.status(404).json({ error: 'Participant not found' });
    }

    // Переключаем статус
    participant.status =
      participant.status === 'active' ? 'disabled' : 'active';
    await participant.save();

    // Возвращаем обновлённую запись
    res.json(participant); // toJSON.transform сработает автоматически
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(port, host, () => {
  console.log(
    `[ ready ] ${host}${port != 443 && port != 80 ? ':' + port : ''}`
  );
});
