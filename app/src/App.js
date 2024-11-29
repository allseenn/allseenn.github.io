import React, { useState, useEffect } from 'react';
import { Container, Grid, Typography, Paper } from '@mui/material';
import './index.css'; 

const App = () => {
    const [metrics, setMetrics] = useState({});

    const weatherCards = [
        { id: 'weatherTemp', title: 'Температура на улице', unit: '°C', blue: [-50, 0], green: [1, 25], red: [26, 50] },
        { id: 'weatherHum', title: 'Влажность на улице', unit: '%', blue: [61, 100], green: [31, 60], red: [0, 30]  },
    ];

    const getRandomValue = () => {
        return Math.floor(Math.random() * 3); 
    };

    const fetchData = async () => {
        try {
            const response = await fetch('/fakeData.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
    
            // Применяем случайное изменение ко всем значениям
            const modifiedMetrics = Object.fromEntries(
                Object.entries(data).map(([key, value]) => [key, value + getRandomValue()])
            );
    
            setMetrics((prevMetrics) => ({
                ...prevMetrics,
                ...modifiedMetrics,
            }));
        } catch (error) {
            console.error('Error fetching metrics: ', error);
        }
    };
   
    const fetchWeather = async () => {
        try {
            const response = await fetch('https://wttr.in/Moscow?format=%t+%h');
            const weather = await response.text();

            const weatherData = weather.split(' ');
            
            if (weatherData.length === 2) {
                const newWeather = {
                    weatherTemp: parseFloat(weatherData[0].replace('°C', '')),
                    weatherHum: parseFloat(weatherData[1].replace('%', '')),
                };

                setMetrics((prevMetrics) => ({
                    ...prevMetrics,
                    ...newWeather,
                }));
            } else {
                console.error('Unexpected weather data format:', weatherData);
            }
        } catch (error) {
            console.error('Error fetching weather data:', error);
        }
    };

    useEffect(() => {
        fetchData();
        fetchWeather();

        const interval = setInterval(() => {
            fetchData();
            fetchWeather();
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    const cards = [
        { id: 'temp', title: 'Температура воздуха', unit: '°C', blue: [0, 22.999], green: [23, 26.999], red: [27, 40] },
        { id: 'raw_temp', title: 'Некомпенсированная температура воздуха', unit: '°C', blue: [0, 22.999], green: [23, 26.999], red: [27.999, 40] },
        { id: 'humidity', title: 'Относительная влажность воздуха', unit: '%', blue: [61, 100], green: [31, 60.999], red: [0, 30.999] },
        { id: 'raw_hum', title: 'Некомпенсированная влажность воздуха', unit: '%', blue: [61, 100], green: [31, 60.999], red: [0, 30.999] },
        { id: 'press', title: 'Атмосферное давление', unit: 'mmHg', blue: [600, 720.999], green: [721, 770.999], red: [771, 800]  },
        { id: 'gas', title: 'Электрическое сопротивление воздуха', unit: 'KΩ', blue: [0, 10.999], green: [11, 50.999], red: [51, 100] },
        { id: 'ecCO2', title: 'Эквивалентная концентрация CO₂', unit: 'ppm', blue: [0, 200.999], green: [201, 600.999], red: [601, 5000] },
        { id: 'bVOC', title: 'Концентрация антропотоксинов', unit: 'ppm', blue: [0, 0.5999], green: [0.6, 1.5999], red: [1.6, 3.0] },
        { id: 'IAQ', title: 'Динамический индекс качества воздуха', unit: 'D-IAQ', blue: [101, 200.999], green: [0, 100.999], red: [201, 500] },
        { id: 'SIAQ', title: 'Статический индекс качества воздуха', unit: 'S-IAQ', blue: [101, 200.999], green: [0, 100.999], red: [201, 500] },
        { id: 'IAQ_ACC', title: 'Точность индекса качества воздуха', unit: 'QoS', blue: [1, 2], green: [3, 5], red: [0, 0] },
        { id: 'status', title: 'Ошибки работы датчика', unit: 'CODE', blue: [1, 2], green: [0, 0], red: [2, 10] },
        { id: 'rad_dyn', title: 'Динамический уровень радиации', unit: 'μR/h', blue: [30, 50.999], green: [0, 29.999], red: [51, 500] },
        { id: 'rad_stat', title: 'Статический уровень радиации', unit: 'μR/h', blue: [30, 50.999], green: [0, 29.999], red: [51, 500] },
    ];

    const getColor = (value, card) => {
        if (value >= card.blue[0] && value <= card.blue[1]) return 'blue';
        if (value >= card.green[0] && value <= card.green[1]) return 'green';
        if (value >= card.red[0] && value <= card.red[1]) return 'red';
        return 'black'; 
    };

    return (
        <Container maxWidth="lg" className="container my-4">
            <Typography variant="h3" align="center" gutterBottom>
                ODROID: WEB-MET
            </Typography>
            <Grid container spacing={3}>
                {cards.map((card) => (
                    <Grid item xs={12} sm={6} md={3} key={card.id}>
                        <Paper className="metric-card" elevation={3}>
                            <Typography variant="body1" align="center" className="card-title">
                                {card.title}
                            </Typography>
                            <Typography
                                variant="h4"
                                align="center"
                                className="card-value"
                                sx={{
                                    color: (theme) => {
                                        const value = metrics[card.id];
                                        return value !== undefined ? getColor(value, card) : 'black';
                                    },
                                }}
                            >
                                {metrics[card.id] ?? '--'}
                            </Typography>
                            <Typography variant="body2" align="center" className="card-unit">
                                {card.unit}
                            </Typography>
                        </Paper>
                    </Grid>
                ))}
                {weatherCards.map((card) => (
                    <Grid item xs={12} sm={6} md={3} key={card.id}>
                        <Paper className="metric-card" elevation={3}>
                            <Typography variant="body2" align="center" className="card-title">
                                {card.title}
                            </Typography>
                            <Typography
                                variant="h4"
                                align="center"
                                className="card-value"
                                sx={{
                                    color: (theme) => {
                                        const value = metrics[card.id];
                                        return value !== undefined ? getColor(value, card) : 'black';
                                    },
                                }}
                            >
                                {metrics[card.id] ?? '--'}
                            </Typography>
                            <Typography variant="body2" align="center" className="card-unit">
                                {card.unit}
                            </Typography>
                        </Paper>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
};

export default App;
