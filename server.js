import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import path from 'path'
import userRoutes from './routes/userRoutes.js'
import connectDB from './config/db.js'
import errorHandler from './middlewares/errorHandler.js'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'

// APP CONFIG
dotenv.config()
const app = express()
app.use(cookieParser())
app.use(express.json())
app.use(cors())

if (process.env.NODE_ENV === 'development') app.use(morgan('dev'))

// DATBASE CONNECTION
connectDB()

// ROUTES
app.get('/api', (req, res) => {
	res.send('API is running')
})

app.use('/api/users', userRoutes)

const __dirname = path.resolve()
app.use('/uploads', express.static(path.join(__dirname, '/uploads')))

// SERVE STATIC ASSETS IF IN PRODUCTION - must put above clean up code

if (process.env.NODE_ENV === 'production') {
	// set static folder
	app.use(express.static(path.join(__dirname, '/frontend/build')))
	app.get('*', (req, res) => {
		res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'))
	})
}

app.all('*', (req, res) =>
	res.status(404).send({ message: `Not found - ${req.originalUrl}` })
)

// ERROR HANDLER
app.use(errorHandler)

// PORT CONFIG
const port = process.env.PORT || 5005
app.listen(port, () => {
	console.log(
		`Server running in ${process.env.NODE_ENV} mode on port ${port}`
	)
})
