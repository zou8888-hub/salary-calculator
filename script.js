// 实时工资计算器 - 简单直接的实现方式
// 全局变量
let monthlySalary = 0;
let workDays = 0;
let startTime = null;
let endTime = null;
let secondsPerDay = 0;
let moneyPerSecond = 0;
let moneyPerMinute = 0;
let currentSalary = 0;
let startTimeStamp = null;
let intervalId = null;
let lastCoinValue = 0;

// 国际化相关变量
let currentLanguage = 'en-US';
let translations = {};

// DOM元素引用
let elements = {};

// 检测用户系统语言
function detectUserLanguage() {
    // 获取用户浏览器语言
    const browserLanguage = navigator.language || navigator.userLanguage;
    console.log('检测到浏览器语言:', browserLanguage);
    
    // 支持的语言列表
    const supportedLanguages = ['zh-CN', 'en-US'];
    
    // 检查是否有完全匹配的语言
    if (supportedLanguages.includes(browserLanguage)) {
        currentLanguage = browserLanguage;
    } else {
        // 检查语言前缀匹配（如zh匹配zh-CN）
        const languagePrefix = browserLanguage.split('-')[0];
        const matchingLanguage = supportedLanguages.find(lang => lang.startsWith(languagePrefix));
        
        if (matchingLanguage) {
            currentLanguage = matchingLanguage;
        } else {
            // 默认使用英文
            currentLanguage = 'en-US';
        }
    }
    
    console.log('最终选择的语言:', currentLanguage);
    return currentLanguage;
}

// 加载指定语言的翻译文件
async function loadTranslations(language) {
    try {
        const response = await fetch(`lang/${language}.json`);
        if (!response.ok) {
            throw new Error(`Failed to load translations for ${language}`);
        }
        translations = await response.json();
        console.log('翻译文件加载成功:', language);
        return translations;
    } catch (error) {
        console.error('加载翻译文件失败:', error);
        // 如果加载失败，使用默认的英文翻译
        return await loadTranslations('en-US');
    }
}

// 应用翻译
function applyTranslations() {
    console.log('开始应用翻译');
    
    // 更新标题
    document.querySelector('.title').textContent = translations.appTitle;
    
    // 更新输入标签
    elements.monthlySalary.previousElementSibling.textContent = translations.inputLabels.monthlySalary;
    elements.workDays.previousElementSibling.textContent = translations.inputLabels.workDays;
    elements.startTime.previousElementSibling.textContent = translations.inputLabels.startTime;
    elements.endTime.previousElementSibling.textContent = translations.inputLabels.endTime;
    elements.lunchBreak.previousElementSibling.textContent = translations.inputLabels.lunchBreak;
    
    // 更新按钮文本
    elements.startBtn.textContent = translations.buttons.start;
    elements.endBtn.textContent = translations.buttons.end;
    elements.resetBtn.textContent = translations.buttons.reset;
    
    // 更新显示文本
    elements.earnedAmount.previousElementSibling.previousElementSibling.textContent = translations.displayTexts.earned;
    elements.earnedAmount.nextElementSibling.textContent = translations.displayTexts.yuan;
    elements.elapsedTime.previousElementSibling.textContent = translations.displayTexts.usedTime;
    elements.moneyPerMinute.previousElementSibling.previousElementSibling.textContent = translations.displayTexts.perMinute;
    
    console.log('翻译应用完成');
}

// 格式化时间为HH:MM:SS格式
function formatTime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', async function() {
    console.log('=== 实时工资计算器加载完成 ===');
    
    // 获取DOM元素
    console.log('开始获取DOM元素');
    elements.monthlySalary = document.getElementById('monthlySalary');
    elements.workDays = document.getElementById('workDays');
    elements.startTime = document.getElementById('startTime');
    elements.endTime = document.getElementById('endTime');
    elements.lunchBreak = document.getElementById('lunchBreak');
    elements.startBtn = document.getElementById('startBtn');
    elements.endBtn = document.getElementById('endBtn');
    elements.resetBtn = document.getElementById('resetBtn');
    // elements.currentSalary = document.getElementById('currentSalary'); // 此元素不存在，已注释
    elements.earnedAmount = document.getElementById('earnedAmount');
    elements.elapsedTime = document.getElementById('elapsedTime');
    elements.moneyPerMinute = document.getElementById('moneyPerMinute');
    elements.moneyPerMinuteRow = document.getElementById('moneyPerMinuteRow');
    elements.coinContainer = document.getElementById('coinContainer');
    elements.subtitleContainer = document.getElementById('subtitleContainer');
    elements.coinSound = document.getElementById('coinSound');
    
    // 验证DOM元素
    console.log('验证DOM元素存在性:');
    console.log('monthlySalary:', !!elements.monthlySalary);
    console.log('workDays:', !!elements.workDays);
    console.log('startTime:', !!elements.startTime);
    console.log('endTime:', !!elements.endTime);
    console.log('lunchBreak:', !!elements.lunchBreak);
    console.log('startBtn:', !!elements.startBtn);
    console.log('endBtn:', !!elements.endBtn);
    console.log('resetBtn:', !!elements.resetBtn);
    // console.log('currentSalary:', !!elements.currentSalary); // 此元素不存在，已注释
    console.log('earnedAmount:', !!elements.earnedAmount);
    console.log('elapsedTime:', !!elements.elapsedTime);
    console.log('moneyPerMinute:', !!elements.moneyPerMinute);
    console.log('moneyPerMinuteRow:', !!elements.moneyPerMinuteRow);
    console.log('coinContainer:', !!elements.coinContainer);
    console.log('subtitleContainer:', !!elements.subtitleContainer);
    console.log('coinSound:', !!elements.coinSound);
    
    // 准备音效
    console.log('准备音效');
    prepareSoundEffects();
    
    // 验证音效函数
    console.log('playCoinSound是否为函数:', typeof elements.playCoinSound === 'function');
    
    // 语言检测和翻译加载
    console.log('开始语言检测和翻译加载');
    detectUserLanguage();
    await loadTranslations(currentLanguage);
    applyTranslations();
    
    // 绑定事件监听器
    console.log('绑定事件监听器');
    bindEvents();
    
    console.log('=== 初始化完成 ===');
});

// 绑定事件监听器
function bindEvents() {
    // 开始计算按钮点击事件
    elements.startBtn.addEventListener('click', function() {
        console.log('开始计算按钮被点击');
        startCalculation();
    });
    
    // 结束计算按钮点击事件
    elements.endBtn.addEventListener('click', function() {
        console.log('结束计算按钮被点击');
        // 停止计算但不重置数据
        if (intervalId) {
            clearInterval(intervalId);
            intervalId = null;
        }
        
        // 显示每分钟挣钱结果
        if (moneyPerSecond > 0) {
            elements.moneyPerMinute.textContent = moneyPerMinute.toFixed(2);
            elements.moneyPerMinuteRow.style.display = 'block';
        } else {
            // 即使为0也显示，确保用户看到结果
            elements.moneyPerMinute.textContent = '0.00';
            elements.moneyPerMinuteRow.style.display = 'block';
        }
    });
    
    // 重置按钮点击事件
    elements.resetBtn.addEventListener('click', function() {
        console.log('重置按钮被点击');
        resetCalculation();
    });
}

// 开始计算
function startCalculation() {
    // 获取输入值
    const salaryValue = elements.monthlySalary.value;
    const daysValue = elements.workDays.value;
    const startValue = elements.startTime.value;
    const endValue = elements.endTime.value;
    const lunchBreakValue = elements.lunchBreak.value;
    
    // 验证输入
    if (!salaryValue || isNaN(parseFloat(salaryValue)) || parseFloat(salaryValue) <= 0) {
        alert(translations.messages.invalidSalary);
        return;
    }
    
    if (!daysValue || isNaN(parseInt(daysValue)) || parseInt(daysValue) <= 0) {
        alert(translations.messages.invalidWorkDays);
        return;
    }
    
    if (!lunchBreakValue || isNaN(parseInt(lunchBreakValue)) || parseInt(lunchBreakValue) < 0) {
        alert(translations.messages.invalidLunchBreak);
        return;
    }
    
    // 解析输入值
    monthlySalary = parseFloat(salaryValue);
    workDays = parseInt(daysValue);
    startTime = parseTime(startValue);
    endTime = parseTime(endValue);
    const lunchBreakSeconds = parseInt(lunchBreakValue) * 60; // 转换为秒
    
    // 计算每天工作秒数
    secondsPerDay = endTime - startTime;
    if (secondsPerDay < 0) {
        secondsPerDay += 24 * 3600; // 处理跨天的情况
    }
    
    // 扣除午休时间
    secondsPerDay = Math.max(0, secondsPerDay - lunchBreakSeconds);
    if (secondsPerDay <= 0) {
        alert(translations.messages.noWorkingTime);
        return;
    }
    
    // 计算每秒工资
    const dailySalary = monthlySalary / workDays;
    moneyPerSecond = dailySalary / secondsPerDay;
    moneyPerMinute = moneyPerSecond * 60;
    
    console.log('计算参数:', {
        monthlySalary,
        workDays,
        secondsPerDay,
        moneyPerSecond,
        moneyPerMinute
    });
    
    // 初始化计时
    startTimeStamp = Date.now();
    currentSalary = 0;
    lastCoinValue = 0;
    
    // 清除现有定时器
    if (intervalId) {
        clearInterval(intervalId);
    }
    
    // 设置新定时器，每秒更新一次
    intervalId = setInterval(updateSalary, 1000);
    
    // 立即更新一次
    updateSalary();
}

// 重置计算
function resetCalculation() {
    console.log('执行重置功能');
    // 清除定时器
    if (intervalId) {
        console.log('清除定时器:', intervalId);
        clearInterval(intervalId);
        intervalId = null;
    }
    
    // 重置所有状态变量
    currentSalary = 0;
    startTimeStamp = null;
    lastCoinValue = 0;
    
    // 重置显示
    // elements.currentSalary.textContent = '0.00'; // 此元素不存在，已注释
    elements.earnedAmount.textContent = '0.00';
    elements.elapsedTime.textContent = '00:00:00';
    elements.moneyPerMinute.textContent = '0.00';
    elements.moneyPerMinuteRow.style.display = 'none';
    // elements.currentSalary.classList.remove('money-animation'); // 此元素不存在，已注释
    elements.earnedAmount.classList.remove('money-animation');
    // elements.moneyPerMinute.classList.remove('money-animation'); // 移除每分钟挣钱动画
    // elements.elapsedTime.classList.remove('money-animation'); // 移除时间动画
    
    // 清空金币容器
    elements.coinContainer.innerHTML = '';
    
    // 清空字幕容器
    elements.subtitleContainer.innerHTML = '';
    
    // 重置输入
    elements.monthlySalary.value = '';
    elements.workDays.value = '';
    elements.startTime.value = '09:00';
    elements.endTime.value = '18:00';
    
    console.log('重置完成，所有状态已清除');
}

// 解析时间字符串为秒数
function parseTime(timeStr) {
    const parts = timeStr.split(':');
    const hours = parseInt(parts[0]);
    const minutes = parseInt(parts[1]);
    return hours * 3600 + minutes * 60;
}

// 更新工资显示
function updateSalary() {
    if (!startTimeStamp) return;
    
    // 计算经过的时间（秒）
    const elapsedSeconds = (Date.now() - startTimeStamp) / 1000;
    
    // 计算当前工资
    currentSalary = elapsedSeconds * moneyPerSecond;
    
    // 格式化并显示工资
    const formattedSalary = currentSalary.toFixed(2);
    // elements.currentSalary.textContent = formattedSalary; // 此元素不存在，已注释
    
    // 更新"我挣到了多少钱"显示
    elements.earnedAmount.textContent = formattedSalary;
    
    // 显示经过的时间
    const formattedTime = formatTime(elapsedSeconds);
    elements.elapsedTime.textContent = formattedTime;
    
    // 添加动画效果（仅保留金额动画，移除时间动画）
            // elements.currentSalary.classList.add('money-animation'); // 此元素不存在，已注释
            elements.earnedAmount.classList.add('money-animation');
            // elements.moneyPerMinute.classList.add('money-animation'); // 移除每分钟挣钱动画
            // elements.elapsedTime.classList.add('money-animation'); // 移除时间动画
            setTimeout(() => {
                // elements.currentSalary.classList.remove('money-animation'); // 此元素不存在，已注释
                elements.earnedAmount.classList.remove('money-animation');
                // elements.moneyPerMinute.classList.remove('money-animation'); // 移除每分钟挣钱动画
                // elements.elapsedTime.classList.remove('money-animation'); // 移除时间动画
            }, 500);
    
    // 检查是否需要掉落金币
    checkCoinDrop();
}

// 检查是否需要掉落金币
function checkCoinDrop() {
    const roundedValue = Math.floor(currentSalary * 10); // 将值乘以10，实现每0.1元掉落一次
    console.log('检查金币掉落 - 当前值:', roundedValue, '上次金币值:', lastCoinValue);
    
    // 每到0.1元且大于上一次的金币值时掉落金币
    if (roundedValue > lastCoinValue && roundedValue > 0) {
        console.log('满足所有条件，掉落金币');
        dropCoins(roundedValue / 10); // 除以10恢复原始值
        lastCoinValue = roundedValue;
    }
}

// 准备音效
function prepareSoundEffects() {
    // 存储AudioContext实例
    let audioContext = null;
    
    // 激活AudioContext（需要用户交互）
    function activateAudioContext() {
        if (!audioContext) {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (audioContext.state === 'suspended') {
            audioContext.resume();
        }
    }
    
    // 创建"咣咣咣"的音效
    function createCoinClang() {
        if (!audioContext) {
            activateAudioContext();
        }
        
        try {
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            // 设置音效参数
            oscillator.frequency.setValueAtTime(523, audioContext.currentTime); // C5
            oscillator.frequency.exponentialRampToValueAtTime(261.63, audioContext.currentTime + 0.2); // C4
            
            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
            
            // 启动音效
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.2);
        } catch (error) {
            console.error('创建音效失败:', error);
        }
    }
    
    // 替换默认的音效播放函数
    elements.playCoinSound = function() {
        try {
            // 激活AudioContext
            activateAudioContext();
            
            // 连续播放3次"咣咣咣"音效
            for (let i = 0; i < 3; i++) {
                setTimeout(createCoinClang, i * 100);
            }
        } catch (error) {
            console.error('播放音效失败:', error);
        }
    };
    
    // 监听用户交互事件来激活AudioContext
    document.addEventListener('click', activateAudioContext, { once: true });
    document.addEventListener('touchstart', activateAudioContext, { once: true });
}

// 显示字幕
function showSubtitle(value) {
    console.log('显示字幕:', value);
    
    // 确保字幕容器存在
    if (!elements.subtitleContainer) {
        console.error('字幕容器不存在');
        elements.subtitleContainer = document.getElementById('subtitleContainer');
        if (!elements.subtitleContainer) {
            console.error('无法获取字幕容器');
            return;
        }
    }
    
    const subtitle = document.createElement('div');
    subtitle.className = 'subtitle';
    subtitle.textContent = translations.messages.earnedSubtitle.replace('${value}', value);
    
    elements.subtitleContainer.appendChild(subtitle);
    
    // 3秒后移除字幕
    setTimeout(() => {
        if (subtitle.parentNode) {
            subtitle.parentNode.removeChild(subtitle);
        }
    }, 3000);
}

// 掉落金币
function dropCoins(value) {
    console.log('=== 开始掉落金币流程 ===');
    console.log('掉落金币值:', value);
    
    // 计算金币数量 - 每1元掉落时，增加大量金币，实现天上撒钱效果
    const coinCount = value * 3; // 每元掉落3个金币，数量随金额增加
    // 确保每次至少掉落20个金币，实现强烈的视觉冲击
    const actualCoinCount = Math.max(coinCount, 20);
    
    console.log('金币数量:', actualCoinCount);
    
    // 确保所有必要的元素都存在
    if (!elements.subtitleContainer) {
        elements.subtitleContainer = document.getElementById('subtitleContainer');
    }
    
    if (!elements.playCoinSound) {
        // 如果playCoinSound不存在，重新准备音效
        prepareSoundEffects();
    }
    
    // 显示字幕
    console.log('准备调用showSubtitle函数');
    showSubtitle(value);
    
    // 播放音效
    console.log('准备播放音效');
    if (typeof elements.playCoinSound === 'function') {
        console.log('调用playCoinSound函数');
        elements.playCoinSound();
    } else {
        console.error('音效播放函数不存在或不是函数:', typeof elements.playCoinSound);
    }
    
    // 创建金币
    console.log('开始创建金币');
    for (let i = 0; i < actualCoinCount; i++) {
        setTimeout(() => {
            createCoin();
        }, i * 50); // 间隔50ms创建一个金币，加快掉落速度
    }
    
    console.log('=== 掉落金币流程结束 ===');
}

// 创建单个金币
function createCoin() {
    const coin = document.createElement('div');
    coin.className = 'coin sparkle';
    
    // 随机位置
    const leftPosition = Math.random() * (window.innerWidth - 50);
    coin.style.left = leftPosition + 'px';
    
    // 添加到容器
    elements.coinContainer.appendChild(coin);
    
    // 3秒后移除金币
    setTimeout(() => {
        if (coin.parentNode) {
            coin.parentNode.removeChild(coin);
        }
    }, 3000);
}