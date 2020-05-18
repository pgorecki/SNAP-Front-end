import React, { useState } from 'react';
import Avatar from 'react-avatar';
import { Search, List } from 'semantic-ui-react';
import { fullName, clientFullName } from '../../utils/modelUtils';
import useSearchClient from '../../hooks/useSearchClient';
import useDebouncedCallback from '../../hooks/useDebouncedCallback';
import { NavLink } from 'react-router-dom';

export function ClientField({ label, children }) {
  return (
    <>
      <p style={{ marginBottom: '0.5em', color: '#666' }}>{label}</p>
      <p>
        <strong style={{ fontSize: '1.15em' }}>{children}</strong>
      </p>
    </>
  );
}

export function ClientAvatar({ client, ...props }) {
  const {
    first_name: firstName,
    middle_name: middleName,
    last_name: lastName,
  } = client;

  const clientFullName = fullName({ firstName, middleName, lastName });

  const maxInitials = [firstName, middleName, lastName].filter((x) => !!x)
    .length;

  return (
    <Avatar
      name={`${clientFullName} ${client.id}`}
      maxInitials={maxInitials}
      {...props}
    />
  );
}

export function ClientSearch({ ...props }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [data, error, loading, fetchData] = useSearchClient(
    '/clients/search/?q=',
    {
      results: [],
    }
  );
  const searchClient = useDebouncedCallback((query) => {
    fetchData(query);
  }, 500);

  const handleSearchChange = (e, { value }) => {
    setSearchQuery(value);
    searchClient(value);
  };

  const resultRenderer = ({ client }) => (
    <List as={NavLink} to={`clients/${client.id}`}>
      <List.Item>
        <List.Icon verticalAlign="middle">
          <ClientAvatar client={client} size={48} />
        </List.Icon>
        <List.Content>
          <List.Header>{clientFullName(client)}</List.Header>
          <List.Description>Agency 1</List.Description>
        </List.Content>
      </List.Item>
    </List>
  );

  return (
    <Search
      loading={loading}
      // onResultSelect={(a, b, c) => console.log(a, b, c)}
      onSearchChange={handleSearchChange}
      results={data.results.map((client) => ({ title: client.id, client }))}
      value={searchQuery}
      resultRenderer={resultRenderer}
      {...props}
    />
  );
}
