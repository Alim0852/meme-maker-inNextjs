"use client";
import { useEffect, useState } from 'react';

export default function Memes() {
  const [memes, setMemes] = useState<any[]>([]);
  const [selectedMeme, setSelectedMeme] = useState<any | null>(null);
  const [memeText, setMemeText] = useState({ topText: '', midText: '', bottomText: '' });

  useEffect(() => {
    const fetchMemes = async () => {
      const res = await fetch('https://api.imgflip.com/get_memes', {
        cache: 'no-store',
      });
      const result = await res.json();
      if (result.success && Array.isArray(result.data.memes)) {
        setMemes(result.data.memes);
      } else {
        console.error('Memes data is not an array:', result);
      }
    };

    fetchMemes();
  }, []);

  const handleMemeClick = (meme: any) => {
    setSelectedMeme(meme);
  };

  const handleCloseModal = () => {
    setSelectedMeme(null);
    setMemeText({ topText: '', midText: '', bottomText: '' });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setMemeText((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitted:", memeText);
    
    setMemeText({ topText: '', midText: '', bottomText: '' });
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-gray-100 min-h-screen">
      <h1 className="text-4xl font-bold mb-6 text-gray-800">Memes</h1>
      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {memes.map((meme) => (
          <li key={meme.id} className="border rounded-lg p-2 bg-white shadow-md cursor-pointer" onClick={() => handleMemeClick(meme)}>
            <img src={meme.url} alt={meme.name} className="w-48 h-48 object-cover rounded-md mb-2" />
          </li>
        ))}
      </ul>

      {selectedMeme && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
          <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center relative">
            <div className="relative">
              <img src={selectedMeme.url} alt={selectedMeme.name} className="w-80 h-80 object-cover" />
              <div className="absolute top-2 left-1/2 transform -translate-x-1/2 text-black text-xl font-bold">{memeText.topText}</div>
              <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-black text-xl font-bold">{memeText.bottomText}</div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-black text-xl font-bold">{memeText.midText}</div>
            </div>
            <form onSubmit={handleSubmit} className="w-full">
              <input type="text" name="topText" placeholder="Top Text" value={memeText.topText} onChange={handleChange} className="border p-2 mb-2 w-full" />
              <input type="text" name="midText" placeholder="Middle Text" value={memeText.midText} onChange={handleChange} className="border p-2 mb-2 w-full" />
              <input type="text" name="bottomText" placeholder="Bottom Text" value={memeText.bottomText} onChange={handleChange} className="border p-2 mb-2 w-full" />
              <button type="submit" className="bg-blue-500 text-white p-2 rounded mb-2 w-full">Submit Meme Text</button>
              <button type="button" onClick={handleCloseModal} className="absolute top-4 right-4 bg-red-500 text-white p-2 rounded">Close</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
