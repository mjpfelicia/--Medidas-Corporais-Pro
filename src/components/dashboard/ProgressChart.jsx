const ProgressChart = ({ title, current, target, color }) => {
  const percent = target ? Math.min((current / target) * 100, 100) : 0;

  return (
    <div className="col-md-6">
      <div className="card shadow-sm">
        <div className="card-body">
          <div className="d-flex justify-content-between mb-2">
            <strong>{title}</strong>
            <small>{current} / {target}</small>
          </div>

          <div className="progress" style={{ height: 10 }}>
            <div
              className={`progress-bar bg-${color}`}
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressChart;
