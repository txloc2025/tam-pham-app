import { useState, useEffect } from 'react';

const cards = [
  { id: 1, title: "TỬ TẾ", message: "Làm điều đúng – dù không ai biết.", action: "Hãy giúp một người không quen hôm nay – một hành động nhỏ thôi.", reflect: "Tôi đã làm gì khiến người khác thấy dễ chịu hôm nay?" },
  { id: 2, title: "TRUNG THỰC", message: "Dám đứng về phía sự thật – kể cả khi bất lợi.", action: "Nói thật trong một tình huống bạn hay biện minh.", reflect: "Tôi có trung thực hay đang sợ bị đánh giá?" }
];

export default function App() {
  const [card, setCard] = useState(null);
  const [reflection, setReflection] = useState("");
  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem('tampham_history');
    return saved ? JSON.parse(saved) : [];
  });

  const drawCard = () => {
    const random = cards[Math.floor(Math.random() * cards.length)];
    setCard(random);
    setReflection("");
  };

  const saveReflection = () => {
    const today = new Date().toISOString().split('T')[0];
    const entry = { date: today, title: card.title, reflection };
    const updated = [...history.filter(h => h.date !== today), entry];
    localStorage.setItem('tampham_history', JSON.stringify(updated));
    setHistory(updated);
  };

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    const todayEntry = history.find(h => h.date === today);
    if (todayEntry) {
      const foundCard = cards.find(c => c.title === todayEntry.title);
      setCard(foundCard);
      setReflection(todayEntry.reflection);
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <h1 className="text-3xl font-bold mb-6">🌟 Rút – Sống – Soi – Chia sẻ</h1>

      {!card ? (
        <button onClick={drawCard} className="bg-yellow-400 px-4 py-2 rounded">🎴 Rút Phẩm Hôm Nay</button>
      ) : (
        <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold">🌿 {card.title}</h2>
          <p className="italic">💡 {card.message}</p>
          <p className="font-medium mt-2">🎯 Hành động: {card.action}</p>
          <p className="text-sm text-gray-600 mt-2">🔍 Soi lại: {card.reflect}</p>
          <textarea
            value={reflection}
            onChange={(e) => setReflection(e.target.value)}
            placeholder="Bạn rút ra gì sau khi sống phẩm này hôm nay?"
            className="w-full mt-4 p-2 border rounded"
          />
          <div className="flex gap-2 mt-4">
            <button onClick={saveReflection} className="bg-green-500 text-white px-3 py-1 rounded">💾 Lưu</button>
            <button onClick={drawCard} className="bg-blue-500 text-white px-3 py-1 rounded">🔁 Đổi thẻ</button>
          </div>
        </div>
      )}

      {history.length > 0 && (
        <div className="mt-6 w-full max-w-md">
          <h3 className="text-lg font-bold mb-2">🕘 Lịch sử 21 ngày</h3>
          <ul className="bg-white rounded-xl shadow p-4 space-y-2 max-h-64 overflow-auto text-sm">
            {history.slice(-21).reverse().map((entry, index) => (
              <li key={index}>
                <strong>{entry.date}</strong> – {entry.title}<br />
                <em>{entry.reflection}</em>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
