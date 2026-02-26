import { useState, useEffect } from 'react';
import { useUserProfile } from '../hooks/useUserProfile';
import AdvancedMetrics from '../components/dashboard/AdvancedMetrics';
import '../styles/profile.css';
import '../styles/advanced-metrics.css';

const ProfilePage = ({ measurements = [] }) => {
  const { profile, updateProfile, activityLevels } = useUserProfile();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(profile);
  const [successMessage, setSuccessMessage] = useState('');
  const [lastMeasurement, setLastMeasurement] = useState(null);
  const [firstMeasurement, setFirstMeasurement] = useState(null);

  // Atualiza measurements quando muda
  useEffect(() => {
    if (Array.isArray(measurements) && measurements.length > 0) {
      const sorted = [...measurements].sort((a, b) => new Date(a.date) - new Date(b.date));
      setFirstMeasurement(sorted[0]);
      setLastMeasurement(sorted[sorted.length - 1]);
    }
  }, [measurements]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'age' || name === 'height' ? parseInt(value) : 
              name === 'activityLevel' ? parseFloat(value) : 
              value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validações
    if (!formData.name.trim()) {
      alert('Nome é obrigatório');
      return;
    }

    if (formData.age < 13 || formData.age > 120) {
      alert('Idade deve estar entre 13 e 120 anos');
      return;
    }

    if (formData.height < 100 || formData.height > 250) {
      alert('Altura deve estar entre 100 e 250 cm');
      return;
    }

    updateProfile(formData);
    setIsEditing(false);
    setSuccessMessage('Perfil atualizado com sucesso! ✅');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleCancel = () => {
    setFormData(profile);
    setIsEditing(false);
  };

  const genderEmoji = profile.gender === 'male' ? '👨' : '👩';
  const activityEmoji = {
    1.2: '🪑',
    1.375: '🚶',
    1.55: '🏃',
    1.725: '💪',
    1.9: '🔥'
  };

  return (
    <div className="profile-container py-4">
      <div className="row justify-content-center">
        <div className="col-12 col-md-8 col-lg-6">
          
          {/* Header */}
          <div className="profile-header card mb-4 shadow-sm">
            <div className="card-body text-center py-5">
              <div className="profile-avatar mb-3">
                <span className="avatar-emoji">{genderEmoji}</span>
              </div>
              <h2 className="mb-1">{profile.name}</h2>
              <p className="text-muted mb-0">
                {profile.age} anos • {profile.height} cm
              </p>
              <div className="mt-3">
                <span className="badge bg-primary me-2">
                  {profile.gender === 'male' ? 'Homem' : 'Mulher'}
                </span>
                <span className="badge bg-info">
                  {activityEmoji[profile.activityLevel]} {profile.activityLevel}
                </span>
              </div>
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

          {/* Profile Info Cards */}
          {!isEditing && (
            <>
              <div className="profile-info-grid">
                <div className="info-card">
                  <div className="info-label">Nome</div>
                  <div className="info-value">{profile.name}</div>
                </div>

                <div className="info-card">
                  <div className="info-label">Gênero</div>
                  <div className="info-value">
                    {profile.gender === 'male' ? 'Homem' : 'Mulher'}
                  </div>
                </div>

                <div className="info-card">
                  <div className="info-label">Idade</div>
                  <div className="info-value">{profile.age} anos</div>
                </div>

                <div className="info-card">
                  <div className="info-label">Altura</div>
                  <div className="info-value">{profile.height} cm</div>
                </div>

                <div className="info-card col-12">
                  <div className="info-label">Nível de Atividade</div>
                  <div className="info-value-activity">
                    {activityEmoji[profile.activityLevel]} {activityLevels[profile.activityLevel]}
                  </div>
                </div>
              </div>

              <button
                className="btn btn-primary w-100 mt-4"
                onClick={() => setIsEditing(true)}
              >
                <i className="bi bi-pencil me-2"></i>
                Editar Perfil
              </button>
            </>
          )}

          {/* Edit Form */}
          {isEditing && (
            <form className="profile-form card p-4 shadow-sm" onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="name" className="form-label fw-600">
                  Nome
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label htmlFor="gender" className="form-label fw-600">
                  Gênero
                </label>
                <select
                  className="form-select"
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                >
                  <option value="male">Homem</option>
                  <option value="female">Mulher</option>
                </select>
              </div>

              <div className="row">
                <div className="col-6 mb-3">
                  <label htmlFor="age" className="form-label fw-600">
                    Idade (anos)
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    id="age"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                    min="13"
                    max="120"
                    required
                  />
                </div>

                <div className="col-6 mb-3">
                  <label htmlFor="height" className="form-label fw-600">
                    Altura (cm)
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    id="height"
                    name="height"
                    value={formData.height}
                    onChange={handleChange}
                    min="100"
                    max="250"
                    required
                  />
                </div>
              </div>

              <div className="mb-4">
                <label htmlFor="activityLevel" className="form-label fw-600">
                  Nível de Atividade
                </label>
                <select
                  className="form-select"
                  id="activityLevel"
                  name="activityLevel"
                  value={formData.activityLevel}
                  onChange={handleChange}
                >
                  {Object.entries(activityLevels).map(([key, value]) => (
                    <option key={key} value={key}>
                      {value}
                    </option>
                  ))}
                </select>
                <small className="d-block text-muted mt-2">
                  Isso afeta o cálculo de calorias e recomendações de exercício.
                </small>
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

          {/* Metrics Section */}
          {lastMeasurement && (
            <div className="mt-4">
              <h5 className="mb-3">
                <i className="bi bi-graph-up me-2"></i>
                Suas Métricas Avançadas
              </h5>
              <AdvancedMetrics lastMeasurement={lastMeasurement} firstMeasurement={firstMeasurement} />
            </div>
          )}

          {/* Info Box */}
          <div className="alert alert-info mt-4 mb-0">
            <strong>💡 Dica:</strong> Seus dados de perfil são usados para cálculos mais precisos de gordura corporal, massa muscular e recomendações personalizadas.
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
