import React from 'react';

export default function Comment({ avatar, username, text, date }) {
  return (
    <div className="flex items-start mb-4">
      <img src={avatar} alt="" className="w-10 h-10 rounded-full mr-3" />
      <div>
        <div className="font-bold">{username}
          <span className="text-gray-500 text-sm ml-2">{new Date(date).toLocaleDateString()}</span>
        </div>
        <div>{text}</div>
      </div>
    </div>
  );
}
