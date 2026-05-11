import { useState, useEffect, useRef } from 'react';
import type { KanbanCard, KanbanColumn, CardComment } from '../../types';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';

interface CardDetailModalProps {
  card: KanbanCard;
  columns: KanbanColumn[];
  isAdmin: boolean;
  onClose: () => void;
  onApprove?: () => void;
  onReturn?: () => void;
}

const formatDate = (dateString?: string) => {
  if (!dateString) return null;
  return new Date(dateString).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
};

const formatDateTime = (dateString: string) => {
  return new Date(dateString).toLocaleString('pt-BR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
};

const getDueDateStatus = (due_date?: string) => {
  if (!due_date) return null;
  const diff = Math.ceil((new Date(due_date).getTime() - new Date().setHours(0,0,0,0)) / 86400000);
  if (diff < 0) return { color: '#ef4444', label: `Atrasado ${Math.abs(diff)}d` };
  if (diff < 3) return { color: '#f97316', label: `${diff}d restantes` };
  return { color: '#22c55e', label: `${diff}d restantes` };
};

export default function CardDetailModal({
  card,
  columns,
  isAdmin,
  onClose,
  onApprove,
  onReturn,
}: CardDetailModalProps) {
  const { client } = useAuth();
  const [comments, setComments] = useState<CardComment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [loadingComments, setLoadingComments] = useState(true);
  const commentsEndRef = useRef<HTMLDivElement>(null);

  const currentColumnIndex = columns.findIndex(c => c.id === card.column_id);
  const currentColumn = columns[currentColumnIndex];
  const isLastColumn = currentColumnIndex === columns.length - 1;
  const isFirstColumn = currentColumnIndex === 0;
  const dueDateStatus = getDueDateStatus(card.due_date);

  useEffect(() => {
    const fetchComments = async () => {
      const { data, error } = await supabase
        .from('card_comments')
        .select('*')
        .eq('card_id', card.id)
        .order('created_at', { ascending: true });

      if (!error) setComments(data || []);
      setLoadingComments(false);
    };
    fetchComments();
  }, [card.id]);

  useEffect(() => {
    commentsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [comments]);

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !client) return;

    setSubmitting(true);
    const { data, error } = await supabase
      .from('card_comments')
      .insert([{
        card_id: card.id,
        client_id: client.id,
        content: newComment.trim(),
        author_name: client.name,
        author_role: isAdmin ? 'admin' : 'client',
      }])
      .select()
      .single();

    if (!error && data) {
      setComments(prev => [...prev, data]);
      setNewComment('');
    }
    setSubmitting(false);
  };

  const border = 'rgba(255,255,255,0.08)';
  const muted = 'rgba(255,255,255,0.45)';
  const text = 'rgba(255,255,255,0.87)';

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(0,0,0,0.75)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 2000, padding: '20px',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: '#1e1e1e',
          borderRadius: '16px',
          border: `1px solid ${border}`,
          width: '100%',
          maxWidth: '860px',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div style={{
          padding: '20px 24px',
          borderBottom: `1px solid ${border}`,
          display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px',
        }}>
          <div style={{ flex: 1 }}>
            {card.category_tag && (
              <span style={{
                display: 'inline-block', marginBottom: '8px',
                background: 'rgba(168,85,247,0.15)', color: '#c084fc',
                fontSize: '11px', fontWeight: 700, padding: '3px 10px',
                borderRadius: '4px', textTransform: 'uppercase', letterSpacing: '0.5px',
              }}>
                {card.category_tag}
              </span>
            )}
            <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 700, color: text, lineHeight: 1.3 }}>
              {card.title}
            </h2>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: muted, fontSize: '20px', padding: '4px', lineHeight: 1,
              flexShrink: 0,
            }}
          >
            <i className="fas fa-times"></i>
          </button>
        </div>

        {/* Progress Bar */}
        <div style={{ padding: '16px 24px', borderBottom: `1px solid ${border}` }}>
          <p style={{ margin: '0 0 10px 0', fontSize: '11px', fontWeight: 600, color: muted, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Progresso
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0' }}>
            {columns.map((col, idx) => {
              const isDone = idx < currentColumnIndex;
              const isCurrent = idx === currentColumnIndex;
              return (
                <div key={col.id} style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{
                      height: '4px',
                      background: isDone || isCurrent ? '#a855f7' : 'rgba(255,255,255,0.1)',
                      borderRadius: idx === 0 ? '4px 0 0 4px' : idx === columns.length - 1 ? '0 4px 4px 0' : '0',
                      transition: 'background 0.3s',
                    }} />
                    <p style={{
                      margin: '6px 0 0 0', fontSize: '10px',
                      color: isCurrent ? '#c084fc' : isDone ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.25)',
                      fontWeight: isCurrent ? 700 : 400,
                      whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                    }}>
                      {isCurrent && <i className="fas fa-circle" style={{ fontSize: '6px', marginRight: '4px', verticalAlign: 'middle' }}></i>}
                      {col.name}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Body: two columns */}
        <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

          {/* Left: Card info */}
          <div style={{
            flex: '0 0 340px', padding: '24px',
            borderRight: `1px solid ${border}`,
            overflowY: 'auto',
          }}>
            {/* Description */}
            <div style={{ marginBottom: '24px' }}>
              <p style={{ margin: '0 0 8px 0', fontSize: '11px', fontWeight: 600, color: muted, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Descrição
              </p>
              {card.description ? (
                <p style={{ margin: 0, fontSize: '14px', color: 'rgba(255,255,255,0.7)', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>
                  {card.description}
                </p>
              ) : (
                <p style={{ margin: 0, fontSize: '14px', color: 'rgba(255,255,255,0.25)', fontStyle: 'italic' }}>
                  Sem descrição
                </p>
              )}
            </div>

            {/* Meta */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <p style={{ margin: '0 0 4px 0', fontSize: '11px', fontWeight: 600, color: muted, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Coluna atual
                </p>
                <p style={{ margin: 0, fontSize: '14px', color: '#c084fc', fontWeight: 600 }}>
                  <i className="fas fa-layer-group" style={{ marginRight: '6px' }}></i>
                  {currentColumn?.name || '—'}
                </p>
              </div>

              {card.assignee && (
                <div>
                  <p style={{ margin: '0 0 4px 0', fontSize: '11px', fontWeight: 600, color: muted, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Responsável
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{
                      width: '28px', height: '28px', borderRadius: '50%',
                      background: 'rgba(168,85,247,0.2)', color: '#c084fc',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '11px', fontWeight: 700,
                    }}>
                      {card.assignee.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                    </div>
                    <p style={{ margin: 0, fontSize: '14px', color: text }}>{card.assignee}</p>
                  </div>
                </div>
              )}

              {card.due_date && (
                <div>
                  <p style={{ margin: '0 0 4px 0', fontSize: '11px', fontWeight: 600, color: muted, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Prazo
                  </p>
                  <p style={{ margin: 0, fontSize: '14px', color: dueDateStatus?.color || text, fontWeight: 600 }}>
                    <i className="fas fa-calendar-alt" style={{ marginRight: '6px' }}></i>
                    {formatDate(card.due_date)}
                    {dueDateStatus && (
                      <span style={{ fontSize: '12px', fontWeight: 400, marginLeft: '8px', opacity: 0.8 }}>
                        ({dueDateStatus.label})
                      </span>
                    )}
                  </p>
                </div>
              )}

              <div>
                <p style={{ margin: '0 0 4px 0', fontSize: '11px', fontWeight: 600, color: muted, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Criado em
                </p>
                <p style={{ margin: 0, fontSize: '13px', color: muted }}>
                  {formatDateTime(card.created_at)}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            {!isAdmin && (
              <div style={{ marginTop: '32px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <button
                  onClick={onApprove}
                  disabled={isLastColumn}
                  style={{
                    padding: '12px 16px',
                    background: isLastColumn ? 'rgba(255,255,255,0.05)' : 'rgba(34,197,94,0.15)',
                    border: `1px solid ${isLastColumn ? 'rgba(255,255,255,0.08)' : 'rgba(34,197,94,0.3)'}`,
                    borderRadius: '10px',
                    color: isLastColumn ? muted : '#86efac',
                    fontSize: '14px', fontWeight: 600,
                    cursor: isLastColumn ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={e => { if (!isLastColumn) e.currentTarget.style.background = 'rgba(34,197,94,0.25)'; }}
                  onMouseLeave={e => { if (!isLastColumn) e.currentTarget.style.background = 'rgba(34,197,94,0.15)'; }}
                >
                  <i className="fas fa-check" style={{ marginRight: '8px' }}></i>
                  {isLastColumn ? 'Já concluído' : 'Aprovar e avançar'}
                </button>
                <button
                  onClick={onReturn}
                  disabled={isFirstColumn}
                  style={{
                    padding: '12px 16px',
                    background: isFirstColumn ? 'rgba(255,255,255,0.05)' : 'rgba(99,102,241,0.1)',
                    border: `1px solid ${isFirstColumn ? 'rgba(255,255,255,0.08)' : 'rgba(99,102,241,0.3)'}`,
                    borderRadius: '10px',
                    color: isFirstColumn ? muted : '#a5b4fc',
                    fontSize: '14px', fontWeight: 600,
                    cursor: isFirstColumn ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={e => { if (!isFirstColumn) e.currentTarget.style.background = 'rgba(99,102,241,0.2)'; }}
                  onMouseLeave={e => { if (!isFirstColumn) e.currentTarget.style.background = 'rgba(99,102,241,0.1)'; }}
                >
                  <i className="fas fa-arrow-left" style={{ marginRight: '8px' }}></i>
                  Solicitar revisão
                </button>
              </div>
            )}
          </div>

          {/* Right: Comments */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <div style={{ padding: '16px 24px', borderBottom: `1px solid ${border}` }}>
              <p style={{ margin: 0, fontSize: '13px', fontWeight: 600, color: text }}>
                <i className="fas fa-comments" style={{ marginRight: '8px', color: '#a855f7' }}></i>
                Comentários e Sugestões
                {comments.length > 0 && (
                  <span style={{ marginLeft: '8px', background: 'rgba(168,85,247,0.2)', color: '#c084fc', fontSize: '11px', padding: '2px 8px', borderRadius: '100px' }}>
                    {comments.length}
                  </span>
                )}
              </p>
            </div>

            {/* Thread */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '16px 24px' }}>
              {loadingComments ? (
                <p style={{ color: muted, fontSize: '13px' }}>Carregando...</p>
              ) : comments.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                  <i className="fas fa-comment-dots" style={{ fontSize: '32px', color: 'rgba(255,255,255,0.1)', marginBottom: '12px', display: 'block' }}></i>
                  <p style={{ margin: 0, fontSize: '13px', color: muted }}>Nenhum comentário ainda.</p>
                  <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: 'rgba(255,255,255,0.25)' }}>
                    Use esta area para sugestoes, duvidas ou feedback.
                  </p>
                </div>
              ) : (
                comments.map(comment => (
                  <div key={comment.id} style={{
                    marginBottom: '16px',
                    display: 'flex',
                    flexDirection: comment.author_role === 'admin' ? 'row-reverse' : 'row',
                    gap: '10px',
                    alignItems: 'flex-start',
                  }}>
                    <div style={{
                      width: '32px', height: '32px', borderRadius: '50%', flexShrink: 0,
                      background: comment.author_role === 'admin' ? 'rgba(168,85,247,0.2)' : 'rgba(99,102,241,0.2)',
                      color: comment.author_role === 'admin' ? '#c084fc' : '#a5b4fc',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '12px', fontWeight: 700,
                    }}>
                      {comment.author_name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{
                        display: 'flex', gap: '8px', alignItems: 'baseline',
                        flexDirection: comment.author_role === 'admin' ? 'row-reverse' : 'row',
                        marginBottom: '4px',
                      }}>
                        <span style={{ fontSize: '12px', fontWeight: 600, color: comment.author_role === 'admin' ? '#c084fc' : '#a5b4fc' }}>
                          {comment.author_name}
                        </span>
                        <span style={{ fontSize: '11px', color: muted }}>
                          {comment.author_role === 'admin' ? 'Tuliu' : 'Cliente'}
                        </span>
                        <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.2)' }}>
                          {formatDateTime(comment.created_at)}
                        </span>
                      </div>
                      <div style={{
                        background: comment.author_role === 'admin' ? 'rgba(168,85,247,0.08)' : 'rgba(255,255,255,0.04)',
                        border: `1px solid ${comment.author_role === 'admin' ? 'rgba(168,85,247,0.15)' : border}`,
                        borderRadius: comment.author_role === 'admin' ? '12px 4px 12px 12px' : '4px 12px 12px 12px',
                        padding: '10px 14px',
                      }}>
                        <p style={{ margin: 0, fontSize: '13px', color: 'rgba(255,255,255,0.75)', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
                          {comment.content}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
              <div ref={commentsEndRef} />
            </div>

            {/* Input */}
            <div style={{ padding: '16px 24px', borderTop: `1px solid ${border}` }}>
              <form onSubmit={handleSubmitComment} style={{ display: 'flex', gap: '10px', alignItems: 'flex-end' }}>
                <textarea
                  value={newComment}
                  onChange={e => setNewComment(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSubmitComment(e as any); }
                  }}
                  placeholder="Escreva uma sugestão ou comentário... (Enter para enviar)"
                  rows={2}
                  style={{
                    flex: 1, padding: '10px 14px',
                    background: 'rgba(255,255,255,0.05)',
                    border: `1px solid ${border}`,
                    borderRadius: '10px',
                    color: text, fontSize: '13px',
                    resize: 'none', fontFamily: 'inherit',
                    outline: 'none',
                  }}
                  onFocus={e => e.target.style.borderColor = 'rgba(168,85,247,0.4)'}
                  onBlur={e => e.target.style.borderColor = border}
                />
                <button
                  type="submit"
                  disabled={submitting || !newComment.trim()}
                  style={{
                    padding: '10px 16px',
                    background: submitting || !newComment.trim() ? 'rgba(168,85,247,0.1)' : 'rgba(168,85,247,0.8)',
                    border: 'none', borderRadius: '10px',
                    color: submitting || !newComment.trim() ? muted : 'white',
                    cursor: submitting || !newComment.trim() ? 'not-allowed' : 'pointer',
                    fontSize: '14px', transition: 'all 0.2s',
                    flexShrink: 0,
                  }}
                  onMouseEnter={e => { if (!submitting && newComment.trim()) e.currentTarget.style.background = '#a855f7'; }}
                  onMouseLeave={e => { if (!submitting && newComment.trim()) e.currentTarget.style.background = 'rgba(168,85,247,0.8)'; }}
                >
                  <i className="fas fa-paper-plane"></i>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
