import app from './api/index';

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server is running locally on http://localhost:${PORT}`);
});
