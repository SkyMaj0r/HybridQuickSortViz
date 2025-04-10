import React, { useState, useEffect } from "react";
const Button = (props) => <button className="px-4 py-2 bg-blue-600 text-white rounded" {...props} />;
const Input = (props) => <input className="border px-3 py-1 rounded" {...props} />;

function QuickSortVisualizer() {
  const [array, setArray] = useState([]);
  const [isSorting, setIsSorting] = useState(false);
  const [arraySize, setArraySize] = useState(20);
  const [highlight, setHighlight] = useState({ i: -1, j: -1 });

  const generateArray = (length = arraySize) => {
    const newArr = Array.from({ length }, () => Math.floor(Math.random() * 200 + 10));
    setArray(newArr);
    setHighlight({ i: -1, j: -1 });
  };

  useEffect(() => {
    generateArray();
  }, [arraySize]);

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const quickSort = async (arr, low, high) => {
    if (high - low <= 10) {
      await insertionSort(arr, low, high);
      return;
    }
    const pivot = medianOfThree(arr, low, high);
    const partitionIndex = await partition(arr, low, high, pivot);
    await quickSort(arr, low, partitionIndex - 1);
    await quickSort(arr, partitionIndex, high);
  };

  const medianOfThree = (arr, low, high) => {
    const mid = Math.floor((low + high) / 2);
    if (arr[low] > arr[mid]) swap(arr, low, mid);
    if (arr[low] > arr[high]) swap(arr, low, high);
    if (arr[mid] > arr[high]) swap(arr, mid, high);
    return arr[mid];
  };

  const partition = async (arr, low, high, pivot) => {
    let i = low,
      j = high;
    while (i <= j) {
      while (arr[i] < pivot) i++;
      while (arr[j] > pivot) j--;
      if (i <= j) {
        swap(arr, i, j);
        setHighlight({ i, j });
        setArray([...arr]);
        await sleep(150); // optimal visualization delay
        i++;
        j--;
      }
    }
    return i;
  };

  const insertionSort = async (arr, low, high) => {
    for (let i = low + 1; i <= high; i++) {
      let key = arr[i];
      let j = i - 1;
      while (j >= low && arr[j] > key) {
        arr[j + 1] = arr[j];
        setHighlight({ i: j, j: j + 1 });
        j--;
        setArray([...arr]);
        await sleep(150);
      }
      arr[j + 1] = key;
      setHighlight({ i: j + 1, j: i });
      setArray([...arr]);
      await sleep(150);
    }
  };

  const swap = (arr, i, j) => {
    [arr[i], arr[j]] = [arr[j], arr[i]];
  };

  const handleSort = async () => {
    setIsSorting(true);
    const arrCopy = [...array];
    await quickSort(arrCopy, 0, arrCopy.length - 1);
    setIsSorting(false);
    setHighlight({ i: -1, j: -1 });
  };

  return (
    <div className="flex flex-col items-center p-6 space-y-4">
      <h1 className="text-2xl font-bold">QuickSort Visualizer</h1>
      <div className="flex items-center space-x-4">
        <Input
          type="number"
          value={arraySize}
          onChange={(e) => setArraySize(Math.max(5, parseInt(e.target.value) || 5))}
          disabled={isSorting}
          className="w-24"
          min={5}
        />
        <Button onClick={() => generateArray()} disabled={isSorting}>Generate Array</Button>
        <Button onClick={handleSort} disabled={isSorting}>Sort</Button>
      </div>
      <div className="flex space-x-1 h-64 items-end">
        {array.map((value, index) => (
          <div
            key={index}
            style={{ height: `${value}px` }}
            className={`w-4 rounded-t ${
              index === highlight.i || index === highlight.j
                ? "bg-red-500"
                : "bg-blue-500"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

export default QuickSortVisualizer;
