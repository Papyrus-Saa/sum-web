'use client';

import { ReactNode } from 'react';
import './config'; // Import to ensure i18n is initialized

export function I18nProvider({ children }: { children: ReactNode }): React.ReactElement {
  return <>{children}</>;
}
