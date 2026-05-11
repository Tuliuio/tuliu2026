import { useState } from 'react';
import type { KanbanCard } from '../../types';

interface KanbanCardItemProps {
  card: KanbanCard;
  onApprove?: () => void;
  onReturn?: () => void;
  onEdit?: () => void;
  onArchive?: () => void;
  onOpenDetail?: () => void;
  isDragging?: boolean;
  isAdmin?: boolean;
  isDarkMode?: boolean;
  draggableProps?: any;
  dragHandleProps?: any;
}

export default function KanbanCardItem({
  card,
  onApprove,
  onReturn,
  onEdit,
  onArchive,
  onOpenDetail,
  isDragging,
  isAdmin,
  isDarkMode,
  draggableProps,
  dragHandleProps,
}: KanbanCardItemProps) {
  const [isHovered, setIsHovered] = useState(false);

  const getDueDateColor = () => {
    if (!card.due_date) return 'transparent';
    const dueDate = new Date(card.due_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return isDarkMode ? '#ef4444' : '#dc2626';
    if (diffDays < 3) return isDarkMode ? '#f97316' : '#ea580c';
    return isDarkMode ? '#84cc16' : '#65a30d';
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
  };

  const bgColor = isDarkMode ? 'rgba(255, 255, 255, 0.04)' : '#ffffff';
  const borderColor = isDarkMode ? 'rgba(255, 255, 255, 0.08)' : '#E5E7EB';
  const textColor = isDarkMode ? 'rgba(255, 255, 255, 0.87)' : '#111111';
  const mutedColor = isDarkMode ? 'rgba(255, 255, 255, 0.45)' : '#666666';

  return (
    <div
      {...draggableProps}
      {...dragHandleProps}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onOpenDetail}
      style={{
        background: bgColor,
        border: `1px solid ${isHovered ? (isDarkMode ? 'rgba(168,85,247,0.35)' : '#a5b4fc') : borderColor}`,
        borderRadius: '12px',
        padding: '14px',
        marginBottom: '12px',
        cursor: isDragging ? 'grabbing' : 'pointer',
        opacity: isDragging ? 0.5 : 1,
        transition: 'all 0.2s',
        ...draggableProps?.style,
      }}
    >
      {/* Title */}
      <div style={{ marginBottom: '8px' }}>
        <h4
          style={{
            margin: 0,
            fontSize: '14px',
            fontWeight: 600,
            color: textColor,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {card.title}
        </h4>
      </div>

      {/* Description */}
      {card.description && (
        <p
          style={{
            margin: '0 0 8px 0',
            fontSize: '13px',
            color: mutedColor,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {card.description}
        </p>
      )}

      {/* Meta Info Row */}
      <div
        style={{
          display: 'flex',
          gap: '8px',
          alignItems: 'center',
          marginBottom: '12px',
          flexWrap: 'wrap',
        }}
      >
        {/* Category Badge */}
        {card.category_tag && (
          <span
            style={{
              display: 'inline-block',
              background: isDarkMode ? 'rgba(255, 255, 255, 0.08)' : '#f0f3ff',
              color: isDarkMode ? 'rgba(255, 255, 255, 0.6)' : '#4338ca',
              fontSize: '11px',
              fontWeight: 600,
              padding: '3px 8px',
              borderRadius: '4px',
              textTransform: 'uppercase',
            }}
          >
            {card.category_tag}
          </span>
        )}

        {/* Due Date */}
        {card.due_date && (
          <span
            style={{
              display: 'inline-block',
              fontSize: '12px',
              color: getDueDateColor(),
              fontWeight: 500,
            }}
          >
            <i className="fas fa-calendar" style={{ marginRight: '4px' }}></i>
            {formatDate(card.due_date)}
          </span>
        )}

        {/* Assignee */}
        {card.assignee && (
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '12px',
              color: mutedColor,
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                background: isDarkMode ? 'rgba(255, 255, 255, 0.12)' : '#e0e7ff',
                color: isDarkMode ? 'rgba(255, 255, 255, 0.6)' : '#4338ca',
                fontSize: '10px',
                fontWeight: 700,
              }}
            >
              {card.assignee.split(' ').map(n => n[0]).join('').slice(0, 2)}
            </div>
            <span style={{ maxWidth: '80px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {card.assignee}
            </span>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      {isHovered && (
        <div
          style={{
            display: 'flex',
            gap: '6px',
            paddingTop: '8px',
            borderTop: `1px solid ${borderColor}`,
          }}
        >
          {isAdmin ? (
            <>
              <button
                onClick={onEdit}
                style={{
                  flex: 1,
                  padding: '6px 10px',
                  background: isDarkMode ? 'rgba(99, 102, 241, 0.1)' : '#f0f3ff',
                  border: 'none',
                  borderRadius: '6px',
                  color: isDarkMode ? '#a5b4fc' : '#4338ca',
                  fontSize: '12px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = isDarkMode ? 'rgba(99, 102, 241, 0.2)' : '#e0e7ff')}
                onMouseLeave={(e) => (e.currentTarget.style.background = isDarkMode ? 'rgba(99, 102, 241, 0.1)' : '#f0f3ff')}
              >
                <i className="fas fa-edit" style={{ marginRight: '4px' }}></i>
                Editar
              </button>
              <button
                onClick={onArchive}
                style={{
                  flex: 1,
                  padding: '6px 10px',
                  background: isDarkMode ? 'rgba(239, 68, 68, 0.1)' : '#fee2e2',
                  border: 'none',
                  borderRadius: '6px',
                  color: isDarkMode ? '#fca5a5' : '#dc2626',
                  fontSize: '12px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = isDarkMode ? 'rgba(239, 68, 68, 0.2)' : '#fecaca')}
                onMouseLeave={(e) => (e.currentTarget.style.background = isDarkMode ? 'rgba(239, 68, 68, 0.1)' : '#fee2e2')}
              >
                <i className="fas fa-trash" style={{ marginRight: '4px' }}></i>
                Deletar
              </button>
            </>
          ) : (
            <>
              <button
                onClick={onApprove}
                style={{
                  flex: 1,
                  padding: '6px 10px',
                  background: isDarkMode ? 'rgba(34, 197, 94, 0.1)' : '#dcfce7',
                  border: 'none',
                  borderRadius: '6px',
                  color: isDarkMode ? '#86efac' : '#16a34a',
                  fontSize: '12px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = isDarkMode ? 'rgba(34, 197, 94, 0.2)' : '#bbf7d0')}
                onMouseLeave={(e) => (e.currentTarget.style.background = isDarkMode ? 'rgba(34, 197, 94, 0.1)' : '#dcfce7')}
              >
                <i className="fas fa-check" style={{ marginRight: '4px' }}></i>
                Aprovar
              </button>
              <button
                onClick={onReturn}
                style={{
                  flex: 1,
                  padding: '6px 10px',
                  background: isDarkMode ? 'rgba(99, 102, 241, 0.1)' : '#f0f3ff',
                  border: 'none',
                  borderRadius: '6px',
                  color: isDarkMode ? '#a5b4fc' : '#4338ca',
                  fontSize: '12px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = isDarkMode ? 'rgba(99, 102, 241, 0.2)' : '#e0e7ff')}
                onMouseLeave={(e) => (e.currentTarget.style.background = isDarkMode ? 'rgba(99, 102, 241, 0.1)' : '#f0f3ff')}
              >
                <i className="fas fa-arrow-left" style={{ marginRight: '4px' }}></i>
                Retornar
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
