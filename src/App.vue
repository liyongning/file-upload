<script setup>
import { ref } from 'vue'
import axios from 'axios'

const inputRef = ref(null)

async function handleUpload() {
  // 获取文件对象
  const file = inputRef.value.files[0]

  const formData = new FormData()
  formData.append('file', file)

  const { data } = await axios.request({
    url: 'http://localhost:3000/uplaod',
    method: 'POST',
    data: formData,
    // 上传进度，这个是通过 XMLHttpRequest 实现的能力
    onUploadProgress: function (progressEvent) {
      // 当前已上传完的大小 / 总大小
      const percentage = Math.round((progressEvent.loaded * 100) / progressEvent.total)
      console.log('Upload Progress: ', `${percentage}%`)
    }
  })
  console.log('data = ', data)
}
</script>

<template>
  <div>
    <input type="file" ref="inputRef" />
    <button @click="handleUpload">Upload</button>
  </div>
</template>

<style scoped>
</style>
