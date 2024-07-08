import express from 'express'
import cors from 'cors'
import multer from 'multer'
import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'
import { existsSync, mkdirSync } from 'fs'

// 解决 ESM 无法使用 __dirname 变量的问题
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const app = express()

// 解决跨域问题
app.use(cors())

/**
 * Multer 是一个 node.js 中间件，用于处理 multipart/form-data 类型的表单数据，它主要用于上传文件
 * 注意: Multer 不会处理任何非 multipart/form-data 类型的表单数据。
 */
const uplaod = multer({
  // 存储，上传的文件落盘
  storage: multer.diskStorage({
    // 将文件放到 /server/uploads 目录下
    destination: (_, __, cb) => {
      const uploadsDir = resolve(__dirname, 'uploads')
      if (!existsSync(uploadsDir)) {
        mkdirSync(uploadsDir)
      }

      cb(null, uploadsDir)
    },
    // 文件名使用原始文件名
    filename: (_, file, cb) => {
      cb(null, file.originalname)
    }
  })
})

app.get('/', (_, res) => {
  res.send('Hello World!')
})

app.post('/uplaod', uplaod.single('file'), (_, res) => {
  res.send('File uploaded successfully')
})

app.listen(3000, () => {
  console.log('Server listening on port 3000')
})
