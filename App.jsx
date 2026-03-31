import React, { useState, useEffect } from ‘react’;
import { Heart, Sparkles, Sun, Moon, Battery, CalendarHeart, Smile, Frown, Meh, BookOpen, Coffee, Briefcase, Edit2, Trash2, Search, Download, BarChart3, TrendingUp } from ‘lucide-react’;
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell, PieChart, Pie, Legend } from ‘recharts’;
import { motion, AnimatePresence } from ‘framer-motion’;

// 初始模拟数据
const initialEntries = [
{ id: 1, date: ‘2026-03-20’, mood: ‘开心冒泡’, energy: 8, tag: ‘生活日常’, happiness: ‘喝了甜甜的奶茶\n看到了晚霞\n收到朋友的信息’, gratitude: ‘感谢外卖小哥\n感谢好天气’, growth: ‘今天没有熬夜’, notes: ‘今天真是美好的一天！’ },
{ id: 2, date: ‘2026-03-21’, mood: ‘岁月静好’, energy: 6, tag: ‘工作闪光’, happiness: ‘准时下班\n午餐很好吃\n搞定了一个bug’, gratitude: ‘感谢同事的帮忙\n感谢自己’, growth: ‘学会了一个新技能’, notes: ‘平平静静才是真。’ },
{ id: 3, date: ‘2026-03-22’, mood: ‘抱抱自己’, energy: 3, tag: ‘学习力量’, happiness: ‘看了一页书\n听了喜欢的歌\n洗了个热水澡’, gratitude: ‘感谢一直坚持的自己\n感谢柔软的床’, growth: ‘允许自己今天不完美’, notes: ‘有点累，但没关系，明天会更好。’ },
{ id: 4, date: ‘2026-03-23’, mood: ‘开心冒泡’, energy: 9, tag: ‘生活日常’, happiness: ‘买到了喜欢的花\n睡到自然醒\n看了部好电影’, gratitude: ‘感谢周末\n感谢花店老板’, growth: ‘学会了插花’, notes: ‘周末万岁！’ },
{ id: 5, date: ‘2026-03-24’, mood: ‘开心冒泡’, energy: 7, tag: ‘工作闪光’, happiness: ‘被老板夸奖\n喝了咖啡\n完成了周报’, gratitude: ‘感谢团队\n感谢咖啡机’, growth: ‘沟通能力提升’, notes: ‘继续加油呀！’ },
];

export default function DreamDiary() {
const [activeTab, setActiveTab] = useState(‘write’);
const [darkMode, setDarkMode] = useState(false);
const [entries, setEntries] = useState([]);
const [searchQuery, setSearchQuery] = useState(’’);
const [filterTag, setFilterTag] = useState(’’);
const [filterMood, setFilterMood] = useState(’’);
const [editingId, setEditingId] = useState(null);

// 表单状态
const [mood, setMood] = useState(‘开心冒泡’);
const [energy, setEnergy] = useState(7);
const [tag, setTag] = useState(‘生活日常’);
const [happiness, setHappiness] = useState(’’);
const [gratitude, setGratitude] = useState(’’);
const [growth, setGrowth] = useState(’’);
const [notes, setNotes] = useState(’’);

// 从 LocalStorage 加载数据
useEffect(() => {
const savedEntries = localStorage.getItem(‘dreamDiaryEntries’);
if (savedEntries) {
try {
setEntries(JSON.parse(savedEntries));
} catch (e) {
setEntries(initialEntries);
localStorage.setItem(‘dreamDiaryEntries’, JSON.stringify(initialEntries));
}
} else {
setEntries(initialEntries);
localStorage.setItem(‘dreamDiaryEntries’, JSON.stringify(initialEntries));
}
}, []);

// 保存数据到 LocalStorage
const saveToLocalStorage = (data) => {
localStorage.setItem(‘dreamDiaryEntries’, JSON.stringify(data));
};

// 编辑记录
const startEdit = (entry) => {
setEditingId(entry.id);
setMood(entry.mood);
setEnergy(entry.energy);
setTag(entry.tag);
setHappiness(entry.happiness);
setGratitude(entry.gratitude);
setGrowth(entry.growth);
setNotes(entry.notes);
setActiveTab(‘write’);
};

// 保存或更新记录
const handleSave = () => {
if (!happiness && !gratitude && !growth) {
alert(‘至少记录一点小美好再走吧~ 💕’);
return;
}

```
let newEntries;
if (editingId) {
  newEntries = entries.map(e =>
    e.id === editingId
      ? { ...e, mood, energy, tag, happiness, gratitude, growth, notes }
      : e
  );
  alert('记录已更新！✨');
  setEditingId(null);
} else {
  const newEntry = {
    id: Date.now(),
    date: new Date().toISOString().split('T')[0],
    mood,
    energy,
    tag,
    happiness,
    gratitude,
    growth,
    notes
  };
  newEntries = [...entries, newEntry];
  alert('记录成功！✨');
}

setEntries(newEntries);
saveToLocalStorage(newEntries);

setHappiness('');
setGratitude('');
setGrowth('');
setNotes('');
setMood('开心冒泡');
setEnergy(7);
setTag('生活日常');
setActiveTab('dashboard');
```

};

// 删除记录
const handleDelete = (id) => {
if (window.confirm(‘确定要删除这条记录吗？’)) {
const newEntries = entries.filter(e => e.id !== id);
setEntries(newEntries);
saveToLocalStorage(newEntries);
alert(‘记录已删除~ 🌸’);
}
};

// 搜索和筛选
const filteredEntries = entries.filter(entry => {
const matchesSearch = searchQuery === ‘’ ||
entry.happiness.includes(searchQuery) ||
entry.gratitude.includes(searchQuery) ||
entry.growth.includes(searchQuery) ||
entry.notes.includes(searchQuery);

```
const matchesTag = filterTag === '' || entry.tag === filterTag;
const matchesMood = filterMood === '' || entry.mood === filterMood;

return matchesSearch && matchesTag && matchesMood;
```

});

// 导出为 JSON
const handleExportJSON = () => {
const dataStr = JSON.stringify(entries, null, 2);
const dataBlob = new Blob([dataStr], { type: ‘application/json’ });
const url = URL.createObjectURL(dataBlob);
const link = document.createElement(‘a’);
link.href = url;
link.download = `dream-diary-${new Date().toISOString().split('T')[0]}.json`;
link.click();
};

// 导出为 CSV
const handleExportCSV = () => {
let csv = ‘日期,心情,能量值,标签,3件小幸福,2件感谢,1件小成长,备注\n’;
entries.forEach(entry => {
const row = [
entry.date,
entry.mood,
entry.energy,
entry.tag,
`"${entry.happiness.replace(/\n/g, ' | ')}"`,
`"${entry.gratitude.replace(/\n/g, ' | ')}"`,
`"${entry.growth}"`,
`"${entry.notes}"`
].join(’,’);
csv += row + ‘\n’;
});

```
const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
const url = URL.createObjectURL(blob);
const link = document.createElement('a');
link.href = url;
link.download = `dream-diary-${new Date().toISOString().split('T')[0]}.csv`;
link.click();
```

};

// 统计数据计算
const totalHappiness = entries.length * 3;
const totalGratitude = entries.length * 2;
const totalGrowth = entries.length * 1;

const moodCounts = {
‘开心冒泡’: entries.filter(e => e.mood === ‘开心冒泡’).length,
‘岁月静好’: entries.filter(e => e.mood === ‘岁月静好’).length,
‘抱抱自己’: entries.filter(e => e.mood === ‘抱抱自己’).length,
};

const tagCounts = {
‘生活日常’: entries.filter(e => e.tag === ‘生活日常’).length,
‘工作闪光’: entries.filter(e => e.tag === ‘工作闪光’).length,
‘学习力量’: entries.filter(e => e.tag === ‘学习力量’).length,
};

const moodData = [
{ name: ‘开心冒泡’, count: moodCounts[‘开心冒泡’], color: ‘#FDBA74’ },
{ name: ‘岁月静好’, count: moodCounts[‘岁月静好’], color: ‘#FDE047’ },
{ name: ‘抱抱自己’, count: moodCounts[‘抱抱自己’], color: ‘#93C5FD’ },
];

const tagData = [
{ name: ‘生活日常’, count: tagCounts[‘生活日常’], color: ‘#FB923C’ },
{ name: ‘工作闪光’, count: tagCounts[‘工作闪光’], color: ‘#60A5FA’ },
{ name: ‘学习力量’, count: tagCounts[‘学习力量’], color: ‘#A78BFA’ },
];

const energyData = entries
.sort((a, b) => new Date(a.date) - new Date(b.date))
.map(e => ({
date: e.date.slice(5),
energy: e.energy
}));

const monthlyStats = {};
entries.forEach(entry => {
const month = entry.date.slice(0, 7);
if (!monthlyStats[month]) {
monthlyStats[month] = { count: 0, avgEnergy: 0, totalEnergy: 0 };
}
monthlyStats[month].count += 1;
monthlyStats[month].totalEnergy += entry.energy;
});

Object.keys(monthlyStats).forEach(month => {
monthlyStats[month].avgEnergy = (monthlyStats[month].totalEnergy / monthlyStats[month].count).toFixed(1);
});

const monthlyData = Object.entries(monthlyStats)
.sort(([a], [b]) => a.localeCompare(b))
.map(([month, stats]) => ({
month: month.slice(5),
count: stats.count,
avgEnergy: parseFloat(stats.avgEnergy)
}));

const bgClass = darkMode ? ‘bg-gray-900 text-white’ : ‘bg-[#FFF5F5] text-gray-800’;
const cardClass = darkMode ? ‘bg-gray-800 border-gray-700’ : ‘bg-white border-pink-50’;
const inputClass = darkMode ? ‘bg-gray-700 text-white border-gray-600’ : ‘bg-pink-50/30 border-pink-100 text-gray-700’;

return (
<div className={`min-h-screen ${bgClass} font-sans selection:bg-pink-200 transition-colors duration-300`}>
{/* 顶部导航 */}
<header className={`${darkMode ? 'bg-gray-800/70 border-gray-700' : 'bg-white/70 border-pink-50'} backdrop-blur-md border-b shadow-sm sticky top-0 z-10 transition-colors`}>
<div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
<div className="flex items-center gap-2">
<Heart className="text-pink-400 fill-pink-400" size={28} />
<h1 className="text-xl font-bold text-pink-500 tracking-wide">321幸福手帐</h1>
<span className="text-sm text-gray-400 ml-2">共 {entries.length} 条记录</span>
</div>

```
      <div className="flex items-center gap-4">
        <div className={`flex ${darkMode ? 'bg-gray-700' : 'bg-pink-50'} rounded-full p-1 border ${darkMode ? 'border-gray-600' : 'border-pink-100'}`}>
          <button 
            onClick={() => setActiveTab('write')}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${activeTab === 'write' ? (darkMode ? 'bg-gray-600 text-pink-400' : 'bg-white text-pink-500 shadow-sm') : (darkMode ? 'text-gray-300 hover:text-pink-400' : 'text-gray-500 hover:text-pink-400')}`}
          >
            ✍️ 写日记
          </button>
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${activeTab === 'dashboard' ? (darkMode ? 'bg-gray-600 text-pink-400' : 'bg-white text-pink-500 shadow-sm') : (darkMode ? 'text-gray-300 hover:text-pink-400' : 'text-gray-500 hover:text-pink-400')}`}
          >
            🌌 我的小宇宙
          </button>
        </div>

        <button
          onClick={() => setDarkMode(!darkMode)}
          className={`p-2 rounded-full ${darkMode ? 'bg-gray-700 text-yellow-400' : 'bg-pink-50 text-yellow-500'} hover:scale-110 transition-transform`}
          title="切换深色模式"
        >
          {darkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>
    </div>
  </header>

  <main className="max-w-6xl mx-auto px-4 py-8">
    <AnimatePresence mode="wait">
      {activeTab === 'write' ? (
        <motion.div 
          key="write"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="space-y-6"
        >
          <div className={`${cardClass} rounded-3xl p-6 shadow-sm border text-center transition-colors`}>
            <h2 className="text-2xl font-bold mb-2">{editingId ? '✏️ 编辑你的记忆' : '嗨，亲爱的自己 👋'}</h2>
            <p className={darkMode ? 'text-gray-400' : 'text-gray-500'}>{editingId ? '来更新一下这条回忆吧~' : '今天辛苦啦！快来抱一个 🫂'}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-6 md:col-span-1">
              <div className={`${cardClass} rounded-3xl p-6 shadow-sm border transition-colors`}>
                <label className={`block text-sm font-bold mb-3 flex items-center gap-2 ${darkMode ? 'text-pink-400' : 'text-gray-700'}`}>
                  <Smile size={18} /> 今日心情
                </label>
                <div className="space-y-2">
                  {['开心冒泡', '岁月静好', '抱抱自己'].map((m) => (
                    <button
                      key={m}
                      onClick={() => setMood(m)}
                      className={`w-full text-left px-4 py-3 rounded-2xl transition-all flex items-center gap-3 ${mood === m ? (darkMode ? 'bg-pink-900/50 border-pink-600 border text-pink-400 font-medium' : 'bg-pink-50 border-pink-200 border text-pink-600 font-medium') : (darkMode ? 'bg-gray-700 border border-transparent text-gray-300 hover:bg-gray-600' : 'bg-gray-50 border border-transparent text-gray-600 hover:bg-pink-50/50')}`}
                    >
                      <span className="text-xl">
                        {m === '开心冒泡' ? '🥰' : m === '岁月静好' ? '😌' : '🥺'}
                      </span>
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              <div className={`${cardClass} rounded-3xl p-6 shadow-sm border transition-colors`}>
                <label className={`block text-sm font-bold mb-3 flex items-center gap-2 ${darkMode ? 'text-yellow-400' : 'text-gray-700'}`}>
                  <Battery size={18} /> 能量小电池: {energy}
                </label>
                <input 
                  type="range" 
                  min="1" 
                  max="10" 
                  value={energy}
                  onChange={(e) => setEnergy(Number(e.target.value))}
                  className="w-full accent-yellow-400 h-2 bg-yellow-100 rounded-lg appearance-none cursor-pointer"
                />
                <div className={`flex justify-between text-xs mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-400'}`}>
                  <span>没电啦 🪫</span>
                  <span>充满啦 🔋</span>
                </div>
              </div>

              <div className={`${cardClass} rounded-3xl p-6 shadow-sm border transition-colors`}>
                <label className={`block text-sm font-bold mb-3 flex items-center gap-2 ${darkMode ? 'text-purple-400' : 'text-gray-700'}`}>
                  <CalendarHeart size={18} /> 生活碎片
                </label>
                <div className="flex flex-wrap gap-2">
                  {['生活日常', '工作闪光', '学习力量'].map((t) => (
                    <button
                      key={t}
                      onClick={() => setTag(t)}
                      className={`px-3 py-1.5 rounded-full text-sm transition-all ${tag === t ? (darkMode ? 'bg-purple-900/50 text-purple-400 border border-purple-600' : 'bg-purple-100 text-purple-600 border border-purple-200') : (darkMode ? 'bg-gray-700 text-gray-300 border border-transparent hover:bg-gray-600' : 'bg-gray-50 text-gray-500 border border-transparent hover:bg-gray-100')}`}
                    >
                      {t === '生活日常' ? '👨‍👩‍👧 ' : t === '工作闪光' ? '💼 ' : '📚 '}{t}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-6 md:col-span-2">
              <div className={`${cardClass} rounded-3xl p-6 shadow-sm border relative overflow-hidden transition-colors`}>
                <div className="absolute top-0 right-0 w-20 h-20 bg-pink-50 rounded-bl-full -z-10"></div>
                <label className="block text-lg font-bold text-pink-500 mb-2 flex items-center gap-2">
                  ✨ 3件小幸福
                </label>
                <p className={`text-xs mb-3 ${darkMode ? 'text-gray-400' : 'text-gray-400'}`}>今天有什么让你嘴角上扬的瞬间？</p>
                <textarea 
                  value={happiness}
                  onChange={(e) => setHappiness(e.target.value)}
                  placeholder="1. 喝到了秋天的第一杯奶茶\n2. 回家路上看到了绝美的晚霞\n3. 被路边的小猫蹭了腿"
                  className={`w-full h-32 rounded-2xl p-4 focus:outline-none focus:ring-2 focus:ring-pink-300 resize-none ${inputClass} transition-colors`}
                />
              </div>

              <div className={`${cardClass} rounded-3xl p-6 shadow-sm border relative overflow-hidden transition-colors`}>
                <div className="absolute top-0 right-0 w-20 h-20 bg-yellow-50 rounded-bl-full -z-10"></div>
                <label className="block text-lg font-bold text-yellow-500 mb-2 flex items-center gap-2">
                  🙏 2件感恩的事
                </label>
                <p className={`text-xs mb-3 ${darkMode ? 'text-gray-400' : 'text-gray-400'}`}>想对谁、或者对什么事情说声谢谢呢？</p>
                <textarea 
                  value={gratitude}
                  onChange={(e) => setGratitude(e.target.value)}
                  placeholder="1. 感谢同事帮我分担了工作\n2. 感谢自己今天依然在努力"
                  className={`w-full h-24 rounded-2xl p-4 focus:outline-none focus:ring-2 focus:ring-yellow-300 resize-none ${inputClass} transition-colors`}
                />
              </div>

              <div className={`${cardClass} rounded-3xl p-6 shadow-sm border relative overflow-hidden transition-colors`}>
                <div className="absolute top-0 right-0 w-20 h-20 bg-green-50 rounded-bl-full -z-10"></div>
                <label className="block text-lg font-bold text-green-500 mb-2 flex items-center gap-2">
                  🌱 1件小成长
                </label>
                <p className={`text-xs mb-3 ${darkMode ? 'text-gray-400' : 'text-gray-400'}`}>哪怕只是多喝了一杯水，也是超棒的进步哦！</p>
                <textarea 
                  value={growth}
                  onChange={(e) => setGrowth(e.target.value)}
                  placeholder="今天忍住没有吃宵夜，我真棒！"
                  className={`w-full h-16 rounded-2xl p-4 focus:outline-none focus:ring-2 focus:ring-green-300 resize-none ${inputClass} transition-colors`}
                />
              </div>

              <div className={`${cardClass} rounded-3xl p-6 shadow-sm border transition-colors`}>
                <label className={`block text-lg font-bold mb-2 flex items-center gap-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  💬 小碎碎念
                </label>
                <textarea 
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="把心里的话都倒在这里吧..."
                  className={`w-full h-20 rounded-2xl p-4 focus:outline-none focus:ring-2 focus:ring-gray-300 resize-none ${inputClass} transition-colors`}
                />
              </div>

              <div className="flex gap-3">
                <button 
                  onClick={handleSave}
                  className="flex-1 py-4 bg-gradient-to-r from-pink-400 to-rose-400 text-white rounded-2xl font-bold text-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all flex justify-center items-center gap-2"
                >
                  <Sparkles size={20} /> {editingId ? '更新记录' : '收藏今天的幸福'}
                </button>
                {editingId && (
                  <button
                    onClick={() => {
                      setEditingId(null);
                      setHappiness('');
                      setGratitude('');
                      setGrowth('');
                      setNotes('');
                    }}
                    className={`px-6 py-4 rounded-2xl font-bold transition-all ${darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'}`}
                  >
                    取消
                  </button>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      ) : (
        <motion.div 
          key="dashboard"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="space-y-8"
        >
          {/* 搜索和筛选 */}
          <div className={`${cardClass} rounded-3xl p-6 shadow-sm border transition-colors`}>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className={`absolute left-4 top-3.5 ${darkMode ? 'text-gray-400' : 'text-gray-400'}`} size={18} />
                <input
                  type="text"
                  placeholder="搜索记录..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2.5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-pink-300 ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-pink-50 text-gray-700 border-pink-100'} border transition-colors`}
                />
              </div>
              
              <select
                value={filterMood}
                onChange={(e) => setFilterMood(e.target.value)}
                className={`px-4 py-2.5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-pink-300 ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-pink-50 border-pink-100'} border transition-colors`}
              >
                <option value="">所有心情</option>
                <option value="开心冒泡">😊 开心冒泡</option>
                <option value="岁月静好">😌 岁月静好</option>
                <option value="抱抱自己">🥺 抱抱自己</option>
              </select>

              <select
                value={filterTag}
                onChange={(e) => setFilterTag(e.target.value)}
                className={`px-4 py-2.5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-pink-300 ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-pink-50 border-pink-100'} border transition-colors`}
              >
                <option value="">所有分类</option>
                <option value="生活日常">👨‍👩‍👧 生活日常</option>
                <option value="工作闪光">💼 工作闪光</option>
                <option value="学习力量">📚 学习力量</option>
              </select>

              <div className="flex gap-2">
                <button
                  onClick={handleExportJSON}
                  className={`px-4 py-2.5 rounded-2xl font-medium transition-all flex items-center gap-2 ${darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                  title="导出为JSON"
                >
                  <Download size={18} /> JSON
                </button>
                <button
                  onClick={handleExportCSV}
                  className={`px-4 py-2.5 rounded-2xl font-medium transition-all flex items-center gap-2 ${darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                  title="导出为CSV"
                >
                  <Download size={18} /> CSV
                </button>
              </div>
            </div>
          </div>

          {/* 年度统计卡片 */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className={`${cardClass} p-6 rounded-3xl shadow-sm border flex items-center gap-4 transition-colors`}>
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl ${darkMode ? 'bg-pink-900/30' : 'bg-pink-100'}`}>✨</div>
              <div>
                <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>累计捕捉小幸福</p>
                <p className="text-3xl font-bold text-pink-500">{totalHappiness}</p>
              </div>
            </div>
            <div className={`${cardClass} p-6 rounded-3xl shadow-sm border flex items-center gap-4 transition-colors`}>
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl ${darkMode ? 'bg-yellow-900/30' : 'bg-yellow-100'}`}>🙏</div>
              <div>
                <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>累计被感谢的时刻</p>
                <p className="text-3xl font-bold text-yellow-500">{totalGratitude}</p>
              </div>
            </div>
            <div className={`${cardClass} p-6 rounded-3xl shadow-sm border flex items-center gap-4 transition-colors`}>
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl ${darkMode ? 'bg-green-900/30' : 'bg-green-100'}`}>🌱</div>
              <div>
                <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>值得骄傲的小成长</p>
                <p className="text-3xl font-bold text-green-500">{totalGrowth}</p>
              </div>
            </div>
            <div className={`${cardClass} p-6 rounded-3xl shadow-sm border flex items-center gap-4 transition-colors`}>
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl ${darkMode ? 'bg-blue-900/30' : 'bg-blue-100'}`}>📊</div>
              <div>
                <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>坚持记录的日子</p>
                <p className="text-3xl font-bold text-blue-500">{entries.length}</p>
              </div>
            </div>
          </div>

          {/* 图表区域 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {energyData.length > 0 && (
              <div className={`${cardClass} p-6 rounded-3xl shadow-sm border transition-colors`}>
                <h3 className={`text-lg font-bold mb-6 flex items-center gap-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  <Battery className="text-yellow-400" /> 能量值小趋势
                </h3>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={energyData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={darkMode ? '#374151' : '#f3f4f6'} />
                      <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: darkMode ? '#9ca3af' : '#9ca3af', fontSize: 12}} />
                      <YAxis axisLine={false} tickLine={false} tick={{fill: darkMode ? '#9ca3af' : '#9ca3af', fontSize: 12}} domain={[0, 10]} />
                      <Tooltip 
                        contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', backgroundColor: darkMode ? '#374151' : 'white', color: darkMode ? 'white' : 'black' }}
                        cursor={{ stroke: '#fbcfe8', strokeWidth: 2, strokeDasharray: '3 3' }}
                      />
                      <Line type="monotone" dataKey="energy" stroke="#f472b6" strokeWidth={4} dot={{ r: 6, fill: '#f472b6', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 8 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {moodData.some(d => d.count > 0) && (
              <div className={`${cardClass} p-6 rounded-3xl shadow-sm border transition-colors`}>
                <h3 className={`text-lg font-bold mb-6 flex items-center gap-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  <Heart className="text-pink-400" /> 心情小地图
                </h3>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={moodData} layout="vertical" margin={{ top: 5, right: 20, bottom: 5, left: 40 }}>
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke={darkMode ? '#374151' : '#f3f4f6'} />
                      <XAxis type="number" axisLine={false} tickLine={false} tick={{fill: darkMode ? '#9ca3af' : '#9ca3af', fontSize: 12}} />
                      <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fill: darkMode ? '#d1d5db' : '#4b5563', fontSize: 12, fontWeight: 500}} />
                      <Tooltip cursor={{fill: darkMode ? '#4b5563' : '#f9fafb'}} contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', backgroundColor: darkMode ? '#374151' : 'white', color: darkMode ? 'white' : 'black' }} />
                      <Bar dataKey="count" radius={[0, 20, 20, 0]} barSize={32}>
                        {moodData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}
          </div>

          {/* 月度统计和标签分布 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {monthlyData.length > 0 && (
              <div className={`${cardClass} p-6 rounded-3xl shadow-sm border transition-colors`}>
                <h3 className={`text-lg font-bold mb-6 flex items-center gap-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  <TrendingUp className="text-blue-400" /> 月度统计
                </h3>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#374151' : '#f3f4f6'} />
                      <XAxis dataKey="month" tick={{fill: darkMode ? '#9ca3af' : '#9ca3af', fontSize: 12}} />
                      <YAxis yAxisId="left" tick={{fill: darkMode ? '#9ca3af' : '#9ca3af', fontSize: 12}} />
                      <YAxis yAxisId="right" orientation="right" tick={{fill: darkMode ? '#9ca3af' : '#9ca3af', fontSize: 12}} />
                      <Tooltip contentStyle={{ borderRadius: '16px', backgroundColor: darkMode ? '#374151' : 'white', color: darkMode ? 'white' : 'black' }} />
                      <Line yAxisId="left" type="monotone" dataKey="count" stroke="#60A5FA" strokeWidth={2} dot={{r: 4}} name="记录数" />
                      <Line yAxisId="right" type="monotone" dataKey="avgEnergy" stroke="#F472B6" strokeWidth={2} dot={{r: 4}} name="平均能量" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {tagData.some(d => d.count > 0) && (
              <div className={`${cardClass} p-6 rounded-3xl shadow-sm border transition-colors`}>
                <h3 className={`text-lg font-bold mb-6 flex items-center gap-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  <BarChart3 className="text-purple-400" /> 生活碎片分布
                </h3>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={tagData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, count }) => `${name} (${count})`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="count"
                      >
                        {tagData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ borderRadius: '16px', backgroundColor: darkMode ? '#374151' : 'white', color: darkMode ? 'white' : 'black' }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}
          </div>

          {/* 幸福画廊 */}
          <div>
            <h3 className={`text-xl font-bold mb-4 flex items-center gap-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              <Sparkles className="text-yellow-400" /> 幸福时刻集合 ({filteredEntries.length})
            </h3>
            {filteredEntries.length === 0 ? (
              <div className={`${cardClass} p-8 rounded-3xl shadow-sm border text-center transition-colors`}>
                <p className={darkMode ? 'text-gray-400' : 'text-gray-500'}>暂无符合条件的记录~ 快去记录你的幸福吧✨</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredEntries.slice().reverse().map((entry) => (
                  <div key={entry.id} className={`${cardClass} p-5 rounded-3xl shadow-sm border hover:shadow-md transition-shadow relative group`}>
                    <div className="flex justify-between items-center mb-3">
                      <span className={`text-xs font-medium ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-50 text-gray-500'} px-2 py-1 rounded-full`}>{entry.date}</span>
                      <span className="text-2xl">
                        {entry.mood === '开心冒泡' ? '🥰' : entry.mood === '岁月静好' ? '😌' : '🥺'}
                      </span>
                    </div>
                    <div className="mb-3">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                        entry.tag === '生活日常' ? (darkMode ? 'bg-orange-900/30 text-orange-300' : 'bg-orange-50 text-orange-600') :
                        entry.tag === '工作闪光' ? (darkMode ? 'bg-blue-900/30 text-blue-300' : 'bg-blue-50 text-blue-600') :
                        (darkMode ? 'bg-purple-900/30 text-purple-300' : 'bg-purple-50 text-purple-600')
                      }`}>
                        {entry.tag === '生活日常' ? '👨‍👩‍👧 ' : entry.tag === '工作闪光' ? '💼 ' : '📚 '}{entry.tag}
                      </span>
                    </div>
                    <div className={`space-y-2 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      <p className="line-clamp-2"><span className="text-pink-400 font-bold">✨</span> {entry.happiness.split('\n')[0]}...</p>
                      <p className="line-clamp-1"><span className="text-yellow-400 font-bold">🙏</span> {entry.gratitude.split('\n')[0]}</p>
                      <p className="line-clamp-1"><span className="text-green-400 font-bold">🌱</span> {entry.growth}</p>
                    </div>
                    
                    <div className="absolute top-5 right-5 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => startEdit(entry)}
                        className={`p-2 rounded-full ${darkMode ? 'bg-gray-700 text-blue-400 hover:bg-gray-600' : 'bg-blue-50 text-blue-600 hover:bg-blue-100'} transition-colors`}
                        title="编辑"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(entry.id)}
                        className={`p-2 rounded-full ${darkMode ? 'bg-gray-700 text-red-400 hover:bg-gray-600' : 'bg-red-50 text-red-600 hover:bg-red-100'} transition-colors`}
                        title="删除"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  </main>
</div>
```

);
}
