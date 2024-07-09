<script setup>
import { ref } from 'vue'
import axios from 'axios'

const inputRef = ref(null)

// 分片大小，单位字节
// const chunkSize = 1024
const chunkSize = 4

/**
 * 文件切片
 * @param { File } file 文件对象
 * @returns Array<File> 文件的所有切片组成的 File 对象
 */
function splitChunkForFile(file) {
  const { name, size, type, lastModified } = file

  // 存放所有切片
  const allFileChunks = []
  
  // 每一片的开始位置
  let start = 0

  // 循环切每一片，直到整个文件切完
  while (start <= size) {
    const chunk = file.slice(start, Math.min(start + chunkSize, size))
    const newFileChunk = new File([chunk], name + allFileChunks.length, {
      type,
      lastModified,
    })

    start += chunkSize

    allFileChunks.push(newFileChunk)
  }

  return allFileChunks
}

// 上传文件
async function handleUpload() {
  // 获取文件对象
  const file = inputRef.value.files[0]

  // 文件切片
  const allFileChunks = splitChunkForFile(file)

  // 遍历所有切片并上传
  for (let i = 0; i < allFileChunks.length; i++) {
    const fileChunk = allFileChunks[i]

    const formData = new FormData()
    formData.append('file', fileChunk)
    // 标识当前 chunk 属于哪个文件，方便服务端做内容分类和合并，实际场景中这块儿需要考虑唯一性
    formData.append('uuid', file.name)
    // 标识当前 chunk 是文件的第几个 chunk，即保证 chunk 顺序
    formData.append('index', i)
    // 标识总共有多少 chunk，方便服务端判断是否已经接收完所有 chunk
    formData.append('total', allFileChunks.length)

    axios.request({
      url: 'http://localhost:3000/uplaod',
      method: 'POST',
      data: formData,
      // 上传进度，这个是通过 XMLHttpRequest 实现的能力
      onUploadProgress: function (progressEvent) {
        // 当前已上传完的大小 / 总大小
        const percentage = Math.round((progressEvent.loaded * 100) / progressEvent.total)
        console.log('Upload Progress: ', `${percentage}%`)
      }
    }).then(res => {
      console.log('result = ', res.data)
    })
  }
}
</script>

<template>
  <div>
    <input type="file" ref="inputRef" />
    <button @click="handleUpload">Upload</button>
  </div>
</template>

<style scoped></style>
