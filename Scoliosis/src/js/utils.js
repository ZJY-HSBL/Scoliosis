// 工具函数
const utils = {
  // 显示提示消息
  showToast: function(message, duration = 2000) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.add('show');

    setTimeout(() => {
      toast.classList.remove('show');
    }, duration);
  },

  // 压缩图片
  compressImage: function(file, maxWidth = 800, quality = 0.8) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = function(event) {
        const img = new Image();
        img.onload = function() {
          try {
            // 计算压缩后的尺寸
            let width = img.width;
            let height = img.height;

            if (width > maxWidth) {
              height = (height * maxWidth) / width;
              width = maxWidth;
            }

            // 创建canvas并绘制图片
            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');

            // 处理透明背景（针对PNG）
            if (file.type === 'image/png') {
              canvas.width = width;
              canvas.height = height;
              ctx.clearRect(0, 0, width, height);
            }

            ctx.drawImage(img, 0, 0, width, height);

            // 根据文件类型设置输出格式
            const mimeType = file.type || 'image/jpeg';
            const dataUrl = canvas.toDataURL(mimeType, quality);
            resolve(dataUrl);
          } catch (error) {
            reject(new Error('图片压缩失败'));
          }
        };
        img.onerror = () => reject(new Error('图片加载失败'));
        img.src = event.target.result;
      };
      reader.onerror = () => reject(new Error('文件读取失败'));
      reader.readAsDataURL(file);
    });
  },

  // 存储分析结果到本地
  saveAnalysisResult: function(result) {
    const results = JSON.parse(localStorage.getItem('spinalAnalysisResults') || '[]');
    results.unshift({
      id: Date.now(),
      date: new Date().toLocaleString(),
      type: result.type,
      description: result.description,
      image: result.image,
      timestamp: Date.now()
    });
    localStorage.setItem('spinalAnalysisResults', JSON.stringify(results));
    return results;
  },

  // 获取本地存储的分析结果
  getSavedResults: function() {
    return JSON.parse(localStorage.getItem('spinalAnalysisResults') || '[]');
  }
};

export default utils;