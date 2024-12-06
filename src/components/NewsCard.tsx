const NewsCard = ({
  index,
  url,
  title,
  abstract,
}: {
  index: number;
  url: string;
  title: string;
  abstract: string;
}) => {
  return (
    <div key={index} className="p-4 bg-white rounded shadow hover:shadow-md">
      <h2 className="text-lg font-semibold">
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline"
        >
          {title}
        </a>
      </h2>
      <p className="text-gray-700">{abstract}</p>
    </div>
  );
};

export default NewsCard;
