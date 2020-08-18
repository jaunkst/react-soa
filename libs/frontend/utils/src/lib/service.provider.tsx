import React, { useContext } from 'react';
import { Container } from 'inversify';
const InversifyContext = React.createContext<{ container: Container | null }>({
  container: null,
});

type Props = {
  container: Container;
};

type Class<T> = new (...args: any[]) => T;

export const Provider: React.FC<Props> = (props) => {
  return (
    <InversifyContext.Provider value={{ container: props.container }}>
      {props.children}
    </InversifyContext.Provider>
  );
};

export function useService<T>(Klass: Class<T>): T {
  const { container } = useContext(InversifyContext);

  if (!container) {
    throw new Error();
  }

  try {
    return container.get(Klass);
  } catch (err) {
    console.error(err);
  }
}
