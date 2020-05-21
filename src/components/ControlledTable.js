import React from 'react';
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
}) {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({
    columns,
    data: (data && data.results) || [],
    initialState: { pageIndex: 0 },
    manualPagination: true,
  });

  const emptyMessage = error ? (
    <ErrorMessage error={error} />
  ) : (
    <p style={{ textAlign: 'center', color: 'gray', margin: '2em auto' }}>
      No data to display
    </p>
  );

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
                <Table.HeaderCell {...column.getHeaderProps()}>
                  {column.render('Header')}
                </Table.HeaderCell>
              ))}
            </Table.Row>
          ))}
        </Table.Header>
        <Table.Body style={{ position: 'relative' }} {...getTableBodyProps()}>
          {console.log(rows) || rows.length ? (
            rows.map((row) => {
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
        {!error && (
          <Table.Footer>
            <Table.Row>
              <Table.HeaderCell colSpan={columns.length}>
                <Menu floated="right" pagination>
                  <Menu.Item as="a" icon disabled={!(data && data.previous)}>
                    <Icon name="chevron left" />
                  </Menu.Item>
                  <Menu.Item as="a" icon disabled={!(data && data.next)}>
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
                  {data && data.count > 0 && (
                    <div className="item">
                      {(data.page_number - 1) * data.page_size + 1}-
                      {(data.page_number - 1) * data.page_size +
                        data.results.length}{' '}
                      of {data.count}
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
