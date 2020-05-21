import React from 'react';
import Avatar from 'react-avatar';
import { clientFullName } from '../utils/modelUtils';

export default function ClientAvatar({ client, ...props }) {
  const {
    first_name: firstName,
    middle_name: middleName,
    last_name: lastName,
  } = client;

  const fullName = clientFullName(client);

  const maxInitials = [firstName, middleName, lastName].filter((x) => !!x)
    .length;

  return (
    <Avatar
      name={`${fullName} ${client.id}`}
      maxInitials={maxInitials}
      {...props}
    />
  );
}
