interface SparklineProps {
  data: number[];
  width?: number;
  height?: number;
  color?: string;
  strokeWidth?: number;
  showEndPoint?: boolean;
  ariaLabel?: string;
  className?: string;
}

export function Sparkline({
  data,
  width = 96,
  height = 14,
  color = 'var(--accent)',
  strokeWidth = 1.25,
  showEndPoint = true,
  ariaLabel,
  className,
}: SparklineProps) {
  if (!data || data.length < 2) return null;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const stepX = width / (data.length - 1);
  const pad = strokeWidth + 1;
  const innerH = height - pad * 2;

  const points = data.map((v, i) => {
    const x = i * stepX;
    const y = pad + innerH - ((v - min) / range) * innerH;
    return `${x.toFixed(2)},${y.toFixed(2)}`;
  });

  const d = `M${points.join(' L')}`;
  const [lastX, lastY] = points[points.length - 1].split(',').map(Number);

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className={className}
      role={ariaLabel ? 'img' : undefined}
      aria-label={ariaLabel}
      aria-hidden={ariaLabel ? undefined : true}
      style={{ overflow: 'visible' }}
    >
      <path
        d={d}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {showEndPoint && (
        <circle cx={lastX} cy={lastY} r={strokeWidth + 0.6} fill={color} />
      )}
    </svg>
  );
}
