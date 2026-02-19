const StateCard = ({ title, value }) => {
  return (
    <div className="bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-6 min-h-30 flex flex-col justify-between hover:border-blue-500/30 transition">
      <p className="text-white/60 text-sm">{title}</p>

      <h2 className="text-3xl font-semibold text-white tracking-tight">
        {value}
      </h2>
    </div>
  );
};

export default StateCard;
