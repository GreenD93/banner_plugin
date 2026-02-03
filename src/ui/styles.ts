import type { CSSProperties } from 'react';

export const styles: Record<string, CSSProperties> = {
  /* ===== Root ===== */
  root: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    background: '#F3F2F1',
    fontFamily:
      '-apple-system, BlinkMacSystemFont, Segoe UI, sans-serif',
  },

  /* ===== Top Control ===== */
  topWrapper: {
    padding: '12px 12px 6px',
    flexShrink: 0,
  },

  topCard: {
    minHeight: 120,
    background: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    border: '1px solid #E1DFDD',
    display: 'flex',
    justifyContent: 'space-between',
    gap: 16,
  },

  topTitle: {
    fontSize: 16,
    fontWeight: 600,
    color: '#323130',
  },

  optionRow: {
    display: 'flex',
    gap: 12,
  },

  optionItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 4,
    fontSize: 12,
    color: '#323130',
  },

  countRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
  },

  countInput: {
    width: 60,
    padding: '4px 6px',
    fontSize: 12,
    borderRadius: 6,
    border: '1px solid #C8C6C4',
  },

  countLabel: {
    fontSize: 12,
    color: '#323130',
  },

  sectionGap: {
    height: 0,
  },

  /* ===== Chat ===== */
  bottomWrapper: {
    padding: '6px 12px 12px',
    flex: 1,
    minHeight: 0,
  },

  chatCard: {
    height: '100%',
    background: '#FFFFFF',
    borderRadius: 12,
    border: '1px solid #E1DFDD',
    display: 'flex',
    flexDirection: 'column',
    minHeight: 0,
  },

  chatHeader: {
    padding: '8px 12px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '1px solid #EDEBE9',
  },

  messages: {
    flex: 1,
    padding: '12px 16px',
    overflowY: 'auto',
  },

  bubble: {
    maxWidth: '75%',
    padding: '8px 12px',
    fontSize: 13,
    borderRadius: 8,
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
  },

  errorBubble: {
    background: '#F3F2F1',
    color: '#605E5C',
    border: '1px dashed #C8C6C4',
  },

  botBubble: {
    background: '#F3F2F1',
    color: '#323130',
    border: '1px solid #E1DFDD',
  },

  userBubble: {
    background: '#6264A7',
    color: '#FFFFFF',
  },

  /* ===== Attachments ===== */
  attachmentBar: {
    display: 'flex',
    gap: 8,
    padding: 8,
    borderTop: '1px solid #E1DFDD',
    overflowX: 'auto',
  },

  attachmentItem: {
    position: 'relative',
  },

  attachmentImage: {
    maxWidth: 30,
    borderRadius: 6,
  },

  removeButton: {
    position: 'absolute',
    top: -6,
    right: -6,
    width: 18,
    height: 18,
    borderRadius: '50%',
    border: 'none',
    background: '#605E5C',
    color: '#FFFFFF',
    fontSize: 12,
    cursor: 'pointer',
  },

  /* ===== Input ===== */
  inputBar: {
    display: 'flex',
    gap: 8,
    padding: 12,
    borderTop: '1px solid #E1DFDD',
  },

  textarea: {
    flex: 1,
    resize: 'none',
    padding: '8px 12px',
    fontSize: 13,
    borderRadius: 6,
    border: '1px solid #C8C6C4',
    fontFamily: 'inherit',
    lineHeight: '18px',
  },

  /* ===== Buttons ===== */
  buttonBase: {
    padding: '6px 12px',
    fontSize: 12,
    lineHeight: '16px',
    borderRadius: 6,
    cursor: 'pointer',
    fontWeight: 500,
    fontFamily: 'inherit',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
  },

  secondaryButton: {
    background: '#FFFFFF',
    border: '1px solid #C8C6C4',
    color: '#323130',
  },

  primaryButtonActive: {
    background: '#6264A7',
    border: 'none',
    color: '#FFFFFF',
  },
};
