import { useState, useEffect } from 'react';
import { DragDropContext } from '@hello-pangea/dnd';
import { supabase } from '../../lib/supabase';
import type { KanbanColumn as IKanbanColumn, KanbanCard } from '../../types';
import type { Client } from '../../types/supabase';
import KanbanColumn from '../dashboard/KanbanColumn';
import CardModal from './CardModal';

export default function AdminFlowPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [columns, setColumns] = useState<IKanbanColumn[]>([]);
  const [cards, setCards] = useState<KanbanCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCardModalOpen, setIsCardModalOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState<KanbanCard | null>(null);
  const [selectedColumnForNew, setSelectedColumnForNew] = useState<string | null>(null);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await supabase
          .from('clients')
          .select('*')
          .eq('status', 'active')
          .order('name', { ascending: true });

        if (response.error) throw response.error;

        const clientList = response.data || [];
        setClients(clientList);
        if (clientList.length > 0) {
          setSelectedClientId(clientList[0].id);
        }
      } catch (err) {
        console.error('Error fetching clients:', err);
        setError('Erro ao carregar clientes');
      }
    };

    fetchClients();
  }, []);

  useEffect(() => {
    if (!selectedClientId) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        const [columnsResponse, cardsResponse] = await Promise.all([
          supabase.from('kanban_columns').select('*').order('order_index', { ascending: true }),
          supabase
            .from('kanban_cards')
            .select('*')
            .eq('client_id', selectedClientId)
            .is('archived_at', null)
            .order('order_index', { ascending: true }),
        ]);

        if (columnsResponse.error) throw columnsResponse.error;
        if (cardsResponse.error) throw cardsResponse.error;

        setColumns(columnsResponse.data || []);
        setCards(cardsResponse.data || []);
      } catch (err) {
        console.error('Error fetching kanban data:', err);
        setError('Erro ao carregar Flow');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedClientId]);

  const handleDragEnd = async (result: any) => {
    const { source, destination, draggableId } = result;

    if (!destination) return;

    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    try {
      const newColumnId = destination.droppableId;
      const newOrderIndex = destination.index;

      const response = await supabase
        .from('kanban_cards')
        .update({
          column_id: newColumnId,
          order_index: newOrderIndex,
        })
        .eq('id', draggableId);

      if (response.error) throw response.error;

      setCards((prev) =>
        prev.map((c) =>
          c.id === draggableId
            ? { ...c, column_id: newColumnId, order_index: newOrderIndex }
            : c
        )
      );
    } catch (err) {
      console.error('Error updating card:', err);
    }
  };

  const handleAddCard = (columnId: string) => {
    setSelectedCard(null);
    setSelectedColumnForNew(columnId);
    setIsCardModalOpen(true);
  };

  const handleEditCard = (card: KanbanCard) => {
    setSelectedCard(card);
    setSelectedColumnForNew(null);
    setIsCardModalOpen(true);
  };

  const handleArchiveCard = async (cardId: string) => {
    if (!confirm('Tem certeza que deseja deletar este card?')) return;

    try {
      const response = await supabase
        .from('kanban_cards')
        .update({ archived_at: new Date().toISOString() })
        .eq('id', cardId);

      if (response.error) throw response.error;

      setCards((prev) => prev.filter((c) => c.id !== cardId));
    } catch (err) {
      console.error('Error archiving card:', err);
    }
  };

  const handleSaveCard = async (data: Omit<KanbanCard, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      if (selectedCard) {
        const response = await supabase
          .from('kanban_cards')
          .update({ ...data, updated_at: new Date().toISOString() })
          .eq('id', selectedCard.id);

        if (response.error) throw response.error;

        setCards((prev) =>
          prev.map((c) =>
            c.id === selectedCard.id
              ? { ...c, ...data, updated_at: new Date().toISOString() }
              : c
          )
        );
      } else {
        const response = await supabase
          .from('kanban_cards')
          .insert([
            {
              ...data,
              client_id: selectedClientId,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            },
          ])
          .select();

        if (response.error) throw response.error;

        if (response.data && response.data.length > 0) {
          setCards((prev) => [...prev, response.data[0]]);
        }
      }

      setIsCardModalOpen(false);
    } catch (err) {
      console.error('Error saving card:', err);
    }
  };

  if (loading && cards.length === 0) {
    return (
      <div
        style={{
          width: '100%',
          minHeight: '400px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#999',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              border: '3px solid rgba(0, 0, 0, 0.1)',
              borderTop: '3px solid #666',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 16px',
            }}
          ></div>
          <p>Carregando Flow...</p>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '24px', color: '#dc2626' }}>
        <i className="fas fa-exclamation-circle" style={{ marginRight: '8px' }}></i>
        {error}
      </div>
    );
  }

  return (
    <div style={{ width: '100%' }}>
      {/* Client Selector */}
      <div style={{ marginBottom: '24px', paddingBottom: '16px', borderBottom: '1px solid #E5E7EB' }}>
        <label
          style={{
            display: 'block',
            marginBottom: '8px',
            fontSize: '13px',
            fontWeight: 600,
            color: '#666',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          }}
        >
          Selecionar Cliente
        </label>
        <select
          value={selectedClientId || ''}
          onChange={(e) => setSelectedClientId(e.target.value || null)}
          style={{
            width: '100%',
            maxWidth: '300px',
            padding: '10px 12px',
            fontSize: '14px',
            border: '1px solid #E5E7EB',
            borderRadius: '8px',
            background: 'white',
            cursor: 'pointer',
            fontFamily: 'inherit',
          }}
        >
          <option value="">-- Escolha um cliente --</option>
          {clients.map((client) => (
            <option key={client.id} value={client.id}>
              {client.name} {client.plan?.tier && `(${client.plan.tier})`}
            </option>
          ))}
        </select>
      </div>

      {/* Kanban Board */}
      {selectedClientId ? (
        <DragDropContext onDragEnd={handleDragEnd}>
          <div
            style={{
              display: 'flex',
              gap: '16px',
              overflowX: 'auto',
              paddingBottom: '16px',
              paddingRight: '8px',
            }}
          >
            {columns.map((column) => {
              const columnCards = cards
                .filter((card) => card.column_id === column.id && !card.archived_at)
                .sort((a, b) => a.order_index - b.order_index);

              return (
                <KanbanColumn
                  key={column.id}
                  column={column}
                  cards={columnCards}
                  onAddCard={handleAddCard}
                  onEditCard={handleEditCard}
                  onArchiveCard={handleArchiveCard}
                  isAdmin={true}
                  isDarkMode={false}
                />
              );
            })}
          </div>
        </DragDropContext>
      ) : (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '300px',
            color: '#ccc',
            fontSize: '16px',
          }}
        >
          Selecione um cliente para ver o Flow
        </div>
      )}

      {/* Card Modal */}
      <CardModal
        isOpen={isCardModalOpen}
        card={selectedCard}
        columnId={selectedColumnForNew}
        columns={columns}
        onClose={() => {
          setIsCardModalOpen(false);
          setSelectedCard(null);
          setSelectedColumnForNew(null);
        }}
        onSave={handleSaveCard}
      />
    </div>
  );
}
