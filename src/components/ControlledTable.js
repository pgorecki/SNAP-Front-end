import React, { useEffect } from 'react';
import {
  useTable,
  useGroupBy,
  useFilters,
  useSortBy,
  useExpanded,
  usePagination,
} from 'react-table';
import { Icon, Menu, Table, Dimmer, Loader } from 'semantic-ui-react';
import { ErrorMessage } from './common';

export default function ControlledTable({
  columns,
  data,
  error,
  loading,
  fetchData,
  totalCount, // total number of objects
  pageSize: controlledPageSize,
  pageCount: controlledPageCount,
}) {
  const table = useTable(
    {
      columns,
      data: data || [],
      initialState: { pageIndex: 0, pageSize: controlledPageSize },
      manualPagination: true,
      manualSortBy: true,
      pageCount: controlledPageCount,
    },
    useSortBy,
    usePagination
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    state: { pageIndex, pageSize, sortBy, filters },
    page,
    // gotoPage,
    canNextPage,
    canPreviousPage,
    nextPage,
    previousPage,
  } = table;

  const emptyMessage = error ? (
    <ErrorMessage error={error} />
  ) : (
    <p style={{ textAlign: 'center', color: 'gray', margin: '2em auto' }}>
      No data to display
    </p>
  );

  React.useEffect(() => {
    console.log('ControlledTable requesting new data');
    fetchData({ pageIndex, pageSize, sortBy, filters });
  }, [pageIndex, pageSize, sortBy, filters]);

  console.log(totalCount, canPreviousPage, canNextPage);

  return (
    <div style={{ position: 'relative' }}>
      <Dimmer active={loading}>
        <Loader />
      </Dimmer>

      <Table celled {...getTableProps()}>
        <Table.Header>
          {headerGroups.map((headerGroup) => (
            <Table.Row {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <Table.HeaderCell
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                >
                  {column.render('Header')}
                  <span>
                    {column.isSorted ? (
                      column.isSortedDesc ? (
                        <Icon name="sort descending" />
                      ) : (
                        <Icon name="sort ascending" />
                      )
                    ) : (
                      column.canSort && <Icon name="sort" disabled />
                    )}
                  </span>
                </Table.HeaderCell>
              ))}
            </Table.Row>
          ))}
        </Table.Header>
        <Table.Body style={{ position: 'relative' }} {...getTableBodyProps()}>
          {rows.length ? (
            page.map((row) => {
              prepareRow(row);
              return (
                <Table.Row {...row.getRowProps()}>
                  {row.cells.map((cell) => {
                    return (
                      <Table.Cell {...cell.getCellProps()}>
                        {cell.render('Cell')}
                      </Table.Cell>
                    );
                  })}
                </Table.Row>
              );
            })
          ) : (
            <Table.Row>
              <Table.Cell error={!!error} colSpan={columns.length}>
                {emptyMessage}
              </Table.Cell>
            </Table.Row>
          )}
        </Table.Body>
        {!error && pageSize !== undefined && (
          <Table.Footer>
            <Table.Row>
              <Table.HeaderCell colSpan={columns.length}>
                <Menu floated="right" pagination>
                  <Menu.Item
                    as="a"
                    icon
                    disabled={!canPreviousPage}
                    onClick={() => previousPage()}
                  >
                    <Icon name="chevron left" />
                  </Menu.Item>
                  <Menu.Item
                    as="a"
                    icon
                    disabled={!canNextPage}
                    onClick={() => nextPage()}
                  >
                    <Icon name="chevron right" />
                  </Menu.Item>
                </Menu>
                <div
                  className="ui pagination menu"
                  style={{
                    float: 'right',
                    borderColor: 'transparent',
                    boxShadow: 'none',
                    background: 'transparent',
                  }}
                >
                  {data && data.length > 0 && (
                    <div className="item">
                      {pageIndex * pageSize + 1}-
                      {pageIndex * pageSize + page.length} of {totalCount}
                    </div>
                  )}
                </div>
              </Table.HeaderCell>
            </Table.Row>
          </Table.Footer>
        )}
      </Table>
    </div>
  );
}
