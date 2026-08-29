import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Heart, Bookmark, MapPin, Plus } from 'lucide-react';

const BACKEND_URL = 'https://raahi-backend.onrender.com';

export default function TravelFeed({ user }) {
  const [posts, setPosts] = useState([]);
  const [showUpload, setShowUpload] = useState(false);
  const [newPost, setNewPost] = useState({ location: '', image_url: '', caption: '' });

  const fetchPosts = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/api/posts`);
      setPosts(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!user) return alert('Pehle Login Karein!');
    try {
      await axios.post(`${BACKEND_URL}/api/posts/create`, {
        userId: user.id,
        ...newPost
      });
      setShowUpload(false);
      setNewPost({ location: '', image_url: '', caption: '' });
      fetchPosts();
    } catch (err) {
      alert('Post create karne me error aaya');
    }
  };

  const handleSave = async (postId) => {
    if (!user) return alert('Pehle Login Karein!');
    try {
      const res = await axios.post(`${BACKEND_URL}/api/posts/save`, {
        userId: user.id,
        postId
      });
      alert(res.data.message);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-5">
      {/* Add New Post Trigger */}
      <button
        onClick={() => setShowUpload(true)}
        className="w-full bg-slate-900 border border-slate-800 hover:border-teal-500/50 p-3 rounded-2xl flex items-center justify-between text-xs text-slate-400"
      >
        <span>Apni nayi travel photo post karein...</span>
        <div className="bg-teal-500 text-slate-950 p-1.5 rounded-xl">
          <Plus size={16} />
        </div>
      </button>

      {/* Upload Modal */}
      {showUpload && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-sm rounded-2xl p-5">
            <h3 className="text-sm font-bold text-slate-100 mb-3">Create Travel Post</h3>
            <form onSubmit={handleCreatePost} className="space-y-3">
              <input
                type="text"
                placeholder="Location (e.g. Manali, Himachal)"
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200"
                value={newPost.location}
                onChange={(e) => setNewPost({ ...newPost, location: e.target.value })}
              />
              <input
                type="url"
                placeholder="Image URL (Unsplash / Direct Link)"
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200"
                value={newPost.image_url}
                onChange={(e) => setNewPost({ ...newPost, image_url: e.target.value })}
              />
              <textarea
                placeholder="Caption..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200"
                value={newPost.caption}
                onChange={(e) => setNewPost({ ...newPost, caption: e.target.value })}
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowUpload(false)}
                  className="w-1/2 bg-slate-800 text-slate-300 py-2 rounded-xl text-xs"
                >
                  Cancel
                </button>
                <button type="submit" className="w-1/2 bg-teal-500 text-slate-950 font-bold py-2 rounded-xl text-xs">
                  Publish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Posts Feed */}
      {posts.map((post) => (
        <div key={post.id} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg">
          <div className="p-3 flex items-center gap-3">
            <img src={post.avatar_url} alt="" className="w-8 h-8 rounded-full object-cover border border-slate-700" />
            <div>
              <p className="text-xs font-semibold text-slate-200">@{post.username}</p>
              <div className="flex items-center gap-1 text-slate-400 text-[10px]">
                <MapPin size={10} className="text-teal-400" />
                <span>{post.location}</span>
              </div>
            </div>
          </div>

          <img src={post.image_url} alt="" className="w-full h-72 object-cover" />

          <div className="p-3">
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-1 text-xs text-slate-300">
                <Heart size={18} className="text-rose-500 fill-rose-500" />
                <span>{post.likes_count}</span>
              </div>
              <button onClick={() => handleSave(post.id)} className="text-slate-300 hover:text-teal-400">
                <Bookmark size={18} />
              </button>
            </div>
            <p className="text-xs text-slate-300">
              <span className="font-semibold text-slate-100 mr-1.5">@{post.username}</span>
              {post.caption}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
