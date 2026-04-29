import { Droppable, Draggable } from '@hello-pangea/dnd';
import type { KanbanCard, KanbanColumn as IKanbanColumn } from '../../types';
import KanbanCardItem from './KanbanCardItem';

interface KanbanColumnProps {
  column: IKanbanColumn;
  cards: KanbanCard[];
  onApprove?: (cardId: string) => void;
  onReturn?: (cardId: string) => void;
  onAddCard?: (columnId: string) => void;
  onEditCard?: (card: KanbanCard) => void;
  onArchiveCard?: (cardId: string) => void;
  isAdmin?: boolean;
  isDarkMode?: boolean;
}

export default function KanbanColumn({
  column,
  cards,
  onApprove,
  onReturn,
  onAddCard,
  onEditCard,
  onArchiveCard,
  isAdmin,
  isDarkMode,
}: KanbanColumnProps) {
  const bgColor = isDarkMode ? '#2a2a2a' : '#f9fafb';
  const borderColor = isDarkMode ? 'rgba(255, 255, 255, 0.08)' : '#E5E7EB';
  const textColor = isDarkMode ? 'rgba(255, 255, 255, 0.87)' : '#111111';

  // Render without Droppable for read-only mode (when not admin)
  if (!isAdmin) {
    return (
      <div
        style={{
          flex: '0 0 320px',
          display: 'flex',
          flexDirection: 'column',
          background: bgColor,
          borderRadius: '12px',
          border: `1px solid ${borderColor}`,
          overflow: 'hidden',
        }}
      >
        {/* Column Header */}
        <div
          style={{
            padding: '16px',
            borderBottom: `1px solid ${borderColor}`,
            background: isDarkMode
              ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(168, 85, 247, 0.05) 100%)'
              : 'linear-gradient(135deg, rgba(79, 70, 229, 0.05) 0%, rgba(124, 58, 237, 0.05) 100%)',
          }}
        >
          <div>
            <h3
              style={{
                margin: 0,
                fontSize: '14px',
                fontWeight: 700,
                color: textColor,
                letterSpacing: '0.5px',
                textTransform: 'uppercase',
              }}
            >
              {column.name}
            </h3>
            <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: isDarkMode ? 'rgba(255, 255, 255, 0.45)' : '#999' }}>
              {cards.length} {cards.length === 1 ? 'card' : 'cards'}
            </p>
          </div>
        </div>

        {/* Cards Area (no Droppable) */}
        <div
          style={{
            flex: 1,
            padding: '12px',
            overflowY: 'auto',
            minHeight: '200px',
          }}
        >
          {cards.length === 0 ? (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '200px',
                color: isDarkMode ? 'rgba(255, 255, 255, 0.3)' : '#ccc',
                fontSize: '13px',
                fontStyle: 'italic',
              }}
            >
              <i className="fas fa-inbox" style={{ marginRight: '8px' }}></i>
              Vazio
            </div>
          ) : (
            cards
              .sort((a, b) => a.order_index - b.order_index)
              .map((card) => (
                <KanbanCardItem
                  key={card.id}
                  card={card}
                  onApprove={() => onApprove?.(card.id)}
                  onReturn={() => onReturn?.(card.id)}
                  isAdmin={false}
                  isDarkMode={isDarkMode}
                />
              ))
          )}
        </div>
      </div>
    );
  }

  // Render WITH Droppable for admin mode (with drag-drop)
  return (
    <div
      style={{
        flex: '0 0 320px',
        display: 'flex',
        flexDirection: 'column',
        background: bgColor,
        borderRadius: '12px',
        border: `1px solid ${borderColor}`,
        overflow: 'hidden',
      }}
    >
      {/* Column Header */}
      <div
        style={{
          padding: '16px',
          borderBottom: `1px solid ${borderColor}`,
          background: isDarkMode
            ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.04) 0%, rgba(255, 255, 255, 0.02) 100%)'
            : 'linear-gradient(135deg, rgba(79, 70, 229, 0.05) 0%, rgba(124, 58, 237, 0.05) 100%)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3
              style={{
                margin: 0,
                fontSize: '14px',
                fontWeight: 700,
                color: textColor,
                letterSpacing: '0.5px',
                textTransform: 'uppercase',
              }}
            >
              {column.name}
            </h3>
            <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: isDarkMode ? 'rgba(255, 255, 255, 0.45)' : '#999' }}>
              {cards.length} {cards.length === 1 ? 'card' : 'cards'}
            </p>
          </div>

          <button
            onClick={() => onAddCard?.(column.id)}
            title="Adicionar novo card"
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              border: 'none',
              background: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : '#f0f3ff',
              color: isDarkMode ? 'rgba(255, 255, 255, 0.6)' : '#4338ca',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 700,
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = isDarkMode ? 'rgba(255, 255, 255, 0.15)' : '#e0e7ff')}
            onMouseLeave={(e) => (e.currentTarget.style.background = isDarkMode ? 'rgba(255, 255, 255, 0.1)' : '#f0f3ff')}
          >
            +
          </button>
        </div>
      </div>

      {/* Droppable Area (admin only) */}
      <Droppable droppableId={column.id} type="CARD">
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            style={{
              flex: 1,
              padding: '12px',
              overflowY: 'auto',
              background: snapshot.isDraggingOver
                ? isDarkMode
                  ? 'rgba(255, 255, 255, 0.04)'
                  : 'rgba(79, 70, 229, 0.03)'
                : 'transparent',
              transition: 'background 0.2s',
              minHeight: '200px',
            }}
          >
            {cards.length === 0 ? (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '200px',
                  color: isDarkMode ? 'rgba(255, 255, 255, 0.3)' : '#ccc',
                  fontSize: '13px',
                  fontStyle: 'italic',
                }}
              >
                <i className="fas fa-inbox" style={{ marginRight: '8px' }}></i>
                Vazio
              </div>
            ) : (
              cards
                .sort((a, b) => a.order_index - b.order_index)
                .map((card, index) => (
                  <Draggable key={card.id} draggableId={card.id} index={index} isDragDisabled={false}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <KanbanCardItem
                          card={card}
                          onApprove={() => onApprove?.(card.id)}
                          onReturn={() => onReturn?.(card.id)}
                          onEdit={() => onEditCard?.(card)}
                          onArchive={() => onArchiveCard?.(card.id)}
                          isDragging={snapshot.isDragging}
                          isAdmin={true}
                          isDarkMode={isDarkMode}
                          draggableProps={provided.draggableProps}
                          dragHandleProps={provided.dragHandleProps}
                        />
                      </div>
                    )}
                  </Draggable>
                ))
            )}

            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
}
