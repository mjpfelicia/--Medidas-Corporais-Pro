import { useState } from 'react';

const Measurements = ({ onAdd }) => {
  const [form, setForm] = useState({ date: '', weight: '', height: '', waist: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const submit = (e) => {
    e.preventDefault();

    const weight = parseFloat(form.weight);
    const heightCm = parseFloat(form.height);
    const waist = parseFloat(form.waist);

    // Validação básica
    if (!form.date || isNaN(weight) || weight <= 0 || isNaN(heightCm) || heightCm <= 0) {
      alert('Preencha todos os campos obrigatórios com valores válidos (data, peso, altura).');
      return;
    }

    const heightM = heightCm / 100;
    const imc = weight / (heightM * heightM);

    // Estimativas simples (apenas para demonstração)
    // Fórmula de gordura corporal adaptada (sem idade/sexo) - use com cautela
    const estimatedBodyFat = (1.20 * imc + 0.23 * 30 - 10.8 * 1 - 5.4); // exemplo fixo com idade 30 e sexo masculino (1)
    // Se não tiver idade/sexo, talvez algo como:
    // const estimatedBodyFat = (1.20 * imc - 5.4); // como estava

    // Massa muscular estimada (muito simplificada)
    const estimatedMuscleMass = weight * 0.45; // exemplo aleatório

    // Arredondar para 1 casa decimal, mas manter como número
    const bodyFat = Number(estimatedBodyFat.toFixed(1));
    const muscleMass = Number(estimatedMuscleMass.toFixed(1));

    // Chamar onAdd com os dados (incluindo a cintura, se existir)
    onAdd({
      date: form.date,
      weight,
      height: heightCm,
      waist: isNaN(waist) ? null : waist,
      bodyFat,
      muscleMass,
    });

    // Reset (pode manter a data atual como sugestão)
    const today = new Date().toISOString().split('T')[0];
    setForm({ date: today, weight: '', height: '', waist: '' });
  };

  return (
    <form className="card p-4 shadow-sm" onSubmit={submit}>
      <input
        type="date"
        name="date"
        className="form-control mb-3"
        value={form.date}
        onChange={handleChange}
        required
      />

      <input
        type="number"
        name="weight"
        className="form-control mb-3"
        placeholder="Peso (kg)"
        value={form.weight}
        onChange={handleChange}
        step="0.1"
        min="0"
        required
      />

      <input
        type="number"
        name="height"
        className="form-control mb-3"
        placeholder="Altura (cm)"
        value={form.height}
        onChange={handleChange}
        step="0.1"
        min="0"
        required
      />

      <input
        type="number"
        name="waist"
        className="form-control mb-3"
        placeholder="Cintura (cm) (opcional)"
        value={form.waist}
        onChange={handleChange}
        step="0.1"
        min="0"
      />

      <button className="btn btn-primary" type="submit">Adicionar</button>
    </form>
  );
};

export default Measurements;