import { useState, useEffect } from 'react';
import type { KanbanCard, KanbanColumn } from '../../types';

interface CardModalProps {
  isOpen: boolean;
  card?: KanbanCard | null;
  columnId?: string | null;
  columns: KanbanColumn[];
  onClose: () => void;
  onSave: (data: Omit<KanbanCard, 'id' | 'created_at' | 'updated_at'>) => void;
}

const CATEGORIES = [
  'Conteúdo',
  'Design',
  'Desenvolvimento',
  'Marketing',
  'Estratégia',
];

export default function CardModal({
  isOpen,
  card,
  columnId,
  columns,
  onClose,
  onSave,
}: CardModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [assignee, setAssignee] = useState('');
  const [column, setColumn] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      if (card) {
        setTitle(card.title);
        setDescription(card.description || '');
        setCategory(card.category_tag || '');
        setDueDate(card.due_date || '');
        setAssignee(card.assignee || '');
        setColumn(card.column_id);
      } else {
        setTitle('');
        setDescription('');
        setCategory('');
        setDueDate('');
        setAssignee('');
        setColumn(columnId || '');
      }
      setError('');
    }
  }, [isOpen, card, columnId]);

  const handleSubmit = () => {
    if (!title.trim()) {
      setError('Título é obrigatório');
      return;
    }

    if (!column) {
      setError('Coluna é obrigatória');
      return;
    }

    onSave({
      title: title.trim(),
      description: description.trim() || undefined,
      category_tag: category || undefined,
      due_date: dueDate || undefined,
      assignee: assignee.trim() || undefined,
      column_id: column,
      client_id: card?.client_id || '',
      order_index: card?.order_index || 0,
      archived_at: card?.archived_at,
    });
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '20px',
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: 'white',
          borderRadius: '12px',
          padding: '32px',
          maxWidth: '500px',
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2
            style={{
              margin: 0,
              fontSize: '20px',
              fontWeight: 700,
              color: '#111',
            }}
          >
            {card ? 'Editar Card' : 'Novo Card'}
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '20px',
              color: '#999',
              cursor: 'pointer',
              padding: '0',
              width: '24px',
              height: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            ✕
          </button>
        </div>

        {/* Error */}
        {error && (
          <div
            style={{
              background: '#fee2e2',
              border: '1px solid #fecaca',
              borderRadius: '8px',
              padding: '12px',
              marginBottom: '16px',
              color: '#dc2626',
              fontSize: '14px',
            }}
          >
            {error}
          </div>
        )}

        {/* Form */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Title */}
          <div>
            <label
              style={{
                display: 'block',
                marginBottom: '6px',
                fontSize: '13px',
                fontWeight: 600,
                color: '#333',
              }}
            >
              Título *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Escrever artigo sobre SEO"
              style={{
                width: '100%',
                padding: '10px 12px',
                fontSize: '14px',
                border: '1px solid #E5E7EB',
                borderRadius: '8px',
                fontFamily: 'inherit',
                boxSizing: 'border-box',
              }}
            />
          </div>

          {/* Description */}
          <div>
            <label
              style={{
                display: 'block',
                marginBottom: '6px',
                fontSize: '13px',
                fontWeight: 600,
                color: '#333',
              }}
            >
              Descrição
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detalhes sobre a tarefa..."
              rows={3}
              style={{
                width: '100%',
                padding: '10px 12px',
                fontSize: '14px',
                border: '1px solid #E5E7EB',
                borderRadius: '8px',
                fontFamily: 'inherit',
                boxSizing: 'border-box',
                resize: 'vertical',
              }}
            />
          </div>

          {/* Column */}
          <div>
            <label
              style={{
                display: 'block',
                marginBottom: '6px',
                fontSize: '13px',
                fontWeight: 600,
                color: '#333',
              }}
            >
              Coluna *
            </label>
            <select
              value={column}
              onChange={(e) => setColumn(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px',
                fontSize: '14px',
                border: '1px solid #E5E7EB',
                borderRadius: '8px',
                fontFamily: 'inherit',
                boxSizing: 'border-box',
              }}
            >
              <option value="">-- Selecione uma coluna --</option>
              {columns.map((col) => (
                <option key={col.id} value={col.id}>
                  {col.name}
                </option>
              ))}
            </select>
          </div>

          {/* Category */}
          <div>
            <label
              style={{
                display: 'block',
                marginBottom: '6px',
                fontSize: '13px',
                fontWeight: 600,
                color: '#333',
              }}
            >
              Categoria
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px',
                fontSize: '14px',
                border: '1px solid #E5E7EB',
                borderRadius: '8px',
                fontFamily: 'inherit',
                boxSizing: 'border-box',
              }}
            >
              <option value="">-- Nenhuma --</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Due Date */}
          <div>
            <label
              style={{
                display: 'block',
                marginBottom: '6px',
                fontSize: '13px',
                fontWeight: 600,
                color: '#333',
              }}
            >
              Data de Entrega
            </label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px',
                fontSize: '14px',
                border: '1px solid #E5E7EB',
                borderRadius: '8px',
                fontFamily: 'inherit',
                boxSizing: 'border-box',
              }}
            />
          </div>

          {/* Assignee */}
          <div>
            <label
              style={{
                display: 'block',
                marginBottom: '6px',
                fontSize: '13px',
                fontWeight: 600,
                color: '#333',
              }}
            >
              Responsável
            </label>
            <input
              type="text"
              value={assignee}
              onChange={(e) => setAssignee(e.target.value)}
              placeholder="Ex: João Silva"
              style={{
                width: '100%',
                padding: '10px 12px',
                fontSize: '14px',
                border: '1px solid #E5E7EB',
                borderRadius: '8px',
                fontFamily: 'inherit',
                boxSizing: 'border-box',
              }}
            />
          </div>
        </div>

        {/* Actions */}
        <div
          style={{
            display: 'flex',
            gap: '12px',
            marginTop: '24px',
            paddingTop: '24px',
            borderTop: '1px solid #E5E7EB',
          }}
        >
          <button
            onClick={onClose}
            style={{
              flex: 1,
              padding: '12px 16px',
              background: 'none',
              border: '1px solid #E5E7EB',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: 500,
              color: '#666',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = '#f3f4f6')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'none')}
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            style={{
              flex: 1,
              padding: '12px 16px',
              background: '#4f46e5',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: 600,
              color: 'white',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = '#4338ca')}
            onMouseLeave={(e) => (e.currentTarget.style.background = '#4f46e5')}
          >
            {card ? 'Salvar alterações' : 'Criar card'}
          </button>
        </div>
      </div>
    </div>
  );
}
