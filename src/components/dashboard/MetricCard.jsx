const MetricCard = ({ title, value, unit }) => (
  <div className="col-md-4">
    <div className="card shadow-sm">
      <div className="card-body">
        <small className="text-muted">{title}</small>
        <h3 className="fw-bold">
          {value ?? '--'} <small>{unit}</small>
        </h3>
      </div>
    </div>
  </div>
);

export default MetricCard;
