// src/ui/styles.ts

import type { CSSProperties } from 'react';

export const styles: Record<string, CSSProperties> = {
  root: {
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    background: '#F3F2F1',
    fontFamily:
      '-apple-system, BlinkMacSystemFont, Segoe UI, sans-serif',
  },

  topWrapper: {
    flex: 3,
    padding: 12,
  },

  topCard: {
    height: '100%',
    background: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    border: '1px solid #E1DFDD',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  topTitle: {
    fontSize: 16,
    fontWeight: 600,
    color: '#323130',
  },

  topDesc: {
    fontSize: 12,
    color: '#605E5C',
    marginTop: 4,
  },

  resetButton: {
    padding: '6px 12px',
    fontSize: 12,
    borderRadius: 6,
    border: '1px solid #C8C6C4',
    background: '#FFFFFF',
    cursor: 'pointer',
  },

  sectionGap: {
    height: 10,
  },

  bottomWrapper: {
    flex: 7,
    padding: 12,
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

  messages: {
    flex: 1,
    padding: 16,
    overflowY: 'auto',
  },

  bubble: {
    maxWidth: '75%',
    padding: '8px 12px',
    fontSize: 13,
    lineHeight: 1.4,
    borderRadius: 8,
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

  attachmentBar: {
    display: 'flex',
    gap: 8,
    padding: 8,
    borderTop: '1px solid #E1DFDD',
    overflowX: 'auto',
  },

  inputBar: {
    display: 'flex',
    gap: 8,
    padding: 12,
    borderTop: '1px solid #E1DFDD',
    background: '#FFFFFF',
  },

  input: {
    flex: 1,
    padding: '8px 12px',
    fontSize: 13,
    borderRadius: 6,
    border: '1px solid #C8C6C4',
    outline: 'none',
  },

  sendButton: {
    padding: '8px 14px',
    fontSize: 13,
    borderRadius: 6,
    border: 'none',
    background: '#6264A7',
    color: '#FFFFFF',
    cursor: 'pointer',
  },

  attachmentItem: {
    position: 'relative',
    display: 'inline-block',
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
    lineHeight: '18px',
    textAlign: 'center',
  },

  messageImage: {
    maxWidth: 30,
    borderRadius: 6,
  },

  attachmentImage: {
    maxWidth: 30,
    borderRadius: 6,
  },
};
