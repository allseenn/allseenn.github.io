const express = require('express');
const path = require('path');
const redis = require('redis');

const app = express();
const port = 1080;

const redisClient = redis.createClient();
redisClient.connect().catch(console.error);

app.get('/api/data', async (req, res) => {
    try {
        const list = await redisClient.lRange('0', 0, -1);
        const data = {
            temp: parseFloat(list[0]),
            raw_temp: parseFloat(list[1]),
            humidity: parseFloat(list[2]),
            raw_hum: parseFloat(list[3]),
            press: parseFloat(list[4]),
            gas: parseFloat(list[5]),
            ecCO2: parseFloat(list[6]),
            bVOC: parseFloat(list[7]),
            IAQ: parseFloat(list[8]),
            SIAQ: parseFloat(list[9]),
            IAQ_ACC: parseInt(list[10], 10),
            status: parseInt(list[11], 10),
            rad_dyn: parseFloat(list[12]),
            rad_stat: parseInt(list[13], 10),
        };
        res.json(data);
    } catch (error) {
        console.error('Error fetching data from Redis:', error);
        res.status(500).json({ error: 'Failed to retrieve data' });
    }
});

app.use(express.static(path.join(__dirname, 'build')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});


app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
