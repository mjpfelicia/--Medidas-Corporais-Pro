import { useState } from 'react';
import { useUserProfile } from '../hooks/useUserProfile';
import {
  calculateBMI,
  calculatenavyBodyFat,
  estimateBodyFatFromBMI,
  calculateMuscleMass,
  calculateBMR,
  calculateTDEE,
} from '../utils/fitnessCalculations';

const Measurements = ({ onAdd }) => {
  const { profile } = useUserProfile();
  const [form, setForm] = useState({
    date: new Date().toISOString().split('T')[0],
    weight: '',
    height: profile.height || '',
    waist: '',
    neck: '',
    hip: profile.gender === 'female' ? '' : undefined,
    arm: '',
    thigh: '',
    calf: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const submit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const weight = parseFloat(form.weight);
    const heightCm = parseFloat(form.height);
    const waistCm = form.waist ? parseFloat(form.waist) : null;
    const neckCm = form.neck ? parseFloat(form.neck) : null;
    const hipCm = form.hip ? parseFloat(form.hip) : null;
    const armCm = form.arm ? parseFloat(form.arm) : null;
    const thighCm = form.thigh ? parseFloat(form.thigh) : null;
    const calfCm = form.calf ? parseFloat(form.calf) : null;

    // Validações
    if (!form.date || isNaN(weight) || weight <= 0 || weight > 300) {
      setError('Peso deve estar entre 0 e 300 kg');
      return;
    }

    if (isNaN(heightCm) || heightCm <= 0 || heightCm > 250) {
      setError('Altura deve estar entre 0 e 250 cm');
      return;
    }

    if (form.waist && (isNaN(waistCm) || waistCm <= 0)) {
      setError('Cintura inválida');
      return;
    }

    if (form.neck && (isNaN(neckCm) || neckCm <= 0)) {
      setError('Pescoço inválido');
      return;
    }

    if (profile.gender === 'female' && form.hip && (isNaN(hipCm) || hipCm <= 0)) {
      setError('Quadril inválido');
      return;
    }

    // Cálculos
    const imc = calculateBMI(weight, heightCm);

    // Gordura corporal: tentar Navy (mais preciso), senão usar IMC
    let bodyFat = null;
    if (neckCm && waistCm) {
      if (profile.gender === 'female' && hipCm) {
        bodyFat = calculatenavyBodyFat(profile.gender, waistCm, neckCm, heightCm, hipCm);
      } else if (profile.gender === 'male') {
        bodyFat = calculatenavyBodyFat(profile.gender, waistCm, neckCm, heightCm);
      }
    }

    // Se não conseguiu calcular Navy, usa IMC
    if (!bodyFat) {
      bodyFat = estimateBodyFatFromBMI(imc, profile.gender, profile.age);
    }

    // Massa muscular e TMB
    const muscleMass = calculateMuscleMass(weight, bodyFat);
    const bmr = calculateBMR(profile.gender, weight, heightCm, profile.age);
    const tdee = calculateTDEE(profile.gender, weight, heightCm, profile.age, profile.activityLevel);

    // Chamar onAdd com todos os dados
    onAdd({
      date: form.date,
      weight,
      height: heightCm,
      waist: waistCm,
      neck: neckCm,
      hip: hipCm,
      arm: armCm,
      thigh: thighCm,
      calf: calfCm,
      bodyFat,
      muscleMass,
      bmi: parseFloat(imc.toFixed(1)),
      bmr,
      tdee,
    });

    setSuccess('Medição adicionada com sucesso! ✅');
    const today = new Date().toISOString().split('T')[0];
    setForm({
      date: today,
      weight: '',
      height: profile.height || '',
      waist: '',
      neck: '',
      hip: profile.gender === 'female' ? '' : undefined,
      arm: '',
      thigh: '',
      calf: '',
    });

    setTimeout(() => setSuccess(''), 3000);
  };

  const showHipField = profile.gender === 'female';

  return (
    <div className="row justify-content-center">
      <div className="col-12 col-md-8 col-lg-6">
        <form className="card p-4 shadow-sm" onSubmit={submit}>
          <h5 className="mb-4">
            <i className="bi bi-plus-circle me-2"></i>
            Nova Medição
          </h5>

          {error && (
            <div className="alert alert-danger alert-dismissible fade show" role="alert">
              {error}
              <button
                type="button"
                className="btn-close"
                onClick={() => setError('')}
              ></button>
            </div>
          )}

          {success && (
            <div className="alert alert-success alert-dismissible fade show" role="alert">
              {success}
              <button
                type="button"
                className="btn-close"
                onClick={() => setSuccess('')}
              ></button>
            </div>
          )}

          <div className="mb-3">
            <label htmlFor="date" className="form-label fw-600">Data</label>
            <input
              type="date"
              name="date"
              id="date"
              className="form-control"
              value={form.date}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="weight" className="form-label fw-600">Peso (kg) *</label>
            <input
              type="number"
              name="weight"
              id="weight"
              className="form-control"
              placeholder="Ex: 75.5"
              value={form.weight}
              onChange={handleChange}
              step="0.1"
              min="0"
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="height" className="form-label fw-600">Altura (cm) *</label>
            <input
              type="number"
              name="height"
              id="height"
              className="form-control"
              placeholder="Ex: 175"
              value={form.height}
              onChange={handleChange}
              step="0.1"
              min="0"
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="waist" className="form-label fw-600">
              Cintura (cm)
              <small className="text-muted ms-1">(opcional, mas recomendado)</small>
            </label>
            <input
              type="number"
              name="waist"
              id="waist"
              className="form-control"
              placeholder="Ex: 85"
              value={form.waist}
              onChange={handleChange}
              step="0.1"
              min="0"
            />
          </div>

          <div className="mb-3">
            <label htmlFor="neck" className="form-label fw-600">
              Pescoço (cm)
              <small className="text-muted ms-1">(opcional, para cálculo mais preciso)</small>
            </label>
            <input
              type="number"
              name="neck"
              id="neck"
              className="form-control"
              placeholder="Ex: 38"
              value={form.neck}
              onChange={handleChange}
              step="0.1"
              min="0"
            />
          </div>

          {showHipField && (
            <div className="mb-3">
              <label htmlFor="hip" className="form-label fw-600">
                Quadril (cm)
                <small className="text-muted ms-1">(opcional, para cálculo mais preciso)</small>
              </label>
              <input
                type="number"
                name="hip"
                id="hip"
                className="form-control"
                placeholder="Ex: 95"
                value={form.hip}
                onChange={handleChange}
                step="0.1"
                min="0"
              />
            </div>
          )}

          <div className="mb-3">
            <label htmlFor="arm" className="form-label fw-600">
              Braço (cm)
              <small className="text-muted ms-1">(opcional - bíceps)</small>
            </label>
            <input
              type="number"
              name="arm"
              id="arm"
              className="form-control"
              placeholder="Ex: 32"
              value={form.arm}
              onChange={handleChange}
              step="0.1"
              min="0"
            />
          </div>

          <div className="mb-3">
            <label htmlFor="thigh" className="form-label fw-600">
              Coxa (cm)
              <small className="text-muted ms-1">(opcional - perna)</small>
            </label>
            <input
              type="number"
              name="thigh"
              id="thigh"
              className="form-control"
              placeholder="Ex: 55"
              value={form.thigh}
              onChange={handleChange}
              step="0.1"
              min="0"
            />
          </div>

          <div className="mb-3">
            <label htmlFor="calf" className="form-label fw-600">
              Panturrilha (cm)
              <small className="text-muted ms-1">(opcional)</small>
            </label>
            <input
              type="number"
              name="calf"
              id="calf"
              className="form-control"
              placeholder="Ex: 38"
              value={form.calf}
              onChange={handleChange}
              step="0.1"
              min="0"
            />
          </div>

          <div className="alert alert-info small mb-3">
            <strong>💡 Dica:</strong> Para cálculos mais precisos de gordura corporal, preencha também cintura, pescoço {showHipField && 'e quadril'}. As medidas de braço, coxa e panturrilha são opcionais para comparação com o corpo ideal.
          </div>

          <button className="btn btn-primary w-100" type="submit">
            <i className="bi bi-plus-circle me-2"></i>
            Adicionar Medição
          </button>
        </form>
      </div>
    </div>
  );
};

export default Measurements;