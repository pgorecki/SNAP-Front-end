import React from 'react';
import { NavLink } from 'react-router-dom';
import { Button, Icon, Grid, Header, Label } from 'semantic-ui-react';

export function PrimaryActionLink({ icon, label, to }) {
  return (
    <Button size="tiny" basic color="blue" as={NavLink} to={to}>
      <Icon name="edit" /> {label}
    </Button>
  );
}

export function EditActionLink({ to }) {
  return <PrimaryActionLink icon="edit" label="Edit" to={to} />;
}

export function DeleteActionButton({ onClick }) {
  return (
    <Button size="tiny" negative onClick={onClick}>
      <Icon name="trash" /> Delete
    </Button>
  );
}
