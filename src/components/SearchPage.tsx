import React, { useState } from "react";
import NewsCard from "./NewsCard";
import { FiSearch, FiLoader } from "react-icons/fi";
import { AiOutlineFileSearch } from "react-icons/ai";

interface Article {
  title: string;
  abstract: string;
  url: string;
}

const SearchPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const postsPerPage = 5;

  const fetchArticles = async () => {
    if (!searchTerm.trim()) return; 
    setLoading(true);
    try {
      const response = await fetch(
        `https://api.nytimes.com/svc/search/v2/articlesearch.json?q=${searchTerm}&api-key=${
          import.meta.env.VITE_NYT_API_KEY
        }`
      );
      const data = await response.json();
      const results = data.response.docs.map((doc: any) => ({
        title: doc.headline.main,
        abstract: doc.abstract || "No description available.",
        url: doc.web_url,
      }));
      setArticles(results);
      setCurrentPage(1);
    } catch (error) {
      console.error("Error fetching articles:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      fetchArticles();
    }
  };

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = articles.slice(indexOfFirstPost, indexOfLastPost);

  const totalPages = Math.ceil(articles.length / postsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Discover Articles
        </h1>

        <div className="flex gap-2 mb-6">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Search for articles..."
              className="w-full p-3 pl-10 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleKeyPress}
            />
            <FiSearch className="absolute left-3 top-3.5 text-gray-500 text-xl" />
          </div>
          <button
            onClick={fetchArticles}
            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 flex items-center"
            disabled={loading}
          >
            {loading ? <FiLoader className="animate-spin" /> : "Search"}
          </button>
        </div>

        <div className="space-y-4">
          {loading && (
            <p className="text-center text-gray-500 animate-pulse">
              Loading articles...
            </p>
          )}

          {!loading &&
            currentPosts.length > 0 &&
            currentPosts.map((article, index) => (
              <NewsCard
                key={index}
                title={article.title}
                url={article.url}
                abstract={article.abstract}
                index={index}
              />
            ))}

          {!loading && articles.length === 0 && (
            <div className="text-center text-gray-500">
              <AiOutlineFileSearch className="mx-auto text-6xl mb-4" />
              <p className="mb-2">
                No articles found. Try a different keyword!
              </p>
              <div>
                <p className="font-semibold">Suggested Topics:</p>
                <div className="flex justify-center space-x-2 mt-2">
                  {["Technology", "Sports", "Health", "Business", "Travel"].map(
                    (suggestion, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSearchTerm(suggestion)}
                        className="bg-blue-100 text-blue-600 py-1 px-3 rounded-full text-sm hover:bg-blue-200"
                      >
                        {suggestion}
                      </button>
                    )
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {articles.length > postsPerPage && (
          <div className="flex justify-between items-center mt-6">
            <button
              onClick={handlePreviousPage}
              className={`px-4 py-2 bg-gray-300 text-gray-700 font-medium rounded-lg shadow-md hover:bg-gray-400 ${
                currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <p className="text-gray-700 font-medium">
              Page {currentPage} of {totalPages}
            </p>
            <button
              onClick={handleNextPage}
              className={`px-4 py-2 bg-gray-300 text-gray-700 font-medium rounded-lg shadow-md hover:bg-gray-400 ${
                currentPage === totalPages
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
