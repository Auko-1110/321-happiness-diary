import React, { useState, useEffect, useRef } from 'react';
import { Heart, Sparkles, Sun, Moon, Battery, CalendarHeart, Smile, Search, Download, Edit2, Trash2, Camera, X, TrashIcon, LayoutGrid } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell, PieChart, Pie } from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';

const initialEntries = [];

export default function DreamDiary() {
  const [activeTab, setActiveTab] = useState('write');
  const [subPage, setSubPage] = useState('dashboard');
  const [darkMode, setDarkMode] = useState(false);
  const [entries, setEntries] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTag, setFilterTag] = useState('');
  const [filterMood, setFilterMood] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [mood, setMood] = useState('开心冒泡');
  const [energy, setEnergy] = useState(7);
  const [tag, setTag] = useState('生活日常');
  const [happiness, setHappiness] = useState('');
  const [gratitude, setGratitude] = useState('');
  const [growth, setGrowth] = useState('');
  const [notes, setNotes] = useState('');
  const [previewImage, setPreviewImage] = useState(null);
  const fileInputRef = useRef(null);

  const today = new Date().toISOString().split('T')[0];

  // 本地存储
  useEffect(() => {
    const saved = localStorage.getItem('dreamDiaryEntries');
    if (saved) {
      try { setEntries(JSON.parse(saved)); } catch (e) { setEntries(initialEntries); }
    } else {
      setEntries(initialEntries);
    }
  }, []);

  const saveToLocal = (data) => {
    localStorage.setItem('dreamDiaryEntries', JSON.stringify(data));
  };

  // 图片
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setPreviewImage(reader.result);
    reader.readAsDataURL(file);
  };
  const removeImage = () => {
    setPreviewImage(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

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
    setPreviewImage(entry.image || null);
    setActiveTab('write');
  };

  // 保存
  const handleSave = () => {
    if (!happiness && !gratitude && !growth) {
      alert('至少记录一点小美好再走吧~ 💕');
      return;
    }
    const newEntry = {
      id: editingId || Date.now(),
      date: selectedDate,
      mood, energy, tag, happiness, gratitude, growth, notes, image: previewImage
    };
    const newEntries = editingId
      ? entries.map(e => e.id === editingId ? newEntry : e)
      : [...entries, newEntry];
    setEntries(newEntries);
    saveToLocal(newEntries);
    resetForm();
    setActiveTab('dashboard');
    alert(editingId ? '已更新 ✅' : '记录成功 ✨');
  };

  const resetForm = () => {
    setEditingId(null);
    setSelectedDate(today);
    setMood('开心冒泡');
    setEnergy(7);
    setTag('生活日常');
    setHappiness('');
    setGratitude('');
    setGrowth('');
    setNotes('');
    setPreviewImage(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // 删除单条
  const handleDelete = (id) => {
    if (!window.confirm('确定删除这条记录吗？')) return;
    const res = entries.filter(e => e.id !== id);
    setEntries(res);
    saveToLocal(res);
  };

  // 一键清空
  const handleClearAll = () => {
    if (!window.confirm('⚠️ 确定要永久删除所有日记、图片、记录吗？此操作不可恢复！')) return;
    setEntries([]);
    saveToLocal([]);
  };

  // 筛选
  const filteredEntries = entries.filter(e => {
    const matchSearch = !searchQuery ||
      e.happiness?.includes(searchQuery) ||
      e.gratitude?.includes(searchQuery) ||
      e.growth?.includes(searchQuery) ||
      e.notes?.includes(searchQuery);
    const matchTag = !filterTag || e.tag === filterTag;
    const matchMood = !filterMood || e.mood === filterMood;
    const matchDate = !filterDate || e.date === filterDate;
    return matchSearch && matchTag && matchMood && matchDate;
  });

  // 导出
  const handleExportJSON = () => {
    const blob = new Blob([JSON.stringify(entries, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `幸福手帐-${today}.json`;
    a.click();
  };
  const handleExportCSV = () => {
    let csv = '日期,心情,能量,分类,三件幸福,两件感恩,一件成长,备注\n';
    entries.forEach(e => {
      csv += `"${e.date}","${e.mood}","${e.energy}","${e.tag}","${e.happiness?.replace(/\n/g, ' | ')}","${e.gratitude?.replace(/\n/g, ' | ')}","${e.growth}","${e.notes}"\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `幸福手帐-${today}.csv`;
    a.click();
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

  // 日历视图
  const daysInMonth = (y, m) => new Date(y, m + 1, 0).getDate();
  const getMonthData = () => {
    const now = new Date();
    const y = now.getFullYear();
    const m = now.getMonth();
    const days = daysInMonth(y, m);
    const arr = [];
    for (let d = 1; d <= days; d++) {
      const dateStr = `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const has = entries.some(e => e.date === dateStr);
      arr.push({ date: dateStr, day: d, has });
    }
    return arr;
  };
  const monthDays = getMonthData();

  // 相册所有图片
  const allImages = entries
    .filter(e => e.image)
    .map(e => ({ date: e.date, image: e.image, id: e.id }));

  // 样式
  const bgClass = darkMode
    ? 'bg-gray-900 text-white'
    : 'bg-gradient-to-b from-pink-50 to-white text-gray-800';
  const cardClass = darkMode
    ? 'bg-gray-800 border border-gray-700'
    : 'bg-white border border-pink-100 shadow-sm';
  const inputClass = darkMode
    ? 'bg-gray-700 border border-gray-600 text-white'
    : 'bg-pink-50 border border-pink-100 text-gray-700';

  return (
    <div className={`min-h-screen ${bgClass} font-sans transition-colors duration-300`}>
      {/* 顶部 */}
      <header className={`sticky top-0 z-10 backdrop-blur-md border-b ${darkMode ? 'bg-gray-800/70 border-gray-700' : 'bg-white/70 border-pink-100'} shadow-sm`}>
        <div className="max-w-6xl mx-auto px-4 py-4 flex flex-wrap gap-3 justify-between items-center">
          <div className="flex items-center gap-2">
            <Heart className="text-pink-400 fill-pink-400" size={26} />
            <h1 className="text-xl font-bold text-pink-500">321幸福手帐</h1>
            <span className="text-sm text-gray-400">{entries.length} 天</span>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <div className={`flex ${darkMode ? 'bg-gray-700' : 'bg-pink-50'} rounded-full p-1 border ${darkMode ? 'border-gray-600' : 'border-pink-100'}`}>
              <button onClick={() => setActiveTab('write')} className={`px-3 py-1.5 rounded-full text-sm font-medium ${activeTab === 'write' ? (darkMode ? 'bg-gray-600 text-pink-400' : 'bg-white text-pink-500 shadow') : 'text-gray-500'}`}>写日记</button>
              <button onClick={() => { setActiveTab('dashboard'); setSubPage('dashboard'); }} className={`px-3 py-1.5 rounded-full text-sm font-medium ${activeTab === 'dashboard' && subPage === 'dashboard' ? (darkMode ? 'bg-gray-600 text-pink-400' : 'bg-white text-pink-500 shadow') : 'text-gray-500'}`}>数据</button>
              <button onClick={() => { setActiveTab('dashboard'); setSubPage('calendar'); }} className={`px-3 py-1.5 rounded-full text-sm font-medium ${activeTab === 'dashboard' && subPage === 'calendar' ? (darkMode ? 'bg-gray-600 text-pink-400' : 'bg-white text-pink-500 shadow') : 'text-gray-500'}`}>日历</button>
              <button onClick={() => { setActiveTab('dashboard'); setSubPage('album'); }} className={`px-3 py-1.5 rounded-full text-sm font-medium ${activeTab === 'dashboard' && subPage === 'album' ? (darkMode ? 'bg-gray-600 text-pink-400' : 'bg-white text-pink-500 shadow') : 'text-gray-500'}`}>相册</button>
            </div>
            <button onClick={() => setDarkMode(!darkMode)} className="p-2 rounded-full hover:scale-110 transition-transform">
              {darkMode ? <Sun size={20} className="text-yellow-400" /> : <Moon size={20} className="text-yellow-500" />}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          {activeTab === 'write' ? (
            <motion.div key="write" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
              <div className={`${cardClass} rounded-3xl p-6 text-center`}>
                <h2 className="text-2xl font-bold text-pink-500 mb-1">{editingId ? '编辑记忆' : '亲爱的自己'}</h2>
                <p className="text-sm text-gray-500">今天辛苦啦，抱一下 🫂</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-6">
                  <div className={`${cardClass} rounded-3xl p-6`}>
                    <label className="block text-sm font-bold mb-2 flex items-center gap-2">
                      <Calendar size={18} /> 选择日期
                    </label>
                    <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} className={`w-full px-4 py-3 rounded-2xl border focus:ring-2 focus:ring-pink-300 ${inputClass}`} />
                  </div>

                  <div className={`${cardClass} rounded-3xl p-6`}>
                    <label className="block text-sm font-bold mb-2 flex items-center gap-2">
                      <Smile size={18} /> 今日心情
                    </label>
                    <div className="space-y-2">
                      {['开心冒泡', '岁月静好', '抱抱自己'].map(m => (
                        <button key={m} onClick={() => setMood(m)} className={`w-full text-left px-4 py-3 rounded-2xl border flex items-center gap-3 transition ${mood === m ? (darkMode ? 'bg-pink-900/40 border-pink-600 text-pink-400' : 'bg-pink-50 border-pink-200 text-pink-600 font-medium') : 'border-transparent'}`}>
                          <span className="text-xl">{m === '开心冒泡' ? '🥰' : m === '岁月静好' ? '😌' : '🥺'}</span>{m}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className={`${cardClass} rounded-3xl p-6`}>
                    <label className="block text-sm font-bold mb-2 flex items-center gap-2">
                      <Battery size={18} /> 能量值 {energy}
                    </label>
                    <input type="range" min={1} max={10} value={energy} onChange={(e) => setEnergy(+e.target.value)} className="w-full accent-yellow-400" />
                  </div>

                  <div className={`${cardClass} rounded-3xl p-6`}>
                    <label className="block text-sm font-bold mb-2 flex items-center gap-2">
                      <CalendarHeart size={18} /> 生活碎片
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {['生活日常', '工作闪光', '学习力量'].map(t => (
                        <button key={t} onClick={() => setTag(t)} className={`px-3 py-1.5 rounded-full border text-sm ${tag === t ? (darkMode ? 'bg-purple-900/40 border-purple-600 text-purple-400' : 'bg-purple-100 border-purple-200 text-purple-600') : 'border-transparent'}`}>
                          {t === '生活日常' ? '👨‍👩‍👧 ' : t === '工作闪光' ? '💼 ' : '📚 '}{t}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="md:col-span-2 space-y-6">
                  <div className={`${cardClass} rounded-3xl p-6`}>
                    <label className="block text-sm font-bold mb-3 flex items-center gap-2">
                      <Camera size={18} /> 今日纪念照片
                    </label>
                    <div className="flex items-center gap-3">
                      <label className="px-4 py-2 border border-dashed rounded-xl cursor-pointer hover:bg-pink-50 transition">
                        <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                        <span className="text-sm">选择图片</span>
                      </label>
                      {previewImage && (
                        <button onClick={removeImage} className="text-sm text-red-400 flex items-center gap-1">
                          <X size={16} /> 删除
                        </button>
                      )}
                    </div>
                    {previewImage && (
                      <div className="mt-3 rounded-xl overflow-hidden border max-h-64">
                        <img src={previewImage} alt="预览" className="w-full h-full object-contain" />
                      </div>
                    )}
                  </div>

                  <div className={`${cardClass} rounded-3xl p-6 relative`}>
                    <div className="absolute top-0 right-0 w-20 h-20 bg-pink-100 rounded-bl-full -z-10 opacity-40"></div>
                    <label className="text-lg font-bold text-pink-500 flex items-center gap-2">✨ 3件小幸福</label>
                    <p className="text-xs text-gray-500 mb-2">让你嘴角上扬的瞬间</p>
                    <textarea value={happiness} onChange={(e) => setHappiness(e.target.value)} placeholder="1. ...\n2. ...\n3. ..." className={`w-full h-32 p-4 rounded-2xl border focus:ring-2 focus:ring-pink-300 resize-none ${inputClass}`} />
                  </div>

                  <div className={`${cardClass} rounded-3xl p-6 relative`}>
                    <div className="absolute top-0 right-0 w-20 h-20 bg-yellow-100 rounded-bl-full -z-10 opacity-40"></div>
                    <label className="text-lg font-bold text-yellow-500 flex items-center gap-2">🙏 2件感恩</label>
                    <p className="text-xs text-gray-500 mb-2">想对谁说谢谢</p>
                    <textarea value={gratitude} onChange={(e) => setGratitude(e.target.value)} placeholder="1. ...\n2. ..." className={`w-full h-24 p-4 rounded-2xl border focus:ring-2 focus:ring-yellow-300 resize-none ${inputClass}`} />
                  </div>

                  <div className={`${cardClass} rounded-3xl p-6 relative`}>
                    <div className="absolute top-0 right-0 w-20 h-20 bg-green-100 rounded-bl-full -z-10 opacity-40"></div>
                    <label className="text-lg font-bold text-green-500 flex items-center gap-2">🌱 1件小成长</label>
                    <p className="text-xs text-gray-500 mb-2">哪怕很小也值得骄傲</p>
                    <textarea value={growth} onChange={(e) => setGrowth(e.target.value)} placeholder="今天..." className={`w-full h-16 p-4 rounded-2xl border focus:ring-2 focus:ring-green-300 resize-none ${inputClass}`} />
                  </div>

                  <div className={`${cardClass} rounded-3xl p-6`}>
                    <label className="text-lg font-bold flex items-center gap-2">💬 小碎碎念</label>
                    <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="心里话..." className={`w-full h-20 p-4 rounded-2xl border focus:ring-2 focus:ring-gray-300 resize-none ${inputClass}`} />
                  </div>

                  <div className="flex gap-3">
                    <button onClick={handleSave} className="flex-1 py-4 bg-gradient-to-r from-pink-400 to-rose-400 text-white rounded-2xl font-bold text-lg shadow hover:shadow-lg hover:-translate-y-0.5 transition flex items-center justify-center gap-2">
                      <Sparkles size={18} /> {editingId ? '更新记录' : '收藏今天'}
                    </button>
                    {editingId && (
                      <button onClick={resetForm} className="px-6 py-4 rounded-2xl bg-gray-200 text-gray-700 font-bold">取消</button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div key="dashboard" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8">

              {subPage === 'dashboard' && (
                <>
                  <div className={`${cardClass} rounded-3xl p-6`}>
                    <div className="flex flex-col md:flex-row gap-3 flex-wrap">
                      <div className="flex-1 relative">
                        <Search className="absolute left-3 top-3 text-gray-400" size={18} />
                        <input type="text" placeholder="搜索内容..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className={`w-full pl-10 pr-4 py-2.5 rounded-2xl border ${inputClass}`} />
                      </div>
                      <input type="date" value={filterDate} onChange={(e) => setFilterDate(e.target.value)} className={`px-4 py-2.5 rounded-2xl border ${inputClass}`} />
                      <select value={filterMood} onChange={(e) => setFilterMood(e.target.value)} className={`px-4 py-2.5 rounded-2xl border ${inputClass}`}>
                        <option value="">全部心情</option>
                        <option value="开心冒泡">开心冒泡</option>
                        <option value="岁月静好">岁月静好</option>
                        <option value="抱抱自己">抱抱自己</option>
                      </select>
                      <select value={filterTag} onChange={(e) => setFilterTag(e.target.value)} className={`px-4 py-2.5 rounded-2xl border ${inputClass}`}>
                        <option value="">全部分类</option>
                        <option value="生活日常">生活日常</option>
                        <option value="工作闪光">工作闪光</option>
                        <option value="学习力量">学习力量</option>
                      </select>
                      <div className="flex gap-2">
                        <button onClick={handleExportJSON} className="px-3 py-2.5 rounded-xl bg-gray-100 text-sm flex items-center gap-1">
                          <Download size={16} /> JSON
                        </button>
                        <button onClick={handleExportCSV} className="px-3 py-2.5 rounded-xl bg-gray-100 text-sm flex items-center gap-1">
                          <Download size={16} /> CSV
                        </button>
                        <button onClick={handleClearAll} className="px-3 py-2.5 rounded-xl bg-red-100 text-red-600 text-sm flex items-center gap-1">
                          <TrashIcon size={16} /> 清空
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    <div className={`${cardClass} p-6 rounded-3xl flex items-center gap-4`}>
                      <div className="w-12 h-12 rounded-xl bg-pink-100 flex items-center justify-center text-xl">✨</div>
                      <div><p className="text-sm text-gray-500">小幸福</p><p className="text-2xl font-bold text-pink-500">{totalHappiness}</p></div>
                    </div>
                    <div className={`${cardClass} p-6 rounded-3xl flex items-center gap-4`}>
                      <div className="w-12 h-12 rounded-xl bg-yellow-100 flex items-center justify-center text-xl">🙏</div>
                      <div><p className="text-sm text-gray-500">被感谢</p><p className="text-2xl font-bold text-yellow-500">{totalGratitude}</p></div>
                    </div>
                    <div className={`${cardClass} p-6 rounded-3xl flex items-center gap-4`}>
                      <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center text-xl">🌱</div>
                      <div><p className="text-sm text-gray-500">小成长</p><p className="text-2xl font-bold text-green-500">{totalGrowth}</p></div>
                    </div>
                    <div className={`${cardClass} p-6 rounded-3xl flex items-center gap-4`}>
                      <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center text-xl">📅</div>
                      <div><p className="text-sm text-gray-500">记录天数</p><p className="text-2xl font-bold text-blue-500">{entries.length}</p></div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {energyData.length > 0 && (
                      <div className={`${cardClass} p-6 rounded-3xl`}>
                        <h3 className="text-lg font-bold mb-4">能量趋势</h3>
                        <div className="h-64">
                          <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={energyData}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="date" />
                              <YAxis domain={[0, 10]} />
                              <Tooltip />
                              <Line type="monotone" dataKey="energy" stroke="#f472b6" strokeWidth={3} dot={{ r: 5 }} />
                            </LineChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    )}
                    {moodData.some(d => d.count) && (
                      <div className={`${cardClass} p-6 rounded-3xl`}>
                        <h3 className="text-lg font-bold mb-4">心情分布</h3>
                        <div className="h-64">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart layout="vertical" data={moodData} margin={{ left: 40 }}>
                              <XAxis type="number" />
                              <YAxis type="category" dataKey="name" />
                              <Tooltip />
                              <Bar dataKey="count" radius={[0, 8, 8, 0]}>
                                {moodData.map((i, idx) => <Cell key={idx} fill={i.color} />)}
                              </Bar>
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {tagData.some(d => d.count) && (
                      <div className={`${cardClass} p-6 rounded-3xl`}>
                        <h3 className="text-lg font-bold mb-4">生活碎片</h3>
                        <div className="h-64">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie data={tagData} dataKey="count" outerRadius={80} label={({ name, count }) => `${name}(${count})`}>
                                {tagData.map((i, idx) => <Cell key={idx} fill={i.color} />)}
                              </Pie>
                              <Tooltip />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    )}
                  </div>

                  <div>
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                      <LayoutGrid size={20} /> 幸福时刻集合 ({filteredEntries.length})
                    </h3>
                    {filteredEntries.length === 0 ? (
                      <div className={`${cardClass} p-8 rounded-3xl text-center`}>暂无记录</div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredEntries.slice().reverse().map(e => (
                          <div key={e.id} className={`${cardClass} p-5 rounded-3xl relative group`}>
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">{e.date}</span>
                              <span className="text-xl">{e.mood === '开心冒泡' ? '🥰' : e.mood === '岁月静好' ? '😌' : '🥺'}</span>
                            </div>
                            <div className="mb-2">
                              <span className="text-xs px-2 py-1 rounded-full bg-blue-50 text-blue-600">
                                {e.tag === '生活日常' ? '👨‍👩‍👧 ' : e.tag === '工作闪光' ? '💼 ' : '📚 '}{e.tag}
                              </span>
                            </div>
                            {e.image && (
                              <div className="mb-3 rounded-xl overflow-hidden border max-h-44">
                                <img src={e.image} alt="纪念" className="w-full h-full object-cover" />
                              </div>
                            )}
                            <div className="text-sm space-y-1 text-gray-600">
                              <p className="line-clamp-2"><span className="text-pink-500 font-bold">✨</span> {e.happiness?.split('\n')[0]}</p>
                              <p className="line-clamp-1"><span className="text-yellow-500 font-bold">🙏</span> {e.gratitude?.split('\n')[0]}</p>
                              <p className="line-clamp-1"><span className="text-green-500 font-bold">🌱</span> {e.growth}</p>
                            </div>
                            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                              <button onClick={() => startEdit(e)} className="p-1.5 rounded-lg bg-blue-50 text-blue-600"><Edit2 size={16} /></button>
                              <button onClick={() => handleDelete(e.id)} className="p-1.5 rounded-lg bg-red-50 text-red-600"><Trash2 size={16} /></button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </>
              )}

              {/* 日历视图 */}
              {subPage === 'calendar' && (
                <div className={`${cardClass} p-6 rounded-3xl`}>
                  <h3 className="text-xl font-bold mb-6 text-pink-500">📅 本月日历</h3>
                  <div className="grid grid-cols-7 gap-2 text-center">
                    {['一', '二', '三', '四', '五', '六', '日'].map((w, i) => (
                      <div key={i} className="text-sm font-bold text-gray-500 py-2">{w}</div>
                    ))}
                    {monthDays.map(day => (
                      <button
                        key={day.date}
                        onClick={() => { setFilterDate(day.date); setSubPage('dashboard'); }}
                        className={`p-3 rounded-xl border text-sm transition ${
                          day.has
                            ? darkMode ? 'bg-pink-900/30 border-pink-600 text-pink-300' : 'bg-pink-100 border-pink-200 text-pink-600'
                            : darkMode ? 'bg-gray-800 border-gray-700 text-gray-400' : 'bg-white border-gray-100 text-gray-400'
                        }`}
                      >
                        {day.day}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* 相册视图 */}
              {subPage === 'album' && (
                <div className={`${cardClass} p-6 rounded-3xl`}>
                  <h3 className="text-xl font-bold mb-6 text-pink-500">🖼️ 纪念相册</h3>
                  {allImages.length === 0 ? (
                    <div className="text-center py-10 text-gray-400">还没有上传任何照片</div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                      {allImages.map((item) => (
                        <div key={item.id} className="relative group rounded-xl overflow-hidden border aspect-square">
                          <img src={item.image} alt={item.date} className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-sm">
                            {item.date}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
