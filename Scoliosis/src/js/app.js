import utils from './utils.js';
import navigation from './navigation.js';
import imageUpload from './imageUpload.js';
import trainingDetail from './trainingDetail.js';
import analyzer from './analyzer.js';

// 初始化应用
document.addEventListener('DOMContentLoaded', () => {
  navigation.init();
  imageUpload.init();
  analyzer.init();
  trainingDetail.init();
});