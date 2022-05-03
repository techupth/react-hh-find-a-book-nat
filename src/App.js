import axios from "axios";
import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [searchText, setSearchText] = useState("");
  const [books, setBooks] = useState([]);

  const searchBook = async () => {
    const results = await axios(
      `https://www.googleapis.com/books/v1/volumes?q=${searchText}`
    );
    setBooks(results.data.items);
  };

  const handleSearchTextChange = (event) => {
    setSearchText(event.target.value);
  };

  // `useEffect` นี้หมายความว่า ถ้า `searchText` มีการเปลี่ยนแปลง Value เมื่อไหร่ให้ Trigger callback function ที่ส่งเข้าไปใน `useEffect`
  // ดังนั้น searchText จะเปลี่ยนทุกๆ ครั้งเมื่อเราพิมพ์ 1 ตัวอักษร
  // ดังนั้นมันจะสร้าง Request ไปหา Serrve ของ Google ทุกๆ ครั้งที่เราพิมพ์แค่ 1 ตัวอักษร ถ้าเราพิมพ์หลายๆ ตัวอักษรก็เหมือนกับเป็นการ Spam (มันทำให้ Server ทำงานหนักได้)
  // useEffect(() => {
  //   searchBook();
  // }, [searchText]);

  // ส่วนนี้คือคำตอบของ `Super challenge` ที่มาแก้ไขปัญหาจาก `useEffect` ข้างบนนะ
  useEffect(() => {
    let timerId;

    if (searchText) {
      // ใช้ `setTimeout` ในการดีเลย์การทำงานของ Function `searchBook`
      // ไม่งั้นมันจะถูก Execute ทุกๆ ครั้งเวลาเรากดปุ่มพิมพ์ข้อความลงไปใน Input Text
      // setTimeout จะ Return id ให้เราเก็บ Id ตัวนี้ไว้ใน Variable ก่อน เพราะว่าเราจะเอาไปใช้ต่อ
      timerId = setTimeout(searchBook, 1000);
    }

    // ส่วนนี้เราเรียกว่า Cleanup Function ของ `useEffect`
    // มันจะเป็นส่วนที่ทำงานทุกครั้งเวลา Component re-rendered
    // เอาไว้ใช้ในการ Clear ค่าต่างๆ ใน Component เช่น เวลาเราใช้ setTimeout มันจะไปสร้างตัวจับเวลาไว้ที่ Browser ให้ Function นั้นทำงานในอีกกี่ ms
    // ถ้าเราไม่เคลียร์มันจะค้างอยู่ที่ Browser แล้วอาจจะทำให้ Browser hang (เรามักเรียกสถานการณ์นี้ว่า "Memory leak")
    return () => {
      // `clearTimeout` เป็น Function ที่เอาไว้ Clear ตัว Timers ที่สร้างด้วย `setTimeout`
      // ให้ใส่ Param เป็น timerId ที่ Return มาจาก `setTimeout` ด้านบน
      // มันก็จะไป Clear ตัว Timer ให้ที่เราตั้งเวลาไว้ตอนแรก
      clearTimeout(timerId);
    };
  }, [searchText]);

  return (
    <div className="App">
      <h1>Find a Book</h1>
      <input
        id="search-text"
        name="search-text"
        type="text"
        onChange={handleSearchTextChange}
        value={searchText}
      />

      <ul>
        {books.map((book) => {
          return <li key={book.id}>{book.volumeInfo.title}</li>;
        })}
      </ul>
    </div>
  );
}

export default App;
