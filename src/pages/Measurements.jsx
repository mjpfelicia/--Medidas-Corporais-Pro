import { useState } from 'react';

const Measurements = ({ onAdd }) => {
  const [form, setForm] = useState({ date: '', weight: '' });

  const submit = (e) => {
    e.preventDefault();
    onAdd(form);
    setForm({ date: '', weight: '' });
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

      <button className="btn btn-primary">Adicionar</button>
    </form>
  );
};

export default Measurements;
