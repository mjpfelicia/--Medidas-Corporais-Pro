import { useState } from 'react';

const Measurements = ({ onAdd }) => {
  const [form, setForm] = useState({ date: '', weight: '', height: '', waist: '' });

  const submit = (e) => {
    e.preventDefault();
    // Calcular IMC (Gordura Corporal) e Massa Muscular
    const weight = parseFloat(form.weight);
    const height = parseFloat(form.height) / 100; // altura em metros
    const waist = parseFloat(form.waist);
    let bodyFat = '';
    let muscleMass = '';
    if (weight && height) {
      // Fórmula IMC: peso / altura^2
      const imc = weight / (height * height);
      // Estimativa simples de gordura corporal (não precisa ser precisa)
      // Exemplo: gordura corporal (%) = (1.20 × IMC) + (0.23 × idade) − (10.8 × sexo) − 5.4
      // Aqui, sem idade/sexo, só para exibir algo:
      bodyFat = (1.20 * imc - 5.4).toFixed(1);
      // Massa muscular estimada (simplificada): peso - (peso * gordura/100)
      muscleMass = (weight - (weight * (bodyFat / 100))).toFixed(1);
    }
    onAdd({ ...form, bodyFat, muscleMass });
    setForm({ date: '', weight: '', height: '', waist: '' });
  };

  return (
    <form className="card p-4 shadow-sm" onSubmit={submit}>
      <input
        type="date"
        className="form-control mb-3"
        value={form.date}
        onChange={e => setForm({ ...form, date: e.target.value })}
      />

      <input
        type="number"
        className="form-control mb-3"
        placeholder="Peso"
        value={form.weight}
        onChange={e => setForm({ ...form, weight: e.target.value })}
      />

      <input
        type="number"
        className="form-control mb-3"
        placeholder="Altura (cm)"
        value={form.height}
        onChange={e => setForm({ ...form, height: e.target.value })}
      />

      <input
        type="number"
        className="form-control mb-3"
        placeholder="Cintura (cm)"
        value={form.waist}
        onChange={e => setForm({ ...form, waist: e.target.value })}
      />

      <button className="btn btn-primary">Adicionar</button>
    </form>
  );
};

export default Measurements;
