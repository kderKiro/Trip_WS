import React, { useState } from "react";
import "./css/AttractionForm.css";

const AttractionForm = ({ onSearch }) => {
  // لازلنا نستخدم متغير اسمه city للكود، لكنه الآن يعني "كلمة البحث"
  const [city, setCity] = useState("");
  const [category, setCategory] = useState("");
  
  // حقول التاريخ والأشخاص (شكلية حالياً)
  const [visitDate, setVisitDate] = useState("");
  const [people, setPeople] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch({
        city,      // سيرسل هذا النص للبحث في الاسم والموقع
        category
    });
  };

  return (
    <form className="attraction-form-container" onSubmit={handleSubmit}>

      {/* 1. Search Field (التغيير هنا) */}
      <div className="attraction-form-group">
        <input
          type="text"
          // ✅ تغيير النص ليوضح للمستخدم أنه يمكنه البحث عن اسم المعلم أو المدينة
          placeholder="Where to? (City or Attraction)" 
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
      </div>

      {/* 2. Visit Date */}
      <div className="attraction-form-group">
        <input
          type="date"
          value={visitDate}
          onChange={(e) => setVisitDate(e.target.value)}
        />
      </div>


      {/* 4. Category */}
      <div className="attraction-form-group">
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">All Categories</option>
          <option value="Museum">Museum</option>
          <option value="Park">Park</option>
          <option value="Historical">Historical</option>
          <option value="Entertainment">Entertainment</option>
          <option value="Nature">Nature</option>
          <option value="Monument">Monument</option>
        </select>
      </div>

      <button type="submit">Search</button>
    </form>
  );
};

export default AttractionForm;