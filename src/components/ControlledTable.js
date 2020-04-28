import React from 'react';
import {
  useTable,
  useGroupBy,
  useFilters,
  useSortBy,
  useExpanded,
  usePagination,
} from 'react-table';
import { Icon, Menu, Table } from 'semantic-ui-react';

export default function ControlledTable({ columns, data, loading, fetchData }) {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({
    columns,
    data: data.results || [],
    initialState: { pageIndex: 0 },
    manualPagination: true,
  });
  console.log(data);
  return (
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
      <Table.Body {...getTableBodyProps()}>
        {rows.map((row) => {
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
        })}
      </Table.Body>

      <Table.Footer>
        <Table.Row>
          <Table.HeaderCell colSpan={columns.length}>
            <Menu floated="right" pagination>
              <Menu.Item as="a" icon disabled={!data.previous}>
                <Icon name="chevron left" />
              </Menu.Item>
              {/* <Menu.Item as="a">1</Menu.Item>
              <Menu.Item as="a">2</Menu.Item>
              <Menu.Item as="a">3</Menu.Item>
              <Menu.Item as="a">4</Menu.Item> */}
              <Menu.Item as="a" icon disabled={!data.next}>
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
              <div className="item">
                {(data.page_number - 1) * data.page_size + 1}-
                {(data.page_number - 1) * data.page_size + data.results.length}{' '}
                of {data.count}
              </div>
            </div>
          </Table.HeaderCell>
        </Table.Row>
      </Table.Footer>
    </Table>
  );
}
