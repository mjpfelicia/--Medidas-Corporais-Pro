import { useState } from 'react';
import { useGoals } from '../hooks/useGoals';
import { useUserProfile } from '../hooks/useUserProfile';
import '../styles/goals.css';

const GoalsPage = () => {
  const { goals, updateGoals } = useGoals();
  const { profile } = useUserProfile();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(goals);
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value ? parseFloat(value) : null
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validações
    if (!formData.targetWeight && !formData.targetBodyFat && !formData.targetWaist) {
      alert('Defina pelo menos uma meta');
      return;
    }

    if (formData.targetWeight && (formData.targetWeight < 30 || formData.targetWeight > 300)) {
      alert('Peso deve estar entre 30 e 300 kg');
      return;
    }

    if (formData.targetBodyFat && (formData.targetBodyFat < 5 || formData.targetBodyFat > 50)) {
      alert('Gordura deve estar entre 5% e 50%');
      return;
    }

    if (formData.targetWaist && (formData.targetWaist < 40 || formData.targetWaist > 200)) {
      alert('Cintura deve estar entre 40 e 200 cm');
      return;
    }

    updateGoals(formData);
    setIsEditing(false);
    setSuccessMessage('Metas atualizadas com sucesso! ✅');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleCancel = () => {
    setFormData(goals);
    setIsEditing(false);
  };

  const goalEmojis = {
    weight: '⚖️',
    bodyFat: '💪',
    waist: '📏',
  };

  return (
    <div className="goals-container py-4">
      <div className="row justify-content-center">
        <div className="col-12 col-md-8 col-lg-6">
          
          {/* Header */}
          <div className="goals-header card mb-4 shadow-sm">
            <div className="card-body text-center py-4">
              <div className="goals-icon mb-3">🎯</div>
              <h2 className="mb-1">Suas Metas</h2>
              <p className="text-muted mb-0">
                Defina objetivos realistas e acompanhe seu progresso
              </p>
            </div>
          </div>

          {/* Success Message */}
          {successMessage && (
            <div className="alert alert-success alert-dismissible fade show" role="alert">
              {successMessage}
              <button
                type="button"
                className="btn-close"
                onClick={() => setSuccessMessage('')}
              ></button>
            </div>
          )}

          {/* Goals Display */}
          {!isEditing && (
            <>
              <div className="goals-grid">
                {goals.targetWeight ? (
                  <div className="goal-card">
                    <div className="goal-icon">{goalEmojis.weight}</div>
                    <div className="goal-label">Meta de Peso</div>
                    <div className="goal-value">{goals.targetWeight} kg</div>
                  </div>
                ) : (
                  <div className="goal-card empty">
                    <div className="goal-icon">⚖️</div>
                    <div className="goal-label">Meta de Peso</div>
                    <div className="goal-empty">Não definida</div>
                  </div>
                )}

                {goals.targetBodyFat ? (
                  <div className="goal-card">
                    <div className="goal-icon">{goalEmojis.bodyFat}</div>
                    <div className="goal-label">Meta de Gordura</div>
                    <div className="goal-value">{goals.targetBodyFat}%</div>
                  </div>
                ) : (
                  <div className="goal-card empty">
                    <div className="goal-icon">💪</div>
                    <div className="goal-label">Meta de Gordura</div>
                    <div className="goal-empty">Não definida</div>
                  </div>
                )}

                {goals.targetWaist ? (
                  <div className="goal-card">
                    <div className="goal-icon">{goalEmojis.waist}</div>
                    <div className="goal-label">Meta de Cintura</div>
                    <div className="goal-value">{goals.targetWaist} cm</div>
                  </div>
                ) : (
                  <div className="goal-card empty">
                    <div className="goal-icon">📏</div>
                    <div className="goal-label">Meta de Cintura</div>
                    <div className="goal-empty">Não definida</div>
                  </div>
                )}
              </div>

              <button
                className="btn btn-primary w-100 mt-4"
                onClick={() => setIsEditing(true)}
              >
                <i className="bi bi-pencil me-2"></i>
                Editar Metas
              </button>
            </>
          )}

          {/* Edit Form */}
          {isEditing && (
            <form className="goals-form card p-4 shadow-sm" onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="targetWeight" className="form-label fw-600">
                  {goalEmojis.weight} Meta de Peso (kg)
                  <small className="text-muted ms-1">(opcional)</small>
                </label>
                <div className="input-group">
                  <input
                    type="number"
                    className="form-control"
                    id="targetWeight"
                    name="targetWeight"
                    value={formData.targetWeight || ''}
                    onChange={handleChange}
                    placeholder="Ex: 75"
                    step="0.5"
                    min="30"
                    max="300"
                  />
                  <span className="input-group-text">kg</span>
                </div>
              </div>

              <div className="mb-3">
                <label htmlFor="targetBodyFat" className="form-label fw-600">
                  {goalEmojis.bodyFat} Meta de Gordura Corporal
                  <small className="text-muted ms-1">(opcional)</small>
                </label>
                <div className="input-group">
                  <input
                    type="number"
                    className="form-control"
                    id="targetBodyFat"
                    name="targetBodyFat"
                    value={formData.targetBodyFat || ''}
                    onChange={handleChange}
                    placeholder="Ex: 20"
                    step="0.5"
                    min="5"
                    max="50"
                  />
                  <span className="input-group-text">%</span>
                </div>
                <small className="d-block text-muted mt-2">
                  Recomendado para {profile.gender === 'male' ? 'homens' : 'mulheres'}: 8-17% (atleta) a 25% (normal)
                </small>
              </div>

              <div className="mb-4">
                <label htmlFor="targetWaist" className="form-label fw-600">
                  {goalEmojis.waist} Meta de Cintura (cm)
                  <small className="text-muted ms-1">(opcional)</small>
                </label>
                <div className="input-group">
                  <input
                    type="number"
                    className="form-control"
                    id="targetWaist"
                    name="targetWaist"
                    value={formData.targetWaist || ''}
                    onChange={handleChange}
                    placeholder="Ex: 80"
                    step="0.5"
                    min="40"
                    max="200"
                  />
                  <span className="input-group-text">cm</span>
                </div>
              </div>

              <div className="d-flex gap-2">
                <button
                  type="submit"
                  className="btn btn-primary flex-grow-1"
                >
                  <i className="bi bi-check-circle me-2"></i>
                  Salvar
                </button>
                <button
                  type="button"
                  className="btn btn-secondary flex-grow-1"
                  onClick={handleCancel}
                >
                  <i className="bi bi-x-circle me-2"></i>
                  Cancelar
                </button>
              </div>
            </form>
          )}

          {/* Info Box */}
          <div className="alert alert-info mt-4 mb-0">
            <strong>💡 Dicas:</strong>
            <ul className="mb-0 mt-2">
              <li>Defina metas realistas e alcançáveis</li>
              <li>Gordura corporal é mais importante que peso</li>
              <li>Cintura/altura reflete bem a saúde cardiovascular</li>
              <li>Atualize suas métricas regularmente</li>
            </ul>
          </div>

        </div>
      </div>
    </div>
  );
};

export default GoalsPage;
