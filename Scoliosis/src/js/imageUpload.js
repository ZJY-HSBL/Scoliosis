import utils from './utils.js';

// 图片上传处理
const imageUpload = {
  init: function() {
    // 初始化DOM元素
    this.fileInput = document.getElementById('file-input');
    this.uploadArea = document.getElementById('upload-area');
    this.previewArea = document.getElementById('preview-area');
    this.previewImg = document.getElementById('preview-img');
    this.previewRemove = document.getElementById('preview-remove');
    this.analyzeBtn = document.getElementById('analyze-btn');
    this.fileName = ''; // 存储当前上传的文件名

    // 绑定事件
    this.uploadArea.addEventListener('click', (e) => {
      // 防止事件冒泡影响label
      e.stopPropagation();
      this.fileInput.click();
    });

    // 阻止label的默认行为
    document.querySelector('#upload-area label').addEventListener('click', (e) => {
      e.stopPropagation();
    });

    // 拖拽上传
    this.uploadArea.addEventListener('dragover', (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.uploadArea.classList.add('dragover');
    });

    this.uploadArea.addEventListener('dragleave', (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.uploadArea.classList.remove('dragover');
    });

    this.uploadArea.addEventListener('drop', (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.uploadArea.classList.remove('dragover');
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        this.handleFile(e.dataTransfer.files[0]);
      }
    });

    // 选择文件后处理
    this.fileInput.addEventListener('change', (e) => {
      if (e.target.files && e.target.files.length > 0) {
        this.handleFile(e.target.files[0]);
      }
    });

    // 移除预览图片
    this.previewRemove.addEventListener('click', (e) => {
      e.stopPropagation();
      this.clearPreview();
    });
  },

  // 处理上传的文件
  async handleFile(file) {
    try {
      // 保存文件名
      this.fileName = file.name;

      // 验证文件类型
      const fileExtension = file.name.split('.').pop().toLowerCase();
      const validExtensions = ['jpg', 'jpeg', 'png', 'webp'];

      if (!validExtensions.includes(fileExtension)) {
        utils.showToast('请上传 JPG/PNG/WEBP 格式的图片');
        return;
      }

      // 验证文件大小
      if (file.size > 5 * 1024 * 1024) {
        utils.showToast('图片超过5MB，请压缩后上传');
        return;
      }

      // 压缩图片
      utils.showToast('正在处理图片...');
      const compressedDataUrl = await utils.compressImage(file);

      // 如果文件名是1.jpg，直接按照原有逻辑处理
      if (this.fileName === '1.jpg') {
        // 显示预览
        this.previewImg.src = compressedDataUrl;
        this.previewArea.style.display = 'block';
        this.analyzeBtn.disabled = false;

        // 存储图片数据
        this.imageBase64 = compressedDataUrl;

        utils.showToast('图片上传成功');
        return;
      }

      // 对于非1.jpg的图片，调用AI API判断是否为脊柱X光片
      const isSpinalXRay = await this.validateSpinalXRay(compressedDataUrl);

      if (!isSpinalXRay) {
        utils.showToast('图片错误，请上传人体脊柱的X光图片！');
        return;
      }

      // 显示预览
      this.previewImg.src = compressedDataUrl;
      this.previewArea.style.display = 'block';
      this.analyzeBtn.disabled = false;

      // 存储图片数据
      this.imageBase64 = compressedDataUrl;

      utils.showToast('图片上传成功');
    } catch (error) {
      utils.showToast(error.message || '图片处理失败，请重试');
      console.error('图片处理错误:', error);
    }
  },

  // 调用AI API验证是否为脊柱X光片
  async validateSpinalXRay(imageData) {
    try {
      // 移除base64数据URL前缀
      const base64Data = imageData.split(',')[1];

      const response = await fetch('https://ark.cn-beijing.volces.com/api/v3/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer token..........'
        },
        body: JSON.stringify({
          model: 'doubao-seed-1-6-vision-250815',
          messages: [
            {
              role: 'user',
              content: [
                {
                  type: 'text',
                  text: '请判断这张图片是否为人体脊柱的X光图片。请只回答"是"或"否"。'
                },
                {
                  type: 'image_url',
                  image_url: {
                    url: imageData
                  }
                }
              ]
            }
          ],
          max_tokens: 10
        })
      });

      if (!response.ok) {
        throw new Error('AI验证失败');
      }

      const data = await response.json();
      const aiResponse = data.choices[0].message.content.trim();

      // 如果AI回答"是"或包含"是"的关键字，则认为是脊柱X光片
      return aiResponse.includes('是') && !aiResponse.includes('否');
    } catch (error) {
      console.error('AI验证错误:', error);
      // 出错时默认允许继续处理（避免API问题导致无法使用）
      return true;
    }
  },

  // 清除预览
  clearPreview() {
    this.previewArea.style.display = 'none';
    this.previewImg.src = '';
    this.analyzeBtn.disabled = true;
    this.imageBase64 = '';
    this.fileInput.value = '';
    this.fileName = ''; // 清空文件名
  },

  // 获取图片Base64数据
  getImageData() {
    return this.imageBase64;
  },

  // 获取当前上传的文件名
  getFileName() {
    return this.fileName;
  }
};

export default imageUpload;
