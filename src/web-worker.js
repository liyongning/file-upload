/**
 * 文件切片
 *    通过循环将整个文件切片，在切的过程中每切一片，就当切好的分片发给主线程，当真个文件切完之后告诉主线程已完成
 * @param { File } file 文件对象
 * @param { number } chunkSize 单个切片的大小，单位字节
 */
function splitChunkForFile(file, chunkSize) {
  const { name, size, type, lastModified } = file

  // 每一片的开始位置
  let start = 0
  // chunk 索引，用来将序号添加到文件名上
  let chunkIdx = 0

  // 循环切每一片，直到整个文件切完
  while (start < size) {
    const chunk = file.slice(start, Math.min(start + chunkSize, size))
    const newFileChunk = new File([chunk], name + chunkIdx++, {
      type,
      lastModified,
    })

    start += chunkSize

    // 将当前切片发给主线程
    this.postMessage({ operation: 'splitChunkForFile', file: newFileChunk })
  }
}

// 接收主线程的消息
onmessage = function (e) {
  const { data } = e
  const { operation } = data

  if (operation === 'splitChunkForFile') {
    // 表示给对文件切片操作
    splitChunkForFile.apply(this, [data.file, data.chunkSize])
  }

  // 还可以扩展其它操作
}