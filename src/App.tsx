import { useEffect, useState } from "react";
import { FaMoon, FaSun } from "react-icons/fa";
import { FaCircleXmark } from "react-icons/fa6";

function App() {
  const [tabs, setTabs] = useState<chrome.tabs.Tab[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [darkMode, setDarkMode] = useState<boolean>(false);

  useEffect(() => {
    chrome.tabs.query({ currentWindow: true }, (tabs) => {
      setTabs(tabs);
    });
  }, []);

  const handleGroupTabs = async () => {
    const tabIds = tabs.map((tab) => tab.id as number);
    const groupId = await chrome.tabs.group({ tabIds });
    await chrome.tabGroups.update(groupId, {
      title: "Grouped Tabs",
      collapsed: true,
    });
  };

  const handleCloseTab = (event: React.MouseEvent<HTMLButtonElement>) => {
    const tabId = Number(event.currentTarget.value);
    chrome.tabs.remove(tabId);
    setTabs((prevTabs) => prevTabs.filter((tab) => tab.id !== tabId));
  };

  // Filter tabs based on the search term
  const filteredTabs = tabs.filter((tab) =>
    tab.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
  };

  return (
    <div
      className={`p-4 w-screen max-w-md ${
        darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex space-x-2">
          <h1 className="text-xl font-bold">Active Tabs</h1>
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-md hover:bg-gray-200 transition"
          >
            {darkMode ? (
              <FaSun className="text-yellow-500" />
            ) : (
              <FaMoon className="text-gray-800" />
            )}
          </button>
        </div>
        <button
          onClick={handleGroupTabs}
          className="px-3 py-1 bg-blue-500 text-white font-medium rounded-md hover:bg-blue-600 transition"
        >
          Group Tabs
        </button>
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search tabs..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={`w-full p-2 rounded-md border ${
            darkMode
              ? "bg-gray-700 text-white border-gray-600"
              : "border-gray-300"
          }`}
        />
      </div>

      <div>
        <ul className="space-y-1">
          {filteredTabs.map((tab) => (
            <li
              key={tab.id}
              className={`flex items-center justify-between p-2 rounded-md hover:bg-gray-200 transition ${
                darkMode
                  ? "bg-gray-600 hover:bg-gray-700"
                  : "bg-gray-100"
              }`}
            >
              <span>{tab.title || "New Tab"}</span>
              <button
                value={tab.id}
                className="text-red-500 text-md hover:underline"
                onClick={handleCloseTab}
              >
                <FaCircleXmark />
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
