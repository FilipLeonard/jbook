import React, { Fragment, useEffect } from 'react';
import { useActions } from '../../hooks/use-actions';
import { useTypedSelector } from '../../hooks/use-typed-selector';
import { AddCell } from '../add-cell';
import { CellListItem } from '../cell-item';
import './cell-list.css';

interface CellListProps {}

export const CellList: React.FC<CellListProps> = () => {
  const cells = useTypedSelector(({ cells: { data, order } }) =>
    order.map(id => data[id])
  );
  const { fetchCells } = useActions();

  useEffect(() => {
    fetchCells();
  }, [fetchCells]);

  const renderedCells = cells.map(cell => (
    <Fragment key={cell.id}>
      <CellListItem cell={cell} />
      <AddCell previousCellId={cell.id} />
    </Fragment>
  ));

  return (
    <div className="cell-list">
      <AddCell forceVisible={cells.length === 0} previousCellId={null} />
      {renderedCells}
    </div>
  );
};
