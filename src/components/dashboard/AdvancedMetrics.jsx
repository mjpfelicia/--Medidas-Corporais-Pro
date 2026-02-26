import {
  calculateBMI,
  calculateWHtR,
  calculatenavyBodyFat,
  estimateBodyFatFromBMI,
  calculateMuscleMass,
  calculateBMR,
  calculateTDEE,
  getBMIClassification,
  getBodyFatClassification,
  getIdealBodyFatRange,
  calculateChange,
  calculateIdealWeight,
  calculateIdealWaist,
  calculateIdealHip,
  calculateIdealNeck,
  calculateIdealThigh,
  calculateIdealArm,
  calculateIdealCalf,
  calculateWeightDifference,
  calculateMeasurementDifference,
} from '../../utils/fitnessCalculations';
import { useUserProfile } from '../../hooks/useUserProfile';
import { useGoals } from '../../hooks/useGoals';

const AdvancedMetrics = ({ lastMeasurement, firstMeasurement }) => {
  const { profile } = useUserProfile();
  const { goals } = useGoals();

  if (!lastMeasurement) {
    return (
      <div className="alert alert-warning text-center">
        <i className="bi bi-exclamation-triangle me-2"></i>
        Nenhuma medição registrada ainda
      </div>
    );
  }

  // Cálculos
  const bmi = calculateBMI(lastMeasurement.weight, lastMeasurement.height);
  const bmiClass = getBMIClassification(bmi);
  
  const whtr = calculateWHtR(lastMeasurement.waist, lastMeasurement.height);
  
  const bodyFat = lastMeasurement.bodyFat;
  const bodyFatClass = getBodyFatClassification(bodyFat, profile.gender);
  const idealBodyFat = getIdealBodyFatRange(profile.gender, profile.age);
  
  const muscleMass = calculateMuscleMass(lastMeasurement.weight, bodyFat);
  const bmr = calculateBMR(profile.gender, lastMeasurement.weight, lastMeasurement.height, profile.age);
  const tdee = calculateTDEE(profile.gender, lastMeasurement.weight, lastMeasurement.height, profile.age, profile.activityLevel);

  // Peso e Medidas Ideais
  const idealWeight = calculateIdealWeight(profile.gender, lastMeasurement.height);
  const weightDiff = calculateWeightDifference(lastMeasurement.weight, idealWeight);
  
  const idealWaist = calculateIdealWaist(profile.gender, lastMeasurement.height);
  const waistDiff = lastMeasurement.waist ? calculateMeasurementDifference(lastMeasurement.waist, idealWaist) : null;
  
  const idealHip = profile.gender === "female" ? calculateIdealHip(profile.gender, lastMeasurement.height) : null;
  const hipDiff = idealHip && lastMeasurement.hip ? calculateMeasurementDifference(lastMeasurement.hip, idealHip) : null;
  
  const idealNeck = calculateIdealNeck(idealWaist, profile.gender);
  const neckDiff = lastMeasurement.neck ? calculateMeasurementDifference(lastMeasurement.neck, idealNeck) : null;

  // Outras medidas ideais
  const idealThigh = calculateIdealThigh(lastMeasurement.height, profile.gender);
  const thighDiff = lastMeasurement.thigh ? calculateMeasurementDifference(lastMeasurement.thigh, idealThigh) : null;
  
  const idealArm = calculateIdealArm(lastMeasurement.height, profile.gender);
  const armDiff = lastMeasurement.arm ? calculateMeasurementDifference(lastMeasurement.arm, idealArm) : null;
  
  const idealCalf = calculateIdealCalf(lastMeasurement.height, profile.gender);
  const calfDiff = lastMeasurement.calf ? calculateMeasurementDifference(lastMeasurement.calf, idealCalf) : null;

  // Previsões
  const predictArrivalDate = (current, target) => {
    if (!target || current === target) return null;
    
    if (!firstMeasurement || new Date(lastMeasurement.date) === new Date(firstMeasurement.date)) {
      return null;
    }

    const daysElapsed = Math.floor(
      (new Date(lastMeasurement.date) - new Date(firstMeasurement.date)) / (1000 * 60 * 60 * 24)
    );
    
    if (daysElapsed === 0) return null;

    const changePerDay = (current - (firstMeasurement.weight || firstMeasurement.bodyFat || firstMeasurement.waist)) / daysElapsed;
    const remainingChange = target - current;
    
    if ((changePerDay > 0 && remainingChange < 0) || (changePerDay < 0 && remainingChange > 0)) {
      return null; // Direção oposta
    }

    if (changePerDay === 0) return null;

    const daysRemaining = Math.abs(remainingChange / changePerDay);
    const arrivalDate = new Date(lastMeasurement.date);
    arrivalDate.setDate(arrivalDate.getDate() + daysRemaining);
    
    return {
      date: arrivalDate.toLocaleDateString('pt-BR'),
      daysRemaining: Math.ceil(daysRemaining),
      isRealistic: daysRemaining < 365, // Mais de 1 ano não é realista
    };
  };

  const weightPrediction = goals.targetWeight ? predictArrivalDate(lastMeasurement.weight, goals.targetWeight) : null;
  const bodyFatPrediction = goals.targetBodyFat ? predictArrivalDate(bodyFat, goals.targetBodyFat) : null;
  const waistPrediction = goals.targetWaist && lastMeasurement.waist ? predictArrivalDate(lastMeasurement.waist, goals.targetWaist) : null;

  // Variações
  const weightChange = firstMeasurement ? calculateChange(lastMeasurement.weight, firstMeasurement.weight) : null;
  const bodyFatChange = firstMeasurement && firstMeasurement.bodyFat ? calculateChange(bodyFat, firstMeasurement.bodyFat) : null;

  return (
    <div className="advanced-metrics">
      {/* Seção Principal - IMC e Classificação */}
      <div className="row mb-4">
        <div className="col-12 col-md-6">
          <div className="metric-card primary">
            <div className="metric-header">
              <span className="metric-icon">📊</span>
              <h4>IMC</h4>
            </div>
            <div className="metric-value">{bmi.toFixed(1)}</div>
            <div className={`metric-classification badge bg-${bmiClass.color}`}>
              {bmiClass.label}
            </div>
            <small className="d-block text-muted mt-2">
              {bmi < 18.5 && '→ Ganhe peso'}
              {bmi >= 18.5 && bmi < 25 && '✓ Peso saudável'}
              {bmi >= 25 && bmi < 30 && '→ Perca peso'}
              {bmi >= 30 && '⚠️ Procure orientação profissional'}
            </small>
          </div>
        </div>

        <div className="col-12 col-md-6">
          <div className="metric-card primary">
            <div className="metric-header">
              <span className="metric-icon">⚖️</span>
              <h4>Peso Ideal</h4>
            </div>
            <div className="metric-value">{idealWeight.toFixed(1)} kg</div>
            <div className={`metric-classification badge ${weightDiff.isOverweight ? 'bg-warning' : weightDiff.isUnderweight ? 'bg-info' : 'bg-success'}`}>
              {weightDiff.status}
            </div>
            <small className="d-block text-muted mt-2">
              {weightDiff.isOverweight ? '↓' : '↑'} {weightDiff.needsToChangePounds.toFixed(1)} kg a {weightDiff.isOverweight ? 'perder' : 'ganhar'}
            </small>
          </div>
        </div>
      </div>

      {/* Cintura/Altura e Medidas Ideais */}
      <div className="row mb-4">
        <div className="col-12 col-md-6">
          <div className="metric-card primary">
            <div className="metric-header">
              <span className="metric-icon">📏</span>
              <h4>Cintura/Altura</h4>
            </div>
            <div className="metric-value">{whtr}</div>
            <div className={`metric-classification badge ${whtr < 0.5 ? 'bg-success' : whtr < 0.57 ? 'bg-info' : 'bg-warning'}`}>
              {whtr < 0.5 ? 'Baixo risco' : whtr < 0.57 ? 'Risco moderado' : 'Alto risco'}
            </div>
            <small className="d-block text-muted mt-2">
              Melhor preditor de saúde que IMC
            </small>
          </div>
        </div>

        <div className="col-12 col-md-6">
          <div className="metric-card primary">
            <div className="metric-header">
              <span className="metric-icon">👖</span>
              <h4>Cintura Ideal</h4>
            </div>
            <div className="metric-value">{idealWaist.toFixed(1)} cm</div>
            <div className={`metric-classification badge ${waistDiff?.isAboveIdeal ? 'bg-warning' : 'bg-success'}`}>
              {waistDiff?.isAboveIdeal ? 'Acima' : 'Dentro do ideal'}
            </div>
            {waistDiff && (
              <small className="d-block text-muted mt-2">
                Atual: {waistDiff.currentMeasure} cm | {waistDiff.isAboveIdeal ? '↓' : '↑'} {waistDiff.needsToChange.toFixed(1)} cm
              </small>
            )}
          </div>
        </div>
      </div>

      {/* Gordura Corporal */}
      <div className="row mb-4">
        <div className="col-12 col-md-6">
          <div className="metric-card">
            <div className="metric-header">
              <span className="metric-icon">💪</span>
              <h4>Gordura Corporal</h4>
            </div>
            <div className="metric-value">{bodyFat.toFixed(1)}%</div>
            <div className={`metric-classification badge bg-${bodyFatClass.color}`}>
              {bodyFatClass.label}
            </div>
            <div className="metric-range mt-2">
              <small className="text-muted">
                Ideal para você: {idealBodyFat.min}% - {idealBodyFat.max}%
              </small>
            </div>
            {bodyFatChange && (
              <small className={`d-block mt-2 ${bodyFatChange.isGain ? 'text-danger' : 'text-success'}`}>
                {bodyFatChange.isGain ? '↑' : '↓'} {Math.abs(bodyFatChange.percentage)}% ({Math.abs(bodyFatChange.difference).toFixed(1)}%)
              </small>
            )}
          </div>
        </div>

        <div className="col-12 col-md-6">
          <div className="metric-card">
            <div className="metric-header">
              <span className="metric-icon">📐</span>
              <h4>Medidas Ideais do Corpo</h4>
            </div>
            <div className="small">
              {/* Pescoço */}
              <div className="mb-3 pb-3 border-bottom">
                <div className="d-flex justify-content-between align-items-center">
                  <span className="fw-600">👤 Pescoço:</span>
                  <span className="text-muted">{neckDiff?.currentMeasure || 'N/A'} → {idealNeck.toFixed(1)} cm</span>
                </div>
                {neckDiff && (
                  <small className={neckDiff.isAboveIdeal ? 'text-danger' : 'text-success'}>
                    {neckDiff.isAboveIdeal ? '↓' : '↑'} {neckDiff.needsToChange.toFixed(1)} cm ({neckDiff.percentageDifference > 0 ? '+' : ''}{neckDiff.percentageDifference}%)
                  </small>
                )}
              </div>

              {/* Braço */}
              <div className="mb-3 pb-3 border-bottom">
                <div className="d-flex justify-content-between align-items-center">
                  <span className="fw-600">💪 Braço:</span>
                  <span className="text-muted">{armDiff?.currentMeasure || 'N/A'} → {idealArm.toFixed(1)} cm</span>
                </div>
                {armDiff && (
                  <small className={armDiff.isAboveIdeal ? 'text-info' : 'text-success'}>
                    {armDiff.isAboveIdeal ? '↓' : '↑'} {armDiff.needsToChange.toFixed(1)} cm ({armDiff.percentageDifference > 0 ? '+' : ''}{armDiff.percentageDifference}%)
                  </small>
                )}
              </div>

              {/* Coxa/Perna */}
              <div className="mb-3 pb-3 border-bottom">
                <div className="d-flex justify-content-between align-items-center">
                  <span className="fw-600">🦵 Coxa:</span>
                  <span className="text-muted">{thighDiff?.currentMeasure || 'N/A'} → {idealThigh.toFixed(1)} cm</span>
                </div>
                {thighDiff && (
                  <small className={thighDiff.isAboveIdeal ? 'text-warning' : 'text-success'}>
                    {thighDiff.isAboveIdeal ? '↓' : '↑'} {thighDiff.needsToChange.toFixed(1)} cm ({thighDiff.percentageDifference > 0 ? '+' : ''}{thighDiff.percentageDifference}%)
                  </small>
                )}
              </div>

              {/* Panturrilha */}
              <div className="mb-3 pb-3 border-bottom">
                <div className="d-flex justify-content-between align-items-center">
                  <span className="fw-600">🫀 Panturrilha:</span>
                  <span className="text-muted">{calfDiff?.currentMeasure || 'N/A'} → {idealCalf.toFixed(1)} cm</span>
                </div>
                {calfDiff && (
                  <small className={calfDiff.isAboveIdeal ? 'text-info' : 'text-success'}>
                    {calfDiff.isAboveIdeal ? '↓' : '↑'} {calfDiff.needsToChange.toFixed(1)} cm ({calfDiff.percentageDifference > 0 ? '+' : ''}{calfDiff.percentageDifference}%)
                  </small>
                )}
              </div>

              {/* Quadril (para mulheres) */}
              {profile.gender === "female" && idealHip && (
                <div className="pb-3">
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="fw-600">🍑 Quadril:</span>
                    <span className="text-muted">{hipDiff?.currentMeasure || 'N/A'} → {idealHip.toFixed(1)} cm</span>
                  </div>
                  {hipDiff && (
                    <small className={hipDiff.isAboveIdeal ? 'text-warning' : 'text-success'}>
                      {hipDiff.isAboveIdeal ? '↓' : '↑'} {hipDiff.needsToChange.toFixed(1)} cm ({hipDiff.percentageDifference > 0 ? '+' : ''}{hipDiff.percentageDifference}%)
                    </small>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Massa Magra */}
      <div className="row mb-4">
        <div className="col-12 col-md-6">
          <div className="metric-card">
            <div className="metric-header">
              <span className="metric-icon">🦵</span>
              <h4>Massa Magra</h4>
            </div>
            <div className="metric-value">{muscleMass.toFixed(1)} kg</div>
            <div className="metric-range mt-2">
              <small className="text-muted">
                {muscleMass} kg de músculos e ossos
              </small>
            </div>
            {bodyFatChange && (
              <small className="d-block mt-2 text-muted">
                Ganho teórico: {(lastMeasurement.weight * 0.75 - (firstMeasurement?.weight || lastMeasurement.weight) * 0.75).toFixed(1)} kg
              </small>
            )}
          </div>
        </div>

        <div className="col-12 col-md-6">
          <div className="metric-card">
            <div className="metric-header">
              <span className="metric-icon">📈</span>
              <h4>Evolução</h4>
            </div>
            <div className="small">
              {weightChange && (
                <div className="mb-3">
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="fw-600">Peso:</span>
                    <span className={weightChange.isGain ? 'text-danger' : 'text-success'}>
                      {weightChange.isGain ? '↑' : '↓'} {Math.abs(weightChange.difference).toFixed(1)} kg
                    </span>
                  </div>
                  <small className={weightChange.isGain ? 'text-danger' : 'text-success'}>
                    ({weightChange.isGain ? '+' : ''}{weightChange.percentage}%)
                  </small>
                </div>
              )}
              {bodyFatChange && (
                <div>
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="fw-600">Gordura:</span>
                    <span className={bodyFatChange.isGain ? 'text-danger' : 'text-success'}>
                      {bodyFatChange.isGain ? '↑' : '↓'} {Math.abs(bodyFatChange.difference).toFixed(1)}%
                    </span>
                  </div>
                  <small className={bodyFatChange.isGain ? 'text-danger' : 'text-success'}>
                    ({bodyFatChange.isGain ? '+' : ''}{bodyFatChange.percentage}%)
                  </small>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Metabolismo */}
      <div className="row mb-4">
        <div className="col-12 col-md-6">
          <div className="metric-card">
            <div className="metric-header">
              <span className="metric-icon">🔥</span>
              <h4>TMB</h4>
            </div>
            <div className="metric-value">{bmr}</div>
            <div className="metric-unit">kcal/dia</div>
            <small className="d-block text-muted mt-2">
              Calorias no repouso
            </small>
          </div>
        </div>

        <div className="col-12 col-md-6">
          <div className="metric-card">
            <div className="metric-header">
              <span className="metric-icon">⚡</span>
              <h4>TDEE</h4>
            </div>
            <div className="metric-value">{tdee}</div>
            <div className="metric-unit">kcal/dia</div>
            <small className="d-block text-muted mt-2">
              Gasto com seu nível: {profile.activityLevel}x
            </small>
          </div>
        </div>
      </div>

      {/* Metas e Previsões */}
      {(goals.targetWeight || goals.targetBodyFat || goals.targetWaist) && (
        <div className="goals-section mt-4 p-4 rounded bg-light">
          <h5 className="mb-3">
            <i className="bi bi-bullseye me-2"></i>
            Seu Progresso em Direção às Metas
          </h5>

          {goals.targetWeight && (
            <div className="goal-progress mb-3">
              <div className="d-flex justify-content-between mb-2">
                <span className="fw-600">Peso</span>
                <span className="text-muted">
                  {lastMeasurement.weight} kg → {goals.targetWeight} kg
                </span>
              </div>
              <div className="progress">
                <div
                  className={`progress-bar ${lastMeasurement.weight > goals.targetWeight ? 'bg-danger' : 'bg-success'}`}
                  style={{
                    width: Math.max(0, Math.min(100, ((lastMeasurement.weight - firstMeasurement?.weight || lastMeasurement.weight) / (goals.targetWeight - (firstMeasurement?.weight || lastMeasurement.weight))) * 100)) + '%'
                  }}
                ></div>
              </div>
              <div className="d-flex justify-content-between mt-2">
                <small className="text-muted">
                  Falta: {Math.abs(lastMeasurement.weight - goals.targetWeight).toFixed(1)} kg
                </small>
                {weightPrediction && weightPrediction.isRealistic && (
                  <small className="text-success fw-600">
                    ✓ Chegará em {weightPrediction.daysRemaining} dias ({weightPrediction.date})
                  </small>
                )}
                {weightPrediction && !weightPrediction.isRealistic && (
                  <small className="text-warning">⚠️ Meta distante ({'>'}1 ano)</small>
                )}
              </div>
            </div>
          )}

          {goals.targetBodyFat && (
            <div className="goal-progress mb-3">
              <div className="d-flex justify-content-between mb-2">
                <span className="fw-600">Gordura</span>
                <span className="text-muted">
                  {bodyFat.toFixed(1)}% → {goals.targetBodyFat}%
                </span>
              </div>
              <div className="progress">
                <div
                  className={`progress-bar ${bodyFat > goals.targetBodyFat ? 'bg-danger' : 'bg-success'}`}
                  style={{
                    width: Math.max(0, Math.min(100, ((bodyFat - (firstMeasurement?.bodyFat || bodyFat)) / (goals.targetBodyFat - (firstMeasurement?.bodyFat || bodyFat))) * 100)) + '%'
                  }}
                ></div>
              </div>
              <div className="d-flex justify-content-between mt-2">
                <small className="text-muted">
                  Falta: {Math.abs(bodyFat - goals.targetBodyFat).toFixed(1)}%
                </small>
                {bodyFatPrediction && bodyFatPrediction.isRealistic && (
                  <small className="text-success fw-600">
                    ✓ Chegará em {bodyFatPrediction.daysRemaining} dias ({bodyFatPrediction.date})
                  </small>
                )}
              </div>
            </div>
          )}

          {goals.targetWaist && lastMeasurement.waist && (
            <div className="goal-progress">
              <div className="d-flex justify-content-between mb-2">
                <span className="fw-600">Cintura</span>
                <span className="text-muted">
                  {lastMeasurement.waist} cm → {goals.targetWaist} cm
                </span>
              </div>
              <div className="progress">
                <div
                  className={`progress-bar ${lastMeasurement.waist > goals.targetWaist ? 'bg-danger' : 'bg-success'}`}
                  style={{
                    width: Math.max(0, Math.min(100, ((lastMeasurement.waist - (firstMeasurement?.waist || lastMeasurement.waist)) / (goals.targetWaist - (firstMeasurement?.waist || lastMeasurement.waist))) * 100)) + '%'
                  }}
                ></div>
              </div>
              <div className="d-flex justify-content-between mt-2">
                <small className="text-muted">
                  Falta: {Math.abs(lastMeasurement.waist - goals.targetWaist).toFixed(1)} cm
                </small>
                {waistPrediction && waistPrediction.isRealistic && (
                  <small className="text-success fw-600">
                    ✓ Chegará em {waistPrediction.daysRemaining} dias ({waistPrediction.date})
                  </small>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {!goals.targetWeight && !goals.targetBodyFat && !goals.targetWaist && (
        <div className="alert alert-info">
          <strong>💡 Dica:</strong> <a href="#goals">Defina suas metas</a> para ver previsões de chegada e ritmo atual!
        </div>
      )}
    </div>
  );
};

export default AdvancedMetrics;
