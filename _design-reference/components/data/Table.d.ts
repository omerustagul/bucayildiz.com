import React from 'react';

export interface TableColumn<Row = any> {
  key: string;
  label: React.ReactNode;
  width?: number | string;
  align?: 'left' | 'center' | 'right';
  /** Custom cell renderer; defaults to row[key]. */
  render?: (row: Row, index: number) => React.ReactNode;
}

export interface TableProps<Row = any> extends React.HTMLAttributes<HTMLDivElement> {
  columns: TableColumn<Row>[];
  rows: Row[];
  onRowClick?: (row: Row, index: number) => void;
  getRowKey?: (row: Row, index: number) => React.Key;
  empty?: React.ReactNode;
  dense?: boolean;
}

/**
 * Lightweight admin data table with custom cell renderers and row click.
 * @startingPoint section="Data" subtitle="Data table" viewport="700x320"
 */
export function Table(props: TableProps): JSX.Element;
