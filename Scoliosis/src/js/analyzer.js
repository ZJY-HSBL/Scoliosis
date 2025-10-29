import utils from './utils.js';
import imageUpload from './imageUpload.js';
import trainingDetail from './trainingDetail.js';

// 分析功能
const analyzer = {
  init: function() {
    // 初始化DOM元素
    this.analyzeBtn = document.getElementById('analyze-btn');
    this.loading = document.getElementById('loading');
    this.error = document.getElementById('error');
    this.resultArea = document.getElementById('result-area');
    this.spinalType = document.getElementById('spinal-type');
    this.spinalDescription = document.getElementById('spinal-description');
    this.trainingPlanContent = document.getElementById('training-plan-content');
    this.saveResultBtn = document.getElementById('save-result-btn');

    // 绑定事件
    this.analyzeBtn.addEventListener('click', () => this.startAnalysis());
    this.saveResultBtn.addEventListener('click', () => this.saveResult());

    // 初始化训练方案点击事件委托
    this.trainingPlanContent.addEventListener('click', (e) => {
      const planItem = e.target.closest('.training-plan-item');
      if (planItem) {
        const index = Array.from(this.trainingPlanContent.children).indexOf(planItem);
        trainingDetail.showDetail(this.currentTrainingPlan[index]);
      }
    });

    // 初始化数据
    this.currentTrainingPlan = [];
    this.currentResult = null;
  },

  // 生成符合脊柱侧弯状态的描述
  generateSpinalDescription(type) {
    // 预设一些常见的脊柱侧弯描述
    const descriptions = [
      "胸椎向右侧弯，腰椎向左代偿；骨盆右侧偏高，骨盆向左偏移；胸廓向右旋转。Cobb角：{angle}度",
      "胸椎向左侧弯，腰椎向右代偿；骨盆左侧偏高，骨盆向右偏移；胸廓向左旋转。Cobb角：{angle}度",
      "腰椎向右侧弯，胸椎向左代偿；骨盆右侧偏低，骨盆向右偏移；胸廓轻微旋转。Cobb角：{angle}度",
      "腰椎向左侧弯，胸椎向右代偿；骨盆左侧偏低，骨盆向左偏移；胸廓轻微旋转。Cobb角：{angle}度",
      "胸腰椎联合侧弯，呈S形改变；骨盆两侧高度不等，存在明显旋转；胸廓不对称。Cobb角：{angle}度"
    ];

    // 确定Cobb角
    let cobbAngle;
    // 检查当前图片是否为1.jpg
    if (imageUpload.getFileName() === '1.jpg') {
      cobbAngle = 22.6;
    } else {
      // 随机生成10-45度之间的Cobb角，保留一位小数
      cobbAngle = (Math.random() * 35 + 10).toFixed(1);
    }

    // 根据侧弯类型选择或随机选择一个描述并替换角度
    let description;
    if (type.includes("胸椎右侧弯")) {
      description = descriptions[0];
    } else if (type.includes("胸椎左侧弯")) {
      description = descriptions[1];
    } else if (type.includes("腰椎右侧弯")) {
      description = descriptions[2];
    } else if (type.includes("腰椎左侧弯")) {
      description = descriptions[3];
    } else if (type.includes("S形") || type.includes("联合侧弯")) {
      description = descriptions[4];
    } else {
      // 随机选择一个描述
      description = descriptions[Math.floor(Math.random() * descriptions.length)];
    }

    // 替换角度占位符
    return description.replace('{angle}', cobbAngle);
  },

  // 修改 getTrainingPlanByType 方法，确保包含指定的训练且总数为4个
  getTrainingPlanByType(type) {
    // 定义四种特定训练
    const deadBugExercise = {
      name: "死虫式",
      instructions: "仰卧位，双膝弯曲与髋同宽，双臂伸直指向天花板。保持腰部贴紧地面，同时缓慢伸展对侧手臂和腿，如右手和左腿，伸展至接近地面但不触地，然后缓慢收回。交替进行对侧手脚的伸展与收回。",
      intensity: { sets: 3, reps: 12, rest: 45, frequency: 5 },
      notes: [
        "保持脊柱中立位：动作过程中，腰部应始终贴紧地面，避免拱起或离开垫子，确保骨盆和脊柱处于中立位置",
        "缓慢控制动作：手脚伸展和收回的动作应缓慢进行，避免借助惯性快速摆动，重点在于感受核心肌群的发力和控制",
        "呼吸配合：动作过程中保持平稳呼吸，避免憋气",
        "对侧手脚同步运动：左手与右脚、右手与左脚同步伸展和收回，保持身体的平衡和协调",
        "避免过度追求幅度：动作幅度应以保持腰部稳定为前提，避免过度追求手脚接近地面而失去核心控制"
      ]
    };

    const lateralFlexionExercise = {
      name: "单侧侧屈",
      instructions: "站立位，双脚与肩同宽。一手放在身体侧面，另一手上举缓慢向对侧弯曲，感受侧弯侧的拉伸。保持3-5秒后回到起始位置，两侧交替进行。",
      intensity: { sets: 3, reps: 8, rest: 45, frequency: 4 },
      notes: [
        "避免过度弯曲导致不适",
        "保持身体正面朝前，不要前后倾",
        "拉伸时感受侧腰肌肉的牵拉"
      ]
    };

    const catPoseExercise = {
      name: "猫式呼吸",
      instructions: "四足跪姿，双手与肩同宽，双膝与髋同宽。吸气时腹部下沉，背部微微下凹，抬头看向前方；呼气时腹部收紧，背部拱起如猫伸展，低头看向腹部。动作缓慢，配合呼吸节奏。",
      intensity: { sets: 3, reps: 10, rest: 30, frequency: 5 },
      notes: [
        "保持手臂伸直但肘部不锁死",
        "动作幅度以不引起疼痛为限",
        "呼吸要均匀，不要憋气"
      ]
    };

    const threeDimensionalExercise = {
      name: "脊柱三维矫正",
      instructions: "站姿或坐姿，首先找到中立位，然后依次进行脊柱的三个平面矫正：冠状面（左右）、矢状面（前后）和水平面（旋转）。每个平面保持5秒，缓慢回到中立位，重复进行。",
      intensity: { sets: 2, reps: 6, rest: 60, frequency: 3 },
      notes: [
        "动作要缓慢、有控制",
        "每个平面矫正到有轻微拉伸感即可",
        "保持自然呼吸，不要憋气"
      ]
    };

    // 根据侧弯类型返回4种训练组合
    // 确保包含所有四种特定训练，或根据需要调整组合
    return [
      deadBugExercise,
      lateralFlexionExercise,
      catPoseExercise,
      threeDimensionalExercise
    ];
  },

  // 开始分析
  async startAnalysis() {
    try {
      // 显示加载状态
      this.loading.style.display = 'block';
      this.error.style.display = 'none';
      this.resultArea.style.display = 'none';
      this.analyzeBtn.disabled = true;

      // 获取图片数据
      const imageData = imageUpload.getImageData();
      if (!imageData) {
        throw new Error('未找到图片数据，请重新上传');
      }

      // 模拟分析过程（实际应用中这里会调用后端API）
      await new Promise(resolve => setTimeout(resolve, 2000));

      // 生成分析结果（实际应用中这里会使用API返回的数据）
      let spinalType;
      // 根据文件名返回特定类型，否则随机生成
      if (imageUpload.getFileName() === '1.jpg') {
        spinalType = "胸椎右侧弯";
      } else {
        const types = [
          "胸椎右侧弯", "胸椎左侧弯",
          "腰椎右侧弯", "腰椎左侧弯",
          "胸腰椎联合侧弯"
        ];
        spinalType = types[Math.floor(Math.random() * types.length)];
      }

      // 生成描述
      const description = this.generateSpinalDescription(spinalType);

      // 获取训练方案
      const trainingPlan = this.getTrainingPlanByType(spinalType);

      // 保存当前结果
      this.currentResult = {
        type: spinalType,
        description: description,
        image: imageData
      };
      this.currentTrainingPlan = trainingPlan;

      // 显示结果
      this.spinalType.textContent = spinalType;
      this.spinalDescription.textContent = description;

      // 生成训练方案HTML
      let trainingHtml = '';
      trainingPlan.forEach(plan => {
        trainingHtml += `
          <div class="training-plan-item">
            <h4>${plan.name}</h4>
          </div>
        `;
      });
      this.trainingPlanContent.innerHTML = trainingHtml;

      // 显示结果区域，隐藏加载状态
      this.loading.style.display = 'none';
      this.resultArea.style.display = 'block';
      this.analyzeBtn.disabled = false;

      utils.showToast('分析完成');
    } catch (error) {
      // 显示错误信息
      this.loading.style.display = 'none';
      this.error.textContent = error.message || '分析失败，请重试';
      this.error.style.display = 'block';
      this.analyzeBtn.disabled = false;
      console.error('分析错误:', error);
    }
  },

  // 保存分析结果
  saveResult() {
    if (!this.currentResult) {
      utils.showToast('没有可保存的分析结果');
      return;
    }

    try {
      // 保存结果到本地存储
      utils.saveAnalysisResult(this.currentResult);
      utils.showToast('分析结果已保存');
    } catch (error) {
      utils.showToast('保存失败，请重试');
      console.error('保存结果错误:', error);
    }
  }
};

export default analyzer;