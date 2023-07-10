import { ReactNode } from 'react';
import 'primereact/resources/primereact.min.css';
import 'primereact/resources/themes/lara-light-indigo/theme.css';

const PrimeCSSProvider = ({ children }: { children: ReactNode }) => {
  return (
    <div>{children}</div>
  )
}

export default PrimeCSSProvider