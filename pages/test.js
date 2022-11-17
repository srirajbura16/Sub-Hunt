import React from "react";

export default function Test() {
  const result = async (e) => {
    const res = await fetch("/api/links");
    const data = await res.json();
    console.log(data);
  };
  return (
    <div>
      <button onClick={result}>test</button>
    </div>
  );
}
