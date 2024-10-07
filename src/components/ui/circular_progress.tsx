const cleanPercentage = (percentage: number) => {
  const isNegativeOrNaN = !Number.isFinite(+percentage) || percentage < 0; // we can set non-numbers to 0 here
  const isTooHigh = percentage > 100;
  return isNegativeOrNaN ? 0 : isTooHigh ? 100 : +percentage;
};

const Circle: React.FC<{ colour: string; percentage?: number }> = ({
  colour,
  percentage,
}) => {
  const r = 15;
  const circ = 2 * Math.PI * r;
  const strokePct = ((100 - (percentage ?? 0)) * circ) / 100; // where stroke will start, e.g. from 15% to 100%.
  return (
    <circle
      r={r}
      cx={10}
      cy={10}
      fill="transparent"
      stroke={strokePct !== circ ? colour : "#eee"} // remove colour as 0% sets full circumference
      strokeWidth={"0.25rem"}
      strokeDasharray={circ}
      strokeDashoffset={percentage ? strokePct : 0}
      className="shadow shadow-black/50"
    ></circle>
  );
};

const Texts: React.FC<{ percentage: number }> = ({ percentage }) => {
  return (
    <text
      x="50%"
      y="50%"
      dominantBaseline="central"
      textAnchor="middle"
      fontSize={"0.5em"}
    >
      {percentage.toFixed(0)}%
    </text>
  );
};

export const CircularProgressBar = ({
  percentage,
  colour,
}: {
  percentage: number;
  colour: string;
}) => {
  const pct = cleanPercentage(percentage);
  return (
    <svg width={40} height={40}>
      <g transform={`rotate(-90 ${"20 10"})`}>
        <Circle colour="lightgrey" />
        <Circle colour={colour} percentage={pct} />
      </g>
      <Texts percentage={pct} />
    </svg>
  );
};
