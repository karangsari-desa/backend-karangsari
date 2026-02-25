export const shorthands = undefined;

export const up = (pgm) => {
  pgm.createTable('users', {
    id: {
      type: 'serial',
      primaryKey: true,
    },
    username: {
      type: 'VARCHAR(255)',
      unique: true,
      notNull: true,
    },
    password: {
      type: 'VARCHAR(255)',
      notNull: true,
    },
  });
};

export const down = (pgm) => {
  pgm.dropTable('users');
};
