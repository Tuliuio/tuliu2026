import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';
import type { KanbanColumn as IKanbanColumn, KanbanCard } from '../../types';
import KanbanColumn from './KanbanColumn';
import CardDetailModal from './CardDetailModal';
import FlowGate from './FlowGate';

export default function FlowPage() {
  const { client } = useAuth();
  const [columns, setColumns] = useState<IKanbanColumn[]>([]);
  const [cards, setCards] = useState<KanbanCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCard, setSelectedCard] = useState<KanbanCard | null>(null);

  const isEnterprise = client?.plan?.tier?.toLowerCase() === 'enterprise';

  useEffect(() => {
    if (!client || !isEnterprise) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        console.log('[FlowPage] Fetching kanban data for client:', client.id);
        const [columnsResponse, cardsResponse] = await Promise.all([
          supabase.from('kanban_columns').select('*').order('order_index', { ascending: true }),
          supabase
            .from('kanban_cards')
            .select('*')
            .eq('client_id', client.id)
            .is('archived_at', null),
        ]);

        console.log('[FlowPage] Columns response:', columnsResponse);
        console.log('[FlowPage] Cards response:', cardsResponse);

        if (columnsResponse.error) {
          console.error('[FlowPage] Columns error:', columnsResponse.error);
          throw columnsResponse.error;
        }
        if (cardsResponse.error) {
          console.error('[FlowPage] Cards error:', cardsResponse.error);
          throw cardsResponse.error;
        }

        console.log('[FlowPage] Data loaded successfully');
        setColumns(columnsResponse.data || []);
        setCards(cardsResponse.data || []);
      } catch (err) {
        console.error('[FlowPage] Error fetching kanban data:', err);
        setError('Erro ao carregar Flow');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [client, isEnterprise]);

  const handleApproveCard = async (cardId: string) => {
    try {
      const card = cards.find((c) => c.id === cardId);
      if (!card) return;

      const currentColumnIndex = columns.findIndex((col) => col.id === card.column_id);
      if (currentColumnIndex === -1 || currentColumnIndex === columns.length - 1) return;

      const nextColumn = columns[currentColumnIndex + 1];
      const response = await supabase
        .from('kanban_cards')
        .update({ column_id: nextColumn.id })
        .eq('id', cardId);

      if (response.error) throw response.error;

      setCards((prev) =>
        prev.map((c) => (c.id === cardId ? { ...c, column_id: nextColumn.id } : c))
      );
    } catch (err) {
      console.error('Error approving card:', err);
    }
  };

  const handleReturnCard = async (cardId: string) => {
    try {
      const card = cards.find((c) => c.id === cardId);
      if (!card) return;

      const currentColumnIndex = columns.findIndex((col) => col.id === card.column_id);
      if (currentColumnIndex === -1 || currentColumnIndex === 0) return;

      const prevColumn = columns[currentColumnIndex - 1];
      const response = await supabase
        .from('kanban_cards')
        .update({ column_id: prevColumn.id })
        .eq('id', cardId);

      if (response.error) throw response.error;

      setCards((prev) =>
        prev.map((c) => (c.id === cardId ? { ...c, column_id: prevColumn.id } : c))
      );
    } catch (err) {
      console.error('Error returning card:', err);
    }
  };

  if (!isEnterprise) {
    return <FlowGate />;
  }

  if (loading) {
    return (
      <div
        style={{
          width: '100%',
          minHeight: '100vh',
          background: '#1a1a1a',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'rgba(255, 255, 255, 0.5)',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              border: '3px solid rgba(255, 255, 255, 0.08)',
              borderTop: '3px solid rgba(255, 255, 255, 0.3)',
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
      <div
        style={{
          width: '100%',
          minHeight: '100vh',
          background: '#1a1a1a',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#ef4444',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <i className="fas fa-exclamation-circle" style={{ fontSize: '48px', marginBottom: '16px', display: 'block' }}></i>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        width: '100%',
        minHeight: '100vh',
        background: '#1a1a1a',
        padding: '24px',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h1
          style={{
            margin: '0 0 8px 0',
            fontSize: '28px',
            fontWeight: 800,
            color: 'rgba(255, 255, 255, 0.87)',
          }}
        >
          <i className="fas fa-columns" style={{ marginRight: '12px', color: '#a855f7' }}></i>
          Flow - Acompanhamento de Projetos
        </h1>
        <p
          style={{
            margin: 0,
            fontSize: '14px',
            color: 'rgba(255, 255, 255, 0.45)',
          }}
        >
          Visualize o progresso de suas tarefas e aprove ou retorne itens conforme necessário.
        </p>
      </div>

      {/* Kanban Board */}
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
              onApprove={handleApproveCard}
              onReturn={handleReturnCard}
              onOpenCard={setSelectedCard}
              isAdmin={false}
              isDarkMode={true}
            />
          );
        })}
      </div>

      {/* Empty State */}
      {columns.length === 0 && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '300px',
            color: 'rgba(255, 255, 255, 0.3)',
            fontSize: '16px',
            textAlign: 'center',
          }}
        >
          <div>
            <i className="fas fa-inbox" style={{ fontSize: '48px', marginBottom: '16px', display: 'block' }}></i>
            <p>Nenhuma coluna disponível</p>
          </div>
        </div>
      )}

      {/* Card Detail Modal */}
      {selectedCard && (
        <CardDetailModal
          card={selectedCard}
          columns={columns}
          isAdmin={false}
          onClose={() => setSelectedCard(null)}
          onApprove={() => {
            handleApproveCard(selectedCard.id);
            setSelectedCard(null);
          }}
          onReturn={() => {
            handleReturnCard(selectedCard.id);
            setSelectedCard(null);
          }}
        />
      )}

      {/* Scrollbar Hint */}
      {columns.length > 0 && (
        <p
          style={{
            margin: '16px 0 0 0',
            fontSize: '12px',
            color: 'rgba(255, 255, 255, 0.25)',
            textAlign: 'center',
          }}
        >
          <i className="fas fa-arrow-right" style={{ marginRight: '4px' }}></i>
          Deslize horizontalmente para ver mais colunas
        </p>
      )}

      {/* Responsive Styles */}
      <style>{`
        @media (max-width: 768px) {
          div[style*="display: flex"][style*="gap: 16px"] {
            flex-direction: column !important;
          }

          div[style*="flex: 0 0 320px"] {
            flex: 1 !important;
          }
        }
      `}</style>
    </div>
  );
}
