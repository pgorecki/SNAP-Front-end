import React from 'react';
import Avatar from 'react-avatar';
import { fullName } from '../../utils/modelUtils';

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

export function ClientAvatar({ client }) {
  const {
    first_name: firstName,
    middle_name: middleName,
    last_name: lastName,
  } = client;

  console.log('z', client);

  const clientFullName = fullName({ firstName, middleName, lastName });

  const maxInitials = [firstName, middleName, lastName].filter((x) => !!x)
    .length;

  return (
    <Avatar name={`${clientFullName} ${client.id}`} maxInitials={maxInitials} />
  );
}
