import React from 'react';

interface FacebookPostProps {
  url: string;
}

const FacebookPost = ({ url }: FacebookPostProps) => {
  return (
    <div className="fb-post-container w-full flex justify-center mb-8">
      <iframe 
        src={`https://www.facebook.com/plugins/post.php?href=${encodeURIComponent(url)}&show_text=true&width=500`} 
        width="500" 
        height="600" 
        className="border-none overflow-hidden rounded-2xl bg-[var(--bg-card)]"
        scrolling="no" 
        frameBorder="0" 
        allowFullScreen={true} 
        allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
      ></iframe>
    </div>
  );
};

export default FacebookPost;
