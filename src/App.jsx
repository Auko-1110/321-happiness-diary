import React, { useState, useEffect, useRef } from 'react';
import { Heart, Sparkles, Sun, Moon, Battery, CalendarHeart, Smile, Frown, Meh, BookOpen, Coffee, Briefcase, Edit2, Trash2, Search, Download, BarChart3, TrendingUp, Calendar, Image as ImageIcon, PhotoAlbum, X } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell, PieChart, Pie, Legend } from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';

// 初始模拟数据
const initialEntries = [
  { id: 1, date: '2026-03-20', mood: '开心冒泡', energy: 8, tag: '生活日常', happiness: '喝了甜甜的奶茶\n看到了晚霞\n收到朋友的信息', gratitude: '感谢外卖小哥\n感谢好天气', growth: '今天没有熬夜', notes: '今天真是美好的一天！', photo: null },
  { id: 2, date: '2026-03-21', mood: '岁月静好', energy: 6, tag: '工作闪光', happiness: '准时下班\n午餐很好吃\n搞定了一个bug', gratitude: '感谢同事的帮忙\n感谢自己', growth: '学会了一个新技能', notes: '平平静静才是真。', photo: null },
  { id: 3, date: '2026-03-22', mood: '抱抱自己', energy: 3, tag: '学习力量', happiness: '看了一页书\n听了喜欢的歌\n洗了个热水澡', gratitude: '感谢一直坚持的自己\n感谢柔软的床', growth: '允许自己今天不完美', notes: '有点累，但没关系，明天会更好。', photo: null },
  { id: 4, date: '2026-03-23', mood: '开心冒泡', energy: 9, tag: '生活日常', happiness: '买到了喜欢的花\n睡到自然醒\n看了部好电影', gratitude: '感谢周末\n感谢花店老板', growth: '学会了插花', notes: '周末万岁！', photo: null },
  { id: 5, date: '2026-03-24', mood: '开心冒泡', energy: 7, tag: '工作闪光', happiness: '被老板夸奖\n喝了咖啡\n完成了周报', gratitude: '感谢团队\n感谢咖啡机', growth: '沟通能力提升', notes: '继续加油呀！', photo: null },
];

export default function DreamDiary() {
  const [activeTab, setActiveTab] = useState('write');
  const [darkMode, setDarkMode] = useState(false);
  const [entries, setEntries] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTag, setFilterTag] = useState('');
  const [filterMood, setFilterMood] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const fileInputRef = useRef(null);

  // 表单状态
  const today = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState(today);
  const [mood, setMood] = useState('开心冒泡');
  const [energy, setEnergy] = useState(7);
  const [tag, setTag] = useState('生活日常');
  const [happiness, setHappiness] = useState('');
  const [gratitude, setGratitude] = useState('');
  const [growth, setGrowth] = useState('');
  const [notes, setNotes] = useState('');
  const [previewPhoto, setPreviewPhoto] = useState(null);

  // 已记录日期集合
  const recordedDates = new Set(entries.map(e => e.date));

  // 从 LocalStorage 加载
  useEffect(() => {
    const savedEntries = localStorage.getItem('dreamDiaryEntries');
    if (savedEntries) {
      try {
        setEntries(JSON.parse(savedEntries));
      } catch (e) {
        setEntries(initialEntries);
        localStorage.setItem('dreamDiaryEntries', JSON.stringify(initialEntries));
      }
    } else {
      setEntries(initialEntries);
      localStorage.setItem('dreamDiaryEntries', JSON.stringify(initialEntries));
    }
  }, []);

  // 编辑
  const startEdit = (entry) => {
    setEditingId(entry.id);
    setSelectedDate(entry.date);
    setMood(entry.mood);
    setEnergy(entry.energy);
    setTag(entry.tag);
    setHappiness(entry.happiness);
    setGratitude(entry.gratitude);
    setGrowth(entry.growth);
    setNotes(entry.notes);
    setPreviewPhoto(entry.photo || null);
    setActiveTab('write');
  };

  const saveToLocalStorage = (data) => {
    localStorage.setItem('dreamDiaryEntries', JSON.stringify(data));
  };

  // 图片上传
  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setPreviewPhoto(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const removePhoto = () => {
    setPreviewPhoto(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // 快速选择日期
  const goToday = () => setSelectedDate(today);
  const goThisWeek = () => {
    const now = new Date();
    const day = now.getDay();
    const first = now.getDate() - day;
    const monday = new Date(now.setDate(first));
    setSelectedDate(monday.toISOString().split('T')[0]);
  };
  const goThisMonth = () => setSelectedDate(today.slice(0, 7) + '-01');

  // 保存日记
  const handleSave = () => {
    if (!happiness && !gratitude && !growth && !previewPhoto) {
      alert('至少记录一点小美好再走吧~ 💕');
      return;
    }

    let newEntries;
    if (editingId) {
      newEntries = entries.map(e =>
        e.id === editingId
          ? {
              ...e,
              date: selectedDate,
              mood,
              energy,
              tag,
              happiness,
              gratitude,
              growth,
              notes,
              photo: previewPhoto
            }
          : e
      );
      alert('记录已更新！✨');
      setEditingId(null);
    } else {
      const newEntry = {
        id: Date.now(),
        date: selectedDate,
        mood,
        energy,
        tag,
        happiness,
        gratitude,
        growth,
        notes,
        photo: previewPhoto
      };
      newEntries = [...entries, newEntry];
      alert('记录成功！✨');
    }

    setEntries(newEntries);
    saveToLocalStorage(newEntries);

    // 重置
    setSelectedDate(today);
    setHappiness('');
    setGratitude('');
    setGrowth('');
    setNotes('');
    setMood('开心冒泡');
    setEnergy(7);
    setTag('生活日常');
    setPreviewPhoto(null);
    setActiveTab('dashboard');
  };

  // 删除
  const handleDelete = (id) => {
    if (window.confirm('确定要删除这条记录吗？')) {
      const newEntries = entries.filter(e => e.id !== id);
      setEntries(newEntries);
      saveToLocalStorage(newEntries);
      alert('记录已删除~ 🌸');
    }
  };

  // 筛选
  const filteredEntries = entries.filter(entry => {
    const matchesSearch = searchQuery === '' ||
      entry.happiness?.includes(searchQuery) ||
      entry.gratitude?.includes(searchQuery) ||
      entry.growth?.includes(searchQuery) ||
      entry.notes?.includes(searchQuery);

    const matchesTag = filterTag === '' || entry.tag === filterTag;
    const matchesMood = filterMood === '' || entry.mood === filterMood;
    return matchesSearch && matchesTag && matchesMood;
  });

  // 导出
  const handleExportJSON = () => {
    const dataStr = JSON.stringify(entries, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `dream-diary-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  };

  const handleExportCSV = () => {
    let csv = '日期,心情,能量值,标签,3件小幸福,2件感谢,1件小成长,备注\n';
    entries.forEach(entry => {
      const row = [
        entry.date,
        entry.mood,
        entry.energy,
        entry.tag,
        `"${(entry.happiness || '').replace(/\n/g, ' | ')}"`,
        `"${(entry.gratitude || '').replace(/\n/g, ' | ')}"`,
        `"${entry.growth || ''}"`,
        `"${entry.notes || ''}"`
      ].join(',');
      csv += row + '\n';
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `dream-diary-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  // 统计
  const totalHappiness = entries.length * 3;
  const totalGratitude = entries.length * 2;
  const totalGrowth = entries.length * 1;

  const moodCounts = {
    '开心冒泡': entries.filter(e => e.mood === '开心冒泡').length,
    '岁月静好': entries.filter(e => e.mood === '岁月静好').length,
    '抱抱自己': entries.filter(e => e.mood === '抱抱自己').length,
  };

  const tagCounts = {
    '生活日常': entries.filter(e => e.tag === '生活日常').length,
    '工作闪光': entries.filter(e => e.tag === '工作闪光').length,
    '学习力量': entries.filter(e => e.tag === '学习力量').length,
  };

  const moodData = [
    { name: '开心冒泡', count: moodCounts['开心冒泡'], color: '#FDBA74' },
    { name: '岁月静好', count: moodCounts['岁月静好'], color: '#FDE047' },
    { name: '抱抱自己', count: moodCounts['抱抱自己'], color: '#93C5FD' },
  ];

  const tagData = [
    { name: '生活日常', count: tagCounts['生活日常'], color: '#FB923C' },
    { name: '工作闪光', count: tagCounts['工作闪光'], color: '#60A5FA' },
    { name: '学习力量', count: tagCounts['学习力量'], color: '#A78BFA' },
  ];

  const energyData = entries
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .map(e => ({ date: e.date.slice(5), energy: e.energy }));

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

  // 所有有照片的记录
  const photoEntries = entries.filter(e => e.photo);

  // 可爱背景
  const bgClass = darkMode
    ? 'bg-gray-900 text-white'
    : 'bg-gradient-to-br from-pink-50 via-rose-50 to-blue-50 text-gray-800';
  const cardClass = darkMode
    ? 'bg-gray-800 border-gray-700'
    : 'bg-white/85 backdrop-blur-sm border-pink-100 shadow-sm';
  const inputClass = darkMode
    ? 'bg-gray-700 text-white border-gray-600'
    : 'bg-pink-50/50 border-pink-100 text-gray-700';

  return (
    <div className={`min-h-screen ${bgClass} font-sans selection:bg-pink-200 transition-colors duration-300 relative`}>
      {/* 柔和装饰 */}
      {!darkMode && (
        <>
          <div className="fixed w-[500px] h-[500px] rounded-full bg-pink-100/40 -top-64 -left-64 blur-3xl -z-10"></div>
          <div className="fixed w-[500px] h-[500px] rounded-full bg-blue-100/40 -bottom-64 -right-64 blur-3xl -z-10"></div>
          <div className="fixed w-[400px] h-[400px] rounded-full bg-yellow-100/30 top-1/2 right-20 blur-3xl -z-10"></div>
        </>
      )}

      {/* 顶部 */}
      <header className={`${darkMode ? 'bg-gray-800/70 border-gray-700' : 'bg-white/70 border-pink-100'} backdrop-blur-md border-b shadow-sm sticky top-0 z-50 transition-colors`}>
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Heart className="text-pink-400 fill-pink-400" size={28} />
            <h1 className="text-xl font-bold text-pink-500 tracking-wide">321幸福手帐</h1>
            <span className="text-sm text-gray-400 ml-2">共 {entries.length} 条记录</span>
          </div>

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
                🌌 数据统计
              </button>
              <button 
                onClick={() => setActiveTab('album')}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${activeTab === 'album' ? (darkMode ? 'bg-gray-600 text-pink-400' : 'bg-white text-pink-500 shadow-sm') : (darkMode ? 'text-gray-300 hover:text-pink-400' : 'text-gray-500 hover:text-pink-400')}`}
              >
                📸 回忆相册
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
          {/* ---------- 写日记 ---------- */}
          {activeTab === 'write' && (
            <motion.div 
              key="write"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div className={`${cardClass} rounded-3xl p-6 border text-center`}>
                <h2 className="text-2xl font-bold mb-2">{editingId ? '✏️ 编辑你的记忆' : '嗨，亲爱的自己 👋'}</h2>
                <p className={darkMode ? 'text-gray-400' : 'text-gray-500'}>
                  {editingId ? '来更新一下这条回忆吧~' : '今天辛苦啦！快来抱一个 🫂'}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-6">
                  {/* 日期 + 快速选择 */}
                  <div className={`${cardClass} rounded-3xl p-6 border`}>
                    <label className="block text-sm font-bold mb-3 flex items-center gap-2 text-blue-500">
                      <Calendar size={18} /> 选择日期
                    </label>
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className={`w-full px-4 py-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-300 ${inputClass}`}
                    />
                    <div className="flex gap-2 mt-3 flex-wrap">
                      <button onClick={goToday} className="text-xs px-2 py-1 bg-blue-100 text-blue-600 rounded-full">
                        今天
                      </button>
                      <button onClick={goThisWeek} className="text-xs px-2 py-1 bg-purple-100 text-purple-600 rounded-full">
                        本周
                      </button>
                      <button onClick={goThisMonth} className="text-xs px-2 py-1 bg-pink-100 text-pink-600 rounded-full">
                        本月
                      </button>
                    </div>
                  </div>

                  {/* 日历标记 */}
                  <div className={`${cardClass} rounded-3xl p-6 border`}>
                    <label className="block text-sm font-bold mb-3 flex items-center gap-2 text-green-500">
                      <PhotoAlbum size={18} /> 已记录日期
                    </label>
                    <div className="grid grid-cols-7 gap-1 text-xs">
                      {['日', '一', '二', '三', '四', '五', '六'].map(d => (
                        <div key={d} className="text-center font-medium mb-1">{d}</div>
                      ))}
                      {Array.from({ length: 31 }, (_, i) => {
                        const d = String(i + 1).padStart(2, '0');
                        const month = selectedDate.slice(0, 7);
                        const checkDate = `${month}-${d}`;
                        const hasRecord = recordedDates.has(checkDate);
                        return (
                          <div
                            key={d}
                            className={`w-full h-7 flex items-center justify-center rounded-full text-xs
                              ${hasRecord ? 'bg-pink-100 text-pink-600 font-bold' : 'text-gray-400'}`}
                          >
                            {i + 1}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* 心情 */}
                  <div className={`${cardClass} rounded-3xl p-6 border`}>
                    <label className="block text-sm font-bold mb-3 flex items-center gap-2 text-pink-500">
                      <Smile size={18} /> 今日心情
                    </label>
                    <div className="space-y-2">
                      {['开心冒泡', '岁月静好', '抱抱自己'].map((m) => (
                        <button
                          key={m}
                          onClick={() => setMood(m)}
                          className={`w-full text-left px-4 py-3 rounded-2xl transition-all flex items-center gap-3 
                            ${mood === m 
                              ? (darkMode ? 'bg-pink-900/30 text-pink-400 border border-pink-600' 
                                 : 'bg-pink-50 text-pink-600 border border-pink-200 font-medium') 
                              : (darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-50 text-gray-600')}`}
                        >
                          <span className="text-xl">
                            {m === '开心冒泡' ? '🥰' : m === '岁月静好' ? '😌' : '🥺'}
                          </span>
                          {m}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 能量 */}
                  <div className={`${cardClass} rounded-3xl p-6 border`}>
                    <label className="block text-sm font-bold mb-3 flex items-center gap-2 text-yellow-500">
                      <Battery size={18} /> 能量小电池: {energy}
                    </label>
                    <input 
                      type="range" min="1" max="10" value={energy}
                      onChange={(e) => setEnergy(Number(e.target.value))}
                      className="w-full accent-yellow-400 h-2 bg-yellow-100 rounded-lg"
                    />
                    <div className="flex justify-between text-xs mt-2 text-gray-500">
                      <span>没电啦 🪫</span><span>充满啦 🔋</span>
                    </div>
                  </div>

                  {/* 标签 */}
                  <div className={`${cardClass} rounded-3xl p-6 border`}>
                    <label className="block text-sm font-bold mb-3 flex items-center gap-2 text-purple-500">
                      <CalendarHeart size={18} /> 生活碎片
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {['生活日常', '工作闪光', '学习力量'].map((t) => (
                        <button
                          key={t}
                          onClick={() => setTag(t)}
                          className={`px-3 py-1.5 rounded-full text-sm transition-all
                            ${tag === t 
                              ? (darkMode ? 'bg-purple-900/30 text-purple-400 border border-purple-600' 
                                 : 'bg-purple-100 text-purple-600 border border-purple-200') 
                              : (darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-50 text-gray-500')}`}
                        >
                          {t === '生活日常' ? '👨‍👩‍👧 ' : t === '工作闪光' ? '💼 ' : '📚 '}{t}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 右侧表单 */}
                <div className="space-y-6 md:col-span-2">
                  {/* 图片上传 */}
                  <div className={`${cardClass} rounded-3xl p-6 border`}>
                    <label className="block text-lg font-bold text-indigo-500 mb-2 flex items-center gap-2">
                      <ImageIcon size={20} /> 今日纪念照片
                    </label>
                    <div className="flex items-center gap-3">
                      <label className="px-4 py-2 bg-indigo-100 text-indigo-600 rounded-xl cursor-pointer hover:bg-indigo-200 transition-colors">
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handlePhotoChange}
                        />
                        选择图片
                      </label>
                      {previewPhoto && (
                        <button
                          onClick={removePhoto}
                          className="text-sm text-red-500 hover:text-red-600"
                        >
                          删除图片
                        </button>
                      )}
                    </div>

                    {previewPhoto && (
                      <div className="mt-3 relative rounded-2xl overflow-hidden border border-gray-200">
                        <img
                          src={previewPhoto}
                          alt="预览"
                          className="w-full h-48 object-cover"
                        />
                      </div>
                    )}
                  </div>

                  {/* 3件幸福 */}
                  <div className={`${cardClass} rounded-3xl p-6 border relative overflow-hidden`}>
                    <div className="absolute top-0 right-0 w-20 h-20 bg-pink-50 rounded-bl-full -z-10"></div>
                    <label className="block text-lg font-bold text-pink-500 mb-2 flex items-center gap-2">
                      ✨ 3件小幸福
                    </label>
                    <p className="text-xs mb-3 text-gray-500">今天有什么让你嘴角上扬的瞬间？</p>
                    <textarea 
                      value={happiness}
                      onChange={(e) => setHappiness(e.target.value)}
                      placeholder="1. 喝到了秋天的第一杯奶茶\n2. 回家路上看到了绝美的晚霞\n3. 被路边的小猫蹭了腿"
                      className={`w-full h-32 rounded-2xl p-4 focus:outline-none focus:ring-2 focus:ring-pink-300 resize-none ${inputClass}`}
                    />
                  </div>

                  {/* 2件感恩 */}
                  <div className={`${cardClass} rounded-3xl p-6 border relative overflow-hidden`}>
                    <div className="absolute top-0 right-0 w-20 h-20 bg-yellow-50 rounded-bl-full -z-10"></div>
                    <label className="block text-lg font-bold text-yellow-500 mb-2 flex items-center gap-2">
                      🙏 2件感恩的事
                    </label>
                    <p className="text-xs mb-3 text-gray-500">想对谁、或者对什么事情说声谢谢呢？</p>
                    <textarea 
                      value={gratitude}
                      onChange={(e) => setGratitude(e.target.value)}
                      placeholder="1. 感谢同事帮我分担了工作\n2. 感谢自己今天依然在努力"
                      className={`w-full h-24 rounded-2xl p-4 focus:outline-none focus:ring-2 focus:ring-yellow-300 resize-none ${inputClass}`}
                    />
                  </div>

                  {/* 1件成长 */}
                  <div className={`${cardClass} rounded-3xl p-6 border relative overflow-hidden`}>
                    <div className="absolute top-0 right-0 w-20 h-20 bg-green-50 rounded-bl-full -z-10"></div>
                    <label className="block text-lg font-bold text-green-500 mb-2 flex items-center gap-2">
                      🌱 1件小成长
                    </label>
                    <p className="text-xs mb-3 text-gray-500">哪怕只是多喝了一杯水，也是超棒的进步哦！</p>
                    <textarea 
                      value={growth}
                      onChange={(e) => setGrowth(e.target.value)}
                      placeholder="今天忍住没有吃宵夜，我真棒！"
                      className={`w-full h-16 rounded-2xl p-4 focus:outline-none focus:ring-2 focus:ring-green-300 resize-none ${inputClass}`}
                    />
                  </div>

                  {/* 碎碎念 */}
                  <div className={`${cardClass} rounded-3xl p-6 border`}>
                    <label className="block text-lg font-bold mb-2 flex items-center gap-2 text-gray-600">
                      💬 小碎碎念
                    </label>
                    <textarea 
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="把心里的话都倒在这里吧..."
                      className={`w-full h-20 rounded-2xl p-4 focus:outline-none focus:ring-2 focus:ring-gray-300 resize-none ${inputClass}`}
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
                          setSelectedDate(today);
                          setHappiness('');
                          setGratitude('');
                          setGrowth('');
                          setNotes('');
                          setPreviewPhoto(null);
                        }}
                        className="px-6 py-4 rounded-2xl font-bold bg-gray-200 text-gray-600 hover:bg-gray-300"
                      >
                        取消
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* ---------- 数据统计 ---------- */}
          {activeTab === 'dashboard' && (
            <motion.div 
              key="dashboard"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-8"
            >
              <div className={`${cardClass} rounded-3xl p-6 border`}>
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-4 top-3.5 text-gray-400" size={18} />
                    <input
                      type="text" placeholder="搜索记录..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className={`w-full pl-10 pr-4 py-2.5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-pink-300 ${inputClass} border`}
                    />
                  </div>
                  
                  <select value={filterMood} onChange={(e) => setFilterMood(e.target.value)}
                    className={`px-4 py-2.5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-pink-300 ${inputClass} border`}>
                    <option value="">所有心情</option>
                    <option value="开心冒泡">😊 开心冒泡</option>
                    <option value="岁月静好">😌 岁月静好</option>
                    <option value="抱抱自己">🥺 抱抱自己</option>
                  </select>

                  <select value={filterTag} onChange={(e) => setFilterTag(e.target.value)}
                    className={`px-4 py-2.5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-pink-300 ${inputClass} border`}>
                    <option value="">所有分类</option>
                    <option value="生活日常">👨‍👩‍👧 生活日常</option>
                    <option value="工作闪光">💼 工作闪光</option>
                    <option value="学习力量">📚 学习力量</option>
                  </select>

                  <div className="flex gap-2">
                    <button onClick={handleExportJSON}
                      className="px-4 py-2.5 rounded-2xl font-medium bg-gray-100 text-gray-600 hover:bg-gray-200 flex items-center gap-2">
                      <Download size={18} /> JSON
                    </button>
                    <button onClick={handleExportCSV}
                      className="px-4 py-2.5 rounded-2xl font-medium bg-gray-100 text-gray-600 hover:bg-gray-200 flex items-center gap-2">
                      <Download size={18} /> CSV
                    </button>
                  </div>
                </div>
              </div>

              {/* 统计卡片 */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className={`${cardClass} p-6 rounded-3xl flex items-center gap-4`}>
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl bg-pink-100">✨</div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">累计捕捉小幸福</p>
                    <p className="text-3xl font-bold text-pink-500">{totalHappiness}</p>
                  </div>
                </div>
                <div className={`${cardClass} p-6 rounded-3xl flex items-center gap-4`}>
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl bg-yellow-100">🙏</div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">累计被感谢的时刻</p>
                    <p className="text-3xl font-bold text-yellow-500">{totalGratitude}</p>
                  </div>
                </div>
                <div className={`${cardClass} p-6 rounded-3xl flex items-center gap-4`}>
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl bg-green-100">🌱</div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">值得骄傲的小成长</p>
                    <p className="text-3xl font-bold text-green-500">{totalGrowth}</p>
                  </div>
                </div>
                <div className={`${cardClass} p-6 rounded-3xl flex items-center gap-4`}>
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl bg-blue-100">📊</div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">坚持记录的日子</p>
                    <p className="text-3xl font-bold text-blue-500">{entries.length}</p>
                  </div>
                </div>
              </div>

              {/* 图表 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {energyData.length > 0 && (
                  <div className={`${cardClass} p-6 rounded-3xl border`}>
                    <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-gray-700">
                      <Battery className="text-yellow-400" /> 能量值小趋势
                    </h3>
                    <div className="h-64 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={energyData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                          <XAxis dataKey="date" axisLine={false} tickLine={false} />
                          <YAxis axisLine={false} tickLine={false} domain={[0, 10]} />
                          <Tooltip 
                            contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                          />
                          <Line type="monotone" dataKey="energy" stroke="#f472b6" strokeWidth={4} dot={{ r: 6, fill: '#f472b6' }} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                )}

                {moodData.some(d => d.count > 0) && (
                  <div className={`${cardClass} p-6 rounded-3xl border`}>
                    <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-gray-700">
                      <Heart className="text-pink-400" /> 心情小地图
                    </h3>
                    <div className="h-64 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={moodData} layout="vertical" margin={{ top: 5, right: 20, bottom: 5, left: 40 }}>
                          <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f3f4f6" />
                          <XAxis type="number" axisLine={false} tickLine={false} />
                          <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} />
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {monthlyData.length > 0 && (
                  <div className={`${cardClass} p-6 rounded-3xl border`}>
                    <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-gray-700">
                      <TrendingUp className="text-blue-400" /> 月度统计
                    </h3>
                    <div className="h-64 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={monthlyData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                          <XAxis dataKey="month" />
                          <YAxis yAxisId="left" />
                          <YAxis yAxisId="right" orientation="right" />
                          <Line yAxisId="left" type="monotone" dataKey="count" stroke="#60A5FA" name="记录数" />
                          <Line yAxisId="right" type="monotone" dataKey="avgEnergy" stroke="#F472B6" name="平均能量" />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                )}

                {tagData.some(d => d.count > 0) && (
                  <div className={`${cardClass} p-6 rounded-3xl border`}>
                    <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-gray-700">
                      <BarChart3 className="text-purple-400" /> 生活碎片分布
                    </h3>
                    <div className="h-64 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={tagData}
                            cx="50%" cy="50%"
                            labelLine={false}
                            label={({ name, count }) => `${name} (${count})`}
                            outerRadius={80}
                            dataKey="count"
                          >
                            {tagData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                )}
              </div>

              {/* 记录列表 */}
              <div>
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-gray-700">
                  <Sparkles className="text-yellow-400" /> 幸福时刻集合 ({filteredEntries.length})
                </h3>
                {filteredEntries.length === 0 ? (
                  <div className={`${cardClass} p-8 rounded-3xl text-center`}>
                    <p className="text-gray-500">暂无符合条件的记录~ 快去记录你的幸福吧✨</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredEntries.slice().reverse().map((entry) => (
                      <div key={entry.id} className={`${cardClass} p-5 rounded-3xl hover:shadow-md transition-shadow relative group`}>
                        {entry.photo && (
                          <div className="mb-3 rounded-xl overflow-hidden">
                            <img
                              src={entry.photo}
                              alt="纪念"
                              className="w-full h-32 object-cover"
                            />
                          </div>
                        )}
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-xs font-medium bg-gray-50 text-gray-500 px-2 py-1 rounded-full">{entry.date}</span>
                          <span className="text-2xl">
                            {entry.mood === '开心冒泡' ? '🥰' : entry.mood === '岁月静好' ? '😌' : '🥺'}
                          </span>
                        </div>
                        <div className="mb-2">
                          <span className="text-xs px-2 py-1 rounded-full font-medium bg-blue-50 text-blue-600">
                            {entry.tag === '生活日常' ? '👨‍👩‍👧 ' : entry.tag === '工作闪光' ? '💼 ' : '📚 '}{entry.tag}
                          </span>
                        </div>
                        <div className="space-y-1 text-sm text-gray-600">
                          <p className="line-clamp-2"><span className="text-pink-400 font-bold">✨</span> {entry.happiness?.split('\n')[0]}...</p>
                          <p className="line-clamp-1"><span className="text-yellow-400 font-bold">🙏</span> {entry.gratitude?.split('\n')[0]}</p>
                          <p className="line-clamp-1"><span className="text-green-400 font-bold">🌱</span> {entry.growth}</p>
                        </div>
                        
                        <div className="absolute top-5 right-5 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => startEdit(entry)}
                            className="p-2 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(entry.id)}
                            className="p-2 rounded-full bg-red-50 text-red-600 hover:bg-red-100"
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

          {/* ---------- 回忆相册 ---------- */}
          {activeTab === 'album' && (
            <motion.div
              key="album"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div className={`${cardClass} p-6 rounded-3xl text-center`}>
                <h2 className="text-2xl font-bold text-pink-500 flex items-center justify-center gap-2">
                  <PhotoAlbum className="text-pink-400" /> 回忆相册
                </h2>
                <p className="text-gray-500 mt-1">珍藏每一个闪光瞬间 📸</p>
              </div>

              {photoEntries.length === 0 ? (
                <div className={`${cardClass} p-10 rounded-3xl text-center`}>
                  <ImageIcon className="mx-auto text-gray-300" size={48} />
                  <p className="mt-4 text-gray-500">还没有照片记录哦~</p>
                  <button
                    onClick={() => setActiveTab('write')}
                    className="mt-4 px-4 py-2 bg-pink-100 text-pink-600 rounded-full hover:bg-pink-200"
                  >
                    去上传第一张照片
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {photoEntries
                    .slice()
                    .reverse()
                    .map((entry) => (
                      <div
                        key={entry.id}
                        className={`relative group rounded-2xl overflow-hidden border aspect-square ${cardClass} cursor-pointer`}
                        onClick={() => {
                          setPreviewPhoto(entry.photo);
                          setShowPhotoModal(true);
                        }}
                      >
                        <img
                          src={entry.photo}
                          alt={entry.date}
                          className="w-full h-full object-cover transition-transform group-hover:scale-105"
                        />
                        <div className="absolute bottom-0 left-0 right-0 bg-black/40 text-white text-xs p-2">
                          {entry.date}
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* 图片查看弹窗 */}
      {showPhotoModal && previewPhoto && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="relative max-w-3xl max-h-[90vh]">
            <button
              onClick={() => setShowPhotoModal(false)}
              className="absolute -top-10 right-0 text-white bg-red-500 p-2 rounded-full"
            >
              <X size={20} />
            </button>
            <img
              src={previewPhoto}
              alt="预览大图"
              className="max-h-[85vh] rounded-xl object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
}
