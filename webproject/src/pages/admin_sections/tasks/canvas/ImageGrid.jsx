import React from "react";
import styles from "./ImageGrid.module.css";

const images = [
  "https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1581325699592-13b32775a2bd?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1600299017305-948248f3ed66?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1551963831-b3b1ca40c98e?auto=format&fit=crop&w=400&q=80",
  "https://img2.freepng.ru/20180429/cle/avd0gz1lr.webp"
];

const ImageGrid = ({ addImage }) => {
  return (
    <div className={styles.grid}>
      {images.map((src, index) => (
        <img
          key={index}
          src={src}
          alt={`Sample ${index + 1}`}
          className={styles.image}
          onClick={() => addImage(src)}
        />
      ))}
    </div>
  );
};

export default ImageGrid;
