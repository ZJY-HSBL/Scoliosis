import utils from './utils.js';

// 训练详情控制
const trainingDetail = {
  init: function() {
    // 初始化DOM元素
    this.backBtn = document.getElementById('back-to-plan');
    this.detailTitle = document.getElementById('detail-title');
    this.trainingInstructions = document.getElementById('training-instructions');
    this.trainingIntensity = document.getElementById('training-intensity');
    this.trainingNotes = document.getElementById('training-notes');
    this.startTrainingBtn = document.getElementById('start-training-btn');
    this.trainingVideo = document.getElementById('training-video');
    this.videoSource = this.trainingVideo.querySelector('source');

    // 绑定事件
    this.backBtn.addEventListener('click', () => {
      document.getElementById('training-detail-page').classList.remove('active');
      document.getElementById('analyze-page').classList.add('active');
    });

    this.startTrainingBtn.addEventListener('click', () => {
      utils.showToast('开始训练计时...');
      // 这里可以添加训练计时功能
    });
  },

  // 根据训练名称获取对应的视频文件
  getVideoForTraining(trainingName) {
    // 训练名称与视频文件的映射关系
    const videoMap = {
      '单侧侧屈': 'alteralflexion.mp4',
      '猫式呼吸': 'catpose.mp4',
      '死虫式': 'deadbug.mp4',
      '脊柱三维矫正': 'three-dimensional.mp4'
    };

    // 返回对应的视频文件，如果没有匹配的则使用默认视频
    return videoMap[trainingName] || 'alteralflexion.mp4';
  },

  // 显示训练详情
  showDetail(training) {
    // 设置标题
    this.detailTitle.textContent = training.name;

    // 设置训练说明
    this.trainingInstructions.innerHTML = `<p>${training.instructions}</p>`;

    // 设置训练强度
    this.trainingIntensity.innerHTML = `
      <p>每组次数：${training.intensity.sets}组</p>
      <p>每组动作：${training.intensity.reps}次</p>
      <p>组间休息：${training.intensity.rest}秒</p>
      <p>训练频率：每周${training.intensity.frequency}次</p>
    `;

    // 设置注意事项
    let notesHtml = '<ul>';
    training.notes.forEach(note => {
      notesHtml += `<li>${note}</li>`;
    });
    notesHtml += '</ul>';
    this.trainingNotes.innerHTML = notesHtml;

    // 设置视频源
    const videoFile = this.getVideoForTraining(training.name);
    this.videoSource.src = `./videos/${videoFile}`;
    this.trainingVideo.load(); // 重新加载视频

    // 切换到详情页
    document.getElementById('analyze-page').classList.remove('active');
    document.getElementById('training-detail-page').classList.add('active');
  }
};

export default trainingDetail;