import React, { useState } from "react";
import { AutoComplete, Input } from "antd";

const { Search } = Input;

function getRandomInt(max, min = 0) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const searchResult = (query) => {
  return new Array(getRandomInt(5))
    .join(".")
    .split(".")
    .map((item, idx) => {
      const category = `${query}${idx}`;
      return {
        value: category,
        label: (
          <div className="label">
            <span>
              Found {query} on{" "}
              <a target="_blank" rel="noopener noreferrer">
                {category}
              </a>
            </span>
            <span>{getRandomInt(200, 100)} results</span>
          </div>
        ),
      };
    });
};

export default function AutoCompleteWrapper() {
  const [options, setOptions] = useState([]);

  const handleSearch = (value) => {
    setOptions(value ? searchResult(value) : []);
  };

  const onSelect = (value) => {
    console.log("onSelect", value);
  };

  return (
    <AutoComplete
      dropdownMatchSelectWidth={252}
      style={{ width: 300 }}
      options={options}
      onSelect={onSelect}
      onSearch={handleSearch}
    >
      <Search size="medium" placeholder="Search" enterButton />
    </AutoComplete>
  );
}
