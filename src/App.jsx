import React, { useState, useMemo, useRef } from 'react';
import { Heart, Home, Brain, MessageCircle, Shield, Sprout, Share2, Download } from 'lucide-react';
import html2canvas from 'html2canvas';

// --- 技能數據 ---
const SKILLS = [
    { id: 1, text: "情緒接住不說教", sub: "共感而非評判", price: 35, type: 'A' },
    { id: 2, text: "家務自動接手", sub: "行動即是體貼", price: 60, type: 'B' },
    { id: 3, text: "尊重身體界線", sub: "安全感的基礎", price: 15, type: 'A' },
    { id: 4, text: "言語肯定與讚美", sub: "情感的維他命", price: 20, type: 'A' },
    { id: 5, text: "產檢全程陪同", sub: "共享生命節奏", price: 25, type: 'D' },
    { id: 6, text: "孕期友善料理", sub: "照護你的胃口", price: 35, type: 'B' },
    { id: 7, text: "補水散步提醒", sub: "無聲的微關懷", price: 10, type: 'F' },
    { id: 8, text: "保護個人空間", sub: "休息無需理由", price: 15, type: 'A' },
    { id: 9, text: "睡眠環境守護", sub: "靜謐的入眠感", price: 45, type: 'F' },
    { id: 10, text: "待產包完美規劃", sub: "預見你的需求", price: 30, type: 'B' },
    { id: 11, text: "突發狀況冷靜", sub: "秩序感的支點", price: 50, type: 'C' },
    { id: 12, text: "家族溝通代理人", sub: "隔絕外界雜訊", price: 40, type: 'D' },
    { id: 13, text: "平穩的路徑規劃", sub: "慢活的駕駛觀", price: 20, type: 'E' },
    { id: 14, text: "孕期不適緩解", sub: "專業級的陪伴", price: 25, type: 'F' },
    { id: 15, text: "財務安全共識", sub: "未來的穩定度", price: 25, type: 'E' },
    { id: 16, text: "產後全方位支援", sub: "長期主義承諾", price: 55, type: 'C' },
];

const RESULTS = {
    A: {
        icon:
            <Heart className="w-6 h-6 text-stone-400" strokeWidth={1} />,
        title: "安撫型隊友",
        subtitle: "深度連結的情緒港灣",
        definition: "你要的不是答案，而是被看見。",
        desc: "這代表你重視情感交融。這種神隊友懂得在語言停下的地方開始傾聽，他不急於修補，而是用安靜的陪伴接納你所有的起伏。",
        actions: ["優先接納情緒而非評判", "允許脆弱在空間中自由存在", "提供深層的安全感"],
        closing: "你不必堅強，有人陪你柔軟。",
        cta: "安撫型",
        color: "bg-[#F9F7F2]",
    },
    B: {
        icon:
            <Home className="w-6 h-6 text-stone-400" strokeWidth={1} />,
        title: "務實型隊友",
        subtitle: "日常生活的生活建築師",
        definition: "愛不是承諾，而是行動。",
        desc: "你需要的是生活重心的實質移轉。務實型隊友會將雜質過濾掉，讓日常變得輕盈。他用雙手打理一切，讓你專注於成長。",
        actions: ["主動接管家務而無需請求", "透過營養料理照護節律", "優化細節以減少負荷"],
        closing: "最好的體貼，是讓你忘記瑣碎。",
        cta: "務實型",
        color: "bg-[#F5F5F3]",
    },
    C: {
        icon:
            <Brain className="w-6 h-6 text-stone-400" strokeWidth={1} />,
        title: "指揮官型隊友",
        subtitle: "秩序與安全感的架構師",
        definition: "在變動中，他是你的支點。",
        desc: "你尋求結構上的穩固。指揮官型隊友擁有極佳的預測能力與冷靜，在最混亂的時刻，他為你劃定一個絕對安全的圓圈。",
        actions: ["關鍵時刻展現決斷力與冷靜", "科學規劃產後長期藍圖", "理性且穩定的溝通方式"],
        closing: "平靜，源於背後的秩序感。",
        cta: "指揮官型",
        color: "bg-[#F2F2F2]",
    },
    D: {
        icon:
            <MessageCircle className="w-6 h-6 text-stone-400" strokeWidth={1} />,
        title: "溝通協調型隊友",
        subtitle: "外界雜訊的天然過濾器",
        definition: "他為你擋下所有的多餘。",
        desc: "你希望世界能安靜一點。這個類型的隊友最懂得社交邊界，將複雜的人際噪音轉譯為最溫和的訊息，守護你的感官空間。",
        actions: ["協調家庭與外界不同意見", "社交情境中作為你的緩衝", "過濾雜訊讓你專注感受"],
        closing: "你的平靜，是他最在意的事。",
        cta: "溝通型",
        color: "bg-[#F5F7F9]",
    },
    E: {
        icon:
            <Shield className="w-6 h-6 text-stone-400" strokeWidth={1} />,
        title: "安全感型隊友",
        subtitle: "長期主義的生活合夥人",
        definition: "在時間裡，證明他的存在。",
        desc: "你在意的是未來的連續性。這種神隊友提供的是一種根基，關於財務、安全、以及所有讓生活穩定運轉的基石。",
        actions: ["建立共識以消除未來焦慮", "決策始終以穩定為核心", "提供細水長流的支持"],
        closing: "最好的禮物，是確定的明天。",
        cta: "安全感型",
        color: "bg-[#F2F7F5]",
    },
    F: {
        icon:
            <Sprout className="w-6 h-6 text-stone-400" strokeWidth={1} />,
        title: "陪走型隊友",
        subtitle: "微觀幸福的維護者",
        definition: "不追求奇蹟，只追求陪伴。",
        desc: "你珍視微小的日常節奏。陪走型隊友是安靜的影子，他注意你的喝水頻率、睡眠與散步步調。他在生活每個角落安靜存在。",
        actions: ["細節中注入無侵略性的關懷", "陪伴尋找與孕期共處的節律", "持久且不間斷的日常陪伴"],
        closing: "日常微光，就是生活的全部。",
        cta: "陪走型",
        color: "bg-[#F8F9F2]",
    }
};

export default function App() {
    const [step, setStep] = useState('cover');
    const [selectedIds, setSelectedIds] = useState([]);
    const [resultType, setResultType] = useState(null);
    const [isCapturing, setIsCapturing] = useState(false);
    const resultRef = useRef(null);
    const getBgColorFromClass = (colorClass) => {
        const match = colorClass && colorClass.match(/#([0-9A-Fa-f]{6})/);
        return match ? `#${match[1]}` : '#ffffff';
    };
    const finalizeResult = (type) => {
        setResultType(type);
        setStep('result');
        window.scrollTo(0, 0);
    };

    const totalCost = useMemo(() => {
        return selectedIds.reduce((sum, id) => {
            const item = SKILLS.find(s => s.id === id);
            return sum + (item ? item.price : 0);
        }, 0);
    }, [selectedIds]);

    const toggleSelection = (id) => {
        const item = SKILLS.find(s => s.id === id);
        if (!item) return;
        if (selectedIds.includes(id)) {
            setSelectedIds(prev => prev.filter(i => i !== id));
        } else {
            if (totalCost + item.price > 100) return;
            setSelectedIds(prev => [...prev, id]);
        }
    };

    const calculateResult = () => {
        if (selectedIds.length === 0) return;
        const selectedItems = selectedIds
            .map(id => SKILLS.find(s => s.id === id))
            .filter(Boolean);
        if (selectedItems.length === 0) return;

        if (selectedIds.includes(2)) {
            finalizeResult('B');
            return;
        }

        if (selectedIds.includes(11) || selectedIds.includes(16)) {
            finalizeResult('C');
            return;
        }

        const counts = { A: 0, B: 0, C: 0, D: 0, E: 0, F: 0 };
        selectedItems.forEach(item => {
            counts[item.type] += 1;
        });

        let maxType = 'A';
        let maxCount = -1;
        let isTie = false;
        Object.entries(counts).forEach(([type, count]) => {
            if (count > maxCount) {
                maxType = type;
                maxCount = count;
                isTie = false;
            } else if (count === maxCount) {
                isTie = true;
            }
        });

        if (isTie) {
            const highestPriceItem = [...selectedItems].sort((a, b) => b.price - a.price)[0];
            if (highestPriceItem) {
                finalizeResult(highestPriceItem.type);
                return;
            }
        }

        finalizeResult(maxType);
    };

    const handleShare = async () => {
        if (!resultType) return;
        const entry = RESULTS[resultType];
        if (!entry) return;
        const shareData = {
            title: 'Partner Archetype Quiz',
            text: `I found a ${entry.cta} archetype.`,
            url: window.location.href,
        };

        try {
            if (navigator.share) {
                await navigator.share(shareData);
            } else {
                const tempInput = document.createElement('input');
                tempInput.value = window.location.href;
                document.body.appendChild(tempInput);
                tempInput.select();
                document.execCommand('copy');
                document.body.removeChild(tempInput);
                alert('Link copied to clipboard.');
            }
        } catch (err) {
            // Ignore share failures
        }
    };

    const handleDownloadImage = async () => {
        if (!resultType || !resultRef.current) return;
        setIsCapturing(true);
        setTimeout(async () => {
            try {
                const canvas = await html2canvas(resultRef.current, {
                    useCORS: true,
                    scale: 4,
                    backgroundColor: getBgColorFromClass(RESULTS[resultType].color),
                    width: resultRef.current.offsetWidth,
                    height: resultRef.current.offsetHeight,
                    logging: false,
                });
                const image = canvas.toDataURL('image/png');
                const link = document.createElement('a');
                link.href = image;
                link.download = `Partner_Archetype_4_5.png`;
                link.click();
            } catch (err) {
                alert('Unable to create download right now.');
            } finally {
                setIsCapturing(false);
            }
        }, 200);
    };

    return (
        <div className="min-h-screen bg-[#F8F7F4] font-serif text-stone-800 flex justify-center py-0 md:py-8 px-0 md:px-6">

            <div
                className="w-full max-w-md bg-white md:rounded-[0.5rem] shadow-sm overflow-hidden relative flex flex-col min-h-screen md:min-h-[800px] border border-stone-200/30">

                {/* --- 封面頁 --- */}
                {step === 'cover' && (
                    <div className="flex-1 flex flex-col items-center justify-between p-12 text-center animate-fade-in py-24">
                        <div className="space-y-4">
                            <span className="text-[10px] font-bold tracking-[0.5em] text-stone-400 uppercase sans-font">Selection
                                Experience</span>
                            <div className="w-8 h-px bg-stone-200 mx-auto"></div>
                        </div>
                        <div className="flex flex-col items-center">
                            <h1 className="text-[2.2rem] font-light tracking-tight text-stone-900 mb-6 leading-tight serif-font">
                                理想伴侶餐廳
                            </h1>
                            <div className="w-10 h-10 rounded-full border border-stone-100 flex items-center justify-center mb-6">
                                <Heart size={14} className="text-stone-300" strokeWidth={1} />
                            </div>
                            <p className="text-stone-400 text-sm font-light tracking-wide leading-relaxed sans-font max-w-[240px]">
                                在一份價值 $100 的溫柔清單中，
                                <br />
                                尋找妳最渴望的陪伴形式。
                            </p>
                        </div>
                        <button onClick={() => setStep('select')} className="group flex flex-col items-center gap-6 transition-all
                active:scale-95">
                            <span
                                className="text-[11px] font-bold tracking-[0.4em] uppercase text-stone-800 border-b border-stone-800 pb-1">Begin
                                Selection</span>
                        </button>
                    </div>
                )}

                {/* --- 選擇頁 --- */}
                {step === 'select' && (
                    <div className="flex flex-col h-full bg-white flex-1 animate-fade-in">
                        <div className="p-8 pt-12 text-center border-b border-stone-50">
                            <h2 className="text-xl font-light serif-font tracking-tight mb-2 italic text-stone-900">The Service Menu
                            </h2>
                            <p className="text-[9px] tracking-[0.3em] uppercase text-stone-400 sans-font">選取妳的年度陪伴盛宴</p>
                        </div>
                        <div className="flex-1 overflow-y-auto px-8 pb-44 pt-8 scrollbar-hide">
                            <div className="space-y-10">
                                <section>
                                    <div className="mb-6 border-b border-stone-100 pb-2 flex justify-between items-end">
                                        <h3 className="text-[9px] font-bold tracking-[0.2em] uppercase text-stone-600 sans-font">I.
                                            Emotional Essence / 情感本質</h3>
                                    </div>
                                    <div className="space-y-6">
                                        {SKILLS.slice(0, 5).map((item) => {
                                            const isSelected = selectedIds.includes(item.id);
                                            const canAfford = totalCost + item.price <= 100; return (<button key={item.id}
                                                onClick={() => toggleSelection(item.id)} disabled={!isSelected && !canAfford}
                                                className={`w-full text-left transition-all relative ${!isSelected && !canAfford ?
                                                    'opacity-10 grayscale' : 'opacity-100'}`}>
                                                <div className="flex justify-between items-baseline mb-1">
                                                    <h4 className={`text-[14px] font-medium serif-font ${isSelected ? 'text-stone-900'
                                                        : 'text-stone-500'}`}>{item.text}</h4>
                                                    <div
                                                        className="flex-1 mx-4 border-b border-dotted border-stone-200 h-px mb-1 opacity-50">
                                                    </div>
                                                    <span className={`text-[12px] sans-font ${isSelected ? 'text-stone-900 font-medium'
                                                        : 'text-stone-400'}`}>{item.price}</span>
                                                </div>
                                                <p className={`text-[10px] font-light sans-font ${isSelected ? 'text-stone-400 italic'
                                                    : 'text-stone-300'}`}>{item.sub}</p>
                                                {isSelected && <div
                                                    className="absolute -left-4 top-2 w-1 h-1 bg-stone-900 rounded-full"></div>}
                                            </button>
                                            );
                                        })}
                                    </div>
                                </section>
                                <section>
                                    <div className="mb-6 border-b border-stone-100 pb-2 flex justify-between items-end">
                                        <h3 className="text-[9px] font-bold tracking-[0.2em] uppercase text-stone-600 sans-font">II.
                                            Practical Support / 務實支持</h3>
                                    </div>
                                    <div className="space-y-6">
                                        {SKILLS.slice(5, 11).map((item) => {
                                            const isSelected = selectedIds.includes(item.id);
                                            const canAfford = totalCost + item.price <= 100; return (<button key={item.id}
                                                onClick={() => toggleSelection(item.id)} disabled={!isSelected && !canAfford}
                                                className={`w-full text-left transition-all relative ${!isSelected && !canAfford ?
                                                    'opacity-10 grayscale' : 'opacity-100'}`}>
                                                <div className="flex justify-between items-baseline mb-1">
                                                    <h4 className={`text-[14px] font-medium serif-font ${isSelected ? 'text-stone-900'
                                                        : 'text-stone-500'}`}>{item.text}</h4>
                                                    <div
                                                        className="flex-1 mx-4 border-b border-dotted border-stone-200 h-px mb-1 opacity-50">
                                                    </div>
                                                    <span className={`text-[12px] sans-font ${isSelected ? 'text-stone-900 font-medium'
                                                        : 'text-stone-400'}`}>{item.price}</span>
                                                </div>
                                                <p className={`text-[10px] font-light sans-font ${isSelected ? 'text-stone-400 italic'
                                                    : 'text-stone-300'}`}>{item.sub}</p>
                                                {isSelected && <div
                                                    className="absolute -left-4 top-2 w-1 h-1 bg-stone-900 rounded-full"></div>}
                                            </button>
                                            );
                                        })}
                                    </div>
                                </section>
                                <section>
                                    <div className="mb-6 border-b border-stone-100 pb-2 flex justify-between items-end">
                                        <h3 className="text-[9px] font-bold tracking-[0.2em] uppercase text-stone-600 sans-font">
                                            III. Longterm Security / 長期穩定</h3>
                                    </div>
                                    <div className="space-y-6">
                                        {SKILLS.slice(11).map((item) => {
                                            const isSelected = selectedIds.includes(item.id);
                                            const canAfford = totalCost + item.price <= 100; return (<button key={item.id}
                                                onClick={() => toggleSelection(item.id)} disabled={!isSelected && !canAfford}
                                                className={`w-full text-left transition-all relative ${!isSelected && !canAfford ?
                                                    'opacity-10 grayscale' : 'opacity-100'}`}>
                                                <div className="flex justify-between items-baseline mb-1">
                                                    <h4 className={`text-[14px] font-medium serif-font ${isSelected ? 'text-stone-900'
                                                        : 'text-stone-500'}`}>{item.text}</h4>
                                                    <div
                                                        className="flex-1 mx-4 border-b border-dotted border-stone-200 h-px mb-1 opacity-50">
                                                    </div>
                                                    <span className={`text-[12px] sans-font ${isSelected ? 'text-stone-900 font-medium'
                                                        : 'text-stone-400'}`}>{item.price}</span>
                                                </div>
                                                <p className={`text-[10px] font-light sans-font ${isSelected ? 'text-stone-400 italic'
                                                    : 'text-stone-300'}`}>{item.sub}</p>
                                                {isSelected && <div
                                                    className="absolute -left-4 top-2 w-1 h-1 bg-stone-900 rounded-full"></div>}
                                            </button>
                                            );
                                        })}
                                    </div>
                                </section>
                            </div>
                        </div>
                        <div
                            className="fixed bottom-0 left-0 right-0 md:absolute p-10 bg-gradient-to-t from-white via-white to-transparent z-30 flex flex-col items-center">
                            <div
                                className="w-full bg-stone-50 p-4 mb-4 flex justify-between items-center border border-stone-100/50">
                                <span className="text-[9px] font-bold tracking-widest text-stone-400 uppercase">Budget</span>
                                <span className="text-[11px] font-medium serif-font">${totalCost} / $100</span>
                            </div>
                            <button onClick={calculateResult} disabled={selectedIds.length === 0}
                                className="w-full bg-stone-900 text-white py-4 rounded-none font-light tracking-[0.3em] text-[10px] uppercase active:scale-[0.98] transition-all">
                                Confirm Selection
                            </button>
                        </div>
                    </div>
                )}

                {/* --- 結果頁 (IG 4:5 視覺重構版) --- */}
                {step === 'result' && resultType && (
                    <div className={`flex-1 flex flex-col animate-fade-in ${RESULTS[resultType].color}`}>
                        <div className="flex-1 overflow-y-auto scrollbar-hide flex flex-col items-center pb-8">

                            {/* 核心卡片容器：精確 4:5 比例 */}
                            <div ref={resultRef} className={`w-full aspect-[4/5] p-6 flex flex-col items-center relative
                    overflow-hidden flex-shrink-0 ${RESULTS[resultType].color}`} style={{ height: 'auto' }}>
                                {/* 邊飾 */}
                                <div
                                    className="absolute top-6 left-6 right-6 bottom-6 border border-stone-900/5 pointer-events-none">
                                </div>

                                <div className="mt-6 mb-6">
                                    {RESULTS[resultType].icon}
                                </div>

                                <div className="text-center mb-6 z-10 w-full">
                                    <span
                                        className="text-[8px] font-bold tracking-[0.5em] text-stone-400 mb-3 block uppercase sans-font">Archetype
                                        Profile</span>
                                    <h2
                                        className="text-[1.5rem] font-light mb-2 text-stone-900 serif-font tracking-tight leading-snug">
                                        {RESULTS[resultType].title}<br />
                                        <span
                                            className="italic font-normal text-[1.1rem] opacity-70">{RESULTS[resultType].subtitle}</span>
                                    </h2>
                                    <div className="w-6 h-px bg-stone-200 mx-auto mb-5"></div>
                                    <p className="text-[11px] font-light tracking-wide text-stone-500 italic mb-6 px-10">
                                        「{RESULTS[resultType].definition}」
                                    </p>
                                </div>

                                <div className="w-full mb-6 z-10 px-6 flex flex-col gap-4">
                                    <p
                                        className="text-[11.5px] leading-[1.8] text-stone-600 font-light sans-font text-justify opacity-90 px-2">
                                        {RESULTS[resultType].desc}
                                    </p>

                                    <div className="flex flex-col gap-1.5">
                                        {RESULTS[resultType].actions.map((action, idx) => (
                                            <div key={idx} className="flex items-center gap-3 py-1.5 border-b border-stone-200/40">
                                                <div className="w-1 h-1 bg-stone-400 rounded-full opacity-40"></div>
                                                <span
                                                    className="text-[11px] font-normal text-stone-800 sans-font tracking-wider opacity-90">{action}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="relative z-10 w-full flex flex-col items-center gap-2 mt-2 px-6 mb-2">
                                    <p className="text-[13px] font-light italic text-center text-stone-900 serif-font">
                                        {RESULTS[resultType].closing}
                                    </p>
                                </div>
                            </div>

                            {/* 操作區 */}
                            <div
                                className="relative z-10 w-full flex justify-between items-center opacity-30 mt-2 px-2 border-t border-stone-900/5 pt-4">
                                <div className="text-[6px] font-bold tracking-[0.2em] uppercase sans-font">Selection
                                    ${totalCost}/100</div>
                                <div className="text-[6px] font-bold tracking-[0.2em] uppercase sans-font">Inner Peace Protocol
                                </div>
                            </div>
                            <div className="w-full max-w-[90%] mt-8 grid grid-cols-2 gap-3 pb-8">
                                <button onClick={handleShare}
                                    className="flex items-center justify-center gap-2 border border-stone-200 text-stone-600 py-3 rounded-none text-[9px] font-bold uppercase tracking-widest active:scale-95 transition-all bg-white">
                                    <Share2 size={12} /> Share Link
                                </button>
                                <button onClick={handleDownloadImage} disabled={isCapturing}
                                    className="flex items-center justify-center gap-2 bg-stone-900 text-white py-3 rounded-none text-[9px] font-bold uppercase tracking-widest active:scale-95 transition-all">
                                    <Download size={12} /> {isCapturing ? 'Generating...' : 'Save 4:5 Image'}
                                </button>
                                <button onClick={() => { setSelectedIds([]); setStep('select'); }} className="col-span-2
                        text-stone-400 text-[8px] font-bold tracking-[0.2em] uppercase py-2 text-center">
                                    ← Back to Selection
                                </button>
                            </div>

                        </div>
                    </div>
                )}
            </div>

        </div>
    );
}
