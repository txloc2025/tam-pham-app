// Giai đoạn II – Bản nâng cấp cực phẩm giao diện cảm xúc, minh họa hình ảnh và avatar
import { useState, useEffect } from 'react';

const cards = [
  {
    id: 1,
    title: "TỬ TẾ",
    color: "bg-green-100",
    emoji: "🤝",
    image: "/images/tute.png",
    message: "Làm điều đúng – dù không ai biết.",
    action: "Hãy giúp một người không quen hôm nay – một hành động nhỏ thôi.",
    reflectOptions: [
      "Tôi đã tử tế với ai hôm nay mà không đòi hỏi lại gì?",
      "Tôi đã bỏ qua cơ hội tử tế nào vì sợ phiền?",
      "Điều gì khiến tôi cảm động vì sự tử tế của người khác?"
    ]
  },
  {
    id: 2,
    title: "TRUNG THỰC",
    color: "bg-yellow-100",
    emoji: "🧭",
    image: "/images/trungthuc.png",
    message: "Dám đứng về phía sự thật – kể cả khi bất lợi.",
    action: "Nói thật trong một tình huống bạn hay biện minh.",
    reflectOptions: [
      "Tôi có trung thực thật lòng hôm nay không?",
      "Tôi đã im lặng thay vì nói thật vì sợ gì?",
      "Trung thực khiến tôi thấy mạnh mẽ hay yếu đuối?"
    ]
  }
];

export default function App() {
  const [card, setCard] = useState(null);
  const [reflection, setReflection] = useState("");
  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem('tampham_history');
    return saved ? JSON.parse(saved) : [];
  });
  const [editDate, setEditDate] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [popup, setPopup] = useState(null);

  const drawCard = () => {
    const random = cards[Math.floor(Math.random() * cards.length)];
    setCard({ ...random, reflect: random.reflectOptions[Math.floor(Math.random() * random.reflectOptions.length)] });
    setReflection("");
  };

  const saveReflection = () => {
    const today = new Date().toISOString().split('T')[0];
    const entry = { date: today, title: card.title, reflection };
    const updated = [...history.filter(h => h.date !== today), entry];
    localStorage.setItem('tampham_history', JSON.stringify(updated));
    setHistory(updated);
    setPopup(`Bạn đã sống phẩm ${card.title} hôm nay! 🌟`);
    setTimeout(() => setPopup(null), 3000);
  };

  const deleteEntry = (date) => {
    const updated = history.filter(h => h.date !== date);
    localStorage.setItem('tampham_history', JSON.stringify(updated));
    setHistory(updated);
  };

  const updateEntry = () => {
    const updated = history.map(h => h.date === editDate ? { ...h, reflection: editValue } : h);
    localStorage.setItem('tampham_history', JSON.stringify(updated));
    setHistory(updated);
    setEditDate(null);
    setEditValue("");
  };

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    const todayEntry = history.find(h => h.date === today);
    if (todayEntry) {
      const foundCard = cards.find(c => c.title === todayEntry.title);
      setCard({ ...foundCard, reflect: foundCard.reflectOptions[0] });
      setReflection(todayEntry.reflection);
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-yellow-50">
      <h1 className="text-3xl font-bold mb-4">🌟 Rút – Sống – Soi – Chia sẻ</h1>

      <div className="mb-4 rounded-full border-2 border-gray-300 w-16 h-16 flex items-center justify-center text-xl">👤</div>

      {popup && <div className="bg-green-200 text-green-800 px-4 py-2 mb-4 rounded-xl shadow animate-pulse">{popup}</div>}

      {!card ? (
        <button onClick={drawCard} className="bg-yellow-400 hover:bg-yellow-500 px-4 py-2 rounded font-semibold text-white">🎴 Rút Phẩm Hôm Nay</button>
      ) : (
        <div className={`w-full max-w-md rounded-2xl shadow-lg p-6 mb-6 ${card.color} transition duration-500 ease-in-out animate-fade-in`}>
          <img src={card.image} alt={card.title} className="w-full h-40 object-contain mb-3 rounded-lg" />
          <h2 className="text-xl font-bold">{card.emoji} {card.title}</h2>
          <p className="italic mt-1">💡 {card.message}</p>
          <p className="mt-2">🎯 <strong>Hành động:</strong> {card.action}</p>
          <p className="text-sm text-gray-600 mt-2">🔍 <em>Soi lại:</em> {card.reflect}</p>

          <textarea
            value={reflection}
            onChange={(e) => setReflection(e.target.value)}
            placeholder="Bạn rút ra gì sau khi sống phẩm này hôm nay?"
            className="w-full mt-4 p-2 border rounded"
          />

          <div className="flex gap-2 mt-4">
            <button onClick={saveReflection} className="bg-green-600 text-white px-3 py-1 rounded">💾 Lưu</button>
            <button onClick={drawCard} className="bg-blue-500 text-white px-3 py-1 rounded">🔁 Đổi thẻ</button>
          </div>
        </div>
      )}

      {history.length > 0 && (
        <div className="mt-6 w-full max-w-md">
          <h3 className="text-lg font-bold mb-2">🕘 Lịch sử 21 ngày</h3>
          <ul className="bg-white rounded-xl shadow p-4 space-y-2 max-h-96 overflow-auto text-sm">
            {history.slice(-21).reverse().map((entry, index) => (
              <li key={index} className="border-b pb-2">
                <strong>{entry.date}</strong> – {entry.title}<br />
                {editDate === entry.date ? (
                  <>
                    <textarea
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      className="w-full p-1 border rounded my-1"
                    />
                    <button onClick={updateEntry} className="text-green-600 text-xs mr-2">💾 Lưu sửa</button>
                    <button onClick={() => setEditDate(null)} className="text-gray-500 text-xs">❌ Hủy</button>
                  </>
                ) : (
                  <>
                    <em>{entry.reflection}</em><br />
                    <button onClick={() => { setEditDate(entry.date); setEditValue(entry.reflection); }} className="text-blue-600 text-xs mr-2">✏️ Sửa</button>
                    <button onClick={() => deleteEntry(entry.date)} className="text-red-600 text-xs">🗑️ Xoá</button>
                  </>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
